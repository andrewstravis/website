import { useState, useEffect } from 'react'
import axios from 'axios'
import './Kittens.css'

function Kittens() {
  const [kittens, setKittens] = useState([])
  const [parents, setParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWaitingListForm, setShowWaitingListForm] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: ''
  })
  const [submitStatus, setSubmitStatus] = useState('')

  useEffect(() => {
    document.title = 'Available Abyssinian Kittens for Sale | Royal Abyssinians'
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [kittensRes, parentsRes, aboutRes] = await Promise.all([
        axios.get('/api/kittens'),
        axios.get('/api/parents'),
        axios.get('/api/content/about')
      ])
      setKittens(kittensRes.data)
      setParents(parentsRes.data)
      const aboutContent = JSON.parse(aboutRes.data.content)
      setPaymentMethods(aboutContent.payment_methods || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('submitting')

    try {
      await axios.post('/api/waiting-list', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', preferences: '' })
      setTimeout(() => {
        setShowWaitingListForm(false)
        setSubmitStatus('')
      }, 2000)
    } catch (error) {
      console.error('Error submitting waiting list form:', error)
      setSubmitStatus('error')
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="kittens-page">
      <div className="container">
        <div className="page-header">
          <h1>Available Kittens</h1>
          <button
            className="btn-primary"
            onClick={() => setShowWaitingListForm(!showWaitingListForm)}
          >
            {showWaitingListForm ? 'Close Form' : 'Join Waiting List'}
          </button>
        </div>

        {showWaitingListForm && (
          <div className="waiting-list-form-container">
            <h2>Join Our Waiting List</h2>
            <form onSubmit={handleSubmit} className="waiting-list-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="preferences">Preferences (color, gender, etc.)</label>
                <textarea
                  id="preferences"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about your preferences..."
                />
              </div>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitStatus === 'submitting'}
              >
                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit'}
              </button>
              {submitStatus === 'success' && (
                <p className="success-message">Successfully added to waiting list!</p>
              )}
              {submitStatus === 'error' && (
                <p className="error-message">Error submitting form. Please try again.</p>
              )}
            </form>
          </div>
        )}

        {parents.length > 0 && (
          <div className="parents-section">
            <h2>Our Breeding Cats</h2>
            <div className="parents-grid">
              {parents.map((parent) => (
                <div key={parent.id} className="parent-card">
                  {parent.image_url && (
                    <div className="parent-image">
                      <img src={parent.image_url} alt={parent.name} />
                    </div>
                  )}
                  <div className="parent-details">
                    <h3>{parent.name}</h3>
                    <div className="parent-info">
                      <p><strong>Gender:</strong> {parent.gender}</p>
                      <p><strong>Color:</strong> {parent.color}</p>
                    </div>
                    <p className="parent-description">{parent.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {paymentMethods.length > 0 && (
          <div className="payment-info-box">
            <h3>💳 Payment Methods Accepted</h3>
            <div className="payment-methods">
              {paymentMethods.map((method, index) => (
                <span key={index} className="payment-badge">{method}</span>
              ))}
            </div>
          </div>
        )}

        <h2>Available Kittens</h2>
        <div className="kittens-grid">
          {kittens.length === 0 ? (
            <div className="no-kittens">
              <p>No kittens available at the moment. Please check back later or join our waiting list!</p>
            </div>
          ) : (
            kittens.map((kitten) => (
              <div key={kitten.id} className="kitten-card">
                {kitten.image_url && (
                  <div className="kitten-image">
                    <img src={kitten.image_url} alt={kitten.name} />
                  </div>
                )}
                <div className="kitten-details">
                  <h3>{kitten.name}</h3>
                  <div className="kitten-info">
                    <p><strong>Born:</strong> {kitten.birth_date}</p>
                    <p><strong>Color:</strong> {kitten.color}</p>
                    <p><strong>Gender:</strong> {kitten.gender}</p>
                    <p><strong>Price:</strong> ${kitten.price}</p>
                  </div>
                  <p className="kitten-description">{kitten.description}</p>
                  <div className="kitten-status">
                    {kitten.available ? (
                      <span className="status-available">Available</span>
                    ) : (
                      <span className="status-reserved">Reserved</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Kittens
