import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const accessToken = process.env.PINTEREST_ACCESS_TOKEN

    const response = await fetch(
      `https://api.pinterest.com/v5/pins/search?query=${encodeURIComponent(query)}&access_token=${accessToken}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Pinterest API')
    }

    const data = await response.json()
    return NextResponse.json(data.items || [])
  } catch (error) {
    console.error('Pinterest API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Pinterest results' }, { status: 500 })
  }
}
