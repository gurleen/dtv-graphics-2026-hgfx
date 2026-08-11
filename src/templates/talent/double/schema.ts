import { z } from 'zod'
import type { TemplateSchema } from '@hydra-tv/hydra-gfx-runtime/types'

export type TalentDoubleProps = {
  firstNameLeft: string
  lastNameLeft: string
  firstNameRight: string
  lastNameRight: string
  eyebrow: string
  logoUrl: string
}

export const talentDoubleDefaults: TalentDoubleProps = {
  firstNameLeft: 'MIKE',
  lastNameLeft: 'TUBEROSA',
  firstNameRight: 'ROB',
  lastNameRight: 'BROOKS',
  eyebrow: 'TALENT',
  logoUrl: '',
}

export const talentDoubleSchema = z.object({
  firstNameLeft: z.string(),
  lastNameLeft: z.string(),
  firstNameRight: z.string(),
  lastNameRight: z.string(),
  eyebrow: z.string(),
  logoUrl: z.string(),
}) satisfies z.ZodType<TalentDoubleProps>

export const talentDoubleTemplateSchema: TemplateSchema<TalentDoubleProps> = {
  id: 'talent-double',
  name: 'Talent Lower Third (Double)',
  route: '/graphics/p/dtv-2026/talent-double',
  schema: talentDoubleSchema,
  defaults: talentDoubleDefaults,
  fields: {
    firstNameLeft: { label: 'First name (left)', section: 'CONTENT' },
    lastNameLeft: { label: 'Last name (left)', section: 'CONTENT' },
    firstNameRight: { label: 'First name (right)', section: 'CONTENT' },
    lastNameRight: { label: 'Last name (right)', section: 'CONTENT' },
    eyebrow: { label: 'Eyebrow', section: 'BRAND' },
    logoUrl: { label: 'Logo URL override', section: 'BRAND' },
  },
  transition: { inMs: 500, outMs: 300 },
}
