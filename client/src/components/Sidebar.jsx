import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Settings,
  UserCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "Shared", icon: Users, to: "/shared" },
  { name: "Create", icon: PlusCircle, to: "/create" },
  { name: "Profile", icon: UserCircle, to: "/profile" },
  { name: "Settings", icon: Settings, to: "/settings" },
]

export default function Sidebar() {
  return (
    <aside className="h-screen w-60 bg-background border-r border-border hidden md:flex flex-col justify-between p-4">
      <div>
        <h1 className="text-xl font-bold mb-6 text-foreground tracking-wide">
          CyberTask
        </h1>

        <nav className="space-y-2">
          {links.map(({ name, icon: Icon, to }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 text-sm px-3 py-2 rounded-md font-medium transition hover:bg-accent",
                  isActive ? "bg-muted text-primary" : "text-muted-foreground"
                )
              }
            >
              <Icon className="w-4 h-4" />
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="text-xs text-muted-foreground px-3">
        <p>&copy; 2025 CyberTask</p>
      </div>
    </aside>
  )
}
