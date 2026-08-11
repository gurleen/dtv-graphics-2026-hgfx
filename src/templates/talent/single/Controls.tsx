import { FieldRow, Input } from '@hydra-tv/ui'
import type { TemplateControlsProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type { TalentSingleProps } from './schema'

export default function TalentSingleControls({
  props,
  patch,
}: TemplateControlsProps<TalentSingleProps>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <div
        style={{
          padding: '6px 0 3px',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--fg-3)',
          borderBottom: '1px solid var(--line-1)',
          marginBottom: 4,
        }}
      >
        CONTENT
      </div>
      <FieldRow label="First name">
        <Input
          value={props.firstName}
          width="100%"
          onChange={(v) => patch({ firstName: v })}
        />
      </FieldRow>
      <FieldRow label="Last name">
        <Input
          value={props.lastName}
          width="100%"
          onChange={(v) => patch({ lastName: v })}
        />
      </FieldRow>
    </div>
  )
}
