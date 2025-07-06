import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createTask, updateTask, getTask } from "@/services/api"
import { toast } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-500 text-white" },
  { value: "medium", label: "Medium", color: "bg-yellow-500 text-black" },
  { value: "high", label: "High", color: "bg-red-500 text-white" }
]

export default function TaskForm({ mode = "create" }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    sharedWith: ""
  })

  useEffect(() => {
    if (mode === "edit" && id) {
      loadTask()
    }
  }, [mode, id])

  const loadTask = async () => {
    try {
      setLoading(true)
      const task = await getTask(id)
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        priority: task.priority || "medium",
        sharedWith: task.sharedWith?.join(", ") || ""
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load task",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const taskData = {
        ...formData,
        sharedWith: formData.sharedWith
          .split(",")
          .map(email => email.trim())
          .filter(email => email)
      }

      if (mode === "create") {
        await createTask(taskData)
        toast({
          title: "Success",
          description: "Task created successfully"
        })
      } else {
        await updateTask(id, taskData)
        toast({
          title: "Success", 
          description: "Task updated successfully"
        })
      }
      
      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} task`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "create" ? "Add a new task to your list" : "Update your task details"}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
                  placeholder="Enter task title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background resize-none"
                  placeholder="Describe your task..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <div className="flex gap-2">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange("priority", option.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                          formData.priority === option.value
                            ? option.color
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Share With (Email addresses)</label>
                <input
                  type="text"
                  value={formData.sharedWith}
                  onChange={(e) => handleChange("sharedWith", e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
                  placeholder="user1@example.com, user2@example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple emails with commas
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 text-base font-medium"
                >
                  {loading ? "Saving..." : mode === "create" ? "Create Task" : "Update Task"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="px-8 h-12 text-base"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
