import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Server,
  Users,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/servers', label: 'Servers', icon: Server },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/monitoring', label: 'Monitoring', icon: Activity },
  { path: '/admin/verification', label: 'Verification', icon: ShieldCheck },
]

export function AdminSidebar() {
  const location = useLocation()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Admin Panel
        </h2>
        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(link.path, link.exact)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-input'
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
