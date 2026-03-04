import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('weatherAppUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Get all registered users
  const getUsers = () => {
    const users = localStorage.getItem('weatherAppUsers')
    return users ? JSON.parse(users) : []
  }

  // Save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('weatherAppUsers', JSON.stringify(users))
  }

  // Sign up new user
  const signup = async (userData) => {
    return new Promise((resolve, reject) => {
      try {
        const users = getUsers()
        
        // Check if email already exists
        const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
        if (existingUser) {
          reject(new Error('An account with this email already exists'))
          return
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || '',
          location: userData.location || '',
          createdAt: new Date().toISOString(),
          preferences: {
            temperatureUnit: 'celsius',
            notifications: true
          }
        }

        // Save to users list
        users.push(newUser)
        saveUsers(users)

        // Auto login after signup
        const { password, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)
        localStorage.setItem('weatherAppUser', JSON.stringify(userWithoutPassword))

        resolve(userWithoutPassword)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Login user
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = getUsers()
        const user = users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )

        if (!user) {
          reject(new Error('Invalid email or password'))
          return
        }

        const { password: _, ...userWithoutPassword } = user
        setUser(userWithoutPassword)
        localStorage.setItem('weatherAppUser', JSON.stringify(userWithoutPassword))

        resolve(userWithoutPassword)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Logout user
  const logout = () => {
    setUser(null)
    localStorage.removeItem('weatherAppUser')
  }

  // Update user profile
  const updateProfile = (updates) => {
    if (!user) return

    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      saveUsers(users)
    }

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('weatherAppUser', JSON.stringify(updatedUser))

    return updatedUser
  }

  // Change password
  const changePassword = (currentPassword, newPassword) => {
    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === user.id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    if (users[userIndex].password !== currentPassword) {
      throw new Error('Current password is incorrect')
    }

    users[userIndex].password = newPassword
    saveUsers(users)

    return true
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateProfile,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
