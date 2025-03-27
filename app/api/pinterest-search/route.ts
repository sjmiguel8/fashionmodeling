import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const apiKey = process.env.PINTEREST_API_KEY

    if (!apiKey) {
      throw new Error('Pinterest API key is not configured')
    }

    const response = await fetch(
      'https://api.pinterest.com/v3/search?' + 
      new URLSearchParams({
        q: `${query} fashion clothing`,
        limit: '25',
        api_key: apiKey,
        fields: 'id,image,link,title,description'
      }), {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Pinterest API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data.data || [])
  } catch (error) {
    console.error('Pinterest API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Pinterest results' }, { status: 500 })
  }
}
