import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaMobileAlt } from 'react-icons/fa'
import './About.css'

function About() {
  const [content, setContent] = useState({
    title: 'About Us',
    description: '',
    contact: {
      email: '',
      phone: '',
      address: ''
    },
    payment_methods: []
  })
  const [loading, setLoading] = useState(true)
  const [showPhonePopup, setShowPhonePopup] = useState(false)

  useEffect(() => {
    document.title = 'About Royal Abyssinians | Contact Us'
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content/about')
      const parsedContent = JSON.parse(response.data.content)
      setContent(parsedContent)
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="about-page">
      <div className="container">
        <h1>{content.title}</h1>

        <section className="about-content">
          <div className="about-card">
            <p className="about-description">{content.description}</p>
          </div>
        </section>

        <section className="contact-section">
          <h2>Contact Information</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="email-icon-wrapper">
                <div className="email-envelope">
                  <div className="envelope-flap"></div>
                  <div className="envelope-body"></div>
                </div>
              </div>
              <h3>Email</h3>
              <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
            </div>
            <div className="contact-card">
              <div className="contact-card-iphone">
                <div className="iphone-frame-small">
                  <div className="iphone-notch-small"></div>
                  <div className="iphone-screen-small">
                    <div className="screen-content-small">
                      <div className="call-icon-small">📞</div>
                    </div>
                  </div>
                  <div className="iphone-button-small"></div>
                </div>
              </div>
              <h3>Phone</h3>
              <button
                onClick={() => setShowPhonePopup(true)}
                className="phone-button"
              >
                {content.contact.phone}
              </button>
            </div>
            <div className="contact-card">
              <div className="location-icon-wrapper">
                <div className="location-pin">
                  <div className="pin-top"></div>
                  <div className="pin-bottom"></div>
                </div>
              </div>
              <h3>Address</h3>
              <p>{content.contact.address}</p>
            </div>
          </div>
        </section>

        {content.payment_methods && content.payment_methods.length > 0 && (
          <section className="payment-section">
            <div className="payment-info-box">
              <h3>💳 Payment Methods Accepted</h3>
              <div className="payment-methods">
                {content.payment_methods.map((method, index) => (
                  <span key={index} className="payment-badge">{method}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="cta-section">
          <h2>Get in Touch</h2>
          <p>Interested in one of our kittens? Have questions about the Abyssinian breed?</p>
          <p>We'd love to hear from you!</p>
          <div className="cta-buttons">
            <a href={`mailto:${content.contact.email}`} className="btn-primary">
              Send Email
            </a>
            <button
              onClick={() => setShowPhonePopup(true)}
              className="btn-secondary"
            >
              Call Us
            </button>
          </div>
        </section>
      </div>

      {showPhonePopup && (
        <div className="phone-popup-overlay" onClick={() => setShowPhonePopup(false)}>
          <div className="phone-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPhonePopup(false)}>×</button>
            <div className="iphone-mockup">
              <div className="iphone-frame">
                <div className="iphone-notch"></div>
                <div className="iphone-screen">
                  <div className="screen-content">
                    <div className="call-icon">📞</div>
                    <div className="contact-name">Royal Abyssinians</div>
                    <div className="call-status">Calling...</div>
                  </div>
                </div>
                <div className="iphone-button"></div>
              </div>
            </div>
            <h3>Contact Us By Phone</h3>
            <p className="phone-number">{content.contact.phone}</p>
            <p className="popup-note">Please dial this number to reach us</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default About
