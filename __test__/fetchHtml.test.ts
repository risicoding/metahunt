import { describe, it, expect, vi } from 'vitest'
import { fetchHtml } from '../src/html/fetchHtml'

global.fetch = vi.fn()

const createMockStream = (chunks: string[], failOnRead = false) => {
  let index = 0
  return {
    getReader: () => ({
      read: async () => {
        if (failOnRead) throw new Error('Stream read failed')
        if (index >= chunks.length) return { done: true, value: undefined }
        const chunk = chunks[index++]
        return { done: false, value: new TextEncoder().encode(chunk) }
      },
    }),
  }
}

describe('fetchHtml', () => {
  it('returns partial HTML up to <head>', async () => {
    const htmlChunks = ['<html><head>', '<meta>', '</head><body>']
    ;(fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      body: createMockStream(htmlChunks),
    })

    const result = await fetchHtml('https://example.com')
    expect(result).toContain('<head/>')
    expect(result).not.toContain('<body>')
  })

  it('throws on fetch failure', async () => {
    ;(fetch as any).mockRejectedValue(new Error('Network error'))

    await expect(fetchHtml('https://fail.com')).rejects.toThrow(
      /Network error/
    )
  })

  it('throws on non-ok response', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      body: {},
    })

    await expect(fetchHtml('https://500.com')).rejects.toThrow(
      /Status: 500/
    )
  })

  it('throws if body is missing', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      body: null,
    })

    await expect(fetchHtml('https://nobody.com')).rejects.toThrow(
      /Failed to fetch HTML/
    )
  })

  it('throws on reader.read() failure', async () => {
    ;(fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      body: createMockStream([], true),
    })

    await expect(fetchHtml('https://streamfail.com')).rejects.toThrow(
      /Failed to read response body/
    )
  })

  it('returns full content if </head> is missing', async () => {
    const htmlChunks = ['<html><head>', '<meta>', '<body>']
    ;(fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      body: createMockStream(htmlChunks),
    })

    const result = await fetchHtml('https://noheadend.com')
    expect(result).toContain('<body>')
  })
})

