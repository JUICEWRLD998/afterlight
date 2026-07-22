export interface LetterData {
  slug: string
  occasion: string
  salutation: string
  body: string          // HTML string
  from: string
  sealMonogram: string
  deliverOn: string     // ISO date
  recipientEmail?: string
  accent?: "gold" | "sage"
}
