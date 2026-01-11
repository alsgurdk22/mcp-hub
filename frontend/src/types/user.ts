export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  serversCount: number
  lastActive: string
  status: UserStatus
}

export type UserRole = 'Admin' | 'Developer' | 'User'

export type UserStatus = 'Active' | 'Suspended' | 'Pending'
