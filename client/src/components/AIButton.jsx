import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function AIButton({ onClick, loading }) {
  const [hovering, setHovering] = useState(false)

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "relative flex items-center gap-2 border-border group transition",
        loading && "cursor-not-allowed opacity-50"
      )}
    >
      <Sparkles
        className={cn(
          "w-4 h-4 text-cyan-400 group-hover:animate-pulse",
          hovering && "animate-ping"
        )}
      />
      {loading ? "Thinking..." : "Ask AI"}
    </Button>
  )
}
