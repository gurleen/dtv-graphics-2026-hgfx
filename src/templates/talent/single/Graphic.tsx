import { HtmlCanvas, LowerThird } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import { useGsapPlayout } from '../../../lib/gsap'
import { TALENT_FONT } from '../shared'
import { talentSingleAnimation } from './animation'
import { TalentSingleLayout } from './Layout'
import type { TalentSingleProps } from './schema'

export default function TalentSingleGraphic({
  props,
  onScreen,
}: TemplateRenderProps<TalentSingleProps>) {
  const { scope } = useGsapPlayout(onScreen, talentSingleAnimation)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: TALENT_FONT }}
      >
        <LowerThird align="center" justify="end">
          <TalentSingleLayout
            firstName={props.firstName}
            lastName={props.lastName}
          />
        </LowerThird>
      </div>
    </HtmlCanvas>
  )
}
