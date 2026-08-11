import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'

export type TalentSingleProps = {
  firstName: string
  lastName: string
}

export const talentSingleDefaults: TalentSingleProps = {
  firstName: 'TESSA',
  lastName: 'PELOSO',
}

export const talentSingleSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
}) satisfies z.ZodType<TalentSingleProps>

export const talentSingleTemplateSchema: TemplateSchema<TalentSingleProps> = {
  id: 'talent-single',
  name: 'Talent Lower Third (Single)',
  route: '/graphics/p/dtv-2026/talent-single',
  schema: talentSingleSchema,
  defaults: talentSingleDefaults,
  fields: {
    firstName: { label: 'First name', section: 'CONTENT' },
    lastName: { label: 'Last name', section: 'CONTENT' },
  },
  transition: { inMs: 500, outMs: 300 },
}
