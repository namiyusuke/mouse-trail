import { Tween2 } from "./tween.js";
import GUI from "lil-gui";

const params = {
  count: 20,
  baseOmega: 12,
  omegaDecay: 0.4,
  baseSize: 30,
  sizeDecay: 1,
  hue: 0,
  saturation: 80,
  lightness: 60,
};

let dots = [];
let tweens = [];

function createDots() {
  dots.forEach((el) => el.remove());
  dots = [];
  tweens = [];

  for (let i = 0; i < params.count; i++) {
    const omega = params.baseOmega - i * params.omegaDecay;
    const size = Math.max(params.baseSize - i * params.sizeDecay, 4);
    const hue = params.hue + (i / params.count) * 360;

    const el = document.createElement("div");
    el.className = "dot";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.background = `hsl(${hue}, ${params.saturation}%, ${params.lightness}%)`;
    document.body.appendChild(el);

    dots.push(el);
    tweens.push(new Tween2({ x: mouse.x, y: mouse.y }, Math.max(omega, 0.5)));
  }
}

function updateColors() {
  for (let i = 0; i < dots.length; i++) {
    const hue = params.hue + (i / params.count) * 360;
    dots[i].style.background = `hsl(${hue}, ${params.saturation}%, ${params.lightness}%)`;
  }
}

function updateOmega() {
  for (let i = 0; i < tweens.length; i++) {
    tweens[i].omega = Math.max(params.baseOmega - i * params.omegaDecay, 0.5);
  }
}

function updateSize() {
  for (let i = 0; i < dots.length; i++) {
    const size = Math.max(params.baseSize - i * params.sizeDecay, 4);
    dots[i].style.width = size + "px";
    dots[i].style.height = size + "px";
  }
}

const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let prevTime = performance.now();
let elapsed = 0;

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  const now = performance.now();
  const delta = (now - prevTime) / 1000;
  prevTime = now;
  elapsed += delta;
  for (let i = 0; i < tweens.length; i++) {
    const target = i === 0 ? mouse : tweens[i - 1].position;
    tweens[i].update(target, delta);
    tweens[i].calcDirection(target);
    const hw = dots[i].offsetWidth / 2;
    dots[i].style.transform =
      `translate(${tweens[i].x - hw}px, ${tweens[i].y - hw}px) rotate(${tweens[i].direction + Math.PI}rad)`;
    const hue = params.hue + (i / params.count) * 360 + elapsed * 160;
    dots[i].style.background = `hsl(${hue}, ${params.saturation}%, ${params.lightness}%)`;
  }
  requestAnimationFrame(animate);
}

createDots();
animate();

// GUI
const gui = new GUI();
