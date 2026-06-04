import { useState } from 'react'

export default function AffiliateCard({ item }) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="affiliate-card"
    >
      <div className="card-image">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        )}
        {item.category && <span className="card-category">{item.category}</span>}
      </div>
      <div className="card-body">
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
        <div className="card-footer">
          {item.price && <span className="card-price">{item.price}</span>}
          <span className="card-cta">Ver en Amazon →</span>
        </div>
      </div>
    </a>
  )
}
