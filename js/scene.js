/* ============================================================
   Sanitätshaus Danzeisen — 3D Scroll-Szenen (Three.js)
   Realistische, prozedural modellierte Produkte mit
   studio-ähnlichem Licht (RoomEnvironment) und weichem Schatten.
   ============================================================ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('stage');
const loader = document.getElementById('stageLoader');
const scenesEl = document.getElementById('szenen');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  document.body.classList.add('no3d');
  if (loader) loader.style.display = 'none';
}

if (renderer) init();

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function smoothstep(e0, e1, x) { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
function lerp(a, b, t) { return a + (b - a) * t; }

function init() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9.2);
  camera.lookAt(0, 0, 0);

  // --- Studio environment (procedural, no external HDR) ---
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;

  // --- Key + fill + rim lights (studio) ---
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(4, 8, 6);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xdfe9f5, 0.7);
  fill.position.set(-6, 2, 4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 1.0);
  rim.position.set(-3, 5, -6);
  scene.add(rim);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c2cc, 0.35));

  // --- Soft radial contact-shadow texture (Apple-style float shadow) ---
  function makeShadowTexture() {
    const s = 256, c = document.createElement('canvas'); c.width = c.height = s;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(16,40,38,0.42)');
    g.addColorStop(0.45, 'rgba(16,40,38,0.20)');
    g.addColorStop(1, 'rgba(16,40,38,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const shadowTex = makeShadowTexture();

  /* ---------- Prozedurale Oberflächen-Texturen (Canvas, keine Assets) ---------- */
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  function tex(size, draw, repeat) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = maxAniso;
    if (repeat) t.repeat.set(repeat[0], repeat[1]);
    return t;
  }
  // feiner Strick (vertikale Rippen) – für die Kompressionssocke
  const T_knit = tex(128, (x, s) => {
    for (let i = 0; i < s; i++) {
      const h = 132 + 96 * Math.sin((i / s) * Math.PI * 10);
      x.fillStyle = `rgb(${h | 0},${h | 0},${h | 0})`; x.fillRect(i, 0, 1, s);
    }
    for (let k = 0; k < 4000; k++) { x.fillStyle = `rgba(255,255,255,0.05)`; x.fillRect(Math.random() * s, Math.random() * s, 1, 1); }
  }, [18, 8]);
  // Gewebe/Neopren (Kreuzstruktur) – für Orthese, Gurte
  const T_weave = tex(128, (x, s) => {
    x.fillStyle = '#808080'; x.fillRect(0, 0, s, s);
    const step = 10;
    for (let i = 0; i < s; i += step) {
      x.fillStyle = 'rgba(255,255,255,0.28)'; x.fillRect(i, 0, step / 2, s);
      x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(0, i, s, step / 2);
    }
    for (let k = 0; k < 6000; k++) { x.fillStyle = `rgba(0,0,0,0.05)`; x.fillRect(Math.random() * s, Math.random() * s, 1, 1); }
  }, [7, 5]);
  // gebürstetes Metall (feine horizontale Linien) – Rauheitskarte
  const T_brushed = tex(256, (x, s) => {
    x.fillStyle = '#b8b8b8'; x.fillRect(0, 0, s, s);
    for (let k = 0; k < 9000; k++) {
      const y = Math.random() * s, len = 20 + Math.random() * 80, g = 150 + Math.random() * 90;
      x.strokeStyle = `rgba(${g | 0},${g | 0},${g | 0},0.18)`; x.beginPath();
      x.moveTo(Math.random() * s, y); x.lineTo(Math.random() * s + len, y); x.stroke();
    }
  }, [3, 3]);
  // Mikro-Rauheit (Schaum/Haut/Gummi) – dezentes Rauschen
  function noiseRough(lo, hi, rep) {
    return tex(128, (x, s) => {
      const img = x.createImageData(s, s);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (lo + Math.random() * (hi - lo)) * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
    }, rep || [4, 4]);
  }
  const T_foamRough = noiseRough(0.6, 0.95, [3, 3]);
  const T_skinRough = noiseRough(0.45, 0.7, [2, 3]);
  const T_rubberRough = noiseRough(0.7, 0.95, [6, 2]);

  /* ---------- Materials (an echten Produkten orientiert) ---------- */
  const M = {
    skin: new THREE.MeshPhysicalMaterial({ color: 0xeac3a3, roughness: 0.62, metalness: 0.0, sheen: 0.4, sheenColor: new THREE.Color(0xd89a78), clearcoat: 0.06, roughnessMap: T_skinRough, bumpMap: T_skinRough, bumpScale: 0.004 }),
    // schwarze Strick-Kompressionssocke
    sock: new THREE.MeshPhysicalMaterial({ color: 0x0e0f12, roughness: 0.72, metalness: 0.0, sheen: 0.4, sheenColor: new THREE.Color(0x23262d), sheenRoughness: 0.5, bumpMap: T_knit, bumpScale: 0.014 }),
    sockBand: new THREE.MeshStandardMaterial({ color: 0x0d0e11, roughness: 0.72, bumpMap: T_knit, bumpScale: 0.02 }),
    // schwarze Neopren/Stoff-Orthese
    braceBlack: new THREE.MeshPhysicalMaterial({ color: 0x17181c, roughness: 0.84, metalness: 0.0, sheen: 0.5, sheenColor: new THREE.Color(0x2a2c31), bumpMap: T_weave, bumpScale: 0.02, roughnessMap: T_weave }),
    velcro: new THREE.MeshStandardMaterial({ color: 0x101114, roughness: 0.95, bumpMap: T_weave, bumpScale: 0.03 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xd9dee4, roughness: 0.26, metalness: 1.0, roughnessMap: T_brushed }),
    metalDark: new THREE.MeshStandardMaterial({ color: 0x878d96, roughness: 0.34, metalness: 1.0, roughnessMap: T_brushed }),
    red: new THREE.MeshStandardMaterial({ color: 0xd6212a, roughness: 0.4, metalness: 0.1 }),
    // Einlage mehrfarbig
    foamYellow: new THREE.MeshStandardMaterial({ color: 0xf6c02f, roughness: 0.72, roughnessMap: T_foamRough, bumpMap: T_foamRough, bumpScale: 0.01 }),
    foamBlack: new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.82, roughnessMap: T_foamRough, bumpMap: T_foamRough, bumpScale: 0.008 }),
    foamBlue: new THREE.MeshStandardMaterial({ color: 0x1f6fe0, roughness: 0.6, roughnessMap: T_foamRough }),
    foamRed: new THREE.MeshStandardMaterial({ color: 0xe23a2e, roughness: 0.55 }),
    // Rollstuhl
    frame: new THREE.MeshStandardMaterial({ color: 0x202329, roughness: 0.5, metalness: 0.65, roughnessMap: T_brushed }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x141619, roughness: 0.88, metalness: 0.0, roughnessMap: T_rubberRough, bumpMap: T_rubberRough, bumpScale: 0.01 }),
    seat: new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.92, bumpMap: T_weave, bumpScale: 0.015 }),
    // Gehstock
    chrome: new THREE.MeshStandardMaterial({ color: 0xe2e6ea, roughness: 0.18, metalness: 1.0, roughnessMap: T_brushed }),
    chromeSoft: new THREE.MeshStandardMaterial({ color: 0xc6ccd2, roughness: 0.3, metalness: 0.9, roughnessMap: T_brushed }),
    silicone: new THREE.MeshPhysicalMaterial({ color: 0x26282e, roughness: 0.5, metalness: 0, clearcoat: 0.4 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x0e8f8f, roughness: 0.38, metalness: 0.12 })
  };

  // kräftigere Reflexionen auf Metallteilen
  [M.metal, M.metalDark, M.chrome, M.chromeSoft, M.frame].forEach(m => { m.envMapIntensity = 1.3; });

  function shadowy(obj) { return obj; }

  /* ======================================================
     PRODUKT 1 — Kompressionsstrumpf (Bein, Lathe)
     ====================================================== */
  function buildLeg() {
    const g = new THREE.Group();
    // Kniestrumpf-Bein (Ferse unten … unter dem Knie oben)
    const pts = [
      [0.00, -2.20], [0.34, -2.20], [0.40, -1.70], [0.55, -1.05], [0.66, -0.45],
      [0.62, 0.10], [0.50, 0.55], [0.54, 1.10], [0.64, 1.75], [0.72, 2.35], [0.70, 2.55], [0.00, 2.55]
    ].map(p => new THREE.Vector2(p[0], p[1]));
    const leg = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), M.sock);
    g.add(leg);
    // oberer Bund (Rippstrick etwas dunkler)
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.73, 0.72, 0.34, 64, 1, true), M.sockBand);
    cuff.position.y = 2.36; g.add(cuff);
    // --- Fuß (Socke) ---
    const foot = new THREE.Group();
    const instep = new THREE.Mesh(new THREE.SphereGeometry(0.42, 40, 28), M.sock);
    instep.scale.set(0.92, 0.6, 1.75); instep.position.set(0, -2.18, 0.42); foot.add(instep);
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24), M.sock);
    toe.scale.set(0.9, 0.62, 0.7); toe.position.set(0, -2.28, 1.18); foot.add(toe);
    const heel = new THREE.Mesh(new THREE.SphereGeometry(0.33, 28, 22), M.sock);
    heel.scale.set(0.9, 0.9, 0.85); heel.position.set(0, -2.05, -0.28); foot.add(heel);
    g.add(foot);
    return shadowy(g);
  }

  /* ======================================================
     PRODUKT 2 — Orthopädische Einlage (Extrude + Wölbung)
     ====================================================== */
  function insoleShape(scale) {
    const k = scale || 1;
    const s = new THREE.Shape();
    s.moveTo(0, -2.0 * k);
    s.bezierCurveTo(0.7 * k, -2.0 * k, 0.75 * k, -1.1 * k, 0.66 * k, -0.4 * k);
    s.bezierCurveTo(0.58 * k, 0.2 * k, 0.74 * k, 0.7 * k, 0.78 * k, 1.25 * k);
    s.bezierCurveTo(0.8 * k, 1.9 * k, 0.45 * k, 2.25 * k, 0.0, 2.25 * k);
    s.bezierCurveTo(-0.45 * k, 2.25 * k, -0.8 * k, 1.9 * k, -0.78 * k, 1.25 * k);
    s.bezierCurveTo(-0.74 * k, 0.7 * k, -0.58 * k, 0.2 * k, -0.66 * k, -0.4 * k);
    s.bezierCurveTo(-0.75 * k, -1.1 * k, -0.7 * k, -2.0 * k, 0.0, -2.0 * k);
    return s;
  }
  function archify(geo, amp) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const arch = Math.cos(clamp(y / 2.4, -1, 1) * 1.15) * amp * Math.max(0, 1 - Math.abs(x) / 0.85);
      const heelCup = (y < -0.7 ? Math.min(0.16, Math.abs(x) * 0.22) : 0);
      pos.setZ(i, z + arch + heelCup);
    }
    geo.computeVertexNormals();
  }
  function buildInsole() {
    const g = new THREE.Group();
    // gelber Grundkörper
    const bodyGeo = new THREE.ExtrudeGeometry(insoleShape(1), { depth: 0.18, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, curveSegments: 48 });
    bodyGeo.center(); archify(bodyGeo, 0.28);
    g.add(new THREE.Mesh(bodyGeo, M.foamYellow));
    // schwarzes Fußbett (oben, etwas kleiner, nach +Z)
    const topGeo = new THREE.ExtrudeGeometry(insoleShape(0.9), { depth: 0.06, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.05, bevelSegments: 3, curveSegments: 48 });
    topGeo.center(); archify(topGeo, 0.30);
    const top = new THREE.Mesh(topGeo, M.foamBlack); top.position.z = 0.12; g.add(top);
    // blaue Stützzonen: Ferse + Vorfuß (flache, leicht gewölbte Pads)
    function pad(y, sx, sy, mat) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.5, 28, 20), mat);
      p.scale.set(sx, sy, 0.12); p.position.set(0, y, 0.2); return p;
    }
    g.add(pad(-1.35, 1.15, 1.05, M.foamBlue)); // Ferse
    g.add(pad(1.25, 1.05, 1.2, M.foamBlue));  // Vorfuß
    // roter Punkt (Fersen-Dämpfer)
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 28), M.foamRed);
    dot.rotation.x = Math.PI / 2; dot.position.set(0, -1.4, 0.32); g.add(dot);
    g.rotation.x = -0.18;
    const wrap = new THREE.Group(); wrap.add(g);
    return shadowy(wrap);
  }

  /* ======================================================
     PRODUKT 3 — Knieorthese
     ====================================================== */
  function buildBrace() {
    const g = new THREE.Group();
    const BEND = 0.34; // Kniebeugung (rad)

    // ---------- Bein (Haut) ----------
    // Oberschenkel (fix)
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.62, 2.5, 48), M.skin);
    thigh.position.y = 1.3; g.add(thigh);
    // Kniegelenk
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.64, 44, 34), M.skin);
    knee.scale.set(1.0, 0.94, 1.04); g.add(knee);
    const patella = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 22), M.skin);
    patella.scale.set(1.15, 1.3, 0.6); patella.position.set(0, -0.04, 0.5); g.add(patella);

    // Unterschenkel (gebeugte Untergruppe)
    const lower = new THREE.Group();
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.4, 2.5, 48), M.skin);
    shin.position.y = -1.3; lower.add(shin);
    const calf = new THREE.Mesh(new THREE.SphereGeometry(0.42, 30, 24), M.skin);
    calf.scale.set(1.0, 1.8, 0.9); calf.position.set(0, -0.9, -0.24); lower.add(calf);
    // Fuß
    const sole = new THREE.Mesh(new THREE.SphereGeometry(0.4, 30, 22), M.skin);
    sole.scale.set(0.9, 0.5, 1.6); sole.position.set(0, -2.62, 0.42); lower.add(sole);
    const heel = new THREE.Mesh(new THREE.SphereGeometry(0.33, 22, 18), M.skin);
    heel.scale.set(0.9, 0.85, 0.9); heel.position.set(0, -2.5, -0.12); lower.add(heel);
    lower.rotation.x = BEND; g.add(lower);

    // ---------- Orthese (schwarz) ----------
    // Manschetten (offene, leicht bauchige Stoffringe)
    const thighCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.8, 1.2, 48, 1, true), M.braceBlack);
    thighCuff.position.y = 1.4; g.add(thighCuff);
    const lowerBrace = new THREE.Group();
    const shinCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.56, 1.15, 48, 1, true), M.braceBlack);
    shinCuff.position.y = -1.45; lowerBrace.add(shinCuff);

    // Klett-Gurte (flach) + Lasche
    function strap(r, y) {
      const s = new THREE.Mesh(new THREE.TorusGeometry(r, 0.11, 16, 56), M.velcro);
      s.rotation.x = Math.PI / 2; s.scale.z = 0.4; s.position.y = y;
      const tab = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.16), M.velcro);
      tab.position.set(r * 0.72, y, 0.55); tab.rotation.z = 0.2;
      const grp = new THREE.Group(); grp.add(s); grp.add(tab); return grp;
    }
    g.add(strap(0.96, 1.78)); g.add(strap(0.88, 1.02));
    lowerBrace.add(strap(0.74, -1.02)); lowerBrace.add(strap(0.64, -1.82));
    lowerBrace.rotation.x = BEND; g.add(lowerBrace);

    // ---------- Scharniere + Streben (beide Seiten) ----------
    [-1, 1].forEach(sx => {
      // Metall-Scharnierscheibe
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.09, 36), M.metal);
      disc.rotation.z = Math.PI / 2; disc.position.set(sx * 0.74, 0, 0.14); g.add(disc);
      const discIn = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 36), M.metalDark);
      discIn.rotation.z = Math.PI / 2; discIn.position.set(sx * 0.78, 0, 0.14); g.add(discIn);
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.16, 18), M.metal);
      bolt.rotation.z = Math.PI / 2; bolt.position.set(sx * 0.82, 0, 0.14); g.add(bolt);
      // rote Verstell-Knöpfe (charakteristisch)
      [0.32, -0.32].forEach(dy => {
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 14), M.red);
        knob.position.set(sx * 0.8, dy, 0.16); g.add(knob);
      });
      // obere Strebe (Oberschenkel)
      g.add(tube(sx * 0.74, 0.22, 0.14, sx * 0.72, 1.55, 0.06, 0.055, M.braceBlack));
      // untere Strebe (Unterschenkel, gebeugt)
      const lb = tube(sx * 0.74, -0.22, 0.14, sx * 0.66, -1.55, 0.02, 0.055, M.braceBlack);
      const lbg = new THREE.Group(); lbg.add(lb); lbg.rotation.x = BEND; g.add(lbg);
    });
    return shadowy(g);
  }

  /* ======================================================
     PRODUKT 4 — Rollstuhl
     ====================================================== */
  function wheel(R, tube, spokes, matTire, matRim) {
    const w = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.TorusGeometry(R, tube, 18, 64), matTire);
    w.add(tire);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R - tube - 0.04, 0.035, 12, 64), matRim);
    w.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 20), matRim);
    hub.rotation.x = Math.PI / 2; w.add(hub);
    for (let i = 0; i < spokes; i++) {
      const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, (R - tube), 8), matRim);
      const a = (i / spokes) * Math.PI * 2;
      sp.position.set(Math.cos(a) * (R - tube) / 2, Math.sin(a) * (R - tube) / 2, 0);
      sp.rotation.z = a + Math.PI / 2; w.add(sp);
    }
    return w;
  }
  function tube(x1, y1, z1, x2, y2, z2, r, mat) {
    const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2);
    const len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 16), mat);
    m.position.copy(a).lerp(b, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  }
  function buildWheelchair() {
    const g = new THREE.Group();
    const R = 1.0;
    [-1, 1].forEach(sx => {
      const wl = wheel(R, 0.1, 14, M.rubber, M.metalDark);
      wl.rotation.y = Math.PI / 2;
      wl.position.set(sx * 1.15, R, -0.1);
      g.add(wl);
      // Greifring (Metall)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R - 0.06, 0.035, 12, 64), M.chromeSoft);
      ring.rotation.y = Math.PI / 2; ring.position.set(sx * 1.28, R, -0.1); g.add(ring);
    });
    // Vorderräder (Castor)
    [-1, 1].forEach(sx => {
      const c = wheel(0.32, 0.07, 8, M.rubber, M.metalDark);
      c.rotation.y = Math.PI / 2; c.position.set(sx * 0.78, 0.32, 1.25); g.add(c);
    });
    // Rahmen (schwarz)
    const F = M.frame;
    g.add(tube(-1.0, R, -0.1, -0.85, 0.32, 1.25, 0.05, F)); // links unten schräg
    g.add(tube(1.0, R, -0.1, 0.85, 0.32, 1.25, 0.05, F));
    g.add(tube(-0.85, 1.0, 0.9, -0.85, 0.32, 1.25, 0.05, F)); // vordere Stütze
    g.add(tube(0.85, 1.0, 0.9, 0.85, 0.32, 1.25, 0.05, F));
    g.add(tube(-0.85, 1.0, -0.9, 0.85, 1.0, -0.9, 0.05, F)); // Sitzquerstrebe hinten
    g.add(tube(-0.85, 1.0, 0.9, 0.85, 1.0, 0.9, 0.05, F)); // Sitzquerstrebe vorn
    // Sitz
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 1.7, 4, 1, 4), M.seat);
    seat.position.set(0, 1.06, 0.0); g.add(seat);
    // Rückenlehne
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 0.12), M.seat);
    back.position.set(0, 1.75, -0.92); back.rotation.x = -0.14; g.add(back);
    // Rückenrahmen + Schiebegriffe
    [-1, 1].forEach(sx => {
      g.add(tube(sx * 0.78, 1.0, -0.9, sx * 0.78, 2.5, -1.05, 0.05, F));
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.32, 16), M.velcro);
      grip.position.set(sx * 0.78, 2.52, -1.12); grip.rotation.z = Math.PI / 2; g.add(grip);
      // Armlehne
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.9), M.braceBlack);
      arm.position.set(sx * 0.92, 1.5, 0.1); g.add(arm);
      g.add(tube(sx * 0.92, 1.46, 0.5, sx * 0.92, 1.0, 0.7, 0.04, F));
    });
    // Fußstützen
    [-1, 1].forEach(sx => {
      const fp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.4), M.frame);
      fp.position.set(sx * 0.45, 0.2, 1.5); g.add(fp);
    });
    return shadowy(g);
  }

  /* ======================================================
     PRODUKT 5 — Gehstock (Tube-Handle)
     ====================================================== */
  function buildCane() {
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 3.6, 24), M.chrome);
    shaft.position.y = -0.2; g.add(shaft);
    // Verstellringe
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.02, 10, 24), M.accent);
      r.rotation.x = Math.PI / 2; r.position.y = -1.0 - i * 0.22; g.add(r);
    }
    // Ergonomischer Griff (Derby) als Tube entlang Kurve
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.6, 0), new THREE.Vector3(0, 1.95, 0),
      new THREE.Vector3(0.12, 2.12, 0), new THREE.Vector3(0.5, 2.16, 0),
      new THREE.Vector3(0.92, 2.05, 0), new THREE.Vector3(1.05, 1.78, 0)
    ]);
    const grip = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.13, 18, false), M.silicone);
    g.add(grip);
    // Gummipuffer unten
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.26, 20), M.rubber);
    ferrule.position.y = -2.0; g.add(ferrule);
    return shadowy(g);
  }

  /* ---------- Produkte normalisieren & einhängen ---------- */
  // [builder, zielGröße, basis-Blickwinkel(Y), feinjustierung Y-Position]
  const CONFIG = [
    [buildLeg, 2.9, -0.25, 0],
    [buildInsole, 2.9, -0.55, 0],
    [buildBrace, 3.05, -0.62, 0],
    [buildWheelchair, 3.05, 0.55, 0],
    [buildCane, 3.0, -0.30, 0]
  ];
  const sides = Array.from(scenesEl.querySelectorAll('.scene')).map(s => s.dataset.side || 'right');
  const N = CONFIG.length;
  const products = [];

  CONFIG.forEach(([build, target, baseAngle, yAdj]) => {
    const inner = build();
    let box = new THREE.Box3().setFromObject(inner);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    inner.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    inner.scale.setScalar(target / maxDim);

    // Maße nach Skalierung
    box = new THREE.Box3().setFromObject(inner);
    const sz = box.getSize(new THREE.Vector3());
    const halfH = sz.y / 2;
    const footprint = Math.max(sz.x, sz.z);

    const pivot = new THREE.Group();
    pivot.add(inner);

    // weicher Bodenschatten
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.9 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -halfH - 0.06;
    shadow.scale.set(footprint * 1.9, footprint * 1.9, 1);
    pivot.add(shadow);

    pivot.userData = { base: [], baseAngle, yAdj };
    pivot.traverse(o => { if (o.isMesh) { o.material.transparent = true; pivot.userData.base.push([o.material, o.material.opacity]); } });
    pivot.visible = false;
    scene.add(pivot);
    products.push(pivot);
  });

  function setOpacity(pivot, k) {
    pivot.userData.base.forEach(([mat, base]) => { mat.opacity = base * k; });
  }

  /* ---------- Scroll-Status ---------- */
  let ci = 0, ciTarget = 0;       // continuous index
  let centerX = 0, centerXTarget = 0;
  let canvasOpacity = 0, canvasOpacityTarget = 0;
  const CENTER_OFFSET = 2.35;
  let pointerX = 0, pointerY = 0, pX = 0, pY = 0;

  const isMobile = () => window.innerWidth < 760;
  const sceneEls = Array.from(scenesEl.querySelectorAll('.scene'));

  function updateScroll() {
    const rect = scenesEl.getBoundingClientRect();
    const vh = window.innerHeight, mid = vh / 2;
    // ci aus den Szenen-Mittelpunkten interpolieren -> rastet exakt auf ganze Indizes
    const SC = sceneEls.length; // Szenen gesamt (inkl. Splat-Szene); Modelle = N
    const centers = sceneEls.map(s => { const r = s.getBoundingClientRect(); return r.top + r.height / 2; });
    let idx = 0;
    if (mid <= centers[0]) idx = 0;
    else if (mid >= centers[SC - 1]) idx = SC - 1;
    else for (let k = 0; k < SC - 1; k++) {
      if (mid >= centers[k] && mid <= centers[k + 1]) { idx = k + (mid - centers[k]) / (centers[k + 1] - centers[k]); break; }
    }
    ciTarget = idx;
    const active = clamp(Math.round(ciTarget), 0, SC - 1);
    centerXTarget = isMobile() ? 0 : (sides[active] === 'right' ? CENTER_OFFSET : -CENTER_OFFSET);
    const inView = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
    canvasOpacityTarget = inView ? 1 : 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('pointermove', e => {
    pointerX = (e.clientX / window.innerWidth - 0.5);
    pointerY = (e.clientY / window.innerHeight - 0.5);
  });

  /* ---------- Resize ---------- */
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  updateScroll();

  /* ---------- Render-Loop ---------- */
  const clock = new THREE.Clock();
  let started = false;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    ci = lerp(ci, ciTarget, 1 - Math.pow(0.001, dt));
    centerX = lerp(centerX, centerXTarget, 1 - Math.pow(0.0015, dt));
    canvasOpacity = lerp(canvasOpacity, canvasOpacityTarget, 1 - Math.pow(0.002, dt));
    canvas.style.opacity = canvasOpacity.toFixed(3);

    pX = lerp(pX, pointerX, 0.06); pY = lerp(pY, pointerY, 0.06);

    const mob = isMobile();
    const mobScale = mob ? 0.72 : 1;
    const yShift = mob ? 1.05 : 0;
    products.forEach((p, i) => {
      const d = Math.abs(i - ci);
      const vis = smoothstep(0.82, 0.24, d); // 1 wenn aktiv, schneller aus -> saubere Übergänge
      if (vis <= 0.002) { p.visible = false; return; }
      p.visible = true;
      setOpacity(p, vis);
      const s = (0.9 + 0.1 * vis) * mobScale;
      p.scale.setScalar(s);
      // Mobile: reiner Crossfade (zentriert). Desktop: größerer Abstand beim Wechsel.
      p.position.x = centerX + (i - ci) * (mob ? 0 : 2.5);
      p.position.y = p.userData.yAdj + yShift + Math.sin(time * 0.7 + i) * 0.05;
      // sanftes Schwenken statt Volldrehung – Produkt bleibt immer gut lesbar
      const sway = reduceMotion ? 0 : Math.sin(time * 0.45 + i * 1.3) * 0.42;
      p.rotation.y = p.userData.baseAngle + sway + (i - ci) * 0.35 + pX * 0.3;
      p.rotation.x = -0.02 + pY * 0.1;
    });

    // sanfte Kamera-Parallaxe
    camera.position.x = lerp(camera.position.x, pX * 0.5, 0.05);
    camera.position.y = lerp(camera.position.y, 0.4 - pY * 0.4, 0.05);
    camera.lookAt(centerX * 0.55, 0, 0);

    renderer.render(scene, camera);

    if (!started) {
      started = true;
      document.body.classList.add('stage-ready');
      if (loader) loader.classList.add('hidden');
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
