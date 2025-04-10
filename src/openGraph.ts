import { load } from 'cheerio'
import { fetchHtml } from './fetchHtml'

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

export const scrapeMeta = async (url: string): Promise<ScrapedMeta> => {
  const html = await fetchHtml(url)
  const $ = load(html)

  const meta: ScrapedMeta = {
    og: {},
    twitter: {},
  }

  // HTML lang attribute
  meta.lang = $('html').attr('lang') ?? undefined

  // Title tag
  meta.title = $('title').text().trim() || undefined

  // Standard meta tags
  $('meta').each((_, el) => {
    const name = $(el).attr('name')?.toLowerCase()
    const content = $(el).attr('content')

    if (!name || !content) return

    if (['description', 'keywords', 'author', 'theme-color'].includes(name)) {
      const key = name === 'theme-color' ? 'themeColor' : name
      meta[key as ScrapedMetaKeys] = content
    }

    if (name.startsWith('twitter:')) {
      meta.twitter[name.replace('twitter:', '')] = content
    }
  })

  // Open Graph meta tags
  $("meta[property^='og:']").each((_, el) => {
    const prop = $(el).attr('property')?.replace('og:', '')
    const content = $(el).attr('content')
    if (prop && content) meta.og[prop] = content
  })

  // Canonical link
  const canonical = $("link[rel='canonical']").attr('href')
  if (canonical) meta.canonical = new URL(canonical, url).href

  // Manifest
  const manifest = $("link[rel='manifest']").attr('href')
  if (manifest) meta.manifest = new URL(manifest, url).href

  // Favicon (tries multiple selectors)
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

  if (!meta.favicon) {
    meta.favicon = new URL('/favicon.ico', url).href
  }

  return meta
}
