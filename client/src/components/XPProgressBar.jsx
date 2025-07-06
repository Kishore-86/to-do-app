import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star, Zap, Award } from "lucide-react"

export default function XPProgressBar({ xp = 0, level = 1 }) {
  const xpForCurrentLevel = (level - 1) * 100
  const xpForNextLevel = level * 100
  const currentLevelXP = xp - xpForCurrentLevel
  const xpNeededForNextLevel = xpForNextLevel - xp
  const progressPercentage = Math.max(0, Math.min(100, (currentLevelXP / 100) * 100))

  const getLevelIcon = (level) => {
    if (level < 3) return Star
    if (level < 6) return Zap
    return Award
  }

  const getLevelColor = (level) => {
    if (level < 3) return "bg-blue-500"
    if (level < 6) return "bg-purple-500"
    return "bg-yellow-500"
  }

  const LevelIcon = getLevelIcon(level)
  const levelColor = getLevelColor(level)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-lg p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${levelColor} flex items-center justify-center`}>
            <LevelIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Level {level}</h3>
            <p className="text-xs text-muted-foreground">
              {xpNeededForNextLevel} XP to next level
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {xp} XP
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentLevelXP} XP</span>
          <span>100 XP</span>
        </div>
        
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`absolute top-0 left-0 h-full ${levelColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 1, 
              ease: "easeOut",
              delay: 0.2
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1
            }}
          />
        </div>

        {/* Milestone indicators */}
        <div className="flex justify-between">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className={`w-1 h-3 rounded-full transition-all duration-300 ${
                currentLevelXP >= milestone 
                  ? levelColor 
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Level perks preview */}
      {level > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground"
        >
          <span className="font-medium">Level {level} Perks:</span>
          <span className="ml-1">
            {level < 3 && "Basic task management"}
            {level >= 3 && level < 6 && "AI suggestions & priority sorting"}
            {level >= 6 && "Advanced analytics & team collaboration"}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
