import { describe, it, expect } from 'vitest'
import { formatUrl } from '../src/lib/url'

describe('formatUrl', () => {
  it('adds https:// if missing', () => {
    expect(formatUrl('example.com')).toBe('https://www.example.com/')
  })

  it('does not modify URL with https:// already', () => {
    expect(formatUrl('https://www.example.com')).toBe('https://www.example.com/')
  })

  it('does not add www if subdomain exists', () => {
    expect(formatUrl('blog.example.com')).toBe('https://blog.example.com/')
  })

  it('adds www if domain has no subdomain', () => {
    expect(formatUrl('https://example.com')).toBe('https://www.example.com/')
  })

  it('trims whitespace and formats properly', () => {
    expect(formatUrl('  example.com  ')).toBe('https://www.example.com/')
  })

  it('returns null for invalid URL', () => {
    expect(formatUrl('not a valid url')).toBeNull()
  })

  it('handles http correctly', () => {
    expect(formatUrl('http://example.com')).toBe('http://www.example.com/')
  })

  it('keeps query params and paths', () => {
    expect(formatUrl('example.com/path?foo=bar')).toBe('https://www.example.com/path?foo=bar')
  })
})

