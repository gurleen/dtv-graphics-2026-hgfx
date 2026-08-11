import { Image, Row, Text } from '@hydra-tv/hydra-gfx-runtime'
import { CAA_WHITE_LOGO } from './caaWhiteLogo'
import {
  TALENT_FONT,
  TOP_BOX_FILL,
  TOP_BOX_HEIGHT,
  TOP_BOX_LOGO_WIDTH,
  TOP_BOX_WIDTH,
} from './constants'

type TopBoxProps = {
  eyebrow: string
  /** Optional override; defaults to the inlined CAA wordmark. */
  logoUrl?: string
}

/**
 * Dark badge above the double talent panel.
 * Uses the bundled CAA white logo unless `logoUrl` is provided.
 */
export function TopBox({ eyebrow, logoUrl }: TopBoxProps) {
  const src = logoUrl?.trim() ? logoUrl.trim() : CAA_WHITE_LOGO

  return (
    <div style={{ overflow: 'hidden' }}>
      <div id="top-box">
        <Row
          width={TOP_BOX_WIDTH}
          height={TOP_BOX_HEIGHT}
          justify="center"
          align="center"
          gap={8}
          background={TOP_BOX_FILL}
          paddingY={8}
        >
          <Image
            src={src}
            width={TOP_BOX_LOGO_WIDTH}
            height={TOP_BOX_HEIGHT - 16}
            fit="contain"
            alt=""
          />
          {eyebrow.trim().length > 0 ? (
            <Text
              fontSize={36}
              fontFamily={TALENT_FONT}
              color="#FFFFFF"
              singleLine
              marginTop={4}
            >
              {eyebrow}
            </Text>
          ) : null}
        </Row>
      </div>
    </div>
  )
}
