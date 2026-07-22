// Afterlight — Candlelight Letterpress design tokens
// Single source of truth for all colors, type, and spacing.

export const colors = {
  paper:     "#FBF7EF",
  paperDeep: "#F3ECDE",
  ink:       "#2B2723",
  inkSoft:   "#5B534A",
  gold:      "#C9A24B",
  goldSoft:  "#E9D8A6",
  wax:       "#8C2F2A",
  waxDeep:   "#6E211D",
  sage:      "#7C8471",
  night:     "#1C1A17",
  white:     "#FFFFFF",
} as const

// Typography — Fraunces (display/body) + script for signature
// Email fallback: Georgia, 'Times New Roman', serif
export const fonts = {
  serif:     "'Fraunces', Georgia, 'Times New Roman', serif",
  script:    "'Ephesis', 'Homemade Apple', cursive",
  sans:      "'Instrument Sans', 'Inter', system-ui, sans-serif",
} as const

// Major-third scale (×1.25) anchored at 16px
export const fontSize = {
  xs:   "12.8px",
  sm:   "16px",
  md:   "20px",
  lg:   "25px",
  xl:   "31px",
  "2xl":"39px",
  "3xl":"49px",
} as const

export const lineHeight = {
  tight:  "1.3",
  body:   "1.7",
  loose:  "2",
} as const

// 8px base grid
export const space = {
  "1":  "8px",
  "2":  "16px",
  "3":  "24px",
  "4":  "32px",
  "6":  "48px",
  "8":  "64px",
  "12": "96px",
} as const

export const contentWidth = {
  email:    "600px",
  page:     "680px",
  document: "680px",
} as const

// Gold hairline rule used between letter sections
export const hairline = {
  borderTopWidth:  "1px",
  borderTopStyle:  "solid",
  borderTopColor:  colors.gold,
  opacity:         "0.6",
} as const
