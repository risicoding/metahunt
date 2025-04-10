import { formatUrl } from './lib/url'
import { scrapeMeta } from './openGraph'

export const metaHunt = async (url: string) => {
  const formattedUrl = formatUrl(url)

  if (!formattedUrl) throw new Error('Invalid url')


  const metaData = await scrapeMeta(formattedUrl)
  return metaData
}
