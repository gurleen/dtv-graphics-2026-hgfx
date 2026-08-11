import { FieldRow, Input } from '@hydra-tv/ui'
import type { TemplateControlsProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type { TalentDoubleProps } from './schema'

function Section({ label }: { label: string }) {
  return (
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
        marginTop: 4,
      }}
    >
      {label}
    </div>
  )
}

export default function TalentDoubleControls({
  props,
  patch,
}: TemplateControlsProps<TalentDoubleProps>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <Section label="Left" />
      <FieldRow label="First name">
        <Input
          value={props.firstNameLeft}
          width="100%"
          onChange={(v) => patch({ firstNameLeft: v })}
        />
      </FieldRow>
      <FieldRow label="Last name">
        <Input
          value={props.lastNameLeft}
          width="100%"
          onChange={(v) => patch({ lastNameLeft: v })}
        />
      </FieldRow>

      <Section label="Right" />
      <FieldRow label="First name">
        <Input
          value={props.firstNameRight}
          width="100%"
          onChange={(v) => patch({ firstNameRight: v })}
        />
      </FieldRow>
      <FieldRow label="Last name">
        <Input
          value={props.lastNameRight}
          width="100%"
          onChange={(v) => patch({ lastNameRight: v })}
        />
      </FieldRow>

      <Section label="Brand" />
      <FieldRow label="Eyebrow">
        <Input
          value={props.eyebrow}
          width="100%"
          onChange={(v) => patch({ eyebrow: v })}
        />
      </FieldRow>
      <FieldRow label="Logo URL override">
        <Input
          value={props.logoUrl}
          width="100%"
          onChange={(v) => patch({ logoUrl: v })}
        />
      </FieldRow>
    </div>
  )
}
