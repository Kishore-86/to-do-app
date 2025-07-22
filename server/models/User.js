import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    avatar: String,
    provider: String, // e.g. "google"
    providerId: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("User", userSchema)
