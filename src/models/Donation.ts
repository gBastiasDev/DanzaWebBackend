import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDonation extends Document {
  _id: Types.ObjectId;
  name: string;
  donation_date: Date;
  amount: number;
  email: string;
  state: string;
  photo?: string;
  method: string;
  flowOrder?: string;
  token?: string;
}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    name: { type: String, required: true },
    donation_date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    photo: { type: String, required: false },
    method: { type: String, required: true },
    flowOrder: { type: String, required: false },
    token: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IDonation>("Donation", DonationSchema);
