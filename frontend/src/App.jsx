import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaTiktok, FaLinkedin, FaPinterest, FaSnapchat, FaLink } from 'react-icons/fa'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Kittens from './pages/Kittens'
import Care from './pages/Care'
import About from './pages/About'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import './App.css'

function App() {
  const [socialMedia, setSocialMedia] = useState({ links: [] })

  useEffect(() => {
    fetchSocialMedia()
  }, [])

  const fetchSocialMedia = async () => {
    try {
      const response = await axios.get('/api/content/social_media')
      setSocialMedia(JSON.parse(response.data.content))
    } catch (error) {
      console.error('Error fetching social media:', error)
    }
  }

  const getSocialIcon = (platform) => {
    const iconMap = {
      'instagram': FaInstagram,
      'facebook': FaFacebook,
      'twitter': FaTwitter,
      'youtube': FaYoutube,
      'tiktok': FaTiktok,
      'linkedin': FaLinkedin,
      'pinterest': FaPinterest,
      'snapchat': FaSnapchat
    }
    const IconComponent = iconMap[platform.toLowerCase()] || FaLink
    return <IconComponent />
  }

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kittens" element={<Kittens />} />
            <Route path="/care" element={<Care />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            {socialMedia.links && socialMedia.links.length > 0 && (
              <div className="social-links">
                {socialMedia.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-link social-${(link.icon || link.platform).toLowerCase()}`}
                    title={link.platform}
                  >
                    <span className="social-icon">{getSocialIcon(link.icon || link.platform)}</span>
                    <span className="social-text">{link.platform}</span>
                  </a>
                ))}
              </div>
            )}
            <p>&copy; 2026 Royal Abyssinians. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
