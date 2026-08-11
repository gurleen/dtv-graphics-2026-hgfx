import { HtmlCanvas, LowerThird, Column } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../../lib/gsap'
import {
  TalentName,
  TalentPanel,
  SINGLE_PANEL_HEIGHT,
  SINGLE_PANEL_WIDTH,
  TALENT_FONT,
} from '../shared'
import type { TalentSingleProps } from './schema'

function animation(timeline: gsap.core.Timeline) {
  timeline
    .from('#text-box', { y: 100, opacity: 0, duration: 0.3, ease: 'circ.out' })
    .from('#first-name', { y: 100, opacity: 0, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .from('#last-name', { y: 100, opacity: 0, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .addPause()
    .to('#talent-root', { opacity: 0, duration: 0.3, ease: 'circ.out' })
}

export default function TalentSingleGraphic({
  props,
  onScreen,
}: TemplateRenderProps<TalentSingleProps>) {
  const scope = useGsapPlayout(onScreen, animation)

  return (
    <HtmlCanvas>
      <div
        id="talent-root"
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: TALENT_FONT }}
      >
        <LowerThird align="center" justify="end">
          <Column align="center" height="auto">
            <TalentPanel width={SINGLE_PANEL_WIDTH} height={SINGLE_PANEL_HEIGHT}>
              <TalentName
                firstName={props.firstName}
                lastName={props.lastName}
                firstFontSize={48}
                lastFontSize={48}
              />
            </TalentPanel>
          </Column>
        </LowerThird>
      </div>
    </HtmlCanvas>
  )
}
