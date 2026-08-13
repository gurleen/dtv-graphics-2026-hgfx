import { useState } from 'react'
import { useGsapPlayout } from '../../../lib/gsap'
import { TALENT_FONT } from '../shared'
import { PlayoutSwitch, ShowcaseStage } from '../../shared/ShowcaseChrome'
import type { ShowcaseProps } from '../../showcaseRegistry'
import { talentDoubleAnimation } from './animation'
import { TalentDoubleLayout } from './Layout'
import { talentDoubleDefaults } from './schema'

const TALENT_DOUBLE_WIDTH = 726
const TALENT_DOUBLE_HEIGHT = 44 + 149
const TALENT_PREVIEW_HEADROOM = 80

export default function TalentDoubleShowcase({ autoIn = false }: ShowcaseProps) {
  const [onScreen, setOnScreen] = useState(autoIn)
  const { scope, isAnimating } = useGsapPlayout(onScreen, talentDoubleAnimation)

  return (
    <div>
      <PlayoutSwitch
        onScreen={onScreen}
        onChange={setOnScreen}
        disabled={isAnimating}
      />
      <ShowcaseStage
        width={TALENT_DOUBLE_WIDTH}
        height={TALENT_DOUBLE_HEIGHT + TALENT_PREVIEW_HEADROOM}
        style={{
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div
          ref={scope}
          style={{
            width: TALENT_DOUBLE_WIDTH,
            fontFamily: TALENT_FONT,
          }}
        >
          <TalentDoubleLayout
            firstNameLeft={talentDoubleDefaults.firstNameLeft}
            lastNameLeft={talentDoubleDefaults.lastNameLeft}
            firstNameRight={talentDoubleDefaults.firstNameRight}
            lastNameRight={talentDoubleDefaults.lastNameRight}
            eyebrow={talentDoubleDefaults.eyebrow}
            logoUrl={talentDoubleDefaults.logoUrl}
          />
        </div>
      </ShowcaseStage>
    </div>
  )
}
