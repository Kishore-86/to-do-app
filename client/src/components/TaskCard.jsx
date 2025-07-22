import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"

const priorityColors = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-400 text-black",
  low: "bg-green-600 text-white",
}

export function TaskCard({ task, onClick, onToggleStatus, onEdit, onDelete }) {
  const {
    title,
    description,
    dueDate,
    priority = "medium",
    status = "in-progress",
    sharedWith = [],
  } = task

  const isDone = status === "completed"
  const formattedDue = dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"

  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      onClick={() => onClick?.(task)}
      className="group"
    >
      <Card
        className={cn(
          "w-full shadow-sm border border-border cursor-pointer bg-card group-hover:shadow-lg transition-all",
          isDone && "opacity-50"
        )}
      >
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && (
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{description}</p>
              )}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onToggleStatus?.(task); }}
              className={cn("rounded-full border ml-2 p-2 bg-background hover:bg-accent",
                isDone ? "text-green-500" : "text-gray-400 hover:text-green-500"
              )}
              title={isDone ? "Completed" : "Mark as completed"}
            >
              {isDone ?
                <CheckCircle className="w-5 h-5" /> :
                <Clock className="w-5 h-5" />
              }
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-1 items-center">
            <Badge className={cn(priorityColors[priority] || "bg-gray-300 text-black","font-semibold")}>
              {priority?.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              <span className={cn(
                dueDate && new Date(dueDate) < new Date() && status !== "completed" ? "text-red-500 font-semibold" : ""
              )}>
                {formattedDue}
              </span>
            </Badge>
            {sharedWith.length > 0 && (
              <Badge variant="outline">
                <Users className="w-4 h-4 mr-1" />
                {sharedWith.length}
              </Badge>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => onEdit(task)} className="btn btn-sm btn-outline">Edit</button>
            <button onClick={() => onDelete(task)} className="btn btn-sm btn-danger">Delete</button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

