import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.183.2/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.183.2/examples/jsm/controls/OrbitControls.js";

const materialOptions = [
  { name: "CR-39 (Standard)", index: 1.498 },
  { name: "Trivex", index: 1.53 },
  { name: "Polycarbonate", index: 1.586 },
  { name: "High Index 1.60", index: 1.6 },
  { name: "High Index 1.67", index: 1.67 },
  { name: "High Index 1.74", index: 1.74 },
];

const frameStyles = [
  { value: "plastic", label: "Plastic / Acetate" },
  { value: "metal", label: "Metal" },
  { value: "semi-rimless", label: "Semi-Rimless" },
  { value: "rimless", label: "Rimless" },
];

const state = {
  sphere: -6.5,
  cylinder: 0,
  axis: 180,
  index: 1.67,
  pd: 64,
  eyesize: 52,
  dbl: 18,
  ed: 54,
  style: "metal",
};

const refs = {
  frameStyle: document.getElementById("frameStyle"),
  lensIndex: document.getElementById("lensIndex"),
  pd: document.getElementById("pd"),
  eyeSize: document.getElementById("eyeSize"),
  dbl: document.getElementById("dbl"),
  ed: document.getElementById("ed"),
  sphere: document.getElementById("sphere"),
  resetButton: document.getElementById("resetButton"),
  themeToggle: document.getElementById("themeToggle"),
  resultDecentration: document.getElementById("resultDecentration"),
  resultTemporal: document.getElementById("resultTemporal"),
  resultProtrusion: document.getElementById("resultProtrusion"),
  resultNasal: document.getElementById("resultNasal"),
  resultCenter: document.getElementById("resultCenter"),
  calcToggle: document.getElementById("calcToggle"),
  calculatorOverlay: document.getElementById("calculatorOverlay"),
  calcClose: document.getElementById("calcClose"),
  calcValue: document.getElementById("calcValue"),
  calcPlus6: document.getElementById("calcPlus6"),
  calcMinus20: document.getElementById("calcMinus20"),
  calcMinus10: document.getElementById("calcMinus10"),
  calcClear: document.getElementById("calcClear"),
  resultMax: document.getElementById("resultMax"),
  resultFrameDepth: document.getElementById("resultFrameDepth"),
  sceneContainer: document.getElementById("sceneContainer"),
};

let scene, camera, renderer, controls, glassesGroup, reflectionTexture;
let calculatorDisplay = "0";
let calculatorOperator = null;
let calculatorOperand = null;
let calculatorWaitingForOperand = false;
let reflectionSources = ["panel.png", "calculator.png", "pal.png", "PAL.JPG"];
let reflectionSourceIndex = 0;

function ensureRefs() {
  const missing = Object.entries(refs)
    .filter(([, el]) => !el)
    .map(([key]) => key);
  if (missing.length > 0) {
    showStatus(`Missing required DOM elements: ${missing.join(", ")}`, true);
    console.error("Missing required DOM elements:", missing.join(", "));
    return false;
  }
  return true;
}

function showStatus(message, isError = false) {
  const status = document.getElementById("statusMessage");
  if (status) {
    status.textContent = message;
    status.style.color = isError ? "#f87171" : "var(--accent)";
  }
}

function createOptions() {
  if (!ensureRefs()) return;

  refs.frameStyle.innerHTML = frameStyles
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  refs.lensIndex.innerHTML = materialOptions
    .map((option) => `<option value="${option.index}">${option.name}</option>`)
    .join("");
}

function updateInputs() {
  if (!ensureRefs()) return;

  refs.frameStyle.value = state.style;
  refs.lensIndex.value = state.index;
  refs.pd.value = state.pd;
  refs.eyeSize.value = state.eyesize;
  refs.dbl.value = state.dbl;
  refs.ed.value = state.ed;
  refs.sphere.value = state.sphere;
}

function parseNumber(value, fallback = 0) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function refreshState() {
  state.style = refs.frameStyle.value;
  state.index = parseNumber(refs.lensIndex.value, state.index);
  state.pd = parseNumber(refs.pd.value, state.pd);
  state.eyesize = parseNumber(refs.eyeSize.value, state.eyesize);
  state.dbl = parseNumber(refs.dbl.value, state.dbl);
  state.ed = parseNumber(refs.ed.value, state.ed);
  state.sphere = parseNumber(refs.sphere.value, state.sphere);
}

function updateMetrics(result) {
  refs.resultDecentration.textContent = `${result.decentration.toFixed(1)} mm`;
  refs.resultTemporal.textContent = `${result.temporalEdgeThickness.toFixed(1)} mm`;
  const protrusion = Math.max(
    0,
    result.temporalEdgeThickness - result.frameDepth,
  );
  refs.resultProtrusion.textContent =
    protrusion > 0
      ? `Caution: ${protrusion.toFixed(1)} mm protrusion beyond frame`
      : "No protrusion beyond frame";
  refs.resultProtrusion.style.color =
    protrusion > 0 ? "#dc2626" : "var(--text-main)";
  refs.resultNasal.textContent = `${result.nasalEdgeThickness.toFixed(1)} mm`;
  refs.resultCenter.textContent = `${result.centerThickness.toFixed(1)} mm`;
  refs.resultMax.textContent = `${result.maxThickness.toFixed(1)} mm`;
  refs.resultFrameDepth.textContent = `${result.frameDepth.toFixed(1)} mm`;
}

function initializeControls() {
  refs.frameStyle.addEventListener("change", handleInputChange);
  refs.lensIndex.addEventListener("change", handleInputChange);
  refs.pd.addEventListener("input", handleInputChange);
  refs.eyeSize.addEventListener("input", handleInputChange);
  refs.dbl.addEventListener("input", handleInputChange);
  refs.ed.addEventListener("input", handleInputChange);
  refs.sphere.addEventListener("input", handleInputChange);
  refs.calcToggle.addEventListener("click", openCalculator);
  refs.calcClose.addEventListener("click", closeCalculator);
  refs.calculatorOverlay.addEventListener("click", (event) => {
    if (event.target === refs.calculatorOverlay) closeCalculator();
  });
  document.querySelectorAll(".calculator-key").forEach((button) => {
    button.addEventListener("click", handleCalculatorKey);
  });

  refs.resetButton.addEventListener("click", () => {
    Object.assign(state, {
      sphere: -4.0,
      cylinder: 0,
      axis: 180,
      index: 1.498,
      pd: 63,
      eyesize: 50,
      dbl: 20,
      ed: 52,
      style: "plastic",
    });
    updateInputs();
    handleInputChange();
  });

  refs.themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    refs.themeToggle.textContent = document.body.classList.contains("dark")
      ? "☀️"
      : "🌙";
  });
}

function openCalculator() {
  if (!ensureRefs()) return;
  refs.calculatorOverlay.classList.remove("hidden");
  updateCalculatorDisplay();
}

function closeCalculator() {
  if (!ensureRefs()) return;
  refs.calculatorOverlay.classList.add("hidden");
}

function updateCalculatorDisplay() {
  if (!ensureRefs()) return;
  refs.calcValue.textContent = calculatorDisplay;
}

function handleCalculatorKey(event) {
  const button = event.currentTarget;
  const key = button.dataset.key;
  const action = button.dataset.action;

  if (action) {
    switch (action) {
      case "clear":
        resetCalculator();
        break;
      case "equal":
        calculateResult();
        break;
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        setCalculatorOperator(action);
        break;
      case "percent6":
        applyCalculatorPercent(1.06);
        break;
      case "percent10":
        applyCalculatorPercent(0.9);
        break;
      case "percent20":
        applyCalculatorPercent(0.8);
        break;
    }
    return;
  }

  if (key) {
    if (key === ".") {
      inputDecimal();
    } else {
      inputDigit(key);
    }
  }
}

function inputDigit(digit) {
  if (calculatorWaitingForOperand) {
    calculatorDisplay = digit;
    calculatorWaitingForOperand = false;
  } else {
    calculatorDisplay =
      calculatorDisplay === "0" ? digit : calculatorDisplay + digit;
  }
  updateCalculatorDisplay();
}

function inputDecimal() {
  if (calculatorWaitingForOperand) {
    calculatorDisplay = "0.";
    calculatorWaitingForOperand = false;
  } else if (!calculatorDisplay.includes(".")) {
    calculatorDisplay += ".";
  }
  updateCalculatorDisplay();
}

function setCalculatorOperator(nextOperator) {
  const inputValue = parseFloat(calculatorDisplay);
  if (calculatorOperator && !calculatorWaitingForOperand) {
    const result = performCalculatorOperation(
      calculatorOperator,
      calculatorOperand,
      inputValue,
    );
    calculatorDisplay = String(result);
    calculatorOperand = result;
  } else {
    calculatorOperand = inputValue;
  }

  calculatorOperator = nextOperator;
  calculatorWaitingForOperand = true;
  updateCalculatorDisplay();
}

function calculateResult() {
  const inputValue = parseFloat(calculatorDisplay);
  if (calculatorOperator && calculatorOperand !== null) {
    const result = performCalculatorOperation(
      calculatorOperator,
      calculatorOperand,
      inputValue,
    );
    calculatorDisplay = String(result);
    calculatorOperand = null;
    calculatorOperator = null;
    calculatorWaitingForOperand = true;
    updateCalculatorDisplay();
  }
}

function performCalculatorOperation(operator, left, right) {
  switch (operator) {
    case "add":
      return left + right;
    case "subtract":
      return left - right;
    case "multiply":
      return left * right;
    case "divide":
      return right === 0 ? 0 : left / right;
    default:
      return right;
  }
}

function applyCalculatorPercent(factor) {
  const currentValue = parseFloat(calculatorDisplay) || 0;
  calculatorDisplay = String(parseFloat((currentValue * factor).toFixed(2)));
  calculatorWaitingForOperand = true;
  updateCalculatorDisplay();
}

function resetCalculator() {
  calculatorDisplay = "0";
  calculatorOperator = null;
  calculatorOperand = null;
  calculatorWaitingForOperand = false;
  updateCalculatorDisplay();
}

function handleInputChange() {
  refreshState();
  const result = calculateLensThickness(state);
  updateMetrics(result);
  updateGlasses(result);
}

window.addEventListener("error", (event) => {
  showStatus(`Script error: ${event.message}`, true);
});

window.addEventListener("unhandledrejection", (event) => {
  showStatus(`Unhandled promise rejection: ${event.reason}`, true);
});

function initThree() {
  if (!ensureRefs()) return;

  scene = new THREE.Scene();
  const width = Math.max(refs.sceneContainer.clientWidth, 320);
  const height = Math.max(refs.sceneContainer.clientHeight, 360);

  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = false;
  refs.sceneContainer.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI - Math.PI / 4;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(10, 10, 10);
  spotLight.angle = 0.15;
  spotLight.penumbra = 1;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(2048, 2048);
  scene.add(spotLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(-10, -10, -10);
  scene.add(pointLight);

  if (reflectionTexture) {
    scene.environment = reflectionTexture;
  }

  const head = createHeadModel();
  scene.add(head);

  const initialResult = calculateLensThickness(state);
  glassesGroup = createGlassesModel(initialResult, state);
  scene.add(glassesGroup);

  updateMetrics(initialResult);
  animate();
  showStatus("Opticalc Pro loaded successfully.");
}

function updateSceneSize() {
  const width = Math.max(refs.sceneContainer.clientWidth, 320);
  const height = Math.max(refs.sceneContainer.clientHeight, 360);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function createHeadModel() {
  const group = new THREE.Group();
  group.position.set(0, -0.2, 0);

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: "#fcd4b4",
    roughness: 0.7,
  });
  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    skinMaterial,
  );
  headMesh.scale.set(1, 1.3, 0.9);
  headMesh.castShadow = true;
  group.add(headMesh);

  const browMaterial = new THREE.MeshStandardMaterial({
    color: "#4b3621",
    roughness: 0.5,
  });
  const browLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.04, 0.02),
    browMaterial,
  );
  browLeft.position.set(0.32, 0, 0.85);
  browLeft.rotation.y = 0.1;
  browLeft.castShadow = true;
  group.add(browLeft);

  const browRight = browLeft.clone();
  browRight.position.set(-0.32, 0, 0.85);
  browRight.rotation.y = -0.1;
  group.add(browRight);

  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.1,
  });
  const irisMaterial = new THREE.MeshStandardMaterial({
    color: "#225588",
    roughness: 0.2,
  });
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: "#000000",
    roughness: 0.1,
  });
  const eyelidMaterial = new THREE.MeshStandardMaterial({
    color: "#fcd4b4",
    roughness: 0.8,
  });

  [
    ["left", 0.32],
    ["right", -0.32],
  ].forEach(([side, x]) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(x, 0, 0.78);

    const eyeball = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      eyeWhiteMaterial,
    );
    eyeball.castShadow = true;
    eyeGroup.add(eyeball);

    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3),
      irisMaterial,
    );
    iris.position.set(0, 0, 0.07);
    eyeGroup.add(iris);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      pupilMaterial,
    );
    pupil.position.set(0, 0, 0.085);
    eyeGroup.add(pupil);

    const upperEyelid = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      eyelidMaterial,
    );
    upperEyelid.rotation.x = -0.5;
    upperEyelid.position.set(0, 0.04, 0.02);
    eyeGroup.add(upperEyelid);

    group.add(eyeGroup);
  });

  // Create realistic lips and mouth
  const lipMaterial = new THREE.MeshStandardMaterial({
    color: "#d4856a",
    roughness: 0.4,
  });
  const innerMouthMaterial = new THREE.MeshStandardMaterial({
    color: "#c97060",
    roughness: 0.3,
  });

  // Upper lip
  const upperLip = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    lipMaterial,
  );
  upperLip.scale.set(1, 0.35, 0.5);
  upperLip.position.set(0, -0.42, 0.78);
  upperLip.castShadow = true;
  group.add(upperLip);

  // Lower lip
  const lowerLip = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    lipMaterial,
  );
  lowerLip.scale.set(1, 0.4, 0.55);
  lowerLip.position.set(0, -0.5, 0.77);
  lowerLip.rotation.x = Math.PI;
  lowerLip.castShadow = true;
  group.add(lowerLip);

  // Mouth opening (slight gap between lips)
  const mouthOpening = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.02, 0.03),
    innerMouthMaterial,
  );
  mouthOpening.position.set(0, -0.46, 0.79);
  group.add(mouthOpening);

  // Cupid's bow (subtle detail on upper lip)
  const cupidsBowLeft = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 16, 16),
    lipMaterial,
  );
  cupidsBowLeft.scale.set(1, 0.6, 0.8);
  cupidsBowLeft.position.set(-0.04, -0.41, 0.8);
  group.add(cupidsBowLeft);

  const cupidsBowRight = cupidsBowLeft.clone();
  cupidsBowRight.position.set(0.04, -0.41, 0.8);
  group.add(cupidsBowRight);

  const earMaterial = skinMaterial.clone();
  const leftEar = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    earMaterial,
  );
  leftEar.position.set(1, 0, -0.1);
  leftEar.rotation.y = 0.2;
  leftEar.castShadow = true;
  group.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.set(-1, 0, -0.1);
  rightEar.rotation.y = -0.2;
  group.add(rightEar);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.4, 4),
    skinMaterial,
  );
  nose.position.set(0, -0.1, 0.9);
  nose.castShadow = true;
  group.add(nose);

  return group;
}

function createGlassesModel(result, input) {
  const group = new THREE.Group();
  group.position.set(0, -0.15, 0.9);

  const scale = 0.014;
  const eyesizeScaled = input.eyesize * scale;
  const dblScaled = input.dbl * scale;
  const frameDepth = result.frameDepth * scale;
  const frameColor =
    input.style === "metal"
      ? "#a0a0a0"
      : input.style === "plastic"
        ? "#202020"
        : "#404040";

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(dblScaled, 2 * scale, 2 * scale),
    new THREE.MeshStandardMaterial({ color: frameColor }),
  );
  bridge.castShadow = true;
  group.add(bridge);

  group.add(
    createLensPair(
      "left",
      input,
      result,
      reflectionTexture,
      frameColor,
      eyesizeScaled,
      dblScaled,
      frameDepth,
      scale,
    ),
  );
  group.add(
    createLensPair(
      "right",
      input,
      result,
      reflectionTexture,
      frameColor,
      eyesizeScaled,
      dblScaled,
      frameDepth,
      scale,
    ),
  );

  return group;
}

function createLensPair(
  side,
  input,
  result,
  envMap,
  frameColor,
  eyesizeScaled,
  dblScaled,
  frameDepth,
  scale,
) {
  const isLeft = side === "left";
  const posX = (isLeft ? 1 : -1) * (dblScaled / 2 + eyesizeScaled / 2);
  const pair = new THREE.Group();
  pair.position.set(posX, 0, 0);

  if (input.style !== "rimless") {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(
        eyesizeScaled / 2,
        eyesizeScaled / 2 + eyesizeScaled * 0.05,
        32,
      ),
      new THREE.MeshStandardMaterial({
        color: frameColor,
        side: THREE.DoubleSide,
      }),
    );
    ring.position.set(0, 0, 0.01);
    ring.castShadow = true;
    pair.add(ring);
  }

  if (["plastic", "metal", "semi-rimless"].includes(input.style)) {
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(
        eyesizeScaled / 2 + eyesizeScaled * 0.01,
        eyesizeScaled / 2 + eyesizeScaled * 0.01,
        frameDepth,
        32,
        1,
        true,
      ),
      new THREE.MeshStandardMaterial({
        color: frameColor,
        side: THREE.DoubleSide,
      }),
    );
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0, 0, -frameDepth / 2);
    arm.castShadow = true;
    pair.add(arm);
  }

  const lens = createLensBody(isLeft, eyesizeScaled, result, envMap);
  pair.add(lens);

  return pair;
}

function createLensBody(isLeft, eyesizeScaled, result, envMap) {
  const avgEdgeT =
    ((result.temporalEdgeThickness + result.nasalEdgeThickness) / 2) * 0.014;
  const diff =
    (result.temporalEdgeThickness - result.nasalEdgeThickness) * 0.014;
  const angle = Math.atan(diff / eyesizeScaled) * (isLeft ? 1 : -1);

  const group = new THREE.Group();

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.85,
    roughness: 0.2,
    metalness: 0.1,
    envMap: envMap || null,
    envMapIntensity: 1,
  });

  const faceMaterial = new THREE.MeshStandardMaterial({
    color: "#aaddff",
    transparent: true,
    opacity: 0.25,
    roughness: 0,
    metalness: 0.5,
    envMap: envMap || null,
    envMapIntensity: 1,
  });

  const lensMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(
      eyesizeScaled / 2,
      eyesizeScaled / 2,
      avgEdgeT,
      32,
    ),
    [sideMaterial, faceMaterial, faceMaterial],
  );
  lensMesh.rotation.x = Math.PI / 2;
  lensMesh.rotation.y = angle;
  lensMesh.position.set(0, 0, -avgEdgeT / 2);
  lensMesh.castShadow = true;
  group.add(lensMesh);

  const overlay = new THREE.Mesh(
    new THREE.CircleGeometry(eyesizeScaled / 2, 32),
    new THREE.MeshStandardMaterial({
      envMap: envMap || null,
      color: "#ffffff",
      transparent: true,
      opacity: 0.35,
      roughness: 0,
      metalness: 1,
      envMapIntensity: 2.5,
    }),
  );
  overlay.position.set(0, 0, 0.005);
  overlay.castShadow = true;
  group.add(overlay);

  return group;
}

function updateGlasses(result) {
  if (!glassesGroup) return;
  scene.remove(glassesGroup);
  glassesGroup = createGlassesModel(result, state);
  scene.add(glassesGroup);
}

function calculateSag(h, f, n) {
  if (f === 0) return 0;
  const R = (1000 * (n - 1)) / Math.abs(f);
  if (h >= R) return R;
  return R - Math.sqrt(R * R - h * h);
}

function calculateLensThickness(inputData) {
  const { sphere, cylinder, pd, eyesize, dbl, ed, index, style } = inputData;
  const gcd = eyesize + dbl;
  const decentration = Math.abs((gcd - pd) / 2);
  const power1 = sphere;
  const power2 = sphere + cylinder;
  const maxPower = Math.max(Math.abs(power1), Math.abs(power2));
  const isMinus = sphere + cylinder / 2 < 0;
  let centerThickness = 2.0;
  let edgeThickness = 2.0;

  if (isMinus) {
    centerThickness = index >= 1.6 ? 1.5 : 2.0;
    const temporalRadius = eyesize / 2 + decentration;
    const nasalRadius = Math.max(0, eyesize / 2 - decentration);
    const temporalSag = calculateSag(temporalRadius, maxPower, index);
    const nasalSag = calculateSag(nasalRadius, maxPower, index);
    const temporalEdgeThickness = centerThickness + temporalSag;
    const nasalEdgeThickness = centerThickness + nasalSag;
    return {
      decentration,
      centerThickness,
      temporalEdgeThickness,
      nasalEdgeThickness,
      maxThickness: Math.max(temporalEdgeThickness, nasalEdgeThickness),
      frameDepth: getFrameDepth(style),
    };
  }

  edgeThickness = 1.0;
  const furthestRadius = ed / 2 + decentration;
  const centerSag = calculateSag(furthestRadius, maxPower, index);
  centerThickness = edgeThickness + centerSag;
  const temporalEdgeThickness = Math.max(
    edgeThickness,
    centerThickness - calculateSag(eyesize / 2 + decentration, maxPower, index),
  );
  const nasalEdgeThickness = Math.max(
    edgeThickness,
    centerThickness -
      calculateSag(Math.max(0, eyesize / 2 - decentration), maxPower, index),
  );
  return {
    decentration,
    centerThickness,
    temporalEdgeThickness,
    nasalEdgeThickness,
    maxThickness: centerThickness,
    frameDepth: getFrameDepth(style),
  };
}

function getFrameDepth(style) {
  switch (style) {
    case "plastic":
      return 5.0;
    case "metal":
      return 2.5;
    case "semi-rimless":
      return 2.5;
    case "rimless":
      return 1.0;
    default:
      return 3.0;
  }
}

window.addEventListener("resize", () => {
  if (renderer && camera) {
    updateSceneSize();
  }
});

showStatus("Script loaded, initializing…");
createOptions();
updateInputs();
initializeControls();
showStatus("Controls initialized. Frame and material options loaded.");

function setReflectionTexture(texture) {
  reflectionTexture = texture;
  reflectionTexture.mapping = THREE.EquirectangularReflectionMapping;
  reflectionTexture.repeat.set(2, 2);
  reflectionTexture.offset.set(-0.5, -0.25);
  reflectionTexture.wrapS = THREE.RepeatWrapping;
  reflectionTexture.wrapT = THREE.RepeatWrapping;
  initThree();
}

function loadReflectionTexture() {
  const source = reflectionSources[reflectionSourceIndex];
  new THREE.TextureLoader().load(
    source,
    setReflectionTexture,
    undefined,
    () => {
      reflectionSourceIndex += 1;
      if (reflectionSourceIndex < reflectionSources.length) {
        loadReflectionTexture();
      } else {
        initThree();
      }
    },
  );
}

loadReflectionTexture();
