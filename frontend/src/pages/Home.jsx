import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Home.css'

function Home() {
  const [content, setContent] = useState({
    company_name: 'Royal Abyssinians',
    logo_url: '/logo.png',
    affiliations: [],
    tagline: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Royal Abyssinians | Abyssinian Kittens for Sale | Abyssinian Cat Breeder'
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content/home')
      const parsedContent = JSON.parse(response.data.content)
      setContent(parsedContent)
    } catch (error) {
      console.error('Error fetching home content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <img
              src={content.logo_url || "/images/aby_photo1.jpg"}
              alt={content.company_name}
              className="logo"
            />
          </div>
          <h1 className="company-name">{content.company_name}</h1>
          <p className="tagline">{content.tagline}</p>
        </div>
      </section>

      <section className="intro-section">
        <div className="container">
          <h2>Welcome</h2>
          <p className="description">{content.description}</p>
        </div>
      </section>

      <section className="affiliations-section">
        <div className="container">
          <h2>Our Affiliations</h2>
          <div className="affiliations-list">
            {content.affiliations && content.affiliations.map((affiliation, index) => (
              <div key={index} className="affiliation-badge">
                <span className="badge-icon">✓</span>
                <span>{affiliation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quick-links-section">
        <div className="container">
          <h2>Explore Our Site</h2>
          <div className="quick-links">
            <Link to="/kittens" className="quick-link-card">
              <div className="card-icon">🐾</div>
              <h3>Available Kittens</h3>
              <p>Browse our beautiful Abyssinian kittens and join the waiting list</p>
            </Link>
            <Link to="/care" className="quick-link-card">
              <div className="card-icon">💝</div>
              <h3>Care Guide</h3>
              <p>Learn about the Abyssinian breed and how to care for your cat</p>
            </Link>
            <Link to="/about" className="quick-link-card">
              <div className="card-icon">📧</div>
              <h3>About Us</h3>
              <p>Get to know us and find our contact information</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
