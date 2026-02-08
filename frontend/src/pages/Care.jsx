import { useState, useEffect } from 'react'
import axios from 'axios'
import './Care.css'

function Care() {
  const [content, setContent] = useState({
    title: 'Caring for Your Abyssinian',
    about_breed: '',
    care_tips: [],
    image_url: '/images/aby_kitten1.jpg'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Abyssinian Cat Care Guide | Royal Abyssinians'
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content/care')
      const parsedContent = JSON.parse(response.data.content)
      setContent(parsedContent)
    } catch (error) {
      console.error('Error fetching care content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="care-page">
      <div className="container">
        <h1>{content.title}</h1>

        <section className="breed-info">
          <h2>About the Abyssinian Breed</h2>
          <div className="breed-card">
            <div className="breed-image">
              <img src={content.image_url || "/images/aby_kitten1.jpg"} alt="Abyssinian Kitten" />
            </div>
            <p>{content.about_breed}</p>
          </div>
        </section>

        <section className="care-tips-section">
          <h2>Care Guidelines</h2>
          <div className="care-tips-grid">
            {content.care_tips && content.care_tips.map((tip, index) => (
              <div key={index} className="care-tip-card">
                <div className="tip-number">{index + 1}</div>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="additional-info">
          <h2>Important Considerations</h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>🏥 Health</h3>
              <p>Regular veterinary check-ups are essential. Abyssinians are generally healthy but should be monitored for hereditary conditions.</p>
            </div>
            <div className="info-card">
              <h3>🎮 Activity</h3>
              <p>Abyssinians are highly active and need plenty of mental and physical stimulation. Provide climbing structures and interactive toys.</p>
            </div>
            <div className="info-card">
              <h3>🍖 Nutrition</h3>
              <p>Feed high-quality cat food appropriate for their life stage. Maintain a consistent feeding schedule and provide fresh water.</p>
            </div>
            <div className="info-card">
              <h3>👥 Socialization</h3>
              <p>Abyssinians are social cats who enjoy human companionship. They don't do well when left alone for long periods.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Care
