import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";
import fontLoaderHelper from "./helpers/fontLoaderHelper.mjs";
import {Font} from "./font.mjs";
import {makeText} from "./text.mjs";
import {makeHero} from "./hero.js";
import {attachControls, detachControls} from "./menuControls.mjs";
import {PickHelper} from "./helpers/pickHelper.mjs";

const HomeAction = {
    Transition: {
        Game: 'GAME'
    },
    init() {
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

        this.picker = Object.setPrototypeOf({
            camera,
            scene,
            raycaster: new THREE.Raycaster()
        }, PickHelper);

        this.scene = scene;
        this.camera = camera;
    },
    load() {
        this.listener = attachControls(this.camera, this.canvas);

        const {
            MathUtils: {
                degToRad,
            }
        } = THREE;

        const animations = [];

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
            this.scene.add(title);

            const action = makeText('Play', options);
            action.onHover = function onTextActionHover() {
                this.switchToAccentColor();
            };
            action.onLeave = function onTextActionLeave() {
                this.restoreOriginalColor();
            };
            action.onClick = (function onTextActionClick() {
                this.setTransitionTo(HomeAction.Transition.Game);
            }).bind(this);
            action.onAnimate = function onTextActionAnimate(time) {
                const speed = time;
                const angle = speed + Math.PI * 2;
                const radius = Math.sin(speed) * 10;
                this.position.y = -35 + (Math.sin(angle) * radius);
            };
            animations.push(action);
            action.position.y = -35;
            action.rotation.y = degToRad(tilt);
            action.rotation.z = degToRad(-tilt);
            action.rotation.x = degToRad(-tilt);
            this.scene.add(action);
        });

        const hero = makeHero({
            y: -5,
            scale: 15
        });
        const tilt = 15;
        hero.rotation.y = degToRad(tilt);
        hero.rotation.z = degToRad(tilt);
        hero.rotation.x = degToRad(tilt);
        this.scene.add(hero);

        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        this.hero = hero;
        this.animations = animations;
    },
    update(time) {
        time *= 0.001;
        this.animations.forEach(animation => animation.onAnimate(time));
        this.picker.pick(this.listener, time);
        this.hero.rotation.y = time;
    },
    unload() {
        detachControls(this.listener);
    },
    // Free up references for possible GC
    teardown() {

    },
    setTransitionTo(transition) {
        this.transitionTo = transition;
    }
};

export default HomeAction;
