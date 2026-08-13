import { Column, Row, Text } from '@hydra-tv/hydra-gfx-runtime'
import { PANEL_INK, TALENT_FONT, TALENT_INK_SHADOW } from './constants'

type TalentNameProps = {
  firstName: string
  lastName: string
  /** Prefix for GSAP ids, e.g. `` → `first-name`, `left-` → `left-first-name`. */
  idPrefix?: string
  /** Stack names vertically (double columns) vs side-by-side (single). */
  stacked?: boolean
  firstFontSize?: number
  lastFontSize?: number
  textAlign?: 'left' | 'center'
}

export function TalentName({
  firstName,
  lastName,
  idPrefix = '',
  stacked = false,
  firstFontSize = 48,
  lastFontSize = stacked ? 60 : 48,
  textAlign = stacked ? 'center' : 'left',
}: TalentNameProps) {
  const firstId = `${idPrefix}first-name`
  const lastId = `${idPrefix}last-name`
  const firstText = firstName.toUpperCase()
  const lastText = lastName.toUpperCase()

  const first = (
    <div style={{ overflow: 'hidden' }}>
      <div id={firstId} style={{ textShadow: TALENT_INK_SHADOW }}>
        <Text
          fontSize={firstFontSize}
          fontFamily={TALENT_FONT}
          color={PANEL_INK}
          textAlign={textAlign}
          lineHeight={1.05}
          singleLine
        >
          {firstText}
        </Text>
      </div>
    </div>
  )

  const last = (
    <div style={{ overflow: 'hidden' }}>
      <div id={lastId} style={{ fontWeight: 800, textShadow: TALENT_INK_SHADOW }}>
        <Text
          fontSize={lastFontSize}
          fontFamily={TALENT_FONT}
          color={PANEL_INK}
          textAlign={textAlign}
          lineHeight={1.05}
          singleLine
        >
          {lastText}
        </Text>
      </div>
    </div>
  )

  if (stacked) {
    return (
      <Column align={textAlign === 'center' ? 'center' : 'start'} gap={0} height="auto">
        {first}
        {last}
      </Column>
    )
  }

  return (
    <Row justify="start" align="center" gap={8} height="auto" padding={12}>
      {first}
      {last}
    </Row>
  )
}
