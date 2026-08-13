import { useState } from 'react'
import { useGsapPlayout } from '../../../lib/gsap'
import { TALENT_FONT } from '../shared'
import { PlayoutSwitch, ShowcaseStage } from '../../shared/ShowcaseChrome'
import type { ShowcaseProps } from '../../showcaseRegistry'
import { talentSingleAnimation } from './animation'
import { TalentSingleLayout } from './Layout'
import { talentSingleDefaults } from './schema'

const TALENT_SINGLE_WIDTH = 400
const TALENT_SINGLE_HEIGHT = 100
const TALENT_PREVIEW_HEADROOM = 80

export default function TalentSingleShowcase({ autoIn = false }: ShowcaseProps) {
  const [onScreen, setOnScreen] = useState(autoIn)
  const { scope, isAnimating } = useGsapPlayout(onScreen, talentSingleAnimation)

  return (
    <div>
      <PlayoutSwitch
        onScreen={onScreen}
        onChange={setOnScreen}
        disabled={isAnimating}
      />
      <ShowcaseStage
        width={TALENT_SINGLE_WIDTH}
        height={TALENT_SINGLE_HEIGHT + TALENT_PREVIEW_HEADROOM}
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
            width: TALENT_SINGLE_WIDTH,
            fontFamily: TALENT_FONT,
          }}
        >
          <TalentSingleLayout
            firstName={talentSingleDefaults.firstName}
            lastName={talentSingleDefaults.lastName}
          />
        </div>
      </ShowcaseStage>
    </div>
  )
}
