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
  renderer.toneMappingExposure = 1.05;

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

  /* ---------- Materials ---------- */
  const M = {
    skin: new THREE.MeshStandardMaterial({ color: 0xe7c0a4, roughness: 0.72, metalness: 0.0 }),
    stocking: new THREE.MeshPhysicalMaterial({ color: 0x262a36, roughness: 0.42, metalness: 0.0, sheen: 1.0, sheenColor: new THREE.Color(0x7d93b5), sheenRoughness: 0.6, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
    silicone: new THREE.MeshPhysicalMaterial({ color: 0x3a3f4d, roughness: 0.5, metalness: 0, clearcoat: 0.4 }),
    foam: new THREE.MeshStandardMaterial({ color: 0x12a39b, roughness: 0.85, metalness: 0.0 }),
    foamDark: new THREE.MeshStandardMaterial({ color: 0x0c6f6a, roughness: 0.9 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xe2e6ea, roughness: 0.16, metalness: 1.0 }),
    chromeSoft: new THREE.MeshStandardMaterial({ color: 0xc6ccd2, roughness: 0.3, metalness: 0.9 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x191c21, roughness: 0.82, metalness: 0.0 }),
    fabric: new THREE.MeshStandardMaterial({ color: 0x242832, roughness: 0.95, metalness: 0.0 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x0e8f8f, roughness: 0.38, metalness: 0.12 }),
    seat: new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: 0.9 })
  };

  function shadowy(obj) { return obj; }

  /* ======================================================
     PRODUKT 1 — Kompressionsstrumpf (Bein, Lathe)
     ====================================================== */
  function buildLeg() {
    const g = new THREE.Group();
    const pts = [
      [0.00, -2.20], [0.34, -2.20], [0.40, -1.70], [0.55, -1.05], [0.66, -0.45],
      [0.62, 0.10], [0.50, 0.55], [0.54, 1.10], [0.64, 1.75], [0.74, 2.45], [0.00, 2.55]
    ].map(p => new THREE.Vector2(p[0], p[1]));
    const leg = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), M.stocking);
    g.add(leg);
    // Silikon-Haftband oben
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 16, 96), M.silicone);
    band.position.y = 2.3; band.rotation.x = Math.PI / 2;
    g.add(band);
    // feiner Fuß-Andeutung (abgeflachte Kugel)
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), M.stocking);
    foot.scale.set(1, 0.62, 1.5); foot.position.set(0, -2.2, 0.32);
    g.add(foot);
    return shadowy(g);
  }

  /* ======================================================
     PRODUKT 2 — Orthopädische Einlage (Extrude + Wölbung)
     ====================================================== */
  function buildInsole() {
    const s = new THREE.Shape();
    // Sohlenkontur in XY (x=Breite, y=Länge: Ferse unten, Zehen oben)
    s.moveTo(0, -2.0);
    s.bezierCurveTo(0.7, -2.0, 0.75, -1.1, 0.66, -0.4);
    s.bezierCurveTo(0.58, 0.2, 0.74, 0.7, 0.78, 1.25);
    s.bezierCurveTo(0.8, 1.9, 0.45, 2.25, 0.0, 2.25);
    s.bezierCurveTo(-0.45, 2.25, -0.8, 1.9, -0.78, 1.25);
    s.bezierCurveTo(-0.74, 0.7, -0.58, 0.2, -0.66, -0.4);
    s.bezierCurveTo(-0.75, -1.1, -0.7, -2.0, 0.0, -2.0);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, curveSegments: 48 });
    geo.center();
    // Wölbung: Längsgewölbe + Fersenmulde durch Anheben der Vertices
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      // Längsgewölbe (medial betont) zur Kamera (+Z), dezente Fersenmulde
      const arch = Math.cos(clamp(y / 2.4, -1, 1) * 1.15) * 0.30 * Math.max(0, 1 - Math.abs(x) / 0.85);
      const heelCup = (y < -0.7 ? Math.min(0.16, Math.abs(x) * 0.22) : 0);
      pos.setZ(i, z + arch + heelCup);
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, M.foam);
    // aufrecht stehend (Ferse unten, Zehen oben), Fußbett zeigt zur Kamera, leicht zurückgelehnt
    mesh.rotation.x = -0.18;
    const g = new THREE.Group();
    g.add(mesh);
    return shadowy(g);
  }

  /* ======================================================
     PRODUKT 3 — Knieorthese
     ====================================================== */
  function buildBrace() {
    const g = new THREE.Group();
    // Bein-Segment
    const legPts = [
      [0.0, -2.0], [0.5, -2.0], [0.52, -1.2], [0.6, -0.2], [0.66, 0.0],
      [0.6, 0.2], [0.52, 1.2], [0.5, 2.0], [0.0, 2.0]
    ].map(p => new THREE.Vector2(p[0], p[1]));
    const leg = new THREE.Mesh(new THREE.LatheGeometry(legPts, 64), M.skin);
    g.add(leg);
    // Stoff-Manschette
    const sleevePts = [
      [0.0, -1.5], [0.6, -1.5], [0.64, -0.6], [0.72, 0.0], [0.64, 0.6], [0.6, 1.5], [0.0, 1.5]
    ].map(p => new THREE.Vector2(p[0], p[1]));
    const sleeve = new THREE.Mesh(new THREE.LatheGeometry(sleevePts, 64), M.fabric);
    g.add(sleeve);
    // Seitliche Scharniere + Streben
    [-1, 1].forEach(sx => {
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32), M.chrome);
      hinge.rotation.z = Math.PI / 2; hinge.position.set(sx * 0.74, 0, 0);
      g.add(hinge);
      const barU = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.2, 0.16), M.chromeSoft);
      barU.position.set(sx * 0.74, 0.62, 0); g.add(barU);
      const barL = barU.clone(); barL.position.y = -0.62; g.add(barL);
    });
    // Klettgurte
    [0.95, -0.95].forEach(y => {
      const strap = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.08, 12, 64), M.fabric);
      strap.position.y = y; strap.rotation.x = Math.PI / 2; strap.scale.z = 0.5; g.add(strap);
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.1), M.accent);
      buckle.position.set(0, y, 0.7); g.add(buckle);
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
      const wl = wheel(R, 0.1, 14, M.rubber, M.chrome);
      wl.rotation.y = Math.PI / 2;
      wl.position.set(sx * 1.15, R, -0.1);
      g.add(wl);
      // Greifring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R - 0.06, 0.035, 12, 64), M.chromeSoft);
      ring.rotation.y = Math.PI / 2; ring.position.set(sx * 1.28, R, -0.1); g.add(ring);
    });
    // Vorderräder (Castor)
    [-1, 1].forEach(sx => {
      const c = wheel(0.32, 0.07, 8, M.rubber, M.chromeSoft);
      c.rotation.y = Math.PI / 2; c.position.set(sx * 0.78, 0.32, 1.25); g.add(c);
    });
    // Rahmen
    const F = M.chrome;
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
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.32, 16), M.fabric);
      grip.position.set(sx * 0.78, 2.52, -1.12); grip.rotation.z = Math.PI / 2; g.add(grip);
      // Armlehne
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.9), M.fabric);
      arm.position.set(sx * 0.92, 1.5, 0.1); g.add(arm);
      g.add(tube(sx * 0.92, 1.46, 0.5, sx * 0.92, 1.0, 0.7, 0.04, F));
    });
    // Fußstützen
    [-1, 1].forEach(sx => {
      const fp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.4), M.fabric);
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
    [buildLeg, 3.0, -0.25, 0],
    [buildInsole, 3.0, -0.55, 0],
    [buildBrace, 3.0, -0.20, 0],
    [buildWheelchair, 3.25, 0.55, 0],
    [buildCane, 3.1, -0.30, 0]
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
  const CENTER_OFFSET = 2.15;
  let pointerX = 0, pointerY = 0, pX = 0, pY = 0;

  const isMobile = () => window.innerWidth < 760;
  const sceneEls = Array.from(scenesEl.querySelectorAll('.scene'));

  function updateScroll() {
    const rect = scenesEl.getBoundingClientRect();
    const vh = window.innerHeight, mid = vh / 2;
    // ci aus den Szenen-Mittelpunkten interpolieren -> rastet exakt auf ganze Indizes
    const centers = sceneEls.map(s => { const r = s.getBoundingClientRect(); return r.top + r.height / 2; });
    let idx = 0;
    if (mid <= centers[0]) idx = 0;
    else if (mid >= centers[N - 1]) idx = N - 1;
    else for (let k = 0; k < N - 1; k++) {
      if (mid >= centers[k] && mid <= centers[k + 1]) { idx = k + (mid - centers[k]) / (centers[k + 1] - centers[k]); break; }
    }
    ciTarget = idx;
    const active = clamp(Math.round(ciTarget), 0, N - 1);
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
      const vis = smoothstep(0.95, 0.32, d); // 1 wenn aktiv, 0 wenn weit weg
      if (vis <= 0.002) { p.visible = false; return; }
      p.visible = true;
      setOpacity(p, vis);
      const s = (0.9 + 0.1 * vis) * mobScale;
      p.scale.setScalar(s);
      // Mobile: reiner Crossfade (zentriert). Desktop: dezenter Slide.
      p.position.x = centerX + (i - ci) * (mob ? 0 : 1.4);
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
