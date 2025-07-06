import User from "../models/userModel.js"

// @desc   Get authenticated user profile
// @route  GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-googleId")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile", error: err.message })
  }
}

// @desc   Update XP (increment or decrement)
// @route  PATCH /api/user/xp
export const updateXP = async (req, res) => {
  const { delta } = req.body // +1 or -1

  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.xp = Math.max(0, user.xp + delta)
    await user.save()

    res.status(200).json({ xp: user.xp })
  } catch (err) {
    res.status(500).json({ message: "Failed to update XP", error: err.message })
  }
}

// @desc   Search user by email (for task sharing)
// @route  POST /api/user/find
export const findUserByEmail = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email }).select("name email avatar _id")

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: "Failed to search user", error: err.message })
  }
}
