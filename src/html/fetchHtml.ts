/**
 * Fetches HTML content from a given URL and returns the partial HTML
 * up to and including the <head> tag. Useful for partial DOM parsing.
 *
 * @param url - The URL of the HTML page to fetch.
 * @returns A promise that resolves with the partial HTML string.
 */

export const fetchHtml = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
      },
    })

    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch HTML. Status: ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    let html = ''
    let done = false

    while (!done) {
      const result = await reader.read().catch((err) => {
        throw new Error(`Failed to read response body: ${err.message}`)
      })

      const { value, done: readerDone } = result

      if (value) {
        html += decoder.decode(value, { stream: true })
      }

      if (html.includes('</head>')) {
        html = html.split('</head>')[0] + '<head/>'
        break
      }

      done = readerDone
    }

    return html
  } catch (err) {
    console.error('fetchHtml error:', err)
    throw new Error(
      `Error fetching HTML from ${url}: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
}
