import type { ReactNode } from 'react'
import { Column } from '@hydra-tv/hydra-gfx-runtime'
import { PANEL_FILL, PANEL_FOOTER } from './constants'
import { SHELL, SHELL_CONTENT, ShapeSheen } from './ShapeSheen'

type TalentPanelProps = {
  width: number
  height: number
  children: ReactNode
  /** GSAP target id for the panel shell. Defaults to `text-box`. */
  id?: string
}

const FOOTER_HEIGHT = 14

/**
 * Gray talent lower-third shell: light content plate, dark footer bar.
 */
export function TalentPanel({
  width,
  height,
  children,
  id = 'text-box',
}: TalentPanelProps) {
  const contentHeight = height - FOOTER_HEIGHT

  return (
    <div style={{ overflow: 'hidden', width, height }}>
      <div id={id} style={{ width, height }}>
        <Column width={width} height={height} justify="start" align="stretch">
          <div style={{ ...SHELL, width, height: contentHeight, background: PANEL_FILL }}>
            <ShapeSheen variant="light" />
            <div style={{ ...SHELL_CONTENT, paddingTop: 5 }}>{children}</div>
          </div>
          <div style={{ ...SHELL, width, height: FOOTER_HEIGHT, background: PANEL_FOOTER }}>
            <ShapeSheen variant="dark" />
          </div>
        </Column>
      </div>
    </div>
  )
}
