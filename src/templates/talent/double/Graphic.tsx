import { HtmlCanvas, LowerThird } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import { useGsapPlayout } from '../../../lib/gsap'
import { TALENT_FONT } from '../shared'
import { talentDoubleAnimation } from './animation'
import { TalentDoubleLayout } from './Layout'
import type { TalentDoubleProps } from './schema'

export default function TalentDoubleGraphic({
  props,
  onScreen,
}: TemplateRenderProps<TalentDoubleProps>) {
  const { scope } = useGsapPlayout(onScreen, talentDoubleAnimation)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: TALENT_FONT }}
      >
        <LowerThird align="center" justify="end">
          <TalentDoubleLayout
            firstNameLeft={props.firstNameLeft}
            lastNameLeft={props.lastNameLeft}
            firstNameRight={props.firstNameRight}
            lastNameRight={props.lastNameRight}
            eyebrow={props.eyebrow}
            logoUrl={props.logoUrl}
          />
        </LowerThird>
      </div>
    </HtmlCanvas>
  )
}
