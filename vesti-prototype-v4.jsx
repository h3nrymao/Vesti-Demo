import React, { useState, useRef, useMemo } from "react";

// ============================================================
// VESTI — swipe-to-style prototype v0.4
// Changes:
//  - Hair overhaul: six styles (buzz, crop, bob, long, pony,
//    curls) rendered as proper back/front layers, plus colour.
//  - Real catalogue ready: run fetch-products.mjs, then swap
//    the two lines marked REAL PRODUCTS below.
// ============================================================

// REAL PRODUCTS: after running fetch-products.mjs, uncomment the
// import and the two assignment lines, and the app swipes through
// real Glassons / Princess Polly / Universal Store items with photos.
//
// import { REAL_TOPS, REAL_BOTTOMS } from "./products.js";

const TOPS = [
  { id: "t1", name: "Boxy Heavyweight Tee", brand: "Glassons", url: "https://www.glassons.com", price: 35, style: "streetwear", color: "#2E2E2E", img: null },
  { id: "t2", name: "Knit Polo", brand: "Uniqlo", url: "https://www.uniqlo.com/au/", price: 50, style: "minimal", color: "#D9D4C7", img: null },
  { id: "t3", name: "Baby Tee", brand: "Princess Polly", url: "https://www.princesspolly.com.au", price: 40, style: "y2k", color: "#F2A7C3", img: null },
  { id: "t4", name: "Oversize Blazer", brand: "ASOS", url: "https://www.asos.com/au/", price: 95, style: "office", color: "#4A4E69", img: null },
  { id: "t5", name: "Check Flannel", brand: "Universal Store", url: "https://www.universalstore.com", price: 60, style: "grunge", color: "#8C2F2F", img: null },
  { id: "t6", name: "Linen Shirt", brand: "Country Road", url: "https://www.countryroad.com.au", price: 90, style: "minimal", color: "#EDE6D6", img: null },
  { id: "t7", name: "Graphic Hoodie", brand: "Culture Kings", url: "https://www.culturekings.com.au", price: 80, style: "streetwear", color: "#1F1F1F", img: null },
  { id: "t8", name: "Corset Top", brand: "Princess Polly", url: "https://www.princesspolly.com.au", price: 55, style: "y2k", color: "#B33951", img: null },
  { id: "t9", name: "Merino Turtleneck", brand: "COS", url: "https://www.cos.com", price: 120, style: "office", color: "#2B2B2B", img: null },
  { id: "t10", name: "Band Tee", brand: "Dangerfield", url: "https://dangerfield.com.au", price: 45, style: "grunge", color: "#1C1C1C", img: null },
];

const BOTTOMS = [
  { id: "b1", name: "Wide-Leg Cargos", brand: "Glassons", url: "https://www.glassons.com", price: 55, style: "streetwear", color: "#7A8B6F", img: null },
  { id: "b2", name: "Pleated Trouser", brand: "Uniqlo", url: "https://www.uniqlo.com/au/", price: 60, style: "minimal", color: "#3B3A36", img: null },
  { id: "b3", name: "Low-Rise Denim", brand: "Princess Polly", url: "https://www.princesspolly.com.au", price: 65, style: "y2k", color: "#7BA3C9", img: null },
  { id: "b4", name: "Straight-Leg Jean", brand: "ASOS", url: "https://www.asos.com/au/", price: 70, style: "office", color: "#22223B", img: null },
  { id: "b5", name: "Ripped Black Denim", brand: "Universal Store", url: "https://www.universalstore.com", price: 75, style: "grunge", color: "#1A1A1A", img: null },
  { id: "b6", name: "Drawstring Pant", brand: "Country Road", url: "https://www.countryroad.com.au", price: 80, style: "minimal", color: "#A89F8D", img: null },
  { id: "b7", name: "Track Pant", brand: "Culture Kings", url: "https://www.culturekings.com.au", price: 60, style: "streetwear", color: "#C9C9C9", img: null },
  { id: "b8", name: "Flare Jean", brand: "Princess Polly", url: "https://www.princesspolly.com.au", price: 70, style: "y2k", color: "#33415C", img: null },
  { id: "b9", name: "Wool Trouser", brand: "COS", url: "https://www.cos.com", price: 130, style: "office", color: "#8A8578", img: null },
  { id: "b10", name: "Pleated Plaid Skirt", brand: "Dangerfield", url: "https://dangerfield.com.au", price: 55, style: "grunge", color: "#5E1F1F", img: null },
];

// REAL PRODUCTS: uncomment after running fetch-products.mjs
// const TOPS = REAL_TOPS;
// const BOTTOMS = REAL_BOTTOMS;

const DECK_PAIRS = Array.from({ length: Math.min(TOPS.length, BOTTOMS.length, 15) }, (_, i) => [i % TOPS.length, i % BOTTOMS.length])
  .concat([[0, 6], [2, 7], [4, 9], [1, 5], [8, 3]].filter(([a, b]) => a < TOPS.length && b < BOTTOMS.length));

const STYLES = ["streetwear", "minimal", "y2k", "office", "grunge"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ---------- Hair system ----------
// Each style renders in two layers: `back` paints behind the head and
// shoulders, `front` paints over the head. Head: cx 100, cy 28, r 30,
// frame cropped at y=30 so the crown stays out of shot.
const HAIR_STYLES = {
  buzz: {
    label: "Buzz",
    back: () => null,
    front: (c) => (
      <g opacity="0.85">
        <path d="M71 30 Q70 40 74 48 L79 46 Q76 38 77 30 Z" fill={c} />
        <path d="M129 30 Q130 40 126 48 L121 46 Q124 38 123 30 Z" fill={c} />
      </g>
    ),
  },
  crop: {
    label: "Crop",
    back: () => null,
    front: (c) => (
      <g>
        <path d="M70 30 Q68 44 75 54 L83 50 Q77 41 78 30 Z" fill={c} />
        <path d="M130 30 Q132 44 125 54 L117 50 Q123 41 122 30 Z" fill={c} />
        <path d="M78 30 L122 30 Q118 36 100 36 Q82 36 78 30 Z" fill={c} />
      </g>
    ),
  },
  bob: {
    label: "Bob",
    back: (c) => <path d="M64 30 Q60 56 70 66 Q84 72 100 72 Q116 72 130 66 Q140 56 136 30 Z" fill={c} />,
    front: (c) => (
      <g>
        <path d="M64 30 Q64 48 74 60 Q80 64 84 62 Q76 50 77 30 Z" fill={c} />
        <path d="M136 30 Q136 48 126 60 Q120 64 116 62 Q124 50 123 30 Z" fill={c} />
      </g>
    ),
  },
  long: {
    label: "Long",
    back: (c) => <path d="M62 30 Q56 70 62 112 Q70 120 80 116 Q74 80 76 40 L124 40 Q126 80 120 116 Q130 120 138 112 Q144 70 138 30 Z" fill={c} />,
    front: (c) => (
      <g>
        <path d="M66 30 Q64 60 72 92 Q78 96 82 92 Q75 62 78 30 Z" fill={c} />
        <path d="M134 30 Q136 60 128 92 Q122 96 118 92 Q125 62 122 30 Z" fill={c} />
      </g>
    ),
  },
  pony: {
    label: "Pony",
    back: (c) => <path d="M126 32 Q142 50 138 80 Q136 102 128 112 Q122 110 122 102 Q130 84 128 62 Q126 44 118 36 Z" fill={c} />,
    front: (c) => (
      <g>
        <path d="M70 30 Q69 42 75 50 L81 47 Q77 39 78 30 Z" fill={c} />
        <path d="M130 30 Q131 42 125 50 L119 47 Q123 39 122 30 Z" fill={c} />
        <path d="M76 30 L124 30 Q120 35 100 35 Q80 35 76 30 Z" fill={c} />
      </g>
    ),
  },
  curls: {
    label: "Curls",
    back: (c) => (
      <g>
        <circle cx="68" cy="40" r="13" fill={c} />
        <circle cx="132" cy="40" r="13" fill={c} />
        <circle cx="64" cy="58" r="11" fill={c} />
        <circle cx="136" cy="58" r="11" fill={c} />
        <circle cx="74" cy="70" r="10" fill={c} />
        <circle cx="126" cy="70" r="10" fill={c} />
      </g>
    ),
    front: (c) => (
      <g>
        <circle cx="76" cy="34" r="10" fill={c} />
        <circle cx="124" cy="34" r="10" fill={c} />
        <circle cx="90" cy="31" r="9" fill={c} />
        <circle cx="110" cy="31" r="9" fill={c} />
      </g>
    ),
  },
};

function proportionsFrom(sizes) {
  const shirtIdx = SHIRT_SIZES.indexOf(sizes.shirt);
  const torso = 0.84 + shirtIdx * 0.07;
  const waistNum = Number(sizes.waist) || 32;
  const hips = 0.8 + Math.min(Math.max((waistNum - 24) / 22, 0), 1) * 0.42;
  const shoeNum = Number(sizes.shoe) || 9;
  const shoe = 28 + Math.min(Math.max((shoeNum - 5) / 9, 0), 1) * 14;
  return { torso, hips, shoe };
}

function Avatar({ skin, hairStyle, hairColor, torso, hips, shoe, top, bottom }) {
  const tx = (x) => 100 + (x - 100) * torso;
  const hx = (x) => 100 + (x - 100) * hips;
  const H = HAIR_STYLES[hairStyle] || HAIR_STYLES.crop;
  return (
    <svg viewBox="0 30 200 290" style={{ width: "100%", height: "100%" }}>
      {/* hair back layer */}
      {H.back(hairColor)}
      {/* head, crown cropped above frame */}
      <circle cx="100" cy="28" r="30" fill={skin} />
      <ellipse cx="100" cy="50" rx="16" ry="8" fill={skin} />
      <rect x="92" y="54" width="16" height="14" rx="4" fill={skin} />
      {/* arms */}
      <rect x={tx(46)} y="84" width="14" height="84" rx="7" fill={skin} />
      <rect x={tx(140)} y="84" width="14" height="84" rx="7" fill={skin} />
      {/* top garment */}
      <path d={`M${tx(70)} 74 L${tx(130)} 74 L${tx(150)} 92 L${tx(141)} 132 L${tx(129)} 126 L${tx(128)} 172 L${tx(72)} 172 L${tx(71)} 126 L${tx(59)} 132 L${tx(50)} 92 Z`} fill={top} />
      <rect x={tx(46)} y="84" width="14" height="34" rx="7" fill={top} />
      <rect x={tx(140)} y="84" width="14" height="34" rx="7" fill={top} />
      {/* bottom garment */}
      <path d={`M${hx(74)} 172 L${hx(126)} 172 L${hx(131)} 258 L${hx(106)} 258 L100 206 L${hx(94)} 258 L${hx(69)} 258 Z`} fill={bottom} />
      {/* shoes */}
      <rect x={100 - shoe - 2} y="258" width={shoe} height="13" rx="6" fill="#222" />
      <rect x={102} y="258" width={shoe} height="13" rx="6" fill="#222" />
      {/* hair front layer */}
      {H.front(hairColor)}
    </svg>
  );
}

function emptyProfile() {
  const styles = {};
  STYLES.forEach((s) => (styles[s] = 0));
  return { styles, swipes: 0, likes: 0, priceSum: 0, priceLikes: 0 };
}
function learn(p, items, liked) {
  const next = { ...p, styles: { ...p.styles } };
  next.swipes += 1;
  items.forEach((it) => { if (next.styles[it.style] === undefined) next.styles[it.style] = 0; next.styles[it.style] += liked ? 1 : -0.5; });
  if (liked) {
    next.likes += 1;
    next.priceSum += items.reduce((s, i) => s + i.price, 0);
    next.priceLikes += 1;
  }
  return next;
}

export default function Vesti() {
  const ink = "#16161A";
  const paper = "#F6F5F1";
  const cobalt = "#2742F5";
  const red = "#B3261E";

  const [screen, setScreen] = useState("disclaimer");
  const [sizes, setSizes] = useState({ shirt: "M", waist: "32", shoe: "9" });
  const [skin, setSkin] = useState("#C8A88A");
  const [hairColor, setHairColor] = useState("#3B2A1F");
  const [hairStyle, setHairStyle] = useState("crop");

  const [deckIdx, setDeckIdx] = useState(0);
  const [liked, setLiked] = useState([]);
  const [profile, setProfile] = useState(emptyProfile());
  const [drag, setDrag] = useState({ x: 0, active: false });
  const startX = useRef(0);
  const [mixTop, setMixTop] = useState(0);
  const [mixBottom, setMixBottom] = useState(0);
  const [match, setMatch] = useState(null);

  const { torso, hips, shoe } = useMemo(() => proportionsFrom(sizes), [sizes]);

  const pair = DECK_PAIRS[deckIdx];
  const currentTop = pair ? TOPS[pair[0]] : null;
  const currentBottom = pair ? BOTTOMS[pair[1]] : null;

  const avatarProps = { skin, hairStyle, hairColor, torso, hips, shoe };

  const swipe = (likedIt) => {
    if (!pair) return;
    const items = [currentTop, currentBottom];
    setProfile((p) => learn(p, items, likedIt));
    if (likedIt) {
      setLiked((l) => [{ items, ts: Date.now() }, ...l]);
      setMatch({ items });
    }
    setDeckIdx((i) => i + 1);
    setDrag({ x: 0, active: false });
  };

  const onPointerDown = (e) => { startX.current = e.clientX; setDrag({ x: 0, active: true }); };
  const onPointerMove = (e) => { if (drag.active) setDrag({ x: e.clientX - startX.current, active: true }); };
  const onPointerUp = () => {
    if (!drag.active) return;
    if (drag.x > 90) swipe(true);
    else if (drag.x < -90) swipe(false);
    else setDrag({ x: 0, active: false });
  };

  const likeMix = () => {
    const items = [TOPS[mixTop], BOTTOMS[mixBottom]];
    setProfile((p) => learn(p, items, true));
    setLiked((l) => [{ items, ts: Date.now() }, ...l]);
    setMatch({ items });
  };

  const styleRank = useMemo(() => {
    const keys = Object.keys(profile.styles);
    const max = Math.max(1, ...Object.values(profile.styles).map((v) => Math.abs(v)));
    return keys.map((s) => ({ s, v: profile.styles[s], pct: Math.max(0, profile.styles[s]) / max })).sort((a, b) => b.v - a.v);
  }, [profile]);
  const avgPrice = profile.priceLikes ? Math.round(profile.priceSum / profile.priceLikes) : 0;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');
    .v-display { font-family: 'Anton', sans-serif; }
    .v-body { font-family: 'Inter', sans-serif; }
    .v-card { touch-action: none; user-select: none; }
    .v-input { font-family: 'Inter', sans-serif; border: 1.5px solid #16161A; border-radius: 8px; padding: 9px 10px; font-size: 14px; width: 100%; background: #fff; box-sizing: border-box; }
    @media (prefers-reduced-motion: reduce) { .v-anim { transition: none !important; } }
  `;

  const SkinSwatches = ["#F2D6BD", "#E0B392", "#C8A88A", "#A87B52", "#7C5436", "#4F3322"];
  const HairSwatches = ["#1A1A1A", "#3B2A1F", "#6B4A2B", "#A56B2D", "#C9A14B", "#8A8A8A", "#B33951", "#2742F5"];

  const Nav = ({ id, label, badge }) => (
    <button onClick={() => setScreen(id)} className="v-body" style={{ flex: 1, padding: "12px 0", border: "none", cursor: "pointer", background: screen === id ? ink : "transparent", color: screen === id ? paper : ink, fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", position: "relative" }}>
      {label}
      {badge > 0 && <span style={{ position: "absolute", top: 5, right: 8, background: cobalt, color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 6px" }}>{badge}</span>}
    </button>
  );

  const ItemRow = ({ it }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <div>
        <div style={{ fontWeight: 700 }}>{it.name}</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>{it.brand} · ${it.price}</div>
      </div>
      {it.img ? <img src={it.img} alt="" style={{ width: 28, height: 36, objectFit: "cover", borderRadius: 5 }} /> : <div style={{ width: 18, height: 18, borderRadius: 5, background: it.color, border: "1px solid rgba(0,0,0,0.2)" }} />}
    </div>
  );

  const CardVisual = ({ topItem, bottomItem }) =>
    topItem.img || bottomItem.img ? (
      <div style={{ display: "flex", height: "100%", gap: 4, padding: 6, boxSizing: "border-box" }}>
        {[topItem, bottomItem].map((it) => (
          <div key={it.id} style={{ flex: 1, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            {it.img ? <img src={it.img} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: it.color }} />}
          </div>
        ))}
      </div>
    ) : (
      <div style={{ width: 200, margin: "0 auto", height: "100%" }}>
        <Avatar {...avatarProps} top={topItem.color} bottom={bottomItem.color} />
      </div>
    );

  return (
    <div className="v-body" style={{ maxWidth: 420, margin: "0 auto", background: paper, minHeight: 720, color: ink, border: `2px solid ${ink}`, display: "flex", flexDirection: "column", position: "relative" }}>
      <style>{css}</style>

      <div style={{ padding: "16px 20px 10px", borderBottom: `2px solid ${ink}`, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div className="v-display" style={{ fontSize: 30 }}>VEST<span style={{ color: cobalt }}>I</span></div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 }}>prototype v0.4</div>
      </div>

      {/* ---------- Disclaimer ---------- */}
      {screen === "disclaimer" && (
        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16, flex: 1, justifyContent: "center" }}>
          <h1 className="v-display" style={{ fontSize: 38, lineHeight: 1.05, margin: 0 }}>BEFORE WE START.</h1>
          <div style={{ background: "#fff", border: `2px solid ${ink}`, borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 8px", fontWeight: 700 }}>A quick heads-up:</p>
            <p style={{ margin: "0 0 8px" }}>We're exploring body recognition technology for virtual try-on. It isn't ready yet, so for now your avatar is built from a few simple sizes you give us, not from photos.</p>
            <p style={{ margin: 0 }}>Your sizes stay on your device in this version. Nothing is uploaded, stored or shared. Outfits shown are indicative, not a guarantee of fit.</p>
          </div>
          <button onClick={() => setScreen("setup")} className="v-display" style={{ background: cobalt, color: "#fff", border: "none", padding: "15px 0", fontSize: 19, cursor: "pointer", borderRadius: 8 }}>GOT IT, LET'S GO →</button>
        </div>
      )}

      {/* ---------- Setup ---------- */}
      {screen === "setup" && (
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 13, flex: 1, overflowY: "auto" }}>
          <h2 className="v-display" style={{ fontSize: 28, margin: 0 }}>BUILD YOUR TWIN.</h2>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ width: 120, height: 180, background: "#EFEDE6", border: `2px solid ${ink}`, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
              <Avatar {...avatarProps} top="#888" bottom="#555" />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Shirt size</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {SHIRT_SIZES.map((s) => (
                    <button key={s} onClick={() => setSizes((z) => ({ ...z, shirt: s }))} style={{ padding: "5px 9px", borderRadius: 7, fontSize: 11, fontWeight: 700, background: sizes.shirt === s ? ink : "#fff", color: sizes.shirt === s ? "#fff" : ink, border: `1.5px solid ${ink}`, cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Waist (in)</div>
                  <input className="v-input" type="number" min="22" max="50" value={sizes.waist} onChange={(e) => setSizes((z) => ({ ...z, waist: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Shoe (US)</div>
                  <input className="v-input" type="number" min="4" max="16" value={sizes.shoe} onChange={(e) => setSizes((z) => ({ ...z, shoe: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Hair style</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(HAIR_STYLES).map(([key, h]) => (
                <button key={key} onClick={() => setHairStyle(key)} style={{ width: 52, borderRadius: 10, border: hairStyle === key ? `2.5px solid ${cobalt}` : `1.5px solid ${ink}`, background: "#fff", cursor: "pointer", padding: "4px 2px 2px" }}>
                  <svg viewBox="55 28 90 50" style={{ width: "100%", height: 34 }}>
                    {h.back(hairColor)}
                    <circle cx="100" cy="28" r="30" fill={skin} />
                    {h.front(hairColor)}
                  </svg>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Hair colour</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: 160 }}>
                {HairSwatches.map((c) => (
                  <button key={c} onClick={() => setHairColor(c)} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: hairColor === c ? `3px solid ${cobalt}` : "1px solid rgba(0,0,0,0.2)", cursor: "pointer" }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Skin tone</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: 160 }}>
                {SkinSwatches.map((c) => (
                  <button key={c} onClick={() => setSkin(c)} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: skin === c ? `3px solid ${cobalt}` : "1px solid rgba(0,0,0,0.2)", cursor: "pointer" }} />
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => setScreen("swipe")} className="v-display" style={{ background: cobalt, color: "#fff", border: "none", padding: "15px 0", fontSize: 19, cursor: "pointer", borderRadius: 8, marginTop: "auto" }}>START SWIPING →</button>
        </div>
      )}

      {/* ---------- Swipe ---------- */}
      {screen === "swipe" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16, gap: 12 }}>
          {pair ? (
            <>
              <div style={{ position: "relative", flex: 1, minHeight: 420 }}>
                {DECK_PAIRS[deckIdx + 1] && <div style={{ position: "absolute", inset: 0, transform: "scale(0.96) translateY(10px)", background: "#fff", border: `2px solid ${ink}`, borderRadius: 16, opacity: 0.5 }} />}
                <div
                  className="v-card v-anim"
                  onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
                  style={{ position: "absolute", inset: 0, background: "#fff", border: `2px solid ${ink}`, borderRadius: 16, transform: `translateX(${drag.x}px) rotate(${drag.x / 18}deg)`, transition: drag.active ? "none" : "transform 0.25s ease", cursor: "grab", overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  {drag.x > 40 && <div className="v-display" style={{ position: "absolute", top: 16, left: 16, color: cobalt, border: `3px solid ${cobalt}`, padding: "2px 10px", fontSize: 22, transform: "rotate(-12deg)", borderRadius: 6, zIndex: 2 }}>FIT</div>}
                  {drag.x < -40 && <div className="v-display" style={{ position: "absolute", top: 16, right: 16, color: red, border: `3px solid ${red}`, padding: "2px 10px", fontSize: 22, transform: "rotate(12deg)", borderRadius: 6, zIndex: 2 }}>NOPE</div>}
                  <div style={{ flex: 1, background: "#EFEDE6", padding: "8px 0" }}>
                    <CardVisual topItem={currentTop} bottomItem={currentBottom} />
                  </div>
                  <div style={{ padding: "10px 14px", borderTop: `2px solid ${ink}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{currentTop.name} <span style={{ opacity: 0.5, fontWeight: 500 }}>· {currentTop.brand}</span></span><span>${currentTop.price}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{currentBottom.name} <span style={{ opacity: 0.5, fontWeight: 500 }}>· {currentBottom.brand}</span></span><span>${currentBottom.price}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => swipe(false)} className="v-display" style={{ flex: 1, padding: "13px 0", fontSize: 17, background: "#fff", color: red, border: `2px solid ${red}`, borderRadius: 10, cursor: "pointer" }}>✕ NOPE</button>
                <button onClick={() => swipe(true)} className="v-display" style={{ flex: 1, padding: "13px 0", fontSize: 17, background: cobalt, color: "#fff", border: `2px solid ${cobalt}`, borderRadius: 10, cursor: "pointer" }}>♥ FIT</button>
              </div>
              <div style={{ textAlign: "center", fontSize: 11, opacity: 0.55 }}>{DECK_PAIRS.length - deckIdx} outfits left · drag or tap</div>
            </>
          ) : (
            <div style={{ textAlign: "center", marginTop: 70, padding: 16 }}>
              <div className="v-display" style={{ fontSize: 30 }}>DECK EMPTY</div>
              <p style={{ fontSize: 13, opacity: 0.7 }}>Production version refills infinitely, weighted by your Style DNA.</p>
              <button onClick={() => setScreen("mix")} className="v-display" style={{ background: ink, color: paper, border: "none", padding: "12px 20px", fontSize: 15, borderRadius: 8, cursor: "pointer" }}>TRY MIX & MATCH →</button>
            </div>
          )}
        </div>
      )}

      {/* ---------- Mix & match ---------- */}
      {screen === "mix" && (
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 12, flex: 1 }}>
            <div style={{ flex: 1, background: "#EFEDE6", border: `2px solid ${ink}`, borderRadius: 14, display: "flex", justifyContent: "center", padding: "8px 0", minHeight: 360 }}>
              {TOPS[mixTop].img || BOTTOMS[mixBottom].img ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 6, width: "100%", boxSizing: "border-box" }}>
                  {[TOPS[mixTop], BOTTOMS[mixBottom]].map((it) => (
                    <div key={it.id} style={{ flex: 1, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                      {it.img ? <img src={it.img} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: it.color }} />}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ width: 190 }}>
                  <Avatar {...avatarProps} top={TOPS[mixTop].color} bottom={BOTTOMS[mixBottom].color} />
                </div>
              )}
            </div>
            <div style={{ width: 130, display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
              <div style={{ background: "#fff", border: `2px solid ${ink}`, borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6 }}>Top</div>
                <div style={{ fontSize: 12, fontWeight: 700, minHeight: 32, overflow: "hidden" }}>{TOPS[mixTop].name}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{TOPS[mixTop].brand} · ${TOPS[mixTop].price}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <button onClick={() => setMixTop((i) => (i - 1 + TOPS.length) % TOPS.length)} style={{ flex: 1, border: `1.5px solid ${ink}`, background: "#fff", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>←</button>
                  <button onClick={() => setMixTop((i) => (i + 1) % TOPS.length)} style={{ flex: 1, border: `1.5px solid ${ink}`, background: "#fff", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>→</button>
                </div>
              </div>
              <div style={{ background: "#fff", border: `2px solid ${ink}`, borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6 }}>Bottom</div>
                <div style={{ fontSize: 12, fontWeight: 700, minHeight: 32, overflow: "hidden" }}>{BOTTOMS[mixBottom].name}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{BOTTOMS[mixBottom].brand} · ${BOTTOMS[mixBottom].price}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <button onClick={() => setMixBottom((i) => (i - 1 + BOTTOMS.length) % BOTTOMS.length)} style={{ flex: 1, border: `1.5px solid ${ink}`, background: "#fff", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>←</button>
                  <button onClick={() => setMixBottom((i) => (i + 1) % BOTTOMS.length)} style={{ flex: 1, border: `1.5px solid ${ink}`, background: "#fff", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>→</button>
                </div>
              </div>
              <button onClick={() => { setMixTop(Math.floor(Math.random() * TOPS.length)); setMixBottom(Math.floor(Math.random() * BOTTOMS.length)); }} style={{ border: `1.5px solid ${ink}`, background: "#fff", borderRadius: 8, padding: "8px 0", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>🎲 Shuffle</button>
            </div>
          </div>
          <button onClick={likeMix} className="v-display" style={{ background: cobalt, color: "#fff", border: "none", padding: "14px 0", fontSize: 18, cursor: "pointer", borderRadius: 8 }}>♥ I'D WEAR THIS</button>
        </div>
      )}

      {/* ---------- Fits ---------- */}
      {screen === "likes" && (
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          <h2 className="v-display" style={{ fontSize: 24, margin: "4px 0 12px" }}>YOUR FITS ({liked.length})</h2>
          {liked.length === 0 && <p style={{ fontSize: 13, opacity: 0.6 }}>Nothing yet. Swipe right or build a mix.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {liked.map((entry, i) => (
              <div key={entry.ts + "-" + i} style={{ display: "flex", gap: 12, background: "#fff", border: `2px solid ${ink}`, borderRadius: 12, padding: 10, alignItems: "center" }}>
                <div style={{ width: 54, height: 78, background: "#EFEDE6", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  {entry.items[0].img ? (
                    <img src={entry.items[0].img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Avatar {...avatarProps} top={entry.items[0].color} bottom={entry.items[1].color} />
                  )}
                </div>
                <div style={{ flex: 1, fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>{entry.items[0].name} + {entry.items[1].name}</div>
                  <div style={{ opacity: 0.6 }}>${entry.items[0].price + entry.items[1].price} total</div>
                </div>
                <button onClick={() => setMatch({ items: entry.items })} style={{ background: cobalt, color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>SHOP →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- DNA ---------- */}
      {screen === "dna" && (
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          <h2 className="v-display" style={{ fontSize: 24, margin: "4px 0 2px" }}>STYLE DNA</h2>
          <p style={{ fontSize: 12, opacity: 0.6, marginTop: 0 }}>{profile.swipes} swipes · {profile.likes} likes · avg liked outfit ${avgPrice}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {styleRank.map(({ s, v, pct }) => (
              <div key={s}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <span>{s}</span><span style={{ opacity: 0.5 }}>{v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}</span>
                </div>
                <div style={{ height: 10, background: "#E4E2DA", borderRadius: 99, overflow: "hidden", marginTop: 3 }}>
                  <div className="v-anim" style={{ height: "100%", width: `${pct * 100}%`, background: v > 0 ? cobalt : red, transition: "width 0.4s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: ink, color: paper, borderRadius: 12, padding: 14, fontSize: 12, lineHeight: 1.5 }}>
            <span className="v-display" style={{ fontSize: 16, color: "#fff" }}>BRAND SIGNAL </span>
            <span style={{ color: cobalt, fontWeight: 700 }}>(the real product)</span>
            <p style={{ opacity: 0.75, margin: "6px 0 0" }}>Aggregated swipe data becomes merchandising intelligence sold to brands: which silhouettes, colours and price points your demographic wants this week, before sales data can show it.</p>
          </div>
        </div>
      )}

      {/* ---------- Match popup ---------- */}
      {match && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(22,22,26,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, padding: 24 }}>
          <div style={{ background: paper, border: `2px solid ${ink}`, borderRadius: 16, padding: 20, width: "100%", maxWidth: 320 }}>
            <div className="v-display" style={{ fontSize: 26, color: cobalt }}>IT'S A FIT.</div>
            <p style={{ fontSize: 12, opacity: 0.7, margin: "4px 0 10px" }}>Grab the pieces:</p>
            {match.items.map((it) => (
              <div key={it.id}>
                <ItemRow it={it} />
                <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: cobalt, color: "#fff", textDecoration: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, margin: "8px 0 12px" }}>
                  Shop at {it.brand} →
                </a>
              </div>
            ))}
            <button onClick={() => setMatch(null)} style={{ width: "100%", background: "transparent", border: `1.5px solid ${ink}`, borderRadius: 8, padding: "9px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Keep swiping</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", borderTop: `2px solid ${ink}` }}>
        <Nav id="setup" label="Twin" />
        <Nav id="swipe" label="Swipe" />
        <Nav id="mix" label="Mix" />
        <Nav id="likes" label="Fits" badge={liked.length} />
        <Nav id="dna" label="DNA" />
      </div>
    </div>
  );
}
