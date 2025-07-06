import { useEffect, useState } from "react"
import TaskCard from "@/components/TaskCard"
import { getSharedTasks } from "@/services/api"

export default function Shared() {
  const [sharedTasks, setSharedTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSharedTasks = async () => {
      try {
        const tasks = await getSharedTasks()
        setSharedTasks(tasks)
      } catch (err) {
        console.error("Error fetching shared tasks", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSharedTasks()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shared with Me</h1>
        <p className="text-muted-foreground text-sm">
          Tasks others have shared with you
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading shared tasks...</p>
      ) : sharedTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No shared tasks available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
