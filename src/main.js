import { Tween2 } from "./tween.js";
import "../style.css";

const tween = new Tween2({ x: 0, y: 0 }, 6);
const box = document.getElementById("box");

if (box !== null) {
  const mouse = { x: 0, y: 0 };
  let prevTime = performance.now();
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    const now = performance.now();
    const delta = (now - prevTime) / 1000;
    prevTime = now;
    tween.update(mouse, delta);
    tween.calcDirection(mouse);
    const speed = Math.hypot(tween.velocity.x, tween.velocity.y);
    if (speed > 0.01) {
      box.style.transform = `translate(${tween.x}px, ${tween.y}px) rotate(${tween.direction}rad)`;
    } else {
      box.style.transform = `translate(${tween.x}px, ${tween.y}px)`;
    }
    requestAnimationFrame(animate);
  }
  animate();
}
