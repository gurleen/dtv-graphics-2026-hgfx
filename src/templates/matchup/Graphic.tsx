import { HtmlCanvas, Rect, Row, Column, Flex, Text, Image } from '@hydra-tv/hydra-gfx-runtime'
import type { TemplateRenderProps } from '@hydra-tv/hydra-gfx-runtime/types'
import type gsap from 'gsap'
import { useGsapPlayout } from '../../lib/gsap'
import type { Sport } from '../../config'
import {
  findTeam,
  getTeamKnockoutLogo,
  type TeamInfo,
} from '../../data/teams'
import type { MatchupProps } from './schema'

const MATCHUP_FONT = 'Zuume, system-ui, sans-serif'
const EMPTY_TEAM_FILL = '#141515'

function animation(timeline: gsap.core.Timeline, root: HTMLElement) {
  timeline
    .from('#caa-box', { y: 189, duration: 2.23, ease: 'expo.out' })
    .from('#caa-logo', { y: 189, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#home-box', { y: 189, duration: 2, ease: 'expo.out' }, '<0.3')
    .from('#away-box', { y: 189, duration: 2, ease: 'expo.out' }, '<')
    .from('#home-logo', { y: 75, duration: 2, ease: 'expo.out' }, '<0.1')
    .from('#away-logo', { y: 75, duration: 2, ease: 'expo.out' }, '<')
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
  return props.sport === 'wrestling'
    ? props.wrestlingConfLogoUrl
    : props.basketballConfLogoUrl
}

function teamFill(color: string | undefined): string {
  if (!color) return EMPTY_TEAM_FILL
  return color.startsWith('#') ? color : `#${color}`
}

export default function MatchupGraphic({
  props,
  onScreen,
}: TemplateRenderProps<MatchupProps>) {
  const scope = useGsapPlayout(onScreen, animation)

  const homeTeam = findTeam(props.homeTeamId)
  const awayTeam = findTeam(props.awayTeamId)
  const confLogo = confLogoForSport(props)
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
          <Column width={1920} height="auto" align="stretch">
            <div style={{ overflow: 'hidden' }}>
              <SponsorBar presenter={presenter} sponsorLogoUrl={props.sponsorLogoUrl} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <Row width={1920} height={189} align="stretch" justify="start">
                <TeamBox isHome={false} team={awayTeam} />
                <ConfBox confLogoUrl={confLogo} />
                <TeamBox isHome={true} team={homeTeam} />
              </Row>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <BottomBar venue={props.venue} />
            </div>
          </Column>
        </div>
      </div>
    </HtmlCanvas>
  )
}

function SponsorBar({
  presenter,
  sponsorLogoUrl,
}: {
  presenter: string
  sponsorLogoUrl: string
}) {
  return (
    <div id="sponsor-bar">
      <Row
        width={1920}
        height={72}
        justify="center"
        align="center"
        gap={20}
        padding={28}
        background="#141414"
      >
        <Text color="#FFFFFF" fontSize={48} fontFamily={MATCHUP_FONT} lineHeight={1.05} singleLine>
          {presenter}
        </Text>
        {sponsorLogoUrl ? (
          <Image src={sponsorLogoUrl} width={400} height={48} fit="contain" alt="" />
        ) : null}
      </Row>
    </div>
  )
}

function ConfBox({ confLogoUrl }: { confLogoUrl: string }) {
  return (
    <div id="caa-box">
      <Row
        width={350}
        height={189}
        justify="center"
        align="center"
        padding={20}
        background="#141515"
      >
        <div id="caa-logo">
          {confLogoUrl ? (
            <Image src={confLogoUrl} width={280} height={140} fit="contain" alt="" />
          ) : (
            <Rect fill="transparent" width={280} height={140} />
          )}
        </div>
      </Row>
    </div>
  )
}

function TeamBox({ isHome, team }: { isHome: boolean; team: TeamInfo | undefined }) {
  const idPrefix = isHome ? 'home' : 'away'
  const logoUrl = team ? getTeamKnockoutLogo(team) : ''
  const school = team?.short_name.toUpperCase() ?? ''
  const mascot = team?.mascot.toUpperCase() ?? ''

  return (
    <div id={`${idPrefix}-box`}>
      <Flex
        width={785}
        height={189}
        direction={isHome ? 'row-reverse' : 'row'}
        align="stretch"
        background={teamFill(team?.color)}
      >
        <div id={`${idPrefix}-logo`}>
          <Row width={300} height={189} justify="center" align="center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                style={{
                  marginTop: -50,
                  transform: 'scale(1.5)',
                  maxWidth: 220,
                  maxHeight: 160,
                  objectFit: 'contain',
                }}
              />
            ) : null}
          </Row>
        </div>
        <Column
          width={485}
          height={189}
          justify="center"
          align={isHome ? 'start' : 'end'}
          paddingX={20}
        >
          <div id={`${idPrefix}-school-name`}>
            <Text
              color="#FFFFFF"
              fontSize={60}
              fontFamily={MATCHUP_FONT}
              textAlign={isHome ? 'left' : 'right'}
              lineHeight={1.05}
              singleLine
            >
              {school || ' '}
            </Text>
          </div>
          <div id={`${idPrefix}-team-name`}>
            <Text
              color="#FFFFFF"
              fontSize={72}
              fontFamily={MATCHUP_FONT}
              textAlign={isHome ? 'left' : 'right'}
              lineHeight={1.05}
              singleLine
            >
              {mascot || ' '}
            </Text>
          </div>
        </Column>
      </Flex>
    </div>
  )
}

function BottomBar({ venue }: { venue: string }) {
  return (
    <div id="bottom-bar">
      <Row
        width={1920}
        height={61}
        justify="center"
        align="center"
        background="#F0F0F0"
      >
        <Text color="#000000" fontSize={48} fontFamily={MATCHUP_FONT} lineHeight={1.05} singleLine>
          {venue || ' '}
        </Text>
      </Row>
    </div>
  )
}
