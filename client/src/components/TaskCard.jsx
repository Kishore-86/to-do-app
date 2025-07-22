import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
<<<<<<< HEAD
import { CheckCircle, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"

const priorityColors = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-400 text-black",
  low: "bg-green-600 text-white",
=======
import { CheckCircle, Clock, User2, Calendar, Flag } from "lucide-react"
import { motion } from "framer-motion"

const priorityColors = {
  high: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25",
  medium: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25",
  low: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/25",
}

const priorityIcons = {
  high: "🔥",
  medium: "⚡",
  low: "🌱"
>>>>>>> ef0c36ef7e235f38ed5b7f70e4a2a51eed2916a3
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
<<<<<<< HEAD
  const formattedDue = dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"

  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
=======
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isDone

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
>>>>>>> ef0c36ef7e235f38ed5b7f70e4a2a51eed2916a3
      whileTap={{ scale: 0.98 }}
      layout
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      onClick={() => onClick?.(task)}
<<<<<<< HEAD
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
=======
      className="cursor-pointer group"
    >
      <Card
        className={cn(
          "w-full shadow-lg border-0 transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900",
          "hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-purple-500/10",
          "group-hover:border-blue-200 dark:group-hover:border-purple-700",
          isDone && "opacity-60 saturate-50",
          isOverdue && "ring-2 ring-red-500/50"
        )}
      >
        <CardContent className="p-6 space-y-4">
          {/* Header with status toggle */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{priorityIcons[priority] || "📝"}</span>
                <h3 className={cn(
                  "font-semibold text-lg leading-tight",
                  isDone && "line-through text-muted-foreground"
                )}>
                  {title}
                </h3>
              </div>
              
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus?.(task)
              }}
              className={cn(
                "flex-shrink-0 ml-3 p-2 rounded-full transition-all duration-200",
                isDone 
                  ? "text-green-500 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20" 
                  : "text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
              )}
              title={isDone ? "Mark as incomplete" : "Mark as complete"}
            >
              {isDone ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Clock className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Badges section */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Priority badge */}
            <Badge className={cn(
              "text-xs font-semibold px-3 py-1 border-0",
              priorityColors[priority] || "bg-slate-500 text-white"
            )}>
              <Flag className="w-3 h-3 mr-1" />
              {priority?.toUpperCase() || "NORMAL"}
            </Badge>

            {/* Due date badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs px-3 py-1 border-slate-200 dark:border-slate-700",
                isOverdue && "border-red-500 text-red-600 bg-red-50 dark:bg-red-500/10"
              )}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {due}
            </Badge>

            {/* Shared badge */}
            {sharedWith.length > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-700"
              >
                <User2 className="w-3 h-3 mr-1" />
                {sharedWith.length} shared
              </Badge>
            )}
          </div>

          {/* Progress indicator for completed tasks */}
          {isDone && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          )}

          {/* Overdue indicator */}
          {isOverdue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Overdue
            </motion.div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-lg transition-all duration-300 pointer-events-none" />
>>>>>>> ef0c36ef7e235f38ed5b7f70e4a2a51eed2916a3
        </CardContent>
      </Card>
    </motion.div>
  )
}

