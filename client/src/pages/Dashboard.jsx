import { useEffect, useState } from "react"
import TaskCard from "@/components/TaskCard"
import AIButton from "@/components/AIButton"
import XPProgressBar from "@/components/XPProgressBar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  Target,
  TrendingUp
} from "lucide-react"
import { getAllTasks, markTaskComplete } from "@/services/api"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const filterOptions = [
  { id: 'all', label: 'All Tasks', icon: Target },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
  { id: 'today', label: 'Due Today', icon: Calendar },
]

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [xp, setXP] = useState(120)
  const [level, setLevel] = useState(2)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks()
        setTasks(data)
        setFilteredTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, activeFilter, searchQuery])

  const filterTasks = () => {
    let filtered = [...tasks]
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status/category filter
    switch (activeFilter) {
      case 'pending':
        filtered = filtered.filter(task => task.status !== 'completed')
        break
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed')
        break
      case 'overdue':
        filtered = filtered.filter(task => {
          const dueDate = task.dueDate ? new Date(task.dueDate) : null
          return dueDate && dueDate < new Date() && task.status !== 'completed'
        })
        break
      case 'today':
        filtered = filtered.filter(task => {
          const dueDate = task.dueDate ? new Date(task.dueDate) : null
          return dueDate && dueDate.toDateString() === new Date().toDateString()
        })
        break
      default:
        break
    }

    setFilteredTasks(filtered)
  }

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

      // XP logic (example only)
      if (updated.status === "completed") {
        setXP((prevXP) => prevXP + 20)
        if ((xp + 20) % 100 === 0) setLevel((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error updating task status", error)
    }
  }

  const handleAISort = async () => {
    setAiLoading(true)
    try {
      // You could call an AI endpoint here
      const sorted = [...filteredTasks].sort((a, b) => {
        const priorityMap = { high: 3, medium: 2, low: 1 }
        return priorityMap[b.priority] - priorityMap[a.priority]
      })
      setFilteredTasks(sorted)
    } finally {
      setAiLoading(false)
    }
  }

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length,
    overdue: tasks.filter(t => {
      const dueDate = t.dueDate ? new Date(t.dueDate) : null
      return dueDate && dueDate < new Date() && t.status !== 'completed'
    }).length,
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Welcome back! 🚀
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mb-4"
          >
            You have {stats.pending} tasks pending and {stats.completed} completed tasks.
          </motion.p>
          <XPProgressBar xp={xp} level={level} />
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <AIButton onClick={handleAISort} loading={aiLoading} />
          <Button onClick={() => navigate("/create")} size="lg" className="shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeFilter === id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {label}
              {id !== 'all' && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {id === 'pending' ? stats.pending :
                   id === 'completed' ? stats.completed :
                   id === 'overdue' ? stats.overdue :
                   id === 'today' ? filteredTasks.filter(t => {
                     const dueDate = t.dueDate ? new Date(t.dueDate) : null
                     return dueDate && dueDate.toDateString() === new Date().toDateString()
                   }).length : 0}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Tasks Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || activeFilter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first task!'
                }
              </p>
              {!searchQuery && activeFilter === 'all' && (
                <Button onClick={() => navigate("/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onClick={handleTaskClick}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  )
}
