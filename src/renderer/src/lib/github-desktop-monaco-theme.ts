import type * as Monaco from 'monaco-editor'
import type { editor as MonacoEditorNS } from 'monaco-editor'

/** Тема редактора и diff под окно GitHub Desktop.
 *  Цвета взяты из github-desktop-theme (вариант Flat Diff): строка diff красится
 *  одним ровным фоном, пословной подсветки нет — `*TextBackground` прозрачные. */

export const GITHUB_DESKTOP_LIGHT_THEME_ID = 'github-desktop-light'
export const GITHUB_DESKTOP_DARK_THEME_ID = 'github-desktop-dark'

type Palette = {
  background: string
  foreground: string
  selection: string
  lineHighlight: string
  cursor: string
  gutterForeground: string
  gutterActiveForeground: string
  whitespace: string
  indentGuideActive: string
  comment: string
  keyword: string
  string: string
  function: string
  constant: string
  number: string
  type: string
  variable: string
  tag: string
  diffInsertedLine: string
  diffRemovedLine: string
  diffInsertedGutter: string
  diffRemovedGutter: string
  diffInsertedOverview: string
  diffRemovedOverview: string
  base: 'vs' | 'vs-dark'
}

const LIGHT: Palette = {
  background: '#ffffff',
  foreground: '#24292e',
  selection: '#ebeef1',
  lineHighlight: '#f6f8fa',
  cursor: '#24292e',
  gutterForeground: '#6a737d',
  gutterActiveForeground: '#24292e',
  whitespace: '#e1e4e8',
  indentGuideActive: '#6a737d',
  comment: '#6e7781',
  keyword: '#cf222e',
  string: '#0a3069',
  function: '#8250df',
  constant: '#0550ae',
  number: '#005cc5',
  type: '#d73a49',
  variable: '#953800',
  tag: '#116329',
  diffInsertedLine: '#e6ffed',
  diffRemovedLine: '#ffeef0',
  diffInsertedGutter: '#cdffd8',
  diffRemovedGutter: '#ffdce0',
  diffInsertedOverview: '#34d058',
  diffRemovedOverview: '#d73a49',
  base: 'vs'
}

const DARK: Palette = {
  background: '#24292e',
  foreground: '#f6f8fa',
  selection: '#444d56',
  lineHighlight: '#2b3137',
  cursor: '#f6f8fa',
  gutterForeground: '#959da5',
  gutterActiveForeground: '#f6f8fa',
  whitespace: '#141414',
  indentGuideActive: '#959da5',
  comment: '#8b949e',
  keyword: '#ff7b72',
  string: '#a5d6ff',
  function: '#d2a8ff',
  constant: '#79c0ff',
  number: '#79b8ff',
  type: '#f97583',
  variable: '#ffa657',
  tag: '#7ee787',
  diffInsertedLine: '#113a1b',
  diffRemovedLine: '#450c0f',
  diffInsertedGutter: '#1b4721',
  diffRemovedGutter: '#5a1015',
  diffInsertedOverview: '#28a745',
  diffRemovedOverview: '#f97583',
  base: 'vs-dark'
}

/** Monaco ждёт цвет правила без `#`, а цвет в `colors` — с ним. */
function bare(hex: string): string {
  return hex.startsWith('#') ? hex.slice(1) : hex
}

function buildTheme(p: Palette): MonacoEditorNS.IStandaloneThemeData {
  return {
    base: p.base,
    inherit: true,
    rules: [
      { token: 'comment', foreground: bare(p.comment) },
      { token: 'keyword', foreground: bare(p.keyword) },
      { token: 'keyword.control', foreground: bare(p.keyword) },
      { token: 'operator', foreground: bare(p.keyword) },
      { token: 'string', foreground: bare(p.string) },
      { token: 'string.escape', foreground: bare(p.constant) },
      { token: 'regexp', foreground: bare(p.string) },
      { token: 'number', foreground: bare(p.number) },
      { token: 'constant', foreground: bare(p.constant) },
      { token: 'constant.language', foreground: bare(p.constant) },
      { token: 'type', foreground: bare(p.type) },
      { token: 'type.identifier', foreground: bare(p.type) },
      { token: 'class', foreground: bare(p.type) },
      { token: 'function', foreground: bare(p.function) },
      { token: 'support.function', foreground: bare(p.function) },
      { token: 'variable', foreground: bare(p.variable) },
      { token: 'variable.parameter', foreground: bare(p.variable) },
      { token: 'identifier', foreground: bare(p.foreground) },
      { token: 'delimiter', foreground: bare(p.foreground) },
      { token: 'tag', foreground: bare(p.tag) },
      { token: 'attribute.name', foreground: bare(p.function) },
      { token: 'attribute.value', foreground: bare(p.string) }
    ],
    colors: {
      'editor.background': p.background,
      'editor.foreground': p.foreground,
      'editorCursor.foreground': p.cursor,
      'editor.lineHighlightBackground': p.lineHighlight,
      'editor.selectionBackground': p.selection,
      'editor.inactiveSelectionBackground': p.selection,
      'editorLineNumber.foreground': p.gutterForeground,
      'editorLineNumber.activeForeground': p.gutterActiveForeground,
      'editorGutter.background': p.background,
      'editorWhitespace.foreground': p.whitespace,
      'editorIndentGuide.background1': p.whitespace,
      'editorIndentGuide.activeBackground1': p.indentGuideActive,
      'diffEditor.insertedLineBackground': p.diffInsertedLine,
      'diffEditor.removedLineBackground': p.diffRemovedLine,
      // Прозрачные: Flat Diff красит строку целиком, без пословного чипа поверх.
      'diffEditor.insertedTextBackground': '#00000000',
      'diffEditor.removedTextBackground': '#00000000',
      'diffEditorGutter.insertedLineBackground': p.diffInsertedGutter,
      'diffEditorGutter.removedLineBackground': p.diffRemovedGutter,
      'diffEditorOverview.insertedForeground': p.diffInsertedOverview,
      'diffEditorOverview.removedForeground': p.diffRemovedOverview
    }
  }
}

/** Вызывается один раз при инициализации Monaco (lib/monaco-setup). */
export function registerGithubDesktopThemes(monacoInstance: typeof Monaco): void {
  monacoInstance.editor.defineTheme(GITHUB_DESKTOP_LIGHT_THEME_ID, buildTheme(LIGHT))
  monacoInstance.editor.defineTheme(GITHUB_DESKTOP_DARK_THEME_ID, buildTheme(DARK))
}

/** Единственная точка выбора темы для всех Monaco-поверхностей. */
export function resolveMonacoThemeName(isDark: boolean): string {
  return isDark ? GITHUB_DESKTOP_DARK_THEME_ID : GITHUB_DESKTOP_LIGHT_THEME_ID
}
