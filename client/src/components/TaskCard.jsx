import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, User2, Calendar, AlertCircle, Star } from "lucide-react"
import { motion } from "framer-motion"

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  low: "bg-green-500/20 text-green-400 border-green-500/50",
}

const priorityIcons = {
  high: AlertCircle,
  medium: Star,
  low: CheckCircle,
}

export default function TaskCard({ task, onClick, onToggleStatus }) {
  const {
    title,
    description,
    dueDate,
    priority = 'medium',
    status,
    sharedWith = [],
  } = task

  const due = dueDate ? new Date(dueDate) : null
  const isDone = status === "completed"
  const isOverdue = due && due < new Date() && !isDone
  const isDueToday = due && due.toDateString() === new Date().toDateString()
  
  const PriorityIcon = priorityIcons[priority] || Star

  const formatDueDate = (date) => {
    if (!date) return "No due date"
    const today = new Date()
    const diffTime = date - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    if (diffDays === -1) return "Due yesterday"
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`
    if (diffDays > 1) return `Due in ${diffDays} days`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onClick?.(task)}
      className="group"
    >
      <Card
        className={cn(
          "w-full shadow-lg border transition-all duration-300 cursor-pointer relative overflow-hidden",
          "hover:border-primary/50 hover:shadow-xl",
          isDone ? "opacity-60 bg-muted/50" : "",
          isOverdue ? "border-red-500/50 bg-red-500/5" : "",
          isDueToday ? "border-yellow-500/50 bg-yellow-500/5" : ""
        )}
      >
        {/* Priority indicator bar */}
        <div 
          className={cn(
            "absolute top-0 left-0 w-full h-1 transition-opacity",
            priority === 'high' ? 'bg-red-500' : '',
            priority === 'medium' ? 'bg-yellow-500' : '',
            priority === 'low' ? 'bg-green-500' : ''
          )}
        />
        
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors",
                isDone ? "line-through text-muted-foreground" : ""
              )}>
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {description}
                </p>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus?.(task)
              }}
              className={cn(
                "ml-3 p-2 rounded-full transition-all duration-200 hover:scale-110",
                isDone 
                  ? "text-green-500 bg-green-500/10 hover:bg-green-500/20" 
                  : "text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
              )}
              title={isDone ? "Mark as incomplete" : "Mark as complete"}
            >
              {isDone ? 
                <CheckCircle className="w-5 h-5 fill-current" /> : 
                <Clock className="w-5 h-5" />
              }
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Priority Badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 border transition-all",
                priorityColors[priority]
              )}
            >
              <PriorityIcon className="w-3 h-3" />
              {priority?.toUpperCase()}
            </Badge>

            {/* Due Date Badge */}
            {due && (
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-1 transition-all",
                  isOverdue ? "border-red-500/50 text-red-400 bg-red-500/10" : "",
                  isDueToday ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" : ""
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(due)}
              </Badge>
            )}

            {/* Shared Badge */}
            {sharedWith.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <User2 className="w-3 h-3" />
                {sharedWith.length} shared
              </Badge>
            )}
          </div>

          {/* Progress indicator for completed tasks */}
          {isDone && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-1 bg-green-500 rounded-full"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
