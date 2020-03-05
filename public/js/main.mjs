import {THREE} from './dependencies/three.mjs';
import {OrbitControls} from './dependencies/OrbitControls.js';
import Stats from './dependencies/stats.mjs';
import {attachControls} from "./heroControls.mjs";
import guiControlsHelper from "./helpers/guiControlsHelper.mjs";
import levelLoader from "./level.js";

const canvas = document.getElementById('scene');
const context = canvas.getContext('webgl2');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0ead6);
const cameraFOV = 75;
const cameraAspect = window.innerWidth / window.innerHeight;
const cameraNearClipping = 0.1;
const cameraFarClipping = 100;
const camera = new THREE.PerspectiveCamera(
    cameraFOV,
    cameraAspect,
    cameraNearClipping,
    cameraFarClipping
);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({context, canvas});
renderer.setSize(window.innerWidth, window.innerHeight, false);

function Statistics() {
    const stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0';
    stats.domElement.style.left = '0';
    return stats;
}

const stats = Statistics();
document.body.appendChild(stats.domElement);

function adjustView({canvas, renderer, camera}) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width !== canvas.width || height !== canvas.height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }
}

levelLoader.loadNextLevel().then(({board, tiles, hero}) => {
    scene.add(board);
    scene.add(hero);
    attachControls(hero);
    hero.addOnMoveListener(board);
    guiControlsHelper.addTiles(tiles);
    guiControlsHelper.addTileFlipBehavior(board._tileFlipper);
});

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

let lastTick = 0;

function animate(time) {
    time *= 0.001;

    if (!lastTick || time - lastTick >= 1) {
        lastTick = time;
        // Do something once a second
    }

    adjustView({canvas, renderer, camera});

    renderer.render(scene, camera);

    stats.update();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
