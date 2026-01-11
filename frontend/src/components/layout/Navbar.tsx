import { Link, useLocation } from '@tanstack/react-router'
import { Search, User, Menu, Wrench, X } from 'lucide-react'
import { useState } from 'react'
import { useToolboxStore } from '@/stores/toolbox'
import { cn } from '@/lib/utils'

export function Navbar() {
  const location = useLocation()
  const { servers, getTotalToolsCount } = useToolboxStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const totalTools = getTotalToolsCount()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navLinks = [
    { path: '/servers', label: '서버 둘러보기' },
    { path: '/chat', label: 'AI 채팅' },
    { path: '/register', label: '서버 등록' },
    { path: '/admin', label: '관리자' },
  ]

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
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-input rounded-md transition-colors">
              <User className="w-5 h-5" />
            </button>

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
          </div>
        </div>
      )}
    </nav>
  )
}
