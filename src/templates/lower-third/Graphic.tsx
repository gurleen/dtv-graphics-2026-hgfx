import {
  HtmlCanvas,
  LowerThird,
  Column,
  Rect,
  Text,
  DefaultTextShadow,
} from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../lib/gsap'
import type { LowerThirdProps } from './schema'

function animation(timeline: gsap.core.Timeline) {
  timeline
    .from('#l3-stack', { y: 80, opacity: 0, duration: 0.55, ease: 'power3.out' })
    .addPause()
    .to('#l3-stack', { y: 80, opacity: 0, duration: 0.4, ease: 'power3.in' })
}

export default function LowerThirdGraphic({
  props,
  onScreen,
}: TemplateRenderProps<LowerThirdProps>) {
  const scope = useGsapPlayout(onScreen, animation)

  return (
    <HtmlCanvas>
      <div ref={scope} style={{ width: '100%', height: '100%' }}>
        <LowerThird align="start" justify="end">
          <div id="l3-stack" style={{ pointerEvents: 'none' }}>
            <Column align="start" gap={8} height="auto">
              <Rect
                fill={props.accent}
                width={120}
                height={4}
                marginBottom={8}
              />
              <Text
                fontSize={64}
                fontFamily="system-ui, sans-serif"
                color="#FFFFFF"
                lineHeight={1.05}
                shadow={DefaultTextShadow}
                singleLine
              >
                {props.title}
              </Text>
              <Text
                fontSize={28}
                fontFamily="system-ui, sans-serif"
                color={props.accent}
                shadow={DefaultTextShadow}
                singleLine
              >
                {props.subtitle}
              </Text>
            </Column>
          </div>
        </LowerThird>
      </div>
    </HtmlCanvas>
  )
}
