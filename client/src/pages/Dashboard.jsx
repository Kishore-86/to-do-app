import { useEffect, useState } from "react"
import TaskCard from "@/components/TaskCard"
import AIButton from "@/components/AIButton"
import XPProgressBar from "@/components/XPProgressBar"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, Calendar, TrendingUp } from "lucide-react"
import { getAllTasks, markTaskComplete } from "@/services/api"
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/ui/toaster"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [xp, setXP] = useState(120)
  const [level, setLevel] = useState(2)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks()
        setTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks", error)
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const handleTaskClick = (task) => {
    navigate(`/edit/${task._id}`)
  }

  const handleToggleStatus = async (task) => {
    try {
      const updated = await markTaskComplete(task._id, task.status !== "completed")
      const updatedTasks = tasks.map((t) =>
        t._id === task._id ? { ...t, status: updated.status } : t
      )
      setTasks(updatedTasks)

      // XP logic with animation
      if (updated.status === "completed") {
        setXP((prevXP) => prevXP + 20)
        if ((xp + 20) % 100 === 0) setLevel((prev) => prev + 1)
        
        toast({
          title: "Task Completed! 🎉",
          description: "+20 XP earned"
        })
      }
    } catch (error) {
      console.error("Error updating task status", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const handleAISort = async () => {
    setAiLoading(true)
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const sorted = [...tasks].sort((a, b) => {
        const priorityMap = { high: 3, medium: 2, low: 1 }
        const dueDateScore = (task) => {
          if (!task.dueDate) return 0
          const dueDate = new Date(task.dueDate)
          const today = new Date()
          const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
          return Math.max(0, 10 - diffDays) // Closer due dates get higher score
        }
        
        const scoreA = priorityMap[a.priority] * 10 + dueDateScore(a)
        const scoreB = priorityMap[b.priority] * 10 + dueDateScore(b)
        
        return scoreB - scoreA
      })
      
      setTasks(sorted)
      toast({
        title: "AI Sort Complete ✨",
        description: "Tasks sorted by priority and due date"
      })
    } finally {
      setAiLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status !== "completed").length,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== "completed"
    }).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
        >
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                You have {stats.pending} pending tasks and {stats.completed} completed
              </p>
            </div>
            <XPProgressBar xp={xp} level={level} />
          </div>

          <div className="flex flex-wrap gap-3">
            <AIButton onClick={handleAISort} loading={aiLoading} />
            <Button 
              onClick={() => navigate("/create")}
              className="btn-hover-lift bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Tasks", value: stats.total, icon: Calendar, color: "bg-blue-500" },
            { label: "Completed", value: stats.completed, icon: TrendingUp, color: "bg-green-500" },
            { label: "Pending", value: stats.pending, icon: Calendar, color: "bg-yellow-500" },
            { label: "Overdue", value: stats.overdue, icon: Calendar, color: "bg-red-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.color)}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-muted-foreground mt-3" />
            {["all", "high", "medium", "low"].map((priority) => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filterPriority === priority
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70"
                )}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tasks Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/50 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </motion.div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm || filterPriority !== "all" ? "No matching tasks" : "No tasks yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterPriority !== "all"
                ? "Try adjusting your search or filter"
                : "Create your first task to get started"
              }
            </p>
            {!searchTerm && filterPriority === "all" && (
              <Button
                onClick={() => navigate("/create")}
                className="btn-hover-lift bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Task
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="card-hover"
                >
                  <TaskCard
                    task={task}
                    onClick={handleTaskClick}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
