type CroppedImageProps = {
  src: string
  width: number
  height: number
  /** Zoom from the center. Defaults to 1.5 so the image overruns the box and is clipped. */
  scale?: number
  alt?: string
  id?: string
}

/**
 * Transparent overflow-hidden box with a centered, scaled image.
 * At scale 1 the full image fits; the default scale clips the edges.
 */
export function CroppedImage({
  src,
  width,
  height,
  scale = 1.5,
  alt = '',
  id,
}: CroppedImageProps) {
  return (
    <div
      id={id}
      style={{
        width,
        height,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          flexShrink: 0,
        }}
      />
    </div>
  )
}
