import type { TemplateData } from './types'

const FALLBACK_ACCENT = '#4A90D9'
const DARK = '#0a0a0a'
const WHITE = '#f5f5f5'
const MUTED = '#a3a3a3'

function getAccent(data: TemplateData): string {
  return data.brandColors?.find(Boolean) ?? FALLBACK_ACCENT
}

function getSecondaryColor(data: TemplateData): string {
  return data.brandColors?.[1] ?? data.brandColors?.[0] ?? FALLBACK_ACCENT
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

// ─── Hero: 970x600 ──────────────────────────────────────────────────────────

export function HeroTemplate(data: TemplateData) {
  const intent = data.intent ?? 'lifestyle'
  if (intent === 'benefit') return HeroBenefitVariant(data)
  if (intent === 'problem_solution') return HeroProblemSolutionVariant(data)
  return HeroLifestyleVariant(data)
}

// Hero v1 — Lifestyle: cinematic full-bleed with overlay text
function HeroLifestyleVariant(data: TemplateData) {
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
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={970}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 970,
            height: 600,
            background: `linear-gradient(135deg, ${DARK} 0%, #1a1a2e 50%, ${accent}33 100%)`,
            display: 'flex',
          }}
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

// Hero v2 — Benefit: bold split, giant value prop left / image right
function HeroBenefitVariant(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondaryColor(data)
  const title = getTitle(data)
  const benefit = data.tagline || data.description || title

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 600,
        fontFamily: 'Inter',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 520,
          height: 600,
          padding: '60px 56px',
          background: `linear-gradient(160deg, ${DARK} 0%, #111 100%)`,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 520,
            height: 5,
            background: `linear-gradient(90deg, ${accent}, ${secondary})`,
          }}
        />

        {data.brandName && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: accent,
              marginBottom: 20,
              display: 'flex',
            }}
          >
            {data.brandName}
          </span>
        )}

        <span
          style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.0,
            color: WHITE,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {truncate(benefit, 55)}
        </span>

        <div
          style={{
            display: 'flex',
            marginTop: 24,
            width: 60,
            height: 4,
            borderRadius: 2,
            backgroundColor: accent,
          }}
        />

        {data.keyFeatures[0] && (
          <span
            style={{
              marginTop: 20,
              fontSize: 15,
              color: MUTED,
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            {truncate(data.keyFeatures[0], 80)}
          </span>
        )}
      </div>

      {/* Right panel */}
      <div
        style={{
          display: 'flex',
          width: 450,
          height: 600,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {data.backgroundImageUrl ? (
          <img
            src={data.backgroundImageUrl}
            width={450}
            height={600}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, ${accent}33, ${secondary}22)`,
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
            height: 600,
            background: `linear-gradient(90deg, ${DARK}, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

// Hero v3 — Problem/Solution: checkmark-backed full-bleed
function HeroProblemSolutionVariant(data: TemplateData) {
  const accent = getAccent(data)
  const title = getTitle(data)
  const features = getTopFeatures(data, 2)

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 600,
        fontFamily: 'Inter',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={970}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 970,
            height: 600,
            background: `linear-gradient(135deg, #0d0d0d, ${accent}22)`,
          }}
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
          background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          padding: '60px 56px',
          maxWidth: 560,
          color: WHITE,
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
              marginBottom: 16,
              display: 'flex',
            }}
          >
            {data.brandName}
          </span>
        )}

        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1.1,
            color: WHITE,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {truncate(title, 48)}
        </span>

        {data.tagline && (
          <span
            style={{
              marginTop: 16,
              fontSize: 16,
              color: MUTED,
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            {truncate(data.tagline, 90)}
          </span>
        )}

        {features.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 28,
            }}
          >
            {features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: DARK }}>✓</span>
                </div>
                <span style={{ fontSize: 14, color: WHITE, fontWeight: 500 }}>
                  {truncate(feat, 55)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Standard: 970x300 ──────────────────────────────────────────────────────

export function StandardTemplate(data: TemplateData) {
  const intent = data.intent ?? 'lifestyle'
  if (intent === 'how_it_works') return StandardHowItWorksVariant(data)
  if (intent === 'feature_grid') return StandardFeatureGridVariant(data)
  if (intent === 'social_proof') return StandardSocialProofVariant(data)
  return StandardDefaultVariant(data)
}

// Standard v1 — Default: text left, image right
function StandardDefaultVariant(data: TemplateData) {
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
          <span style={{ fontSize: 13, color: MUTED }}>{data.tagline}</span>
        )}
        {features.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  <span style={{ fontSize: 10, fontWeight: 800, color: DARK }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 13, color: MUTED }}>{truncate(feat, 50)}</span>
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
          <img src={data.backgroundImageUrl} width={440} height={300} style={{ objectFit: 'cover' }} />
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

// Standard v2 — How It Works: 3-step numbered cards
function StandardHowItWorksVariant(data: TemplateData) {
  const accent = getAccent(data)
  const features = getTopFeatures(data, 3)
  const title = getTitle(data)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 970,
        height: 300,
        fontFamily: 'Inter',
        color: WHITE,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={970}
          height={300}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 970,
            height: 300,
            background: `linear-gradient(135deg, #111 0%, ${accent}22 100%)`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 970,
          height: 300,
          backgroundColor: 'rgba(0,0,0,0.75)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '28px 40px',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: accent,
            }}
          >
            How it works
          </span>
          <div
            style={{
              display: 'flex',
              flex: 1,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: WHITE }}>
            {truncate(title, 35)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          {(features.length > 0 ? features : ['Step 1', 'Step 2', 'Step 3']).map((feat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 10,
                padding: '18px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1 }}>
                0{i + 1}
              </span>
              <span style={{ fontSize: 13, color: WHITE, lineHeight: 1.4, fontWeight: 600 }}>
                {truncate(feat, 45)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Standard v3 — Feature Grid: 4-column feature highlights
function StandardFeatureGridVariant(data: TemplateData) {
  const accent = getAccent(data)
  const features = getTopFeatures(data, 4)
  const title = getTitle(data)

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 300,
        fontFamily: 'Inter',
        color: WHITE,
        background: `linear-gradient(135deg, ${DARK} 0%, #141414 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 200,
          padding: '32px 28px',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          gap: 8,
        }}
      >
        {data.brandName && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: accent,
            }}
          >
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
          {truncate(title, 30)}
        </span>
        {data.tagline && (
          <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
            {truncate(data.tagline, 55)}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {(features.length > 0 ? features : ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']).map((feat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '28px 22px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 32,
                height: 3,
                borderRadius: 2,
                backgroundColor: accent,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: WHITE, lineHeight: 1.35 }}>
              {truncate(feat, 40)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Standard v4 — Social Proof: customer review quote bar
function StandardSocialProofVariant(data: TemplateData) {
  const accent = getAccent(data)
  const review = data.reviewHighlight || data.tagline || (data.keyFeatures[0] ?? '')
  const title = getTitle(data)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 970,
        height: 300,
        fontFamily: 'Inter',
        color: WHITE,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={970}
          height={300}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 970,
            height: 300,
            background: `linear-gradient(135deg, #0d0d0d, ${accent}22)`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 970,
          height: 300,
          backgroundColor: 'rgba(0,0,0,0.72)',
        }}
      />

      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          padding: '40px 56px',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: accent,
            lineHeight: 0.8,
            flexShrink: 0,
            opacity: 0.6,
          }}
        >
          &ldquo;
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: WHITE,
              lineHeight: 1.45,
              fontStyle: 'italic',
            }}
          >
            {truncate(review, 130)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: accent, fontSize: 14 }}>★★★★★</span>
            <span style={{ fontSize: 12, color: MUTED }}>Verified Amazon Customer</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
            flexShrink: 0,
            maxWidth: 200,
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
          <span style={{ fontSize: 16, fontWeight: 800, textAlign: 'right' }}>
            {truncate(title, 28)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Square: 600x600 ────────────────────────────────────────────────────────

export function SquareTemplate(data: TemplateData) {
  const intent = data.intent ?? 'lifestyle'
  if (intent === 'benefit') return SquareBenefitVariant(data)
  if (intent === 'social_proof') return SquareSocialProofVariant(data)
  if (intent === 'how_it_works') return SquareHowItWorksVariant(data)
  return SquareDefaultVariant(data)
}

// Square v1 — Default: image top, features below
function SquareDefaultVariant(data: TemplateData) {
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
          <img src={data.backgroundImageUrl} width={600} height={340} style={{ objectFit: 'cover' }} />
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
                <span style={{ fontSize: 10, color: MUTED }}>{truncate(feat, 28)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Square v2 — Benefit Focus: large bold statement centered over full-bleed bg
function SquareBenefitVariant(data: TemplateData) {
  const accent = getAccent(data)
  const title = getTitle(data)
  const claim = data.tagline || data.description || data.keyFeatures[0] || title

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 600,
        height: 600,
        fontFamily: 'Inter',
        color: WHITE,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={600}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 600,
            height: 600,
            background: `radial-gradient(circle at 50% 50%, ${accent}33 0%, ${DARK} 70%)`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 600,
          height: 600,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          padding: '60px 48px',
          gap: 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 48,
            height: 4,
            borderRadius: 2,
            backgroundColor: accent,
          }}
        />
        <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1, color: WHITE }}>
          {truncate(claim, 60)}
        </span>
        <div
          style={{
            display: 'flex',
            width: 48,
            height: 4,
            borderRadius: 2,
            backgroundColor: accent,
          }}
        />
        {data.brandName && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: accent,
              marginTop: 8,
            }}
          >
            {data.brandName}
          </span>
        )}
      </div>
    </div>
  )
}

// Square v3 — Social Proof: large quote over bg
function SquareSocialProofVariant(data: TemplateData) {
  const accent = getAccent(data)
  const review = data.reviewHighlight || data.tagline || data.keyFeatures[0] || ''
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={600}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 600,
            height: 600,
            background: `linear-gradient(180deg, #0d0d0d, ${accent}22)`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 600,
          height: 600,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          height: '100%',
          padding: '48px 44px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: accent, fontSize: 20 }}>★★★★★</span>
          {data.brandName && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: accent,
              }}
            >
              {data.brandName}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: accent,
              lineHeight: 0.7,
              opacity: 0.5,
            }}
          >
            &ldquo;
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: WHITE,
              lineHeight: 1.45,
              fontStyle: 'italic',
            }}
          >
            {truncate(review, 100)}
          </span>
          <span style={{ fontSize: 12, color: MUTED }}>— Verified Amazon Customer</span>
        </div>

        <span style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>
          {truncate(title, 40)}
        </span>
      </div>
    </div>
  )
}

// Square v4 — How It Works: 3 numbered step cards
function SquareHowItWorksVariant(data: TemplateData) {
  const accent = getAccent(data)
  const features = getTopFeatures(data, 3)
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
        background: `linear-gradient(160deg, #0d0d0d 0%, #141414 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 32px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.brandName && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: accent,
              }}
            >
              {data.brandName}
            </span>
          )}
          <span style={{ fontSize: 18, fontWeight: 800 }}>{truncate(title, 30)}</span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: accent,
          }}
        >
          How it works
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          padding: '24px 32px 32px',
          gap: 16,
        }}
      >
        {(features.length > 0 ? features : ['Step 1', 'Step 2', 'Step 3']).map((feat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              gap: 20,
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              padding: '18px 24px',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 44,
                height: 44,
                borderRadius: 22,
                border: `2px solid ${accent}`,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, color: accent }}>{i + 1}</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: WHITE, lineHeight: 1.35 }}>
              {truncate(feat, 55)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Portrait: 300x400 ──────────────────────────────────────────────────────

export function PortraitTemplate(data: TemplateData) {
  const intent = data.intent ?? 'lifestyle'
  if (intent === 'social_proof') return PortraitSocialProofVariant(data)
  if (intent === 'benefit') return PortraitBenefitVariant(data)
  return PortraitDefaultVariant(data)
}

// Portrait v1 — Default: image top, text below
function PortraitDefaultVariant(data: TemplateData) {
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
          <img src={data.backgroundImageUrl} width={300} height={220} style={{ objectFit: 'cover' }} />
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
          <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{data.tagline}</span>
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

// Portrait v2 — Social Proof: review card
function PortraitSocialProofVariant(data: TemplateData) {
  const accent = getAccent(data)
  const review = data.reviewHighlight || data.tagline || data.keyFeatures[0] || ''
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={300}
          height={400}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 300,
            height: 400,
            background: `linear-gradient(180deg, ${accent}22, #0d0d0d)`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: 400,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 60%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          height: '100%',
          padding: '24px 22px',
          gap: 12,
        }}
      >
        <span style={{ color: accent, fontSize: 14 }}>★★★★★</span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: WHITE,
            lineHeight: 1.4,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{truncate(review, 80)}&rdquo;
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingTop: 8,
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span style={{ fontSize: 10, color: MUTED }}>Verified Customer</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{truncate(title, 30)}</span>
        </div>
      </div>
    </div>
  )
}

// Portrait v3 — Benefit: vertical benefit statement with accent stripe
function PortraitBenefitVariant(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondaryColor(data)
  const title = getTitle(data)
  const claim = data.tagline || data.keyFeatures[0] || data.description || title

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 300,
        height: 400,
        fontFamily: 'Inter',
        color: WHITE,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {data.backgroundImageUrl ? (
        <img
          src={data.backgroundImageUrl}
          width={300}
          height={400}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 300,
            height: 400,
            background: `linear-gradient(180deg, ${accent}44, ${secondary}22, #0d0d0d)`,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: 400,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 0,
          top: 0,
          width: 4,
          height: 400,
          background: `linear-gradient(180deg, ${accent}, ${secondary})`,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          height: '100%',
          padding: '28px 22px 28px 26px',
          gap: 10,
        }}
      >
        {data.brandName && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: accent,
            }}
          >
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>
          {truncate(claim, 60)}
        </span>
        <span style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
          {truncate(title, 45)}
        </span>
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
        <span style={{ fontSize: 24, fontWeight: 800, textAlign: 'center' }}>
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
