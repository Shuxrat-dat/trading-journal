'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, BookOpen, PlusCircle, TrendingUp } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Journal', icon: BookOpen },
  { href: '/statistics', label: 'Statistics', icon: BarChart2 },
  { href: '/trades/new', label: 'New Trade', icon: PlusCircle },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-tv-border bg-tv-surface/95 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-tv-accent/20 border border-tv-accent/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-tv-accent" />
            </div>
            <span className="font-semibold text-tv-text tracking-tight">
              Trading<span className="text-tv-accent">Journal</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-tv-accent/15 text-tv-accent border border-tv-accent/25'
                      : 'text-tv-muted hover:text-tv-text hover:bg-tv-hover'
                    }
                    ${href === '/trades/new'
                      ? 'ml-2 bg-tv-accent text-white hover:bg-tv-accentHov border-0 !text-white'
                      : ''
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
