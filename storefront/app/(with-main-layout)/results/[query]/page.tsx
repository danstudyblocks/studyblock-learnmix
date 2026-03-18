import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { search } from "@modules/search/actions"
import SearchResultsTemplate from "@modules/search/templates/search-results-template"

type Props = {
  params: { query: string }
  searchParams: { sortBy?: string; page?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = decodeURIComponent(params.query)

  return {
    title: `Search Results for "${query}"`,
    description: `Search results for "${query}"`,
  }
}

export default async function ResultsPage({ params, searchParams }: Props) {
  try {
    const region = await getRegion("gb")
    
    if (!region) {
      notFound()
    }

    const query = decodeURIComponent(params.query)
    
    if (!query || query.trim() === "") {
      notFound()
    }

    const hits = await search(query)
    const ids = hits.map((hit) => hit.id)

    return (
      <SearchResultsTemplate
        query={query}
        ids={ids}
        sortBy={searchParams.sortBy}
        page={searchParams.page}
        countryCode={"gb"}
      />
    )
  } catch (error) {
    console.error("Error rendering results page:", error)
    notFound()
  }
}
