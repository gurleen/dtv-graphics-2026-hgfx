import { Column } from '@hydra-tv/hydra-gfx-runtime'
import { TalentName, TalentPanel, SINGLE_PANEL_HEIGHT, SINGLE_PANEL_WIDTH } from '../shared'

export type TalentSingleLayoutProps = {
  firstName: string
  lastName: string
}

export function TalentSingleLayout({
  firstName,
  lastName,
}: TalentSingleLayoutProps) {
  return (
    <Column align="center" height="auto">
      <TalentPanel width={SINGLE_PANEL_WIDTH} height={SINGLE_PANEL_HEIGHT}>
        <TalentName
          firstName={firstName}
          lastName={lastName}
          firstFontSize={48}
          lastFontSize={48}
        />
      </TalentPanel>
    </Column>
  )
}
