import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Settings,
  UserCircle,
  Home,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const links = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard", description: "Overview of all tasks" },
  { name: "Shared", icon: Users, to: "/shared", description: "Collaborative tasks" },
  { name: "Create", icon: PlusCircle, to: "/create", description: "Add new task" },
  { name: "Profile", icon: UserCircle, to: "/profile", description: "User settings" },
  { name: "Settings", icon: Settings, to: "/settings", description: "App preferences" },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <motion.aside 
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-screen w-64 bg-card border-r border-border hidden md:flex flex-col justify-between p-6 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Logo/Brand */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              CyberTask
            </h1>
          </div>
          <p className="text-xs text-muted-foreground pl-11">
            AI-Powered Task Management
          </p>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-2">
          {links.map(({ name, icon: Icon, to, description }, index) => {
            const isActive = location.pathname === to
            
            return (
              <motion.div
                key={name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 text-sm px-4 py-3 rounded-xl font-medium transition-all duration-200 relative",
                      "hover:bg-accent/50 hover:text-accent-foreground",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "text-muted-foreground"
                    )
                  }
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{name}</div>
                    <div className="text-xs opacity-70 line-clamp-1">
                      {description}
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </nav>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20"
        >
          <h3 className="text-sm font-semibold text-foreground mb-2">Quick Stats</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Tasks Today</span>
              <span className="text-primary font-semibold">3</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Completed</span>
              <span className="text-green-500 font-semibold">12</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>In Progress</span>
              <span className="text-yellow-500 font-semibold">5</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 space-y-2"
      >
        <div className="text-xs text-muted-foreground px-4">
          <p className="flex items-center gap-2">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for productivity</span>
          </p>
          <p className="mt-1">&copy; 2025 CyberTask</p>
        </div>
      </motion.div>
    </motion.aside>
  )
}
