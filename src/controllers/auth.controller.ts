import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser._id.toString());
    res.status(201).json({ user: newUser, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const newAdmin = new User({ name, email, password, role: "admin" });
    await newAdmin.save();

    const token = generateToken(newAdmin._id.toString());
    res.status(201).json({ user: newAdmin, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
