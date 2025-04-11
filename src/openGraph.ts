import { load } from 'cheerio'

type ScrapedMeta = {
  title?: string
  description?: string
  keywords?: string
  author?: string
  themeColor?: string
  favicon?: string
  canonical?: string
  manifest?: string
  lang?: string
  og: Record<string, string>
  twitter: Record<string, string>
}

type ScrapedMetaKeys = keyof Omit<ScrapedMeta, 'og' | 'twitter'>

export const scrapeMeta = async (html: string,url:string): Promise<ScrapedMeta> => {
  const $ = load(html)

  const meta: ScrapedMeta = {
    og: {},
    twitter: {},
  }

  // Extract the `lang` attribute from the <html> tag
  meta.lang = $('html').attr('lang') ?? undefined

  // Extract content from the <title> tag
  meta.title = $('title').text().trim() || undefined

  // Loop through all <meta> tags to capture standard and Twitter metadata
  $('meta').each((_, el) => {
    const name = $(el).attr('name')?.toLowerCase()
    const content = $(el).attr('content')

    if (!name || !content) return

    // Standard metadata
    if (['description', 'keywords', 'author', 'theme-color'].includes(name)) {
      const key = name === 'theme-color' ? 'themeColor' : name
      meta[key as ScrapedMetaKeys] = content
    }

    // Twitter-specific metadata
    if (name.startsWith('twitter:')) {
      meta.twitter[name.replace('twitter:', '')] = content
    }
  })

  // Open Graph metadata (e.g. og:title, og:image)
  $("meta[property^='og:']").each((_, el) => {
    const prop = $(el).attr('property')?.replace('og:', '')
    const content = $(el).attr('content')
    if (prop && content) {
      meta.og[prop] = content
    }
  })

  // Canonical link (used to indicate the preferred URL)
  const canonical = $("link[rel='canonical']").attr('href')
  if (canonical) {
    meta.canonical = new URL(canonical, url).href
  }

  // Manifest file (PWA metadata)
  const manifest = $("link[rel='manifest']").attr('href')
  if (manifest) {
    meta.manifest = new URL(manifest, url).href
  }

  // Favicon (tries multiple selectors for best match)
  const faviconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ]

  for (const selector of faviconSelectors) {
    const href = $(selector).attr('href')
    if (href) {
      meta.favicon = new URL(href, url).href
      break
    }
  }

  // Fallback to default favicon
  if (!meta.favicon) {
    meta.favicon = new URL('/favicon.ico', url).href
  }

  return meta
}

