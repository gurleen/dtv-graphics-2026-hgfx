import { z } from 'zod'

export const BASKETBALL_GAME_FIELDS = [
  'homeScore',
  'awayScore',
  'clock',
  'shotClock',
  'period',
  'homeTimeouts',
  'awayTimeouts',
  'homeBonus',
  'awayBonus',
] as const

export type BasketballGameField = (typeof BASKETBALL_GAME_FIELDS)[number]

export type BasketballGameState = {
  homeScore: number
  awayScore: number
  clock: string
  shotClock: number
  period: string
  homeTimeouts: number
  awayTimeouts: number
  homeBonus: boolean
  awayBonus: boolean
}

export type BasketballFieldOverrides = {
  [K in BasketballGameField]: boolean
}

export const basketballGameDefaults: BasketballGameState = {
  homeScore: 0,
  awayScore: 0,
  clock: '20:00',
  shotClock: 30,
  period: '1ST',
  homeTimeouts: 4,
  awayTimeouts: 4,
  homeBonus: false,
  awayBonus: false,
}

export const basketballOverridesDefaults: BasketballFieldOverrides =
  Object.fromEntries(
    BASKETBALL_GAME_FIELDS.map((field) => [field, false]),
  ) as BasketballFieldOverrides

export const basketballGameSchema = z.object({
  homeScore: z.number(),
  awayScore: z.number(),
  clock: z.string(),
  shotClock: z.number(),
  period: z.string(),
  homeTimeouts: z.number().int().min(0).max(4),
  awayTimeouts: z.number().int().min(0).max(4),
  homeBonus: z.boolean(),
  awayBonus: z.boolean(),
}) satisfies z.ZodType<BasketballGameState>

export const basketballOverridesSchema = z.object({
  homeScore: z.boolean(),
  awayScore: z.boolean(),
  clock: z.boolean(),
  shotClock: z.boolean(),
  period: z.boolean(),
  homeTimeouts: z.boolean(),
  awayTimeouts: z.boolean(),
  homeBonus: z.boolean(),
  awayBonus: z.boolean(),
}) satisfies z.ZodType<BasketballFieldOverrides>

export function parseBasketballGameState(
  value: unknown,
): BasketballGameState | undefined {
  const parsed = basketballGameSchema.safeParse(value)
  return parsed.success ? parsed.data : undefined
}

/**
 * Overridden fields take the persisted config value; everything else follows
 * live data (or config when live has not been published yet).
 */
export function mergeBasketballState(
  live: BasketballGameState | undefined,
  configValues: BasketballGameState,
  overrides: BasketballFieldOverrides,
): BasketballGameState {
  const base = live ?? configValues
  const next = { ...base }
  for (const field of BASKETBALL_GAME_FIELDS) {
    if (overrides[field]) {
      ;(next[field] as BasketballGameState[typeof field]) = configValues[field]
    }
  }
  return next
}

/** Sub-second clocks arrive as `.9`; pad so the plate does not jump. */
export function formatClockDisplay(clock: string): string {
  return clock.startsWith('.') ? `0${clock}` : clock
}
