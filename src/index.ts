import { fetchHtml } from './html/fetchHtml'
import { formatUrl } from './lib/url'
import { scrapeMeta } from './openGraph'

export const metaHunt = async (url: string) => {
  const formattedUrl = formatUrl(url)

  if (!formattedUrl) throw new Error('Invalid url')

  const html = await fetchHtml(formattedUrl)
  const metaData = await scrapeMeta(html, formattedUrl)
  return metaData
}
