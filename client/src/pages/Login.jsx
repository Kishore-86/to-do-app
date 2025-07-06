import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useEffect } from "react"

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
    <div className="h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to CyberTask</h1>
        <p className="text-muted-foreground">
          Manage your tasks smarter with AI assistance and collaboration.
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full gap-2 bg-white text-black hover:bg-gray-100"
            variant="ghost"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          {/* You can add more OAuth buttons here (GitHub, Facebook) */}
        </div>
      </div>
    </div>
  )
}
