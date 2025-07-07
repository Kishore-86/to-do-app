import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, User2 } from "lucide-react"
import { motion } from "framer-motion"

const priorityColors = {
  high: "bg-red-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-500 text-white",
}

export default function TaskCard({ task, onClick, onToggleStatus }) {
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    sharedWith = [],
  } = task

  const due = dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"
  const isDone = status === "completed"

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
          "w-full shadow-md border transition-all cursor-pointer",
          isDone ? "opacity-50" : "",
        )}
      >
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{title}</h3>
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

          {description && <p className="text-sm text-muted-foreground">{description}</p>}

          <div className="flex flex-wrap gap-2 items-center text-xs mt-2">
            <Badge variant="secondary" className={cn(priorityColors[priority] || "")}>
              {priority?.toUpperCase() || "NORMAL"}
            </Badge>

            <Badge variant="outline">{due}</Badge>

            {sharedWith.length > 0 && (
              <Badge variant="outline">
                <User2 className="w-3 h-3 mr-1" />
                {sharedWith.length} shared
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
