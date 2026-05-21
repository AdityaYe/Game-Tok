import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaFire, FaGamepad, FaUser } from 'react-icons/fa'

import '../styles/bottom-nav.css'

const navItems = [
  {
    to: '/',
    end: true,
    label: 'Clips',
    icon: FaFire,
  },
  {
    to: '/feed',
    label: 'Feed',
    icon: FaGamepad,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: FaUser,
  },
]

const BottomNav = () => {
  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Bottom Navigation"
    >

      <div className="bottom-nav__inner">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `bottom-nav__item ${isActive ? 'is-active' : ''}`
            }
            aria-label={item.label}
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              <Icon />
            </span>

            <span className="bottom-nav__label">
              {item.label}
            </span>
          </NavLink>
          )
        })}

      </div>

    </nav>
  )
}

export default BottomNav
