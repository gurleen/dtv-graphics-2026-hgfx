import type { ReactNode } from 'react'
import { Column, Rect } from '@hydra-tv/hydra-gfx-runtime'
import { PANEL_FILL, PANEL_FOOTER } from './constants'

type TalentPanelProps = {
  width: number
  height: number
  children: ReactNode
  /** GSAP target id for the panel shell. Defaults to `text-box`. */
  id?: string
}

/**
 * Gray talent lower-third shell: top hairline, content, black footer bar.
 */
export function TalentPanel({
  width,
  height,
  children,
  id = 'text-box',
}: TalentPanelProps) {
  return (
    <div id={id}>
      <Column
        width={width}
        height={height}
        justify="between"
        align="stretch"
        background={PANEL_FILL}
      >
        <Rect fill="transparent" width={width} height={5} />
        {children}
        <Rect fill={PANEL_FOOTER} width={width} height={14} />
      </Column>
    </div>
  )
}
