import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/** Scales a fixed-size preview well down to the container width. */
export function ShowcaseStage({
  width,
  height,
  children,
  style,
}: {
  width: number
  height: number
  children: ReactNode
  style?: CSSProperties
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const outer = outerRef.current
    if (!outer) return

    const update = () => {
      const available = outer.clientWidth
      setScale(available > 0 ? Math.min(1, available / width) : 1)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    return () => observer.disconnect()
  }, [width])

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        maxWidth: width,
        height: height * scale,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function PlayoutSwitch({
  onScreen,
  onChange,
  disabled = false,
}: {
  onScreen: boolean
  onChange: (onScreen: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.04em',
          color: onScreen ? '#9aa0a6' : '#e07070',
        }}
      >
        OUT
      </span>
      <span
        style={{
          position: 'relative',
          width: 44,
          height: 24,
          flexShrink: 0,
        }}
      >
        <input
          type="checkbox"
          role="switch"
          aria-label={onScreen ? 'On air' : 'Off air'}
          aria-disabled={disabled}
          checked={onScreen}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            position: 'absolute',
            inset: 0,
            margin: 0,
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
        <span
          aria-hidden
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            borderRadius: 12,
            background: onScreen ? '#7dce82' : '#e07070',
            transition: 'background 0.15s ease',
          }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 2,
            left: onScreen ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#111',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            transition: 'left 0.15s ease',
            pointerEvents: 'none',
          }}
        />
      </span>
      <span
        style={{
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.04em',
          color: onScreen ? '#7dce82' : '#9aa0a6',
        }}
      >
        IN
      </span>
    </label>
  )
}
