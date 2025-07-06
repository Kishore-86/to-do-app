const TOKEN_KEY = "token"
const USER_KEY = "user"

// Save token & user object
export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Get token
export const getToken = () => localStorage.getItem(TOKEN_KEY)

// Get user object
export const getUser = () => {
  const data = localStorage.getItem(USER_KEY)
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

// Logout: clear everything
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.location.href = "/login"
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

// Handle OAuth redirect (optional use)
export const handleOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get("token")
  const user = urlParams.get("user")

  if (token && user) {
    try {
      const userObj = JSON.parse(decodeURIComponent(user))
      saveAuth(token, userObj)
      window.location.href = "/dashboard"
    } catch {
      console.error("Invalid user data in URL")
    }
  }
}
