import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const priorityColor = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-600 text-white",
}

export default function TaskCard({ task, onClick, onToggleStatus }) {
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onClick?.(task)}
    >
      <Card
        className={cn(
          "w-full transition-all shadow-sm hover:shadow-md border border-border cursor-pointer",
          isDone && "opacity-50"
        )}
      >
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus?.(task)
              }}
              className="text-green-500 hover:text-green-600"
              title={isDone ? "Completed" : "Mark as complete"}
            >
              {isDone ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs mt-2">
            <Badge className={cn(priorityColor[priority])}>
              {priority.toUpperCase()}
            </Badge>
            <Badge variant="outline">{formattedDue}</Badge>
            {sharedWith.length > 0 && (
              <Badge variant="outline">
                <User2 className="w-3 h-3 mr-1" />
                {sharedWith.length} Shared
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
