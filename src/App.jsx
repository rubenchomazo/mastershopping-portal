import { useState, useEffect } from 'react'
import { fetchAffiliateLinks } from './services/googleSheets'
import AffiliateCard from './components/AffiliateCard'
import logo from './assets/mastershoppingpro.png'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')

  useEffect(() => {
    fetchAffiliateLinks().then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  const categories = ['Todas', ...new Set(items.map(i => i.category).filter(Boolean))]

  const filtered = items.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'Todas' || item.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} alt="Master Shopping Pro" className="app-logo" />
        <h1>Master Shopping Pro</h1>
        <p>Productos seleccionados para ti — precios y disponibilidad sujetos a cambio</p>
      </header>

      <div className="app-controls">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <section className="affiliate-grid">
        {loading ? (
          <p className="loading-text">Cargando productos...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-text">No se encontraron productos.</p>
        ) : (
          filtered.map((item, i) => <AffiliateCard key={i} item={item} />)
        )}
      </section>


    </div>
  )
}

export default App
