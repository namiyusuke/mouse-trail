import { Tween2 } from "./tween.js";
import GUI from "lil-gui";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const params = {
  count: 30,
  baseOmega: 12,
  omegaDecay: 0.3,
  baseSize: 20,
  sizeDecay: 0.4,
  hueSpeed: 60,
  trail: true,
  trailLength: 8,
};

let tweens = [];
let history = [];

function createTweens() {
  tweens = [];
  history = [];
  for (let i = 0; i < params.count; i++) {
    const omega = Math.max(params.baseOmega - i * params.omegaDecay, 0.5);
    tweens.push(new Tween2({ x: mouse.x, y: mouse.y }, omega));
  }
}

const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let prevTime = performance.now();
let elapsed = 0;

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawArrow(x, y, angle, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.6, -size * 0.5);
  ctx.lineTo(-size * 0.2, 0);
  ctx.lineTo(-size * 0.6, size * 0.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function animate() {
  const now = performance.now();
  const delta = (now - prevTime) / 1000;
  prevTime = now;
  elapsed += delta;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < tweens.length; i++) {
    const target = i === 0 ? mouse : tweens[i - 1].position;
    tweens[i].update(target, delta);
    tweens[i].calcDirection(target);
  }

  const snapshot = tweens.map((t, i) => ({
    x: t.x,
    y: t.y,
    angle: t.direction + Math.PI,
    size: Math.max(params.baseSize - i * params.sizeDecay, 3),
    hue: (i / params.count) * 360 + elapsed * params.hueSpeed,
  }));
  history.push(snapshot);
  if (history.length > params.trailLength) {
    history.shift();
  }

  if (params.trail) {
    for (let f = 0; f < history.length; f++) {
      const alpha = (f + 1) / history.length;
      ctx.globalAlpha = alpha * alpha;
      const frame = history[f];
      for (let i = 0; i < frame.length; i++) {
        const { x, y, angle, size, hue } = frame[i];
        drawArrow(x, y, angle, size, `hsl(${hue}, 80%, 60%)`);
      }
    }
    ctx.globalAlpha = 1;
  } else {
    for (let i = 0; i < snapshot.length; i++) {
      const { x, y, angle, size, hue } = snapshot[i];
      drawArrow(x, y, angle, size, `hsl(${hue}, 80%, 60%)`);
    }
  }

  requestAnimationFrame(animate);
}

createTweens();
animate();

// GUI
const gui = new GUI();
gui.add(params, "count", 1, 80, 1).name("Count").onChange(createTweens);
// gui.add(params, "baseOmega", 1, 30, 0.1);
// .name("Base Omega")
// .onChange(() => {
//   tweens.forEach((t, i) => {
//     t.omega = Math.max(params.baseOmega - i * params.omegaDecay, 0.5);
//   });
// });
gui
  .add(params, "omegaDecay", 0, 2, 0.05)
  .name("Omega Decay")
  .onChange(() => {
    tweens.forEach((t, i) => {
      t.omega = Math.max(params.baseOmega - i * params.omegaDecay, 0.5);
    });
  });
gui.add(params, "baseSize", 5, 40, 1).name("Base Size");
gui.add(params, "sizeDecay", 0, 2, 0.1).name("Size Decay");
gui.add(params, "hueSpeed", 0, 300, 1).name("Hue Speed");
gui.add(params, "trail").name("Trail");
gui.add(params, "trailLength", 2, 20, 1).name("Trail Length");
