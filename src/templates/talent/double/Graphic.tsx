import { HtmlCanvas, LowerThird, Column, Row, Rect } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../../lib/gsap'
import {
  TalentName,
  TalentPanel,
  TopBox,
  DOUBLE_PANEL_HEIGHT,
  DOUBLE_PANEL_WIDTH,
  PANEL_INK,
  TALENT_FONT,
} from '../shared'
import type { TalentDoubleProps } from './schema'

function animation(timeline: gsap.core.Timeline, root: HTMLElement) {
  timeline
    .from('#text-box', { y: 100, opacity: 0, duration: 0.3, ease: 'circ.out' })
    .from('#left-first-name', { x: -100, opacity: 0, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .from('#left-last-name', { x: -100, opacity: 0, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .from('#right-first-name', { x: 100, opacity: 0, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .from('#right-last-name', { x: 100, opacity: 0, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .from('#top-box', { y: 100, duration: 0.3, ease: 'circ.out' }, '<0.1')
    .addPause()
    .to(root, { opacity: 0, duration: 0.3, ease: 'circ.out' })
}

export default function TalentDoubleGraphic({
  props,
  onScreen,
}: TemplateRenderProps<TalentDoubleProps>) {
  const scope = useGsapPlayout(onScreen, animation)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: TALENT_FONT }}
      >
        <LowerThird align="center" justify="end">
          <Column align="center" height="auto">
            <TopBox eyebrow={props.eyebrow} logoUrl={props.logoUrl} />
            <TalentPanel width={DOUBLE_PANEL_WIDTH} height={DOUBLE_PANEL_HEIGHT}>
              <Row justify="evenly" align="center" width="100%" height="auto">
                <TalentName
                  firstName={props.firstNameLeft}
                  lastName={props.lastNameLeft}
                  idPrefix="left-"
                  stacked
                  firstFontSize={48}
                  lastFontSize={60}
                />
                <Rect fill={PANEL_INK} width={1} height={100} radius={8} />
                <TalentName
                  firstName={props.firstNameRight}
                  lastName={props.lastNameRight}
                  idPrefix="right-"
                  stacked
                  firstFontSize={48}
                  lastFontSize={60}
                />
              </Row>
            </TalentPanel>
          </Column>
        </LowerThird>
      </div>
    </HtmlCanvas>
  )
}
