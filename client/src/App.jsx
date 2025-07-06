import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/Sidebar"
import { initSocket } from "@/services/socket"
import { isAuthenticated } from "@/services/auth"

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      initSocket()
    }
  }, [])

  // Pages without sidebar (e.g., /login)
  const noSidebarRoutes = ["/login"]

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="flex">
        {!noSidebarRoutes.includes(location.pathname) && isAuthenticated() && (
          <Sidebar />
        )}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}
