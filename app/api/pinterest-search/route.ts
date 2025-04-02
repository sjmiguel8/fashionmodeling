import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const accessToken = process.env.PINTEREST_ACCESS_TOKEN
    if (!accessToken) {
      console.error('Pinterest API key is not configured')
      return NextResponse.json({ error: 'Pinterest API key is not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://api.pinterest.com/v5/search/pins?query=${query}&access_token=${accessToken}`, {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinterest API error:', response.status, errorText)
      return NextResponse.json({ error: `Pinterest API returned ${response.status}: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data.items || [])
  } catch (error: any) {
    console.error('Pinterest API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch Pinterest results' }, { status: 500 })
  }
}
