import {THREE} from './dependencies/three.mjs';
import {OrbitControls} from './dependencies/OrbitControls.js';
import guiControlsHelper from "./helpers/guiControlsHelper.mjs";
import levelLoader, {LevelClearedListener} from "./level.js";

const Puzzle = {
    init(args) {
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

        this.scene = scene;
        this.camera = camera;
    },
    load(args) {
        const {
            canvas
        } = args;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        const levelClearedListener = Object.assign({
            scene: this.scene,
            guiControlsHelper,
            levelLoader
        }, LevelClearedListener);

        levelClearedListener.onCleared();

        const controls = new OrbitControls(this.camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();
    },
    update(time) {
    },
    unload() {

    },
    // Free up references for possible GC
    teardown() {

    }
};

export default Puzzle;
