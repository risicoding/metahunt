/**
 * Fetches HTML content from a given URL and returns the partial HTML
 * up to and including the <head> tag. Useful for partial DOM parsing.
 *
 * @param url - The URL of the HTML page to fetch.
 * @returns A promise that resolves with the partial HTML string.
 */
export const fetchHtml = async (url: string): Promise<string> => {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
    },
  })
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()

  let html = ''
  let done = false

  while (!done && reader) {
    const { value, done: readerDone } = await reader.read()

    // Ensure value is defined before decoding
    if (value) {
      html += decoder.decode(value)
    }

    // Stop reading once </head> is encountered
    if (html.includes('</head>')) {
      html = html.split('</head>')[0] + '<head/>'
      done = true
    }

    done ||= readerDone
  }

  return html
}
