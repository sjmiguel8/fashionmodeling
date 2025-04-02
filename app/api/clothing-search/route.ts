import { NextResponse } from 'next/server'
import { searchClothingItems } from '@/lib/search-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const results = await searchClothingItems(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in clothing-search API:', error)
    return NextResponse.json({ error: 'Failed to fetch clothing items' }, { status: 500 })
  }
}
