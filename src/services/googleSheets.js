const SHEET_ID = import.meta.env.VITE_SHEET_ID || ''
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || ''
const RANGE = import.meta.env.VITE_SHEET_RANGE || 'Sheet1!A:F'

export async function fetchAffiliateLinks() {
  if (!SHEET_ID || !API_KEY) {
    console.warn('Google Sheets config missing. Using sample data.')
    return getSampleData()
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return parseSheetData(data.values)
  } catch (err) {
    console.error('Error fetching sheet:', err)
    return getSampleData()
  }
}

function parseSheetData(rows) {
  if (!rows || rows.length < 2) return []
  const headers = rows[0].map(h => h.toLowerCase().trim())
  return rows.slice(1).map(row => {
    const item = {}
    headers.forEach((header, i) => {
      item[header] = row[i] || ''
    })
    return item
  }).filter(item => item.title && item.url)
}

function getSampleData() {
  return [
    {
      title: 'Kindle Paperwhite',
      url: 'https://amzn.to/3sample1',
      image: '',
      price: '$129.99',
      category: 'Electrónicos',
      description: 'Amazon Kindle Paperwhite 11ª generación'
    },
    {
      title: 'Echo Dot 5ª Gen',
      url: 'https://amzn.to/3sample2',
      image: '',
      price: '$49.99',
      category: 'Smart Home',
      description: 'Altavoz inteligente con Alexa'
    },
    {
      title: 'Fire TV Stick 4K',
      url: 'https://amzn.to/3sample3',
      image: '',
      price: '$39.99',
      category: 'Electrónicos',
      description: 'Streaming en 4K Ultra HD'
    }
  ]
}
