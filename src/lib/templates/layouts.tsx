import type { TemplateData } from './types'

// ─── Colour system ───────────────────────────────────────────────────────────
// Three tonal palettes: cinematic (dark), product-centric (light), split (contrast)

const DARK       = '#0a0a0a'
const NEAR_DARK  = '#111827'
const SLATE      = '#1E293B'
const SLATE_MID  = '#334155'
const WHITE      = '#FFFFFF'
const OFF_WHITE  = '#F8F8F8'
const WARM_WHITE = '#FDF8F3'
const TEXT_DARK  = '#111827'
const TEXT_MID   = '#374151'
const MUTED      = '#6B7280'
const LIGHT_MUTED = '#9CA3AF'
const FALLBACK_ACCENT = '#4A90D9'
const SUCCESS    = '#10B981'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAccent(data: TemplateData): string {
  return data.brandColors?.find(Boolean) ?? FALLBACK_ACCENT
}

function getSecondary(data: TemplateData): string {
  return data.brandColors?.[1] ?? getAccent(data)
}

function getTitle(data: TemplateData): string {
  return data.headline || data.displayTitle || data.productName
}

function getSubtitle(data: TemplateData): string {
  return data.subheadline || data.tagline || ''
}

function getFeatures(data: TemplateData, count: number): string[] {
  return data.keyFeatures.filter(Boolean).slice(0, count)
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.substring(0, max - 1) + '…' : text
}

// Returns the display font family for headline elements based on brand tone.
// Keyword matching (uses .includes) so descriptive tones work too.
//
// Montserrat      → fitness / performance / bold / supplements / health / sport
// Playfair Display→ luxury / beauty / skincare / elegant / premium / sophisticated
// Lora            → natural / organic / food / botanical / herbal / earthy / wholesome
// Raleway         → fashion / apparel / minimal / modern / lifestyle / chic / style
// Nunito          → playful / fun / family / kids / friendly / casual / cheerful
// Oswald          → industrial / rugged / outdoor / tools / durable / tough / heavy
// Inter           → professional / technical / clean / default
function getDisplayFont(data: TemplateData): string {
  const tone = (data.contentTone ?? '').toLowerCase()

  const matches = (keywords: string[]) => keywords.some((k) => tone.includes(k))

  if (matches(['bold', 'fitness', 'sport', 'athletic', 'performance', 'strong', 'power', 'supplement', 'workout', 'gym', 'muscle', 'energy drink']))
    return 'Montserrat'

  if (matches(['luxury', 'premium', 'elegant', 'sophisticated', 'beauty', 'skincare', 'prestige', 'haute', 'refined', 'couture', 'upscale']))
    return 'Playfair Display'

  if (matches(['natural', 'organic', 'food', 'botanical', 'herbal', 'earthy', 'wholesome', 'nutrition', 'ingredient', 'farm', 'harvest', 'artisan']))
    return 'Lora'

  if (matches(['fashion', 'apparel', 'clothing', 'minimal', 'minimalist', 'modern', 'trendy', 'chic', 'style', 'wear', 'wardrobe', 'outfit']))
    return 'Raleway'

  if (matches(['playful', 'fun', 'family', 'kids', 'friendly', 'casual', 'cheerful', 'bright', 'colorful', 'child', 'baby', 'pet']))
    return 'Nunito'

  if (matches(['industrial', 'rugged', 'outdoor', 'tool', 'tough', 'durable', 'heavy', 'gear', 'hardware', 'construction', 'mechanic', 'tactical']))
    return 'Oswald'

  // lifestyle / professional / technical — Inter is clean and works great here
  return 'Inter'
}

// ─── HERO slot (970×600) ─────────────────────────────────────────────────────
// Cinematic full-bleed lifestyle scene.
// If product image available: headline+benefits LEFT, product image RIGHT.
// If no product image: centred overlay treatment.

export function HeroTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const title = truncate(getTitle(data), 45)
  const subtitle = truncate(getSubtitle(data), 80)
  const features = getFeatures(data, 2)
  const hasBg = Boolean(data.backgroundImageUrl)
  const hasProd = Boolean(data.productImageUrl)
  // When the AI background already has the product composited in-scene (Kontext),
  // don't render the product image again as a Satori overlay — it looks doubled.
  const showProdOverlay = hasProd && !hasBg

  // Dynamic font sizing: very short headlines punch big
  const headlineFontSize = title.length <= 20 ? 64 : title.length <= 30 ? 52 : title.length <= 40 ? 44 : 36

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 600,
        position: 'relative',
        fontFamily: 'Inter',
        overflow: 'hidden',
        backgroundColor: NEAR_DARK,
      }}
    >
      {/* Background scene */}
      {hasBg && (
        <img
          src={data.backgroundImageUrl!}
          width={970}
          height={600}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      )}
      {!hasBg && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: 970, height: 600,
            background: `linear-gradient(135deg, ${NEAR_DARK} 0%, ${SLATE} 55%, ${accent}33 100%)`,
            display: 'flex',
          }}
        />
      )}

      {/* Gradient overlay — strong left vignette for text legibility */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, width: 970, height: 600, display: 'flex',
          background: showProdOverlay
            ? `linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 40%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.0) 100%)`
            : `linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.10) 100%)`,
        }}
      />

      {/* Content layer */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '48px 56px',
          position: 'relative',
          alignItems: 'center',
        }}
      >
        {/* Left: copy — narrower when product overlay is shown, wider when AI bg fills the scene */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: showProdOverlay ? 480 : 620,
            flex: 1,
          }}
        >
          {/* Brand pill */}
          {data.brandName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
              }}
            >
              <div style={{ width: 32, height: 3, backgroundColor: accent, borderRadius: 2, display: 'flex' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: accent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                }}
              >
                {data.brandName}
              </span>
            </div>
          )}

          {/* Headline — large, confident */}
          <span
            style={{
              fontSize: headlineFontSize,
              fontWeight: 800,
              fontFamily: getDisplayFont(data),
              color: WHITE,
              lineHeight: 1.05,
              marginBottom: 18,
              wordBreak: 'break-word',
            }}
          >
            {title}
          </span>

          {/* Subheadline */}
          {subtitle && (
            <span
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.55,
                marginBottom: 30,
                maxWidth: 420,
              }}
            >
              {subtitle}
            </span>
          )}

          {/* Feature rows — max 2, clean and spaced */}
          {features.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: 3,
                      backgroundColor: accent,
                      flexShrink: 0,
                      display: 'flex',
                    }}
                  />
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.86)' }}>
                    {truncate(f, 50)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom accent line */}
          <div
            style={{
              display: 'flex',
              marginTop: 36,
              width: 56,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${accent}, ${secondary})`,
            }}
          />
        </div>

        {/* Right: product image — only when no AI background (AI already composed product in-scene) */}
        {showProdOverlay && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 320,
              height: 500,
              marginLeft: 40,
              flexShrink: 0,
            }}
          >
            <img
              src={data.productImageUrl!}
              style={{
                maxWidth: 300,
                maxHeight: 480,
                objectFit: 'contain',
                filter: 'drop-shadow(0px 32px 56px rgba(0,0,0,0.7))',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PT01 Core Benefit (600×600) ─────────────────────────────────────────────
// Split: dark gradient left with bold headline + benefits, clean white right with product photo.

export function PT01BenefitTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const title = truncate(getTitle(data), 42)
  const subtitle = truncate(getSubtitle(data), 70)
  const features = getFeatures(data, 3)
  const hasProd = Boolean(data.productImageUrl)

  const headlineFontSize = title.length <= 18 ? 34 : title.length <= 26 ? 29 : title.length <= 34 ? 25 : 22

  return (
    <div
      style={{
        display: 'flex',
        width: 600,
        height: 600,
        fontFamily: 'Inter',
        overflow: 'hidden',
      }}
    >
      {/* Left panel — dark, editorial, generous padding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 290,
          height: 600,
          background: `linear-gradient(155deg, ${DARK} 0%, ${NEAR_DARK} 50%, ${SLATE} 100%)`,
          padding: '40px 28px 36px',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle accent glow top-right */}
        <div
          style={{
            position: 'absolute', top: -40, right: -40,
            width: 140, height: 140, borderRadius: 70,
            background: `radial-gradient(circle, ${accent}20 0%, transparent 65%)`,
            display: 'flex',
          }}
        />

        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {/* Accent bar + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 28, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, ${secondary})`, display: 'flex' }} />
            {data.brandName && (
              <span style={{ fontSize: 9, fontWeight: 700, color: `${accent}cc`, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {data.brandName}
              </span>
            )}
          </div>

          {/* Headline */}
          <span
            style={{
              fontSize: headlineFontSize,
              fontWeight: 800,
              fontFamily: getDisplayFont(data),
              color: WHITE,
              lineHeight: 1.15,
              marginBottom: 14,
              wordBreak: 'break-word',
            }}
          >
            {title}
          </span>

          {/* Subheadline */}
          {subtitle && (
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Feature list — bottom section */}
        {features.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 16, height: 16, borderRadius: 8,
                    backgroundColor: accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 800, color: WHITE }}>✓</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.82)', lineHeight: 1.4 }}>
                  {truncate(f, 36)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right panel — clean light background, product hero */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: 600,
          background: hasProd
            ? `linear-gradient(160deg, ${accent}16 0%, ${accent}06 50%, ${WARM_WHITE} 100%)`
            : WARM_WHITE,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow centred behind product */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: 300, height: 300, borderRadius: 150,
            background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {hasProd ? (
          <img
            src={data.productImageUrl!}
            style={{
              maxWidth: 270,
              maxHeight: 400,
              objectFit: 'contain',
              filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.22))',
              position: 'relative',
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${accent}33, ${secondary}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: accent, display: 'flex' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK, textAlign: 'center' }}>
              {truncate(data.productName, 36)}
            </span>
          </div>
        )}

        {/* Bottom accent strip */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0,
            width: '100%', height: 4,
            background: `linear-gradient(90deg, ${accent}, ${secondary})`,
            display: 'flex',
          }}
        />
      </div>
    </div>
  )
}

// ─── PT02 Problem → Solution (970×300) ───────────────────────────────────────
// Before / After split with arrow divider. No AI background — the split IS the design.

export function PT02ProblemSolutionTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const title = truncate(getTitle(data), 55)
  const subtitle = truncate(getSubtitle(data), 80)
  const features = getFeatures(data, 2)
  const hasProd = Boolean(data.productImageUrl)
  const hasBg = Boolean(data.backgroundImageUrl)

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 300,
        fontFamily: 'Inter',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Full-bleed background if available */}
      {hasBg && (
        <img
          src={data.backgroundImageUrl!}
          width={970} height={300}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      )}

      {/* LEFT — Problem panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 420,
          height: 300,
          backgroundColor: hasBg ? 'rgba(17,24,39,0.88)' : SLATE,
          padding: '28px 36px',
          justifyContent: 'center',
          gap: 10,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#EF4444',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: 4,
          }}
        >
          The Challenge
        </span>

        <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, fontStyle: 'italic' }}>
          {subtitle || truncate(data.description || `Most people struggle to get consistent results without the right solution.`, 120)}
        </span>

        {features.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {features.slice(0, 2).map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  borderRadius: 4,
                  padding: '5px 10px',
                }}
              >
                <span style={{ fontSize: 11, color: '#FCA5A5' }}>✗</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>
                  {truncate(f, 28)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CENTER — Arrow divider */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 130,
          height: 300,
          backgroundColor: hasBg ? 'rgba(30,41,59,0.92)' : SLATE_MID,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 2, height: 24, backgroundColor: `${accent}66`, display: 'flex' }} />
          <div
            style={{
              width: 48, height: 48, borderRadius: 24,
              backgroundColor: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 22, color: WHITE, fontWeight: 700 }}>→</span>
          </div>
          <div style={{ width: 2, height: 24, backgroundColor: `${accent}66`, display: 'flex' }} />
        </div>
        {data.brandName && (
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }}>
            {data.brandName}
          </span>
        )}
      </div>

      {/* RIGHT — Solution panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: 300,
          backgroundColor: hasBg ? 'rgba(255,255,255,0.94)' : OFF_WHITE,
          padding: '28px 32px',
          justifyContent: 'center',
          gap: 10,
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: SUCCESS,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: 4,
          }}
        >
          The Solution
        </span>

        <span
          style={{
            fontSize: title.length > 40 ? 20 : 24,
            fontWeight: 800,
            fontFamily: getDisplayFont(data),
            color: TEXT_DARK,
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          {title}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {getFeatures(data, 3).map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 18, height: 18, borderRadius: 9,
                  backgroundColor: `${SUCCESS}22`,
                  border: `1.5px solid ${SUCCESS}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: SUCCESS }}>✓</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_MID }}>{truncate(f, 38)}</span>
            </div>
          ))}
        </div>

        {/* Product image if available — bottom right */}
        {hasProd && (
          <img
            src={data.productImageUrl!}
            style={{
              position: 'absolute',
              right: 16, bottom: 0,
              maxWidth: 100, maxHeight: 220,
              objectFit: 'contain',
              filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.12))',
            }}
          />
        )}

        {/* Accent bottom strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0,
            width: '100%', height: 4,
            background: `linear-gradient(90deg, ${accent}, ${getSecondary(data)})`,
            display: 'flex',
          }}
        />
      </div>
    </div>
  )
}

// ─── PT03 How It Works (970×600) ─────────────────────────────────────────────
// 3-column step timeline with large step numbers. Clean, instructional.

export function PT03HowItWorksTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const title = truncate(getTitle(data), 55)
  const features = getFeatures(data, 3)
  const hasBg = Boolean(data.backgroundImageUrl)

  // If fewer than 3 features, pad with generic steps
  const steps = features.length >= 3
    ? features.slice(0, 3)
    : [...features, ...['Get Started', 'See Results', 'Feel the Difference'].slice(features.length)]

  const stepLabels = ['Step 01', 'Step 02', 'Step 03']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 970,
        height: 600,
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: NEAR_DARK,
      }}
    >
      {hasBg ? (
        <>
          <img
            src={data.backgroundImageUrl!}
            width={970} height={600}
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: 970, height: 600, display: 'flex',
              background: 'rgba(10,10,10,0.72)',
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: 970, height: 600, display: 'flex',
            background: `linear-gradient(160deg, ${NEAR_DARK} 0%, ${SLATE} 100%)`,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '48px 56px',
          position: 'relative',
          gap: 40,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: accent,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            How It Works
          </span>
          <span style={{ fontSize: 36, fontWeight: 800, fontFamily: getDisplayFont(data), color: WHITE, lineHeight: 1.15 }}>
            {title}
          </span>
        </div>

        {/* 3 Step cards */}
        <div style={{ display: 'flex', gap: 20, flex: 1 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '28px 24px',
                gap: 14,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent bar per card */}
              <div
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: 3, display: 'flex',
                  backgroundColor: i === 0 ? accent : i === 1 ? secondary : `${accent}88`,
                }}
              />

              {/* Step label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: `${accent}cc`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                }}
              >
                {stepLabels[i]}
              </span>

              {/* Big step number */}
              <span
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: `${accent}25`,
                  lineHeight: 1,
                  fontFamily: getDisplayFont(data),
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Step content */}
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: WHITE,
                  lineHeight: 1.4,
                }}
              >
                {truncate(step, 60)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer — product + brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, ${secondary})`, display: 'flex' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
              {data.brandName || data.productName}
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {data.productName}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── PT04 What's Inside (600×600) ────────────────────────────────────────────
// Product image centred, 4 feature callout bubbles in corners. Scalable-style ingredient grid.

export function PT04FeatureGridTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const features = getFeatures(data, 4)
  const hasProd = Boolean(data.productImageUrl)

  // Pad to 4 items
  while (features.length < 4) features.push(data.productName)

  const bubblePositions = [
    { top: 28, left: 28 },
    { top: 28, right: 28 },
    { bottom: 28, left: 28 },
    { bottom: 28, right: 28 },
  ]

  const bubbleColors = [accent, secondary, `${accent}cc`, `${secondary}cc`]

  return (
    <div
      style={{
        display: 'flex',
        width: 600,
        height: 600,
        fontFamily: 'Inter',
        // Brand-tinted background so white-background product photos visually lift off the surface
        background: `linear-gradient(145deg, ${accent}14 0%, ${WARM_WHITE} 55%, ${secondary}0E 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Stronger radial glow for product depth */}
      <div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 320, height: 320,
          borderRadius: 160,
          background: `radial-gradient(circle, ${accent}20 0%, transparent 65%)`,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '18px 24px 0',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            {data.brandName || 'Key Ingredients'}
          </span>
          <span style={{ fontSize: 18, fontWeight: 800, fontFamily: getDisplayFont(data), color: TEXT_DARK }}>
            {truncate(data.headline || "What's Inside", 36)}
          </span>
        </div>
      </div>

      {/* Centre product image */}
      <div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 200, height: 240,
        }}
      >
        {hasProd ? (
          <img
            src={data.productImageUrl!}
            style={{
              maxWidth: 196,
              maxHeight: 236,
              objectFit: 'contain',
              filter: 'drop-shadow(0px 12px 28px rgba(0,0,0,0.2))',
            }}
          />
        ) : (
          <div
            style={{
              width: 120, height: 120, borderRadius: 60,
              background: `linear-gradient(135deg, ${accent}33, ${secondary}33)`,
              borderWidth: 2, borderStyle: 'solid', borderColor: `${accent}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: accent, textAlign: 'center', padding: 12 }}>
              {truncate(data.productName, 20)}
            </span>
          </div>
        )}
      </div>

      {/* Feature callout bubbles — one per corner */}
      {features.slice(0, 4).map((feature, i) => {
        const pos = bubblePositions[i]
        const color = bubbleColors[i]
        const isRight = 'right' in pos

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              display: 'flex',
              flexDirection: 'column',
              alignItems: isRight ? 'flex-end' : 'flex-start',
              gap: 4,
              maxWidth: 140,
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: `${color}20`,
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: color }}>
                {String(i + 1)}
              </span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: TEXT_DARK,
                lineHeight: 1.3,
                textAlign: isRight ? 'right' : 'left',
              }}
            >
              {truncate(feature, 32)}
            </span>
          </div>
        )
      })}

      {/* Bottom accent strip */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: 4,
          background: `linear-gradient(90deg, ${accent}, ${secondary})`,
          display: 'flex',
        }}
      />
    </div>
  )
}

// ─── PT05 Feel & Detail (300×400) ────────────────────────────────────────────
// Full-bleed lifestyle/close-up. Let the Kontext-generated image do 90% of the work.
// Minimal text at bottom only.

export function PT05DetailTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const title = truncate(getTitle(data), 40)
  const subtitle = truncate(getSubtitle(data), 60)
  const hasBg = Boolean(data.backgroundImageUrl)
  const hasProd = Boolean(data.productImageUrl)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 300,
        height: 400,
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: NEAR_DARK,
      }}
    >
      {/* Full-bleed background */}
      {hasBg && (
        <img
          src={data.backgroundImageUrl!}
          width={300} height={400}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      )}
      {!hasBg && hasProd && (
        <img
          src={data.productImageUrl!}
          width={300} height={400}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
      )}
      {!hasBg && !hasProd && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: 300, height: 400, display: 'flex',
            background: `linear-gradient(160deg, ${SLATE} 0%, ${accent}44 100%)`,
          }}
        />
      )}

      {/* Shallow bottom gradient — only bottom 40% */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, width: 300, height: 180, display: 'flex',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.0) 100%)',
        }}
      />

      {/* Text — bottom only */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', flexDirection: 'column',
          padding: '0 20px 20px',
          gap: 6,
        }}
      >
        {data.brandName && (
          <span style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: getDisplayFont(data), color: WHITE, lineHeight: 1.2 }}>
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.78)', lineHeight: 1.4 }}>
            {subtitle}
          </span>
        )}
        <div style={{ width: 28, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, ${secondary})`, marginTop: 4, display: 'flex' }} />
      </div>
    </div>
  )
}

// ─── PT06 Who It's For (970×300) ─────────────────────────────────────────────
// Product image left, 2×3 compatibility badge grid right. Clean graphic design.

export function PT06CompatibilityTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const title = truncate(data.headline || "Works With Your Lifestyle", 45)
  const subtitle = truncate(getSubtitle(data), 70)
  const features = getFeatures(data, 6)
  const hasProd = Boolean(data.productImageUrl)
  const hasBg = Boolean(data.backgroundImageUrl)

  // Pad to 6 badges
  const badges = [...features]
  const fallbackBadges = ['Clean', 'Natural', 'Premium', 'Trusted', 'Quality', 'Pure']
  while (badges.length < 6) badges.push(fallbackBadges[badges.length] || 'Quality')

  const badgeColors = [accent, secondary, `${accent}cc`, `${secondary}88`, accent, secondary]

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 300,
        fontFamily: 'Inter',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: OFF_WHITE,
      }}
    >
      {hasBg && (
        <>
          <img
            src={data.backgroundImageUrl!}
            width={970} height={300}
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover', opacity: 0.12 }}
          />
        </>
      )}

      {/* LEFT — product image panel (brand-tinted so white-bg products float off the surface) */}
      <div
        style={{
          display: 'flex',
          width: 260,
          height: 300,
          background: hasProd
            ? `linear-gradient(160deg, ${accent}12 0%, ${accent}06 100%)`
            : `linear-gradient(160deg, ${accent}18 0%, ${WARM_WHITE} 100%)`,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRight: `1px solid rgba(0,0,0,0.06)`,
          position: 'relative',
        }}
      >
        {hasProd ? (
          <img
            src={data.productImageUrl!}
            style={{
              maxWidth: 200, maxHeight: 260,
              objectFit: 'contain',
              filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.12))',
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: accent, display: 'flex' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_MID, textAlign: 'center' }}>
              {truncate(data.productName, 24)}
            </span>
          </div>
        )}

        {/* Left edge accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: `linear-gradient(180deg, ${accent}, ${secondary})`, display: 'flex' }} />
      </div>

      {/* CENTRE — headline + badge grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '24px 36px',
          gap: 16,
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.brandName && (
            <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
              {data.brandName}
            </span>
          )}
          <span style={{ fontSize: 22, fontWeight: 800, fontFamily: getDisplayFont(data), color: TEXT_DARK, lineHeight: 1.2 }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ fontSize: 12, fontWeight: 400, color: MUTED, lineHeight: 1.4 }}>
              {subtitle}
            </span>
          )}
        </div>

        {/* 2×3 badge grid */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {badges.map((badge, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: WHITE,
                borderWidth: 1.5, borderStyle: 'solid', borderColor: `${badgeColors[i % badgeColors.length]}44`,
                borderRadius: 8,
                padding: '7px 12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: 11,
                  backgroundColor: `${badgeColors[i % badgeColors.length]}22`,
                  border: `1.5px solid ${badgeColors[i % badgeColors.length]}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 11, color: badgeColors[i % badgeColors.length], fontWeight: 700 }}>✓</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_DARK, whiteSpace: 'nowrap' }}>
                {truncate(badge, 22)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PT07 Social Proof (600×600) ─────────────────────────────────────────────
// Warm, human review quote card. Ideogram generates the background in design mode.

export function PT07SocialProofTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const secondary = getSecondary(data)
  const hasBg = Boolean(data.backgroundImageUrl)
  const quote = truncate(
    data.reviewHighlight || data.subheadline || `This product completely changed my life. I can't imagine going back.`,
    160
  )
  const title = truncate(data.headline || "Real Results, Real People", 45)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 600,
        height: 600,
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: WARM_WHITE,
      }}
    >
      {/* Background from Ideogram (design mode) */}
      {hasBg && (
        <>
          <img
            src={data.backgroundImageUrl!}
            width={600} height={600}
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: 600, height: 600, display: 'flex',
              backgroundColor: 'rgba(253,248,243,0.88)',
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '44px 48px',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Top: stars + brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ fontSize: 20, color: '#F59E0B' }}>★</span>
            ))}
          </div>
          {data.brandName && (
            <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
              {data.brandName}
            </span>
          )}
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 800, fontFamily: getDisplayFont(data), color: TEXT_DARK, lineHeight: 1.2, marginBottom: 8 }}>
            {title}
          </span>
          <div style={{ width: 40, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${accent}, ${secondary})`, display: 'flex' }} />
        </div>

        {/* Quote block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: WHITE,
            borderRadius: 14,
            padding: '28px 32px',
            gap: 0,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            border: `1px solid rgba(0,0,0,0.05)`,
            flex: 1,
            margin: '16px 0',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Accent left stripe */}
          <div
            style={{
              position: 'absolute', top: 0, left: 0,
              width: 4, height: '100%',
              background: `linear-gradient(180deg, ${accent}, ${secondary})`,
              display: 'flex',
            }}
          />

          {/* Large decorative quote mark */}
          <span
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: `${accent}28`,
              lineHeight: 0.7,
              marginBottom: 12,
              fontFamily: 'Georgia, serif',
            }}
          >
            "
          </span>

          <span
            style={{
              fontSize: 17,
              fontWeight: 400,
              color: TEXT_DARK,
              lineHeight: 1.65,
              fontStyle: 'italic',
            }}
          >
            {quote}
          </span>
        </div>

        {/* Attribution */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 18,
                background: `linear-gradient(135deg, ${accent}, ${secondary})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>✓</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_DARK }}>Verified Amazon Customer</span>
              <span style={{ fontSize: 10, fontWeight: 400, color: MUTED }}>Verified Purchase</span>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: LIGHT_MUTED }}>
            {truncate(data.productName, 24)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Backward-compat format-based templates ──────────────────────────────────
// These are used when slotId is not set (legacy / direct format calls).

export function StandardTemplate(data: TemplateData) {
  // Route to PT06 (wide) if comparison, PT02 if problem_solution, etc.
  const intent = data.intent ?? 'lifestyle'
  if (intent === 'problem_solution') return PT02ProblemSolutionTemplate(data)
  if (intent === 'comparison') return PT06CompatibilityTemplate(data)
  return PT02ProblemSolutionTemplate(data)  // default for standard format
}

export function SquareTemplate(data: TemplateData) {
  const intent = data.intent ?? 'lifestyle'
  if (intent === 'social_proof') return PT07SocialProofTemplate(data)
  if (intent === 'feature_grid') return PT04FeatureGridTemplate(data)
  return PT01BenefitTemplate(data)
}

export function PortraitTemplate(data: TemplateData) {
  return PT05DetailTemplate(data)
}

export function BannerWideTemplate(data: TemplateData) {
  const accent = getAccent(data)
  const title = truncate(getTitle(data), 60)
  const subtitle = truncate(getSubtitle(data), 80)

  return (
    <div
      style={{
        display: 'flex',
        width: 970,
        height: 130,
        fontFamily: 'Inter',
        backgroundColor: NEAR_DARK,
        alignItems: 'center',
        padding: '0 40px',
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: 4, height: 40, borderRadius: 2, backgroundColor: accent, flexShrink: 0, display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {data.brandName && (
          <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            {data.brandName}
          </span>
        )}
        <span style={{ fontSize: 22, fontWeight: 800, color: WHITE }}>{title}</span>
        {subtitle && (
          <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.65)' }}>{subtitle}</span>
        )}
      </div>
      <div style={{ width: 4, height: 40, borderRadius: 2, backgroundColor: accent, flexShrink: 0, display: 'flex' }} />
    </div>
  )
}
