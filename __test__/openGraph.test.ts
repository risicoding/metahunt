// tests/openGraph.test.ts
import { describe, it, expect } from 'vitest'
import { scrapeMeta } from '../src/openGraph'

const baseUrl = 'https://example.com'

const sampleHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test Page</title>
  <meta name="description" content="A test page for scraping." />
  <meta name="keywords" content="test, vitest, meta" />
  <meta name="author" content="Risi" />
  <meta name="theme-color" content="#333333" />

  <meta name="twitter:title" content="Twitter Test Title" />
  <meta name="twitter:description" content="Twitter Test Description" />

  <meta property="og:title" content="OG Test Title" />
  <meta property="og:description" content="OG Test Description" />

  <link rel="canonical" href="/canonical-url" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" href="/favicon.png" />
</head>
<body>
  <h1>Hello world</h1>
</body>
</html>
`

describe('scrapeMeta', () => {
  it('should extract all standard meta information', async () => {
    const meta = await scrapeMeta(sampleHtml, baseUrl)

    expect(meta.lang).toBe('en')
    expect(meta.title).toBe('Test Page')
    expect(meta.description).toBe('A test page for scraping.')
    expect(meta.keywords).toBe('test, vitest, meta')
    expect(meta.author).toBe('Risi')
    expect(meta.themeColor).toBe('#333333')

    expect(meta.twitter.title).toBe('Twitter Test Title')
    expect(meta.twitter.description).toBe('Twitter Test Description')

    expect(meta.og.title).toBe('OG Test Title')
    expect(meta.og.description).toBe('OG Test Description')

    expect(meta.canonical).toBe('https://example.com/canonical-url')
    expect(meta.manifest).toBe('https://example.com/manifest.json')
    expect(meta.favicon).toBe('https://example.com/favicon.png')
  })

  it('should fallback to /favicon.ico if no favicon is found', async () => {
    const htmlWithoutFavicon = sampleHtml.replace(/<link rel="icon".+/, '')
    const meta = await scrapeMeta(htmlWithoutFavicon, baseUrl)

    expect(meta.favicon).toBe('https://example.com/favicon.ico')
  })
})

