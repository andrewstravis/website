import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img
            src="/images/aby_photo1.jpg"
            alt="Royal Abyssinians Logo"
            className="logo-image"
          />
          <span className="logo-text">Royal Abyssinians</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/kittens" className={`nav-link ${isActive('/kittens')}`}>
              Kittens
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/care" className={`nav-link ${isActive('/care')}`}>
              Care
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={`nav-link ${isActive('/about')}`}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
