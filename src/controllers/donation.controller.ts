import { Request, Response } from "express";
import Donation from "../models/Donation";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();



const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_SECRET = process.env.FLOW_SECRET!;
const FLOW_API_URL = process.env.FLOW_API_URL! || "https://sandbox.flow.cl/api"; 
// https://www.flow.cl/api



export const getDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flowOrder } = req.params;
    const donation = await Donation.findOne({ flowOrder });
    if (!donation) {
      res.status(404).json({ message: "Donación no encontrada" });
      return;
    }
    res.json(donation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, donation_date, amount, email, state, photo, method } = req.body;
    const newDonation = new Donation({ name, donation_date, amount, email, state, photo, method });
    await newDonation.save();
    res.status(201).json(newDonation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const createFlowDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, donation_date, amount, email, photo, method } = req.body;

    const newDonation = new Donation({
      name,
      donation_date,
      amount,
      email,
      state: "pendiente",
      photo,
      method,
    });

    await newDonation.save();

    const params: Record<string, any> = {
      apiKey: FLOW_API_KEY,
      commerceOrder: newDonation._id.toString(),
      subject: "Donación Danza UC",
      currency: "CLP",
      amount,
      email,
      urlConfirmation: `${process.env.BACKEND_URL}/api/donations/confirm`,
      urlReturn: `${process.env.FRONTEND_URL}/donations/success`,
    };

    const orderedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const signature = crypto
      .createHmac("sha256", FLOW_SECRET)
      .update(orderedParams)
      .digest("hex");
    
    const { data: { url, token, flowOrder } } = await axios.post(
      `${FLOW_API_URL}/payment/create`,
      new URLSearchParams({ ...params, s: signature }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    newDonation.flowOrder = flowOrder;
    newDonation.token = token;
    await newDonation.save();

    res.status(201).json({
      donation: newDonation,
      flowUrl: `${url}?token=${token}`,
    });
  } catch (error: any) {
    console.error("Error creando donación en Flow:", error.response?.data || error.message);
    res.status(400).json({ message: error.message });
  }
};


export const confirmFlowDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Confirmación Flow recibida:", req.body);
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: "Falta token de Flow" });
      return;
    }


    const params = new URLSearchParams({
      apiKey: FLOW_API_KEY,
      token,
    });

    const signature = crypto
      .createHmac("sha256", FLOW_SECRET)
      .update(params.toString())
      .digest("hex");

    const { data } = await axios.get(
      `${FLOW_API_URL}/payment/getStatus?${params.toString()}&s=${signature}`
    );

    console.log("Datos de estado de pago recibidos de Flow:", data);
    const flowOrder = data.flowOrder;
    const status = data.paymentData?.status;

    const donation = await Donation.findOne({ flowOrder });
    if (!donation) {
      res.status(404).json({ message: "Donación no encontrada" });
      return;
    }


    if (status === 2) {
      donation.state = "pagado";
    } else if (status === 3) {
      donation.state = "fallido";
    } else {
      donation.state = "pendiente";
    }

    await donation.save();


    res.status(200).json({ message: "Confirmación recibida", donation });
  } catch (error: any) {
    console.error("Error en confirmación Flow:", error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};