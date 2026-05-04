import type { PDFBuilder } from '../generator'

export function addSummarySection(builder: PDFBuilder, title: string, body: string) {
  builder.addHeading(title, 1)
  builder.addParagraph(body)
  builder.addSpacer(4)
}
