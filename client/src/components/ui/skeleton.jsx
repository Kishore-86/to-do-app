import { cn } from "@/lib/utils"

<<<<<<< HEAD
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} />
  );
}

export { Skeleton }
=======
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
>>>>>>> ef0c36ef7e235f38ed5b7f70e4a2a51eed2916a3
