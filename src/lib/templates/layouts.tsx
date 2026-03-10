import type { TemplateData } from './types'

const PRIMARY = '#c8ff00'
const DARK = '#0a0a0a'
const WHITE = '#f5f5f5'
const MUTED = '#a3a3a3'

function getBrandColor(data: TemplateData, fallback: string): string {
  return data.brandColors?.find(Boolean) ?? fallback
}

function getTopFeatures(data: TemplateData, count: number): string[] {
  return data.keyFeatures.filter(Boolean).slice(0, count)
}

// ─── Hero: 970x600 ─────────────────────────────────────────────────────────

export function HeroTemplate(data: TemplateData) {
  const accent = getBrandColor(data, PRIMARY)
  const features = getTopFeatures(data, 3)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 970,
        height: 600,
        position: 'relative',
        fontFamily: 'Inter',
        color: WHITE,
        overflow: 'hidden',
      }}
    >
      {/* Background image layer */}
      {data.backgroundImageUrl && (
        <img
          src={data.backgroundImageUrl}
          width={970}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 970,
          height: 600,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: 48,
          position: 'relative',
        }}
      >
        {/* Top: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              width: 6,
              height: 28,
              backgroundColor: accent,
              borderRadius: 3,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: accent,
            }}
          >
            {data.brandName ?? ''}
          </span>
        </div>

        {/* Bottom: product info + features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1 }}>
              {data.productName}
            </span>
            {data.description && (
              <span
                style={{
                  fontSize: 16,
                  color: MUTED,
                  lineHeight: 1.4,
                  maxWidth: 600,
                }}
              >
                {data.description.substring(0, 120)}
              </span>
            )}
          </div>

          {features.length > 0 && (
            <div style={{ display: 'flex', gap: 16 }}>
              {features.map((feat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 8,
                    padding: '10px 16px',
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: accent,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: WHITE }}>
                    {feat.length > 45 ? feat.substring(0, 45) + '...' : feat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Standard: 970x300 ─────────────────────────────────────────────────────

export function StandardTemplate(data: TemplateData) {
  const accent = getBrandColor(data, PRIMARY)
  const features = getTopFeatures(data, 3)

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 300,
        fontFamily: 'Inter',
        color: WHITE,
        backgroundColor: DARK,
        overflow: 'hidden',
      }}
    >
      {/* Left: text content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 530,
          padding: '32px 40px',
          gap: 16,
        }}
      >
        {data.brandName && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: accent,
            }}
          >
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>
          {data.productName.length > 60
            ? data.productName.substring(0, 60) + '...'
            : data.productName}
        </span>
        {features.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {features.map((feat, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: DARK,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span style={{ fontSize: 14, color: MUTED }}>
                  {feat.length > 55 ? feat.substring(0, 55) + '...' : feat}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: background image */}
      <div
        style={{
          display: 'flex',
          width: 440,
          height: 300,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {data.backgroundImageUrl ? (
          <img
            src={data.backgroundImageUrl}
            width={440}
            height={300}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${accent}22, ${DARK})`,
            }}
          />
        )}
        {/* Fade edge */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 80,
            height: 300,
            background: `linear-gradient(90deg, ${DARK}, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

// ─── Square: 600x600 ───────────────────────────────────────────────────────

export function SquareTemplate(data: TemplateData) {
  const accent = getBrandColor(data, PRIMARY)
  const features = getTopFeatures(data, 4)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 600,
        height: 600,
        fontFamily: 'Inter',
        color: WHITE,
        backgroundColor: DARK,
        overflow: 'hidden',
      }}
    >
      {/* Top: brand bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 48,
          backgroundColor: accent,
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: DARK,
          }}
        >
          {data.brandName ?? data.productName}
        </span>
      </div>

      {/* Middle: product image */}
      <div
        style={{
          display: 'flex',
          width: 600,
          height: 340,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {data.backgroundImageUrl ? (
          <img
            src={data.backgroundImageUrl}
            width={600}
            height={340}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, ${DARK}, ${accent}11)`,
            }}
          />
        )}
        {/* Bottom fade */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 600,
            height: 80,
            background: `linear-gradient(transparent, ${DARK})`,
          }}
        />
      </div>

      {/* Bottom: product info + features */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 32px 28px',
          gap: 14,
          flex: 1,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>
          {data.productName.length > 50
            ? data.productName.substring(0, 50) + '...'
            : data.productName}
        </span>
        {features.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {features.map((feat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid rgba(255,255,255,0.1)`,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: accent,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: MUTED }}>
                  {feat.length > 30 ? feat.substring(0, 30) + '...' : feat}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Portrait: 300x400 ─────────────────────────────────────────────────────

export function PortraitTemplate(data: TemplateData) {
  const accent = getBrandColor(data, PRIMARY)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 300,
        height: 400,
        fontFamily: 'Inter',
        color: WHITE,
        backgroundColor: DARK,
        overflow: 'hidden',
      }}
    >
      {/* Top: image */}
      <div
        style={{
          display: 'flex',
          width: 300,
          height: 220,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {data.backgroundImageUrl ? (
          <img
            src={data.backgroundImageUrl}
            width={300}
            height={220}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, ${accent}22, ${DARK})`,
            }}
          />
        )}
        {/* Bottom fade */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 300,
            height: 60,
            background: `linear-gradient(transparent, ${DARK})`,
          }}
        />
      </div>

      {/* Bottom: text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 24px 24px',
          gap: 10,
          flex: 1,
        }}
      >
        {data.brandName && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: accent,
            }}
          >
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
          {data.productName.length > 40
            ? data.productName.substring(0, 40) + '...'
            : data.productName}
        </span>
        {data.keyFeatures[0] && (
          <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>
            {data.keyFeatures[0].length > 80
              ? data.keyFeatures[0].substring(0, 80) + '...'
              : data.keyFeatures[0]}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Banner Wide: 970x130 ──────────────────────────────────────────────────

export function BannerWideTemplate(data: TemplateData) {
  const accent = getBrandColor(data, PRIMARY)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 970,
        height: 130,
        fontFamily: 'Inter',
        color: WHITE,
        background: `linear-gradient(135deg, ${DARK} 0%, #111111 50%, ${accent}15 100%)`,
        overflow: 'hidden',
        gap: 24,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          display: 'flex',
          width: 4,
          height: 60,
          backgroundColor: accent,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {data.brandName && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: accent,
            }}
          >
            {data.brandName}
          </span>
        )}
        <span
          style={{
            fontSize: 24,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          {data.productName.length > 50
            ? data.productName.substring(0, 50) + '...'
            : data.productName}
        </span>
        {data.description && (
          <span
            style={{
              fontSize: 13,
              color: MUTED,
              textAlign: 'center',
            }}
          >
            {data.description.substring(0, 70)}
          </span>
        )}
      </div>
      {/* Right accent bar */}
      <div
        style={{
          display: 'flex',
          width: 4,
          height: 60,
          backgroundColor: accent,
          borderRadius: 2,
        }}
      />
    </div>
  )
}
