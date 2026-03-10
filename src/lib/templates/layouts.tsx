import type { TemplateData } from './types'

const FALLBACK_ACCENT = '#4A90D9'
const DARK = '#0a0a0a'
const WHITE = '#f5f5f5'
const MUTED = '#a3a3a3'

function getAccent(data: TemplateData): string {
  return data.brandColors?.find(Boolean) ?? FALLBACK_ACCENT
}

function getTitle(data: TemplateData): string {
  return data.displayTitle || data.productName
}

function getTopFeatures(data: TemplateData, count: number): string[] {
  return data.keyFeatures.filter(Boolean).slice(0, count)
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.substring(0, max) + '...' : text
}

// ─── Hero: 970x600 ─────────────────────────────────────────────────────────

export function HeroTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const features = getTopFeatures(data, 3)
  const title = getTitle(data)

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
      {data.backgroundImageUrl && (
        <img
          src={data.backgroundImageUrl}
          width={970}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      )}

      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 970,
          height: 600,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.65) 100%)',
        }}
      />

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
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: accent,
            }}
          >
            {data.brandName ?? ''}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontSize: 42,
                fontWeight: 800,
                lineHeight: 1.1,
                maxWidth: 700,
              }}
            >
              {truncate(title, 50)}
            </span>
            {data.tagline && (
              <span
                style={{
                  fontSize: 18,
                  color: MUTED,
                  lineHeight: 1.4,
                  maxWidth: 600,
                }}
              >
                {data.tagline}
              </span>
            )}
            {!data.tagline && data.description && (
              <span
                style={{
                  fontSize: 16,
                  color: MUTED,
                  lineHeight: 1.4,
                  maxWidth: 600,
                }}
              >
                {truncate(data.description, 100)}
              </span>
            )}
          </div>

          {features.length > 0 && (
            <div style={{ display: 'flex', gap: 12 }}>
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
                    border: '1px solid rgba(255,255,255,0.1)',
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
                  <span style={{ fontSize: 12, fontWeight: 500, color: WHITE }}>
                    {truncate(feat, 40)}
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
  const accent = getAccent(data)
  const features = getTopFeatures(data, 3)
  const title = getTitle(data)

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 530,
          padding: '32px 40px',
          gap: 14,
        }}
      >
        {data.brandName && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: accent,
            }}
          >
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15 }}>
          {truncate(title, 45)}
        </span>
        {data.tagline && (
          <span style={{ fontSize: 13, color: MUTED }}>
            {data.tagline}
          </span>
        )}
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
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, color: DARK }}>
                    {i + 1}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: MUTED }}>
                  {truncate(feat, 50)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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
  const accent = getAccent(data)
  const features = getTopFeatures(data, 4)
  const title = getTitle(data)

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
          backgroundColor: accent,
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: DARK,
          }}
        >
          {data.brandName ?? truncate(title, 30)}
        </span>
      </div>

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

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 28px 24px',
          gap: 12,
          flex: 1,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
          {truncate(title, 40)}
        </span>
        {features.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {features.map((feat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: accent,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 10, color: MUTED }}>
                  {truncate(feat, 28)}
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
  const accent = getAccent(data)
  const title = getTitle(data)

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

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 22px 22px',
          gap: 8,
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
        <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>
          {truncate(title, 35)}
        </span>
        {data.tagline && (
          <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
            {data.tagline}
          </span>
        )}
        {!data.tagline && data.keyFeatures[0] && (
          <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
            {truncate(data.keyFeatures[0], 70)}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Banner Wide: 970x130 ──────────────────────────────────────────────────

export function BannerWideTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const title = getTitle(data)

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
          style={{ fontSize: 24, fontWeight: 800, textAlign: 'center' }}
        >
          {truncate(title, 45)}
        </span>
        {data.tagline && (
          <span style={{ fontSize: 13, color: MUTED, textAlign: 'center' }}>
            {data.tagline}
          </span>
        )}
      </div>
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
