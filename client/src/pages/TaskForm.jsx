import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  User2, 
  AlertCircle,
  Star,
  CheckCircle
} from "lucide-react"

const priorityOptions = [
  { value: 'low', label: 'Low Priority', icon: CheckCircle, color: 'bg-green-500' },
  { value: 'medium', label: 'Medium Priority', icon: Star, color: 'bg-yellow-500' },
  { value: 'high', label: 'High Priority', icon: AlertCircle, color: 'bg-red-500' },
]

export default function TaskForm({ mode = "create" }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    sharedWith: "",
  })

  const isEditMode = mode === "edit"
  const title = isEditMode ? "Edit Task" : "Create New Task"

  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, you would fetch the task data here
      // For now, we'll just simulate it
      setFormData({
        title: "Sample Task",
        description: "This is a sample task description",
        priority: "medium",
        dueDate: "2025-01-15",
        sharedWith: "",
      })
    }
  }, [isEditMode, id])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would call your API here
      console.log("Submitting task:", formData)
      
      navigate("/dashboard")
    } catch (error) {
      console.error("Error saving task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Update your task details" : "Add a new task to your list"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Task Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Task Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your task..."
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {priorityOptions.map(({ value, label, icon: Icon, color }) => (
                  <motion.button
                    key={value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("priority", value)}
                    className={`p-4 border rounded-lg transition-all ${
                      formData.priority === value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sharedWith" className="text-sm font-medium">
                  Share With (Email)
                </label>
                <input
                  id="sharedWith"
                  type="email"
                  value={formData.sharedWith}
                  onChange={(e) => handleInputChange("sharedWith", e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="flex-1 h-12"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Save className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? "Saving..." : isEditMode ? "Update Task" : "Create Task"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* AI Suggestions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="mt-6 bg-gradient-to-br from-purple-500/10 to-blue-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">AI Suggestion</h3>
                <p className="text-xs text-muted-foreground">
                  Based on your task patterns, consider setting a reminder 2 days before the due date 
                  and breaking large tasks into smaller subtasks for better completion rates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}