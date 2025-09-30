import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  name: string;
  donation_date: Date;
  amount: number;
  email: string;
  state: string;
  photo?: string;
  method: string;
}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    name: { type: String, required: true },
    donation_date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    photo: { type: String },
    method: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDonation>("Donation", DonationSchema);
