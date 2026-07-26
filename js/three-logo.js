import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('splineCanvas');
if (!canvas) {
    console.warn("Logo Canvas not found");
}

// 1. Set up Camera (using PerspectiveCamera instead of Orthographic for better 3D depth)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);

// 2. Set up Scene
const scene = new THREE.Scene();
scene.background = null;

// Add some lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. Set up Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearAlpha(0); // Transparent

// 4. Wrap the model so GSAP animates the wrapper, and Mouse animates the model itself
const logoGroup = new THREE.Group(); // For ScrollTrigger
const spinGroup = new THREE.Group(); // For mousedown spin
logoGroup.add(spinGroup);
scene.add(logoGroup);

let logoMesh = null;

// 5. Load GLTF Model
const loader = new GLTFLoader();
loader.load(
  'logo-3d.gltf',
  (gltf) => {
    logoMesh = gltf.scene;

    // Optional: Center and scale the model depending on its original size
    // logoMesh.scale.set(1, 1, 1);

    // Add to group
    spinGroup.add(logoMesh);

    // Hide the model initially to avoid a flash before GSAP sets its position
    logoGroup.visible = false;

    // Set up GSAP Waypoints once loaded
    setupGSAPWaypoints();

    // Reveal after setup
    logoGroup.visible = true;
  },
  undefined,
  (error) => {
    console.error("Error loading logo-3d.gltf:", error);
  }
);

// 6. Handle Window Resize
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateLogoScaleForMobile();
}

function updateLogoScaleForMobile() {
  if (window.innerWidth < 768) {
    logoGroup.scale.set(0.03, 0.03, 0.03); // Slightly larger on mobile
  } else {
    logoGroup.scale.set(0.05, 0.05, 0.05);
  }
}


// 7. Handle Mouse Interaction (Floating/Rotation Effect & Click)
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
window.addEventListener('mousemove', (e) => {
  // Normalize mouse coordinates from -1 to 1
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (logoMesh) {
    // Anime com GSAP (com easing suave como 'power2.out' e duração de ~0.8s)
    gsap.to(logoMesh.rotation, {
      x: mouse.y * 0.5,
      y: mouse.x * 0.5,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto"
    });
  }
});


let isMouseDown = false;
let returnTween = null;
let spinTween = null;

function handleDown(e) {
  let clientX = e.clientX;
  let clientY = e.clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (logoMesh) {
    const intersects = raycaster.intersectObject(logoGroup, true);
    if (intersects.length > 0) {
      isMouseDown = true;
      if (returnTween) returnTween.kill();

      // Continuous spin
      spinTween = gsap.to(spinGroup.rotation, {
        y: "+=" + Math.PI * 10, // Just keep spinning
        duration: 5.0,
        ease: "power2.in",
        overwrite: "auto"
      });
    }
  }
}

window.addEventListener('mousedown', handleDown);
window.addEventListener('touchstart', handleDown);

function handleUp() {
  if (isMouseDown && logoMesh) {
    isMouseDown = false;
    if (spinTween) spinTween.kill();

    // Slow return
    returnTween = gsap.to(spinGroup.rotation, {
      y: Math.round(spinGroup.rotation.y / (Math.PI * 2)) * Math.PI * 2, // nearest full rotation
      duration: 1.5,
      ease: "power2.out",
      overwrite: "auto"
    });
  }
}

window.addEventListener('mouseup', handleUp);
window.addEventListener('touchend', handleUp);
window.addEventListener('mouseleave', handleUp);

// 8. Render Loop
renderer.setAnimationLoop((time) => {
  renderer.render(scene, camera);
});


// 9. GSAP ScrollTrigger Setup
function setupGSAPWaypoints() {
  // We use view coordinates, x ranges roughly from -aspect*dist to +aspect*dist
  // Let's set some reasonable positions for a camera at z=10, fov=45

  // A. Set Initial State (Right side of the Hero section)
  const isMobile = window.innerWidth < 768;
  gsap.set(logoGroup.position, {
      x: isMobile ? 1.0 : 3.5, // Closer to center on mobile
      y: isMobile ? 1.2 : 0.5,
      z: 0
  });

  updateLogoScaleForMobile();

  // B. Create the Timeline linked to scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // 1-second smoothing effect for ultra-fluid movement
    }
  });

  // Start right -> Move to left -> Move to right -> Center above footer

  // Waypoint 1: Move left and rotate
  tl.to(logoGroup.position, {
    x: isMobile ? -1.0 : -3, // Closer to center
    y: 0,
    ease: "power1.inOut"
  }, 0);

  tl.to(logoGroup.rotation, {
    y: Math.PI * 2, // 1 full spin
    ease: "power1.inOut"
  }, 0);

  // Waypoint 2: Move right and down
  tl.to(logoGroup.position, {
    x: isMobile ? 1.0 : 3, // Closer to center
    y: -1,
    ease: "power1.inOut"
  }, ">");

  tl.to(logoGroup.rotation, {
    y: Math.PI * 4, // Another full spin
    ease: "power1.inOut"
  }, "<");

  // Waypoint 3: Move to center bottom (footer area)
  tl.to(logoGroup.position, {
    x: 0,
    y: isMobile ? -1 : -2, // Move down
    ease: "power2.out"
  }, ">");

  tl.to(logoGroup.rotation, {
    y: Math.PI * 6,
    ease: "power2.out"
  }, "<");

  // Refresh ScrollTrigger to ensure correct calculations after DOM load
  ScrollTrigger.refresh();
}
