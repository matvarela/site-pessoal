import * as THREE from 'three';
import SplineLoader from '@splinetool/loader';

const canvas = document.getElementById('splineCanvas');
if (!canvas) {
    console.warn("Spline Canvas not found");
}

// 1. Set up Camera
const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -50000, 10000);
camera.position.set(0, 0, 0);
camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

// 2. Set up Scene
const scene = new THREE.Scene();
scene.background = null; // Transparent background so the site shows through

// 3. Set up Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearAlpha(0); // Transparent
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// 4. Wrap the Spline model so GSAP animates the wrapper, and Mouse animates the model itself
const gsapWrapper = new THREE.Group();
scene.add(gsapWrapper);

let logoModel = null;

// 5. Load Spline Scene
const loader = new SplineLoader();
loader.load(
  'https://prod.spline.design/wGJkXg-sCaAJPHIJ/scene.splinecode',
  (splineScene) => {
    logoModel = splineScene;
    gsapWrapper.add(splineScene);
    
    // Hide the model initially to avoid a flash before GSAP sets its position
    gsapWrapper.visible = false;
    
    // Set up GSAP Waypoints once loaded
    setupGSAPWaypoints();
    
    // Reveal after setup
    gsapWrapper.visible = true;
  }
);

// 6. Handle Window Resize
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 7. Handle Mouse Movement (Floating/Rotation Effect)
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

window.addEventListener('mousemove', (e) => {
  // Normalize mouse coordinates from -1 to 1
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 8. Render Loop
renderer.setAnimationLoop((time) => {
  if (logoModel) {
    // Apply gentle rotation based on mouse position
    // We dampen the movement (0.05) so it floats smoothly towards the target
    targetRotationY = mouseX * 0.3; // Max rotation angle on Y
    targetRotationX = mouseY * 0.3; // Max rotation angle on X
    
    logoModel.rotation.y += (targetRotationY - logoModel.rotation.y) * 0.05;
    logoModel.rotation.x += (targetRotationX - logoModel.rotation.x) * 0.05;
  }
  
  renderer.render(scene, camera);
});


// 9. GSAP ScrollTrigger Setup
function setupGSAPWaypoints() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  // A. Set Initial State (Right side of the Hero section)
  // For orthographic camera, units are roughly pixels
  gsap.set(gsapWrapper.position, { 
      x: w * 0.25, 
      y: h * 0.1 
  });
  
  gsap.set(gsapWrapper.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8
  });

  // B. Create the Timeline linked to scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      endTrigger: "#about", // The timeline ends when the "#about" section is fully passed
      end: "bottom center", // specifically when the bottom of #about hits the center of viewport
      scrub: 1,             // 1-second smoothing effect for ultra-fluid movement
    }
  });

  // C. Add Waypoints to Timeline
  
  // Waypoint 1: Move to center and scale up
  tl.to(gsapWrapper.position, {
    x: 0, // Move to center
    y: 0,
    ease: "power2.inOut",
    duration: 1
  }, 0);

  tl.to(gsapWrapper.scale, {
    x: 1.2, // Increase size when it hits the center
    y: 1.2,
    z: 1.2,
    ease: "power2.inOut",
    duration: 1
  }, 0);
  
  // Optional: Add a subtle spin to the GSAP wrapper as it moves
  tl.to(gsapWrapper.rotation, {
    y: Math.PI * 1, // Half spin
    z: 0.1, // Slight tilt
    ease: "none",
    duration: 1
  }, 0);
  
  // Refresh ScrollTrigger to ensure correct calculations after DOM load
  ScrollTrigger.refresh();
}
