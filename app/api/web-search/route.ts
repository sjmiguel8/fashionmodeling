import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_API_KEY
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

    // Add clothing-specific terms and image search parameters
    const searchQuery = `${query} clothing fashion`
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?` + 
      new URLSearchParams({
        key: apiKey!,
        cx: searchEngineId!,
        q: searchQuery,
        searchType: 'image',
        imgSize: 'LARGE',
        imgType: 'photo',
        safe: 'active',
        num: '10'
      })
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Google API')
    }

    const data = await response.json()
    
    // Map the response to include direct image URLs
    const items = data.items?.map((item: any) => ({
      ...item,
      imageUrl: item.link, // Use the direct image URL
      thumbnailUrl: item.image.thumbnailLink,
      sourceUrl: item.image.contextLink,
    })) || []

    return NextResponse.json(items)
  } catch (error) {
    console.error('Google Search API error:', error)
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 })
  }
}
