import { describe, expect, it, vi } from 'vitest'
import {
  GITHUB_DESKTOP_DARK_THEME_ID,
  GITHUB_DESKTOP_LIGHT_THEME_ID,
  registerGithubDesktopThemes,
  resolveMonacoThemeName
} from './github-desktop-monaco-theme'

function registerAndCollect(): Map<string, Record<string, unknown>> {
  const defined = new Map<string, Record<string, unknown>>()
  const defineTheme = vi.fn((id: string, data: Record<string, unknown>) => {
    defined.set(id, data)
  })
  registerGithubDesktopThemes({ editor: { defineTheme } } as never)
  return defined
}

describe('github desktop monaco theme', () => {
  it('picks the theme by appearance', () => {
    expect(resolveMonacoThemeName(false)).toBe(GITHUB_DESKTOP_LIGHT_THEME_ID)
    expect(resolveMonacoThemeName(true)).toBe(GITHUB_DESKTOP_DARK_THEME_ID)
  })

  it('registers both variants with the diff colors the theme exists for', () => {
    const defined = registerAndCollect()
    expect([...defined.keys()]).toEqual([
      GITHUB_DESKTOP_LIGHT_THEME_ID,
      GITHUB_DESKTOP_DARK_THEME_ID
    ])

    for (const [id, data] of defined) {
      const colors = data.colors as Record<string, string>
      expect(colors['diffEditor.insertedLineBackground'], id).toMatch(/^#[0-9a-f]{6}$/)
      expect(colors['diffEditor.removedLineBackground'], id).toMatch(/^#[0-9a-f]{6}$/)
      // Flat Diff: строка красится целиком, пословный чип поверх неё прозрачный.
      expect(colors['diffEditor.insertedTextBackground'], id).toBe('#00000000')
      expect(colors['diffEditor.removedTextBackground'], id).toBe('#00000000')
    }
  })

  it('strips the leading # from token rule colors, which Monaco rejects', () => {
    for (const data of registerAndCollect().values()) {
      const rules = data.rules as { foreground: string }[]
      expect(rules.length).toBeGreaterThan(0)
      for (const rule of rules) {
        expect(rule.foreground).toMatch(/^[0-9a-f]{6}$/)
      }
    }
  })
})
