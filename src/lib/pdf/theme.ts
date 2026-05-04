export const PDF_PAGE = {
  PAGE_WIDTH: 210,
  PAGE_HEIGHT: 297,
  MARGIN: 20,
  CONTENT_WIDTH: 170,
} as const

export const PDF_THEME = {
  colors: {
    text: [28, 25, 23] as const,
    muted: [107, 114, 128] as const,
    minimal: [118, 162, 146] as const,
    mild: [170, 152, 92] as const,
    moderate: [178, 124, 88] as const,
    severe: [168, 88, 88] as const,
  },
  font: {
    family: 'Inter',
    sizeBody: 10,
    sizeH1: 16,
    sizeH2: 13,
    sizeH3: 11,
    sizeFooter: 8,
  },
}
