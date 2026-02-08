import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Admin.css'

function Admin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [homeContent, setHomeContent] = useState({
    company_name: '',
    logo_url: '',
    affiliations: [],
    tagline: '',
    description: ''
  })

  // Create an axios instance with the auth token
  const api = useMemo(() => {
    const instance = axios.create()
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken')
          navigate('/admin-login')
        }
        return Promise.reject(error)
      }
    )
    return instance
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin-login')
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [navigate])

  const [careContent, setCareContent] = useState({
    title: '',
    about_breed: '',
    care_tips: [],
    image_url: ''
  })
  const [aboutContent, setAboutContent] = useState({
    title: '',
    description: '',
    contact: { email: '', phone: '', address: '' },
    payment_methods: []
  })
  const [socialMediaContent, setSocialMediaContent] = useState({
    links: []
  })
  const [kittens, setKittens] = useState([])
  const [parents, setParents] = useState([])
  const [products, setProducts] = useState([])
  const [waitingList, setWaitingList] = useState([])
  const [editingKitten, setEditingKitten] = useState(null)
  const [editingParent, setEditingParent] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newKitten, setNewKitten] = useState({
    name: '',
    birth_date: '',
    color: '',
    gender: 'Male',
    price: '',
    description: '',
    image_url: '',
    available: true
  })
  const [newParent, setNewParent] = useState({
    name: '',
    gender: 'Male',
    color: '',
    description: '',
    image_url: ''
  })
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    stock_quantity: 0,
    available: true
  })
  const [saveStatus, setSaveStatus] = useState('')
  const [newAffiliation, setNewAffiliation] = useState('')
  const [newCareTip, setNewCareTip] = useState('')
  const [newPaymentMethod, setNewPaymentMethod] = useState('')
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', icon: '' })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllContent()
    }
  }, [isAuthenticated])

  const fetchAllContent = async () => {
    try {
      const [homeRes, careRes, aboutRes, socialRes, kittensRes, parentsRes, productsRes, waitingRes] = await Promise.all([
        axios.get('/api/content/home'),
        axios.get('/api/content/care'),
        axios.get('/api/content/about'),
        axios.get('/api/content/social_media'),
        axios.get('/api/kittens'),
        axios.get('/api/parents'),
        axios.get('/api/products'),
        api.get('/api/waiting-list')
      ])

      setHomeContent(JSON.parse(homeRes.data.content))
      setCareContent(JSON.parse(careRes.data.content))
      setAboutContent(JSON.parse(aboutRes.data.content))
      setSocialMediaContent(JSON.parse(socialRes.data.content))
      setKittens(kittensRes.data)
      setParents(parentsRes.data)
      setProducts(productsRes.data)
      setWaitingList(waitingRes.data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }

  const saveHomeContent = async () => {
    setSaveStatus('saving')
    try {
      await api.put('/api/content', {
        page_name: 'home',
        content: JSON.stringify(homeContent)
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Error saving home content:', error)
      setSaveStatus('error')
    }
  }

  const saveCareContent = async () => {
    setSaveStatus('saving')
    try {
      await api.put('/api/content', {
        page_name: 'care',
        content: JSON.stringify(careContent)
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Error saving care content:', error)
      setSaveStatus('error')
    }
  }

  const saveAboutContent = async () => {
    setSaveStatus('saving')
    try {
      await api.put('/api/content', {
        page_name: 'about',
        content: JSON.stringify(aboutContent)
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Error saving about content:', error)
      setSaveStatus('error')
    }
  }

  const saveSocialMediaContent = async () => {
    setSaveStatus('saving')
    try {
      await api.put('/api/content', {
        page_name: 'social_media',
        content: JSON.stringify(socialMediaContent)
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Error saving social media content:', error)
      setSaveStatus('error')
    }
  }

  const addAffiliation = () => {
    if (newAffiliation.trim()) {
      setHomeContent(prev => ({
        ...prev,
        affiliations: [...prev.affiliations, newAffiliation]
      }))
      setNewAffiliation('')
    }
  }

  const removeAffiliation = (index) => {
    setHomeContent(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter((_, i) => i !== index)
    }))
  }

  const addCareTip = () => {
    if (newCareTip.trim()) {
      setCareContent(prev => ({
        ...prev,
        care_tips: [...prev.care_tips, newCareTip]
      }))
      setNewCareTip('')
    }
  }

  const removeCareTip = (index) => {
    setCareContent(prev => ({
      ...prev,
      care_tips: prev.care_tips.filter((_, i) => i !== index)
    }))
  }

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim()) {
      setAboutContent(prev => ({
        ...prev,
        payment_methods: [...(prev.payment_methods || []), newPaymentMethod]
      }))
      setNewPaymentMethod('')
    }
  }

  const removePaymentMethod = (index) => {
    setAboutContent(prev => ({
      ...prev,
      payment_methods: (prev.payment_methods || []).filter((_, i) => i !== index)
    }))
  }

  const addSocialLink = () => {
    if (newSocialLink.platform.trim() && newSocialLink.url.trim()) {
      setSocialMediaContent(prev => ({
        ...prev,
        links: [...(prev.links || []), { ...newSocialLink }]
      }))
      setNewSocialLink({ platform: '', url: '', icon: '' })
    }
  }

  const removeSocialLink = (index) => {
    setSocialMediaContent(prev => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index)
    }))
  }

  const handleKittenSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingKitten) {
        await api.put(`/api/kittens/${editingKitten.id}`, newKitten)
      } else {
        await api.post('/api/kittens', newKitten)
      }
      setNewKitten({
        name: '',
        birth_date: '',
        color: '',
        gender: 'Male',
        price: '',
        description: '',
        image_url: '',
        available: true
      })
      setEditingKitten(null)
      fetchAllContent()
    } catch (error) {
      console.error('Error saving kitten:', error)
    }
  }

  const editKitten = (kitten) => {
    setEditingKitten(kitten)
    setNewKitten(kitten)
  }

  const deleteKitten = async (id) => {
    if (window.confirm('Are you sure you want to delete this kitten?')) {
      try {
        await api.delete(`/api/kittens/${id}`)
        fetchAllContent()
      } catch (error) {
        console.error('Error deleting kitten:', error)
      }
    }
  }

  const handleParentSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingParent) {
        await api.put(`/api/parents/${editingParent.id}`, newParent)
      } else {
        await api.post('/api/parents', newParent)
      }
      setNewParent({
        name: '',
        gender: 'Male',
        color: '',
        description: '',
        image_url: ''
      })
      setEditingParent(null)
      fetchAllContent()
    } catch (error) {
      console.error('Error saving parent:', error)
    }
  }

  const editParent = (parent) => {
    setEditingParent(parent)
    setNewParent(parent)
  }

  const deleteParent = async (id) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        await api.delete(`/api/parents/${id}`)
        fetchAllContent()
      } catch (error) {
        console.error('Error deleting parent:', error)
      }
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, newProduct)
      } else {
        await api.post('/api/products', newProduct)
      }
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        stock_quantity: 0,
        available: true
      })
      setEditingProduct(null)
      fetchAllContent()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setNewProduct(product)
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`)
        fetchAllContent()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const deleteWaitingListEntry = async (id) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      try {
        await api.delete(`/api/waiting-list/${id}`)
        fetchAllContent()
      } catch (error) {
        console.error('Error deleting entry:', error)
      }
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordStatus({ type: '', message: '' })

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' })
      return
    }

    if (passwordData.new_password.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters' })
      return
    }

    try {
      await api.post('/api/admin/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      setPasswordStatus({ type: 'success', message: 'Password changed successfully!' })
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      if (error.response?.status === 401) {
        setPasswordStatus({ type: 'error', message: 'Current password is incorrect' })
      } else {
        setPasswordStatus({ type: 'error', message: 'Failed to change password. Please try again.' })
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin-login')
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="admin-subtitle">Manage your website content</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === 'home' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('home')}
          >
            Home Page
          </button>
          <button
            className={activeTab === 'care' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('care')}
          >
            Care Page
          </button>
          <button
            className={activeTab === 'about' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('about')}
          >
            About Page
          </button>
          <button
            className={activeTab === 'social' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
          <button
            className={activeTab === 'kittens' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('kittens')}
          >
            Kittens
          </button>
          <button
            className={activeTab === 'parents' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('parents')}
          >
            Parents
          </button>
          <button
            className={activeTab === 'products' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={activeTab === 'waiting' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('waiting')}
          >
            Waiting List
          </button>
          <button
            className={activeTab === 'settings' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'home' && (
            <div className="admin-section">
              <h2>Home Page Content</h2>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={homeContent.company_name}
                  onChange={(e) => setHomeContent({ ...homeContent, company_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="text"
                  value={homeContent.logo_url}
                  onChange={(e) => setHomeContent({ ...homeContent, logo_url: e.target.value })}
                  placeholder="/images/aby_photo1.jpg"
                />
                <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                  Use local images: /images/aby_photo1.jpg, /images/aby_photo2.jpg, /images/aby_kitten1.jpg
                </small>
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  value={homeContent.tagline}
                  onChange={(e) => setHomeContent({ ...homeContent, tagline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={homeContent.description}
                  onChange={(e) => setHomeContent({ ...homeContent, description: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Affiliations</label>
                <div className="list-manager">
                  {homeContent.affiliations && homeContent.affiliations.map((aff, index) => (
                    <div key={index} className="list-item">
                      <span>{aff}</span>
                      <button onClick={() => removeAffiliation(index)} className="btn-delete-small">×</button>
                    </div>
                  ))}
                  <div className="add-item">
                    <input
                      type="text"
                      value={newAffiliation}
                      onChange={(e) => setNewAffiliation(e.target.value)}
                      placeholder="Add new affiliation"
                    />
                    <button onClick={addAffiliation} className="btn-add">Add</button>
                  </div>
                </div>
              </div>
              <button onClick={saveHomeContent} className="btn-save">
                {saveStatus === 'saving' ? 'Saving...' : 'Save Home Content'}
              </button>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="admin-section">
              <h2>Care Page Content</h2>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={careContent.title}
                  onChange={(e) => setCareContent({ ...careContent, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>About the Breed</label>
                <textarea
                  value={careContent.about_breed}
                  onChange={(e) => setCareContent({ ...careContent, about_breed: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Breed Image URL</label>
                <input
                  type="text"
                  value={careContent.image_url}
                  onChange={(e) => setCareContent({ ...careContent, image_url: e.target.value })}
                  placeholder="/images/aby_kitten1.jpg"
                />
                <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                  Use local images: /images/aby_photo1.jpg, /images/aby_photo2.jpg, /images/aby_kitten1.jpg
                </small>
              </div>
              <div className="form-group">
                <label>Care Tips</label>
                <div className="list-manager">
                  {careContent.care_tips && careContent.care_tips.map((tip, index) => (
                    <div key={index} className="list-item">
                      <span>{tip}</span>
                      <button onClick={() => removeCareTip(index)} className="btn-delete-small">×</button>
                    </div>
                  ))}
                  <div className="add-item">
                    <input
                      type="text"
                      value={newCareTip}
                      onChange={(e) => setNewCareTip(e.target.value)}
                      placeholder="Add new care tip"
                    />
                    <button onClick={addCareTip} className="btn-add">Add</button>
                  </div>
                </div>
              </div>
              <button onClick={saveCareContent} className="btn-save">
                {saveStatus === 'saving' ? 'Saving...' : 'Save Care Content'}
              </button>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="admin-section">
              <h2>About Page Content</h2>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  rows="4"
                />
              </div>
              <h3>Contact Information</h3>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={aboutContent.contact.email}
                  onChange={(e) => setAboutContent({
                    ...aboutContent,
                    contact: { ...aboutContent.contact, email: e.target.value }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={aboutContent.contact.phone}
                  onChange={(e) => setAboutContent({
                    ...aboutContent,
                    contact: { ...aboutContent.contact, phone: e.target.value }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={aboutContent.contact.address}
                  onChange={(e) => setAboutContent({
                    ...aboutContent,
                    contact: { ...aboutContent.contact, address: e.target.value }
                  })}
                />
              </div>
              <h3>Payment Methods</h3>
              <div className="form-group">
                <label>Accepted Payment Methods</label>
                <div className="list-manager">
                  {aboutContent.payment_methods && aboutContent.payment_methods.map((method, index) => (
                    <div key={index} className="list-item">
                      <span>{method}</span>
                      <button onClick={() => removePaymentMethod(index)} className="btn-delete-small">×</button>
                    </div>
                  ))}
                  <div className="add-item">
                    <input
                      type="text"
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      placeholder="Add payment method (e.g., Cash, Zelle)"
                    />
                    <button onClick={addPaymentMethod} className="btn-add">Add</button>
                  </div>
                </div>
              </div>
              <button onClick={saveAboutContent} className="btn-save">
                {saveStatus === 'saving' ? 'Saving...' : 'Save About Content'}
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="admin-section">
              <h2>Social Media Links</h2>
              <p className="admin-subtitle">Manage your social media links that appear in the footer</p>
              <div className="form-group">
                <label>Current Social Media Links</label>
                <div className="list-manager">
                  {socialMediaContent.links && socialMediaContent.links.map((link, index) => (
                    <div key={index} className="list-item">
                      <div>
                        <strong>{link.platform}</strong>
                        <br />
                        <small style={{ color: 'var(--text-light)' }}>{link.url}</small>
                        {link.icon && <small style={{ color: 'var(--text-light)', display: 'block' }}>Icon: {link.icon}</small>}
                      </div>
                      <button onClick={() => removeSocialLink(index)} className="btn-delete-small">×</button>
                    </div>
                  ))}
                  <div className="add-item" style={{ flexDirection: 'column', gap: '1rem' }}>
                    <input
                      type="text"
                      value={newSocialLink.platform}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                      placeholder="Platform name (e.g., Instagram, Facebook, Twitter)"
                    />
                    <input
                      type="text"
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                      placeholder="URL (e.g., https://instagram.com/yourusername)"
                    />
                    <input
                      type="text"
                      value={newSocialLink.icon}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
                      placeholder="Icon name (optional: instagram, facebook, twitter)"
                    />
                    <button onClick={addSocialLink} className="btn-add">Add Social Link</button>
                  </div>
                </div>
              </div>
              <button onClick={saveSocialMediaContent} className="btn-save">
                {saveStatus === 'saving' ? 'Saving...' : 'Save Social Media Links'}
              </button>
            </div>
          )}

          {activeTab === 'kittens' && (
            <div className="admin-section">
              <h2>{editingKitten ? 'Edit Kitten' : 'Add New Kitten'}</h2>
              <form onSubmit={handleKittenSubmit} className="kitten-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={newKitten.name}
                      onChange={(e) => setNewKitten({ ...newKitten, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Birth Date</label>
                    <input
                      type="date"
                      value={newKitten.birth_date}
                      onChange={(e) => setNewKitten({ ...newKitten, birth_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="text"
                      value={newKitten.color}
                      onChange={(e) => setNewKitten({ ...newKitten, color: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={newKitten.gender}
                      onChange={(e) => setNewKitten({ ...newKitten, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      value={newKitten.price}
                      onChange={(e) => setNewKitten({ ...newKitten, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={newKitten.image_url}
                    onChange={(e) => setNewKitten({ ...newKitten, image_url: e.target.value })}
                    placeholder="/images/aby_kitten1.jpg"
                  />
                  <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                    Use local images: /images/aby_photo1.jpg, /images/aby_photo2.jpg, /images/aby_kitten1.jpg
                  </small>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newKitten.description}
                    onChange={(e) => setNewKitten({ ...newKitten, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newKitten.available}
                      onChange={(e) => setNewKitten({ ...newKitten, available: e.target.checked })}
                    />
                    Available
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    {editingKitten ? 'Update Kitten' : 'Add Kitten'}
                  </button>
                  {editingKitten && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKitten(null)
                        setNewKitten({
                          name: '',
                          birth_date: '',
                          color: '',
                          gender: 'Male',
                          price: '',
                          description: '',
                          image_url: '',
                          available: true
                        })
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <h3>Current Kittens</h3>
              <div className="kittens-list">
                {kittens.map((kitten) => (
                  <div key={kitten.id} className="kitten-item">
                    <div className="kitten-item-info">
                      <h4>{kitten.name}</h4>
                      <p>{kitten.color} - {kitten.gender} - ${kitten.price}</p>
                      <span className={kitten.available ? 'status-badge available' : 'status-badge reserved'}>
                        {kitten.available ? 'Available' : 'Reserved'}
                      </span>
                    </div>
                    <div className="kitten-item-actions">
                      <button onClick={() => editKitten(kitten)} className="btn-edit">Edit</button>
                      <button onClick={() => deleteKitten(kitten.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'parents' && (
            <div className="admin-section">
              <h2>{editingParent ? 'Edit Parent' : 'Add New Parent'}</h2>
              <form onSubmit={handleParentSubmit} className="kitten-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={newParent.name}
                      onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={newParent.gender}
                      onChange={(e) => setNewParent({ ...newParent, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="text"
                      value={newParent.color}
                      onChange={(e) => setNewParent({ ...newParent, color: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={newParent.image_url}
                    onChange={(e) => setNewParent({ ...newParent, image_url: e.target.value })}
                    placeholder="/images/aby_photo1.jpg"
                  />
                  <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                    Use local images: /images/aby_photo1.jpg, /images/aby_photo2.jpg, /images/aby_kitten1.jpg
                  </small>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newParent.description}
                    onChange={(e) => setNewParent({ ...newParent, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    {editingParent ? 'Update Parent' : 'Add Parent'}
                  </button>
                  {editingParent && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingParent(null)
                        setNewParent({
                          name: '',
                          gender: 'Male',
                          color: '',
                          description: '',
                          image_url: ''
                        })
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <h3>Current Parents</h3>
              <div className="kittens-list">
                {parents.map((parent) => (
                  <div key={parent.id} className="kitten-item">
                    <div className="kitten-item-info">
                      <h4>{parent.name}</h4>
                      <p>{parent.color} - {parent.gender}</p>
                    </div>
                    <div className="kitten-item-actions">
                      <button onClick={() => editParent(parent)} className="btn-edit">Edit</button>
                      <button onClick={() => deleteParent(parent.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-section">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="admin-subtitle">Manage products for future shop (not visible to customers yet)</p>
              <form onSubmit={handleProductSubmit} className="kitten-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="e.g., Toys, Food, Accessories, Grooming"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      placeholder="/images/product.jpg"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                    />
                    Available for Sale
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null)
                        setNewProduct({
                          name: '',
                          description: '',
                          price: '',
                          category: '',
                          image_url: '',
                          stock_quantity: 0,
                          available: true
                        })
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <h3>Current Products</h3>
              <div className="kittens-list">
                {products.length === 0 ? (
                  <p>No products added yet. Add products when you're ready to start selling.</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="kitten-item">
                      <div className="kitten-item-info">
                        <h4>{product.name}</h4>
                        <p>{product.category} - ${product.price}</p>
                        <p>Stock: {product.stock_quantity}</p>
                        <span className={product.available ? 'status-badge available' : 'status-badge reserved'}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="kitten-item-actions">
                        <button onClick={() => editProduct(product)} className="btn-edit">Edit</button>
                        <button onClick={() => deleteProduct(product.id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'waiting' && (
            <div className="admin-section">
              <h2>Waiting List</h2>
              <div className="waiting-list">
                {waitingList.length === 0 ? (
                  <p>No entries in the waiting list.</p>
                ) : (
                  waitingList.map((entry) => (
                    <div key={entry.id} className="waiting-item">
                      <div className="waiting-item-info">
                        <h4>{entry.name}</h4>
                        <p>Email: {entry.email}</p>
                        <p>Phone: {entry.phone}</p>
                        <p>Preferences: {entry.preferences || 'None specified'}</p>
                        <p className="entry-date">
                          Added: {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button onClick={() => deleteWaitingListEntry(entry.id)} className="btn-delete">
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-section">
              <h2>Settings</h2>
              <h3>Change Admin Password</h3>
              <form onSubmit={handlePasswordChange} className="kitten-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                    Must be at least 6 characters
                  </small>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    required
                  />
                </div>
                {passwordStatus.message && (
                  <div className={`alert ${passwordStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {passwordStatus.message}
                  </div>
                )}
                <button type="submit" className="btn-save">
                  Change Password
                </button>
              </form>
            </div>
          )}

          {saveStatus === 'success' && (
            <div className="alert alert-success">Content saved successfully!</div>
          )}
          {saveStatus === 'error' && (
            <div className="alert alert-error">Error saving content. Please try again.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
