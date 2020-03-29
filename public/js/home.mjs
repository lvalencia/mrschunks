import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";
import fontLoaderHelper from "./helpers/fontLoaderHelper.mjs";
import {Font} from "./font.mjs";
import {makeText} from "./text.mjs";
import {makeHero} from "./hero.js";
import {attachControls, detachControls} from "./menuControls.mjs";
import {PickHelper} from "./helpers/pickHelper.mjs";

const scene = new THREE.Scene();
scene.background = new THREE.Color(Color.Accent);
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
camera.position.set(0, 0, 75);
camera.lookAt(0, 0, 0);
const canvas = document.getElementById('scene');
const context = canvas.getContext('webgl2');
const renderer = new THREE.WebGLRenderer({context, canvas});
renderer.setSize(window.innerWidth, window.innerHeight, false);

const {
    MathUtils: {
        degToRad,
    }
} = THREE;

const animateables = [];

fontLoaderHelper.load(Font.URL.Modak).then((font) => {
    const color = 'hsl(240, 100%, 75%)';
    const emissive = 0x0000ff;
    const opacity = 0.7;
    const accentColor = Color.Secondary;
    const accentEmissive = Color.Secondary;

    const options = {
        font,
        color,
        emissive,
        opacity,
        accentColor,
        accentEmissive
    };

    const tilt = 2.5;
    const title = makeText('Mrs. Chunk', options);
    title.position.y = 40;
    title.rotation.y = degToRad(tilt);
    title.rotation.z = degToRad(-tilt);
    title.rotation.x = degToRad(-tilt);
    scene.add(title);

    const action = makeText('Play', options);
    action.onHover = function onTextActionHover() {
        this.switchToAccentColor();
    };
    action.onLeave = function onTextActionLeave() {
        this.restoreOriginalColor();
    };
    action.onClick = function onTextActionClick() {
        transitionScene();
    };
    action.onAnimate = function onTextActionAnimate(time) {
        const speed = time;
        const angle = speed + Math.PI * 2;
        const radius = Math.sin(speed) * 10;
        this.position.y = -35 + (Math.sin(angle) * radius);
    };
    animateables.push(action);
    action.position.y = -35;
    action.rotation.y = degToRad(tilt);
    action.rotation.z = degToRad(-tilt);
    action.rotation.x = degToRad(-tilt);
    scene.add(action);
});

const hero = makeHero({
    y: -5,
    scale: 15
});
const tilt = 15;
hero.rotation.y = degToRad(tilt);
hero.rotation.z = degToRad(tilt);
hero.rotation.x = degToRad(tilt);
scene.add(hero);

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(-1, 2, 4);
scene.add(light);

function adjustView({canvas, renderer, camera}) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width !== canvas.width || height !== canvas.height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }
}

const listener = attachControls(camera, canvas);
const picker = Object.setPrototypeOf({
    camera,
    scene,
    raycaster: new THREE.Raycaster()
}, PickHelper);

function transitionScene() {
    console.log('Transition to Gameplay');
    detachControls(listener);
}

function animate(time) {
    time *= 0.001;

    adjustView({canvas, renderer, camera});

    animateables.forEach(animateable => animateable.onAnimate(time));

    picker.pick(listener, time);

    hero.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
