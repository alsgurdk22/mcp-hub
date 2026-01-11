import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Search, Menu, Wrench, X, LogOut, LogIn } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useToolboxStore } from '@/stores/toolbox'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { servers, getTotalToolsCount } = useToolboxStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const totalTools = getTotalToolsCount()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navLinks = [
    { path: '/servers', label: '서버 둘러보기' },
    { path: '/chat', label: 'AI 채팅' },
    { path: '/register', label: '서버 등록' },
    ...(user?.role === 'Admin' ? [{ path: '/admin', label: '관리자' }] : []),
  ]

  const handleLogout = async () => {
    await logout()
    toast.success('로그아웃 되었습니다')
    setIsUserMenuOpen(false)
    navigate({ to: '/' })
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-lime rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">MCP Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'text-primary bg-input'
                    : 'text-muted-foreground hover:text-foreground hover:bg-input'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-input rounded-md transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Toolbox Indicator */}
            {servers.length > 0 && (
              <Link to="/chat" className="relative">
                <div className="px-3 py-1.5 bg-input border border-border rounded-md text-sm hover:border-primary transition-colors">
                  <span className="text-muted-foreground">도구함:</span>
                  <span className="ml-1 text-primary font-semibold">
                    {totalTools}
                  </span>
                </div>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground hover:bg-input rounded-md transition-colors"
                >
                  <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.username}
                  </span>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-border">
                        <p className="font-medium truncate">{user?.username}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-primary mt-1">{user?.role}</p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-input rounded-md transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          로그아웃
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-input rounded-md transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  isActive(link.path)
                    ? 'text-primary bg-input'
                    : 'text-muted-foreground hover:text-foreground hover:bg-input'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-primary"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
