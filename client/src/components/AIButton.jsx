import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Brain, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AIButton({ onClick, loading = false, className, ...props }) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        loading && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20"
        animate={{
          opacity: loading ? [0.5, 1, 0.5] : 0,
        }}
        transition={{
          duration: 2,
          repeat: loading ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4" />
            </motion.div>
            <span>AI Thinking...</span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span>AI Sort</span>
            
            {/* Sparkle effects */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            >
              <Zap className="w-2 h-2 text-yellow-300" />
            </motion.div>
          </>
        )}
      </div>

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
    </Button>
  )
}
