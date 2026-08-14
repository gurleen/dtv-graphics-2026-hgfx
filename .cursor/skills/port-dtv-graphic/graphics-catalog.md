# Old-repo graphic catalog

Source: `https://github.com/gurleen/dtv-graphics-2026` → `src/graphics/<folder>/`.

Resolve the user's name against **folder**, **suggested id**, or **aliases**. Folders keep a numeric prefix in the old repo; drop it in this package.

| Old folder | Suggested template id | Family | Status in this package |
| --- | --- | --- | --- |
| `0_lower_third` | — | test | Skip (SPX test square, not a show graphic) |
| `1_basketball_scorebug` | `basketball-scorebug` | matchup | Ported (`src/templates/scorebug/`) |
| `2_score_to_break` | `score-to-break` | matchup | Ported |
| `3_matchup` | `matchup` | matchup | Ported (design-language reference) |
| `4_starting_lineups_lower` | `starting-lineups` | matchup | Not ported |
| `5_halftime_adjustments` | `halftime-adjustments` | matchup | Not ported |
| `6_halftime_stats` | `halftime-stats` | matchup | Not ported |
| `7_player_to_watch` | `player-to-watch` | matchup | Not ported |
| `8_talent_lower_third_double` | `talent-double` | talent | Ported (`src/templates/talent/double/`) |
| `9_talent_lower_third_single` | `talent-single` | talent | Ported (`src/templates/talent/single/`) |
| `10_player_lower_third` | `player-lower-third` | talent-adjacent | Not ported |
| `11_series_history` | `series-history` | matchup | Not ported |
| `12_coming_up_next` | `coming-up-next` | matchup | Not ported |
| `13_coach_lower_third` | `coach-lower-third` | talent | Not ported |
| `14_coach_lower_third_double` | `coach-lower-third-double` | talent | Not ported |
| `15_wrestling_scorebug` | `wrestling-scorebug` | matchup | Not ported |
| `16_wrestling_probables` | `wrestling-probables` | matchup | Not ported |
| `17_conf_standings` | `conf-standings` | matchup | Not ported |
| `18_around_the_conf` | `around-the-conf` | matchup | Not ported |
| `19_pwe_lower_third` | `pwe-lower-third` | talent-adjacent | Not ported |

Aliases (examples): "player L3" → `10_player_lower_third`; "bug" / "scorebug" → `1_basketball_scorebug`; "PWE" → `19_pwe_lower_third`; "standings" → `17_conf_standings`.

If already ported, do not duplicate. Restyle or extend only if the user asked for that.
