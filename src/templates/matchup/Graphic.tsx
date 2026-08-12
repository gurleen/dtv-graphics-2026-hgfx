import { HtmlCanvas } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../lib/gsap'
import type { Sport } from '../../config'
import { findTeam } from '../../data/teams'
import type { MatchupProps } from './schema'
import {
  DEFAULT_BASKETBALL_CONF_LOGO,
  DEFAULT_SPONSOR_LOGO,
  DEFAULT_WRESTLING_CONF_LOGO,
} from './assets'
import { MATCHUP_FONT, MatchupLayout } from './Layout'

function animation(timeline: gsap.core.Timeline, root: HTMLElement) {
  timeline
    .from('#caa-box', { y: 189, duration: 2.23, ease: 'expo.out' })
    .from('#caa-logo', { y: 189, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#home-box', { y: 189, duration: 2, ease: 'expo.out' }, '<0.3')
    .from('#away-box', { y: 189, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-logo', { xPercent: 100, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-logo', { xPercent: -100, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-school-name', { y: 75, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-school-name', { y: 75, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-team-name', { y: 75, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-team-name', { y: 75, duration: 2, ease: 'expo.out' }, '<')
    .from('#sponsor-bar', { y: 75, duration: 1.5, ease: 'expo.out' }, '<1')
    .from('#bottom-bar', { y: -75, duration: 1.5, ease: 'expo.out' }, '<')
    .addPause()
    .to(root, { opacity: 0, duration: 0.5, ease: 'expo.out' })
}

function presenterForSport(sport: Sport): string {
  return sport === 'wrestling'
    ? 'DREXEL WRESTLING PRESENTED BY'
    : 'DREXEL BASKETBALL PRESENTED BY'
}

function confLogoForSport(props: MatchupProps): string {
  if (props.sport === 'wrestling') {
    return props.wrestlingConfLogoUrl || DEFAULT_WRESTLING_CONF_LOGO
  }
  return props.basketballConfLogoUrl || DEFAULT_BASKETBALL_CONF_LOGO
}

function sponsorLogoUrl(props: MatchupProps): string {
  return props.sponsorLogoUrl || DEFAULT_SPONSOR_LOGO
}

export default function MatchupGraphic({
  props,
  onScreen,
}: TemplateRenderProps<MatchupProps>) {
  const scope = useGsapPlayout(onScreen, animation)

  const homeTeam = findTeam(props.homeTeamId)
  const awayTeam = findTeam(props.awayTeamId)
  const confLogo = confLogoForSport(props)
  const sponsorLogo = sponsorLogoUrl(props)
  const presenter = presenterForSport(props.sport)

  return (
    <HtmlCanvas>
      <div
        ref={scope}
        style={{ width: '100%', height: '100%', fontFamily: MATCHUP_FONT }}
      >
        {/*
          Absolute top (not marginTop): margin-top collapses through HtmlCanvas
          into the host PVW scale wrapper and pushes the graphic below the
          overflow:hidden monitor well — preview looks empty/black.
        */}
        <div style={{ position: 'absolute', top: 700, left: 0, width: 1920 }}>
          <MatchupLayout
            presenter={presenter}
            sponsorLogoUrl={sponsorLogo}
            confLogoUrl={confLogo}
            venue={props.venue}
            location={props.location}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeLogoScale={props.homeLogoScale}
            awayLogoScale={props.awayLogoScale}
          />
        </div>
      </div>
    </HtmlCanvas>
  )
}
