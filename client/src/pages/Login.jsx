import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Zap, Users, Star } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and secure"
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Smart task organization and insights"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share and collaborate with your team"
  },
  {
    icon: Star,
    title: "Gamified Experience",
    description: "Level up with XP and achievements"
  }
]

export default function Login() {
  // Redirect to backend OAuth login
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
  }

  // Optional: Redirect logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      window.location.href = "/dashboard"
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
            >
              Welcome to CyberTask
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-lg"
            >
              Supercharge your productivity with AI-powered task management
            </motion.p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Sign in to continue</h2>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred sign-in method
                </p>
              </div>

              <Button
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-md btn-hover-lift"
                variant="ghost"
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/20"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/70 dark:bg-slate-800/70 px-3 text-muted-foreground">
                    More options coming soon
                  </span>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl font-bold mb-8"
          >
            Why choose CyberTask?
          </motion.h2>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl border border-blue-200/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Join 10,000+ users</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm font-medium">4.9/5 rating</span>
            </div>
            <p className="text-sm text-muted-foreground">
              "CyberTask transformed how I manage my daily tasks. The AI features are incredible!"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
