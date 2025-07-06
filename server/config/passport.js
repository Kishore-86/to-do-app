import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

export const configurePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id })

          let user
          if (existingUser) {
            user = existingUser
          } else {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            })
          }

          // Sign JWT
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          })

          const redirectURL = `${process.env.CLIENT_URL}/login?token=${token}&user=${encodeURIComponent(
            JSON.stringify({
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              id: user._id,
            })
          )}`

          return done(null, { redirectURL })
        } catch (err) {
          return done(err, null)
        }
      }
    )
  )

  // Handle redirect manually in route
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
}
