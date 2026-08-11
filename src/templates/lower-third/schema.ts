import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'

export type LowerThirdProps = {
  title: string
  subtitle: string
  accent: string
}

export const lowerThirdDefaults: LowerThirdProps = {
  title: 'HELLO',
  subtitle: 'Lower third',
  accent: '#FFC600',
}

export const lowerThirdSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accent: z.string(),
}) satisfies z.ZodType<LowerThirdProps>

export const lowerThirdTemplateSchema: TemplateSchema<LowerThirdProps> = {
  id: 'lower-third',
  name: 'Lower Third',
  route: '/graphics/p/dtv-2026/lower-third',
  schema: lowerThirdSchema,
  defaults: lowerThirdDefaults,
  fields: {
    title: { label: 'Title', section: 'CONTENT' },
    subtitle: { label: 'Subtitle', section: 'CONTENT' },
    accent: { label: 'Accent', section: 'STYLE', type: 'color' },
  },
  transition: { inMs: 600, outMs: 400 },
}
