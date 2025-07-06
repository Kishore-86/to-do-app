import { useEffect, useState } from "react"
import XPProgressBar from "@/components/XPProgressBar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // You can also fetch from `/api/user/me` if needed
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // fallback: fake user for now
      setUser({
        name: "Cyber User",
        email: "user@example.com",
        joined: "2025-07-01",
        level: 3,
        xp: 230,
      })
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const { name, email, joined, level, xp } = user

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">Welcome, {name}</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="font-medium">Name</p>
            <p className="text-muted-foreground">{name}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{email}</p>
          </div>
          <div>
            <p className="font-medium">Joined</p>
            <p className="text-muted-foreground">
              {new Date(joined).toLocaleDateString()}
            </p>
          </div>
          <div className="pt-4">
            <XPProgressBar xp={xp} level={level} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
