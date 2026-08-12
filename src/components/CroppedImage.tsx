type CroppedImageProps = {
  src: string
  width: number
  height: number
  /** Zoom from the center. Defaults to 1.5 so the image overruns the box and is clipped. */
  scale?: number
  /** `contain` letterboxes; `cover` fills the box and clips overflow. */
  fit?: 'contain' | 'cover'
  /**
   * Pre-scale image layout size. Defaults to the clip box. Set smaller than
   * `width`/`height` so a scale > 1 can still show the full image width.
   */
  contentWidth?: number
  contentHeight?: number
  alt?: string
  id?: string
}

/**
 * Transparent overflow-hidden box with a centered, scaled image.
 * At scale 1 with contain the full image fits; cover fills the box.
 */
export function CroppedImage({
  src,
  width,
  height,
  scale = 1.5,
  fit = 'contain',
  contentWidth,
  contentHeight,
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
          width: contentWidth ?? '100%',
          height: contentHeight ?? '100%',
          objectFit: fit,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          flexShrink: 0,
        }}
      />
    </div>
  )
}
