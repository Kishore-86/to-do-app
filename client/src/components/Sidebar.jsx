import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Settings,
  UserCircle,
  Zap,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const links = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Shared", icon: Users, to: "/shared" },
  { name: "Create", icon: PlusCircle, to: "/create" },
  { name: "Profile", icon: UserCircle, to: "/profile" },
  { name: "Settings", icon: Settings, to: "/settings" },
]

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="h-screen w-60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/20 hidden md:flex flex-col justify-between p-6 shadow-xl"
    >
      <div>
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CyberTask
            </h1>
            <p className="text-xs text-muted-foreground">v2.0</p>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {links.map(({ name, icon: Icon, to }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 text-sm px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Animated background for active state */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    
                    {/* Icon with animation */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    
                    {/* Text */}
                    <span className="relative z-10">{name}</span>
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200" />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Level 3
            </div>
            <div className="text-xs text-muted-foreground mb-2">Task Master</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ delay: 1, duration: 1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">240/320 XP</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="space-y-4"
      >
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-sm px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>

        {/* Footer */}
        <div className="text-xs text-muted-foreground px-4 text-center">
          <p>&copy; 2025 CyberTask</p>
          <p className="mt-1">Made with ❤️</p>
        </div>
      </motion.div>
    </motion.aside>
  )
}
