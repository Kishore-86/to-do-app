import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function XPProgressBar({ xp = 0, level = 1 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate smooth transition
    const timeout = setTimeout(() => {
      setProgress(Math.min(100, (xp % 100)))
    }, 300)
    return () => clearTimeout(timeout)
  }, [xp])

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">
          Level {level}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {xp % 100} / 100 XP
        </span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-in-out"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
