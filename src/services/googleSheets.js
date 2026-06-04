const CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || ''

export async function fetchAffiliateLinks() {
  if (!CSV_URL) {
    console.warn('VITE_SHEET_CSV_URL not set. Using sample data.')
    return getSampleData()
  }

  try {
    const res = await fetch(CSV_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const csv = await res.text()
    return parseCSV(csv)
  } catch (err) {
    console.error('Error fetching sheet:', err)
    return getSampleData()
  }
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().trim())

  return lines.slice(1).map(line => {
    const values = parseLine(line)
    const item = {}
    headers.forEach((h, i) => { item[h] = (values[i] || '').trim() })
    return item
  }).filter(item => item.title && item.url)
}

function parseLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
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
