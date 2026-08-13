import { Column, Row, Rect } from '@hydra-tv/hydra-gfx-runtime'
import {
  TalentName,
  TalentPanel,
  TopBox,
  DOUBLE_PANEL_HEIGHT,
  DOUBLE_PANEL_WIDTH,
  PANEL_INK,
  TOP_BOX_HEIGHT,
  TOP_BOX_WIDTH,
} from '../shared'

export type TalentDoubleLayoutProps = {
  firstNameLeft: string
  lastNameLeft: string
  firstNameRight: string
  lastNameRight: string
  eyebrow: string
  logoUrl: string
}

export function TalentDoubleLayout({
  firstNameLeft,
  lastNameLeft,
  firstNameRight,
  lastNameRight,
  eyebrow,
  logoUrl,
}: TalentDoubleLayoutProps) {
  return (
    <Column align="center" height="auto">
      <div style={{ width: DOUBLE_PANEL_WIDTH }}>
        <div
          style={{
            overflow: 'hidden',
            height: TOP_BOX_HEIGHT,
            width: TOP_BOX_WIDTH,
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <TopBox eyebrow={eyebrow} logoUrl={logoUrl} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <TalentPanel width={DOUBLE_PANEL_WIDTH} height={DOUBLE_PANEL_HEIGHT}>
            <Row justify="evenly" align="center" width="100%" height="auto">
              <TalentName
                firstName={firstNameLeft}
                lastName={lastNameLeft}
                idPrefix="left-"
                stacked
                firstFontSize={48}
                lastFontSize={60}
              />
              <Rect fill={PANEL_INK} width={1} height={100} />
              <TalentName
                firstName={firstNameRight}
                lastName={lastNameRight}
                idPrefix="right-"
                stacked
                firstFontSize={48}
                lastFontSize={60}
              />
            </Row>
          </TalentPanel>
        </div>
      </div>
    </Column>
  )
}
