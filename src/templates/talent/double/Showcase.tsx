import { useState } from 'react'
import { useGsapPlayout } from '../../../lib/gsap'
import { TALENT_FONT } from '../shared'
import { PlayoutButtons } from '../../shared/ShowcaseChrome'
import { talentDoubleAnimation } from './animation'
import { TalentDoubleLayout } from './Layout'
import { talentDoubleDefaults } from './schema'

const TALENT_DOUBLE_WIDTH = 726
const TALENT_DOUBLE_HEIGHT = 44 + 149
const TALENT_PREVIEW_HEADROOM = 80

export default function TalentDoubleShowcase({ autoIn = false }: { autoIn?: boolean }) {
  const [onScreen, setOnScreen] = useState(autoIn)
  const scope = useGsapPlayout(onScreen, talentDoubleAnimation)

  return (
    <div>
      <PlayoutButtons
        onScreen={onScreen}
        onIn={() => setOnScreen(true)}
        onOut={() => setOnScreen(false)}
      />
      <div
        style={{
          width: TALENT_DOUBLE_WIDTH,
          height: TALENT_DOUBLE_HEIGHT + TALENT_PREVIEW_HEADROOM,
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
      </div>
    </div>
  )
}
