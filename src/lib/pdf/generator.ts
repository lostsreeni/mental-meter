import { PDF_PAGE, PDF_THEME } from './theme'

export type JsPdfLike = {
  setFont: (font: string, style?: string) => void
  setFontSize: (n: number) => void
  setTextColor: (r: number, g: number, b: number) => void
  text: (text: string, x: number, y: number) => void
  splitTextToSize: (text: string, width: number) => string[]
  addPage: () => void
  addImage: (dataUrl: string, format: string, x: number, y: number, w: number, h: number) => void
  output: (type: 'blob') => Blob
  getNumberOfPages: () => number
  setPage: (n: number) => void
}

export class PDFBuilder {
  doc: JsPdfLike
  cursor: { x: number; y: number } = { x: PDF_PAGE.MARGIN, y: PDF_PAGE.MARGIN }

  constructor(doc: JsPdfLike) {
    this.doc = doc
  }

  addHeading(text: string, level: 1 | 2 | 3) {
    const size = level === 1 ? PDF_THEME.font.sizeH1 : level === 2 ? PDF_THEME.font.sizeH2 : PDF_THEME.font.sizeH3
    this.addPageBreakIfNeeded(size * 0.6 + 4)
    this.doc.setFont(PDF_THEME.font.family, 'semibold')
    this.doc.setFontSize(size)
    this.doc.setTextColor(...PDF_THEME.colors.text)
    this.doc.text(text, this.cursor.x, this.cursor.y)
    this.cursor.y += size * 0.5 + 2
  }

  addParagraph(text: string, opts?: { muted?: boolean }) {
    this.doc.setFont(PDF_THEME.font.family, 'normal')
    this.doc.setFontSize(PDF_THEME.font.sizeBody)
    const c = opts?.muted ? PDF_THEME.colors.muted : PDF_THEME.colors.text
    this.doc.setTextColor(c[0], c[1], c[2])
    const lines = this.doc.splitTextToSize(text, PDF_PAGE.CONTENT_WIDTH)
    this.addPageBreakIfNeeded(lines.length * 5)
    for (const line of lines) {
      this.doc.text(line, this.cursor.x, this.cursor.y)
      this.cursor.y += 5
    }
  }

  addSpacer(mm: number) { this.cursor.y += mm }

  addPageBreakIfNeeded(spaceRequired: number) {
    if (this.cursor.y + spaceRequired > PDF_PAGE.PAGE_HEIGHT - PDF_PAGE.MARGIN) {
      this.doc.addPage()
      this.cursor = { x: PDF_PAGE.MARGIN, y: PDF_PAGE.MARGIN }
    }
  }

  addImage(dataUrl: string, width: number, height: number) {
    this.addPageBreakIfNeeded(height)
    this.doc.addImage(dataUrl, 'PNG', this.cursor.x, this.cursor.y, width, height)
    this.cursor.y += height
  }

  addRunningChrome(generatedAt: string) {
    const pages = this.doc.getNumberOfPages()
    for (let p = 1; p <= pages; p++) {
      this.doc.setPage(p)
      this.doc.setFont(PDF_THEME.font.family, 'normal')
      this.doc.setFontSize(8)
      this.doc.setTextColor(...PDF_THEME.colors.muted)
      this.doc.text('MindMeter Self-Report', PDF_PAGE.MARGIN, 10)
      this.doc.text(`Page ${p} of ${pages}`, PDF_PAGE.PAGE_WIDTH - PDF_PAGE.MARGIN - 25, 10)
      this.doc.text(`Generated ${generatedAt} · Self-administered, not a clinical diagnosis`, PDF_PAGE.MARGIN, PDF_PAGE.PAGE_HEIGHT - 8)
    }
  }

  finalize() { return this.doc.output('blob') }
}
