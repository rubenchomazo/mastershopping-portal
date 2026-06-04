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
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  function handleSearch(val) {
    setSearch(val)
    setPage(1)
  }

  function handleCategory(val) {
    setCategory(val)
    setPage(1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} alt="Master Shopping Pro" className="app-logo" />
        <h1>Master Shopping Pro</h1>
        <p>Recomendados del día — Precios y stock actualizados en tiempo real por Amazon.</p>
      </header>

      <div className="app-controls">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={e => handleCategory(e.target.value)}
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
        ) : paginated.length === 0 ? (
          <p className="empty-text">No se encontraron productos.</p>
        ) : (
          paginated.map((item, i) => <AffiliateCard key={i} item={item} />)
        )}
      </section>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={safePage <= 1}
            onClick={() => setPage(p => p - 1)}
          >Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={n === safePage ? 'active' : ''}
              onClick={() => setPage(n)}
            >{n}</button>
          ))}
          <button
            disabled={safePage >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >Siguiente</button>
        </div>
      )}

      <footer className="app-footer">
        <p>© 2026 Master Shopping Pro</p>
      </footer>
    </div>
  )
}

export default App
