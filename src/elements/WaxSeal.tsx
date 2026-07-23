import { registerElementsTool } from "@unlayer/react-elements"
import { colors } from "./theme"

function sealSvg(monogram: string, size: number) {
  return `<div style="text-align:center;padding:8px 0 0;">
    <svg width="${size}" height="${size}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;">
      <defs>
        <radialGradient id="waxSheen" cx="38%" cy="32%" r="60%">
          <stop offset="0%"  stop-color="#C4524D" stop-opacity="1"/>
          <stop offset="60%" stop-color="${colors.wax}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${colors.waxDeep}" stop-opacity="1"/>
        </radialGradient>
        <filter id="waxShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${colors.waxDeep}" flood-opacity="0.45"/>
        </filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#waxSheen)" filter="url(#waxShadow)"/>
      <circle cx="40" cy="40" r="33" fill="none" stroke="${colors.waxDeep}" stroke-width="1" stroke-opacity="0.3"/>
      <text x="40" y="47" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="600"
        fill="${colors.waxDeep}" fill-opacity="0.55" letter-spacing="1">${monogram}</text>
    </svg>
  </div>`
}

const WaxSeal = registerElementsTool({
  name: "wax-seal",
  displayName: "Wax Seal",
  values: { monogram: "A", size: 80 },
  renderer: {
    exporters: {
      web:      ({ monogram, size }: { monogram: string; size: number }) => sealSvg(monogram, size),
      email:    ({ monogram, size }: { monogram: string; size: number }) => sealSvg(monogram, size),
      document: ({ monogram, size }: { monogram: string; size: number }) => sealSvg(monogram, size),
    },
  },
})

export default WaxSeal
