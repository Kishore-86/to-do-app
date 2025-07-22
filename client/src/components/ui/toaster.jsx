<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
=======
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

let toasts = []
let listeners = []

export function toast({ title, description, variant = "default" }) {
  const id = Math.random().toString(36).slice(2)
  const newToast = { id, title, description, variant }
  
  toasts.push(newToast)
  listeners.forEach(listener => listener([...toasts]))
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
  
  return id
}

function removeToast(id) {
  toasts = toasts.filter(t => t.id !== id)
  listeners.forEach(listener => listener([...toasts]))
}

export function Toaster() {
  const [toastList, setToastList] = useState([])

  useEffect(() => {
    listeners.push(setToastList)
    return () => {
      listeners = listeners.filter(listener => listener !== setToastList)
    }
  }, [])

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
            "bg-background text-foreground",
            toast.variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground"
          )}
        >
          <div className="grid gap-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
>>>>>>> ef0c36ef7e235f38ed5b7f70e4a2a51eed2916a3
