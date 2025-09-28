import { Request, Response } from "express";
import Donation from "../models/Donation";



export const getDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, donation_date, amount, email } = req.body;
    const newDonation = new Donation({ name, donation_date, amount, email });
    await newDonation.save();
    res.status(201).json(newDonation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
