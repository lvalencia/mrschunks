import {THREE} from "./dependencies/three.mjs";
import {readFile, ResponseType} from "./utils/fileReader.mjs";

const transitionsDirectory = '/images';
export const BlendTransitions = {
    Cells: `${transitionsDirectory}/cells.png`,
    Distort: `${transitionsDirectory}/distort.png`,
    Gradient: `${transitionsDirectory}/gradient.png`,
    Perlin: `${transitionsDirectory}/perlin.png`,
    Radial: `${transitionsDirectory}/radial.png`,
    Squares: `${transitionsDirectory}/squares.png`
};

export const BlendSceneTransition = {
    init(fromAct, toAct) {
        this.from = fromAct;
        this.to = toAct;
        this.to.init();

        this.from.setTransitionTo = undefined;

        const scene = new THREE.Scene();
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        const left = width / -2;
        const right = width / 2;
        const top = height / 2;
        const bottom = height / -2;
        const near = 0;
        const far = 5;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

        const renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
        };

        this.scene = scene;
        this.camera = camera;
        this.dimensions = {
            width,
            height
        };

        this.fromActRenderTarget = new THREE.WebGLRenderTarget(width, height, renderTargetParameters);
        this.toActRenderTarget = new THREE.WebGLRenderTarget(width, height, renderTargetParameters);
    },
    load() {
        this.to.load();

        const {
            width,
            height
        } = this.dimensions;

        const textureLoader = new THREE.TextureLoader();
        const loadTexture = new Promise((resolve, reject) => {
            textureLoader.load(this.transition, resolve, undefined, reject);
        });
        const vertexShaderFile = '/shaders/blend.vertex.shader';
        const fragmentShaderFile = '/shaders/blend.fragment.shader';

        const uniforms = {
            tDiffuse1: {
                type: 't',
                value: this.toActRenderTarget
            },
            tDiffuse2: {
                type: 't',
                value: this.fromActRenderTarget
            },
            mixRatio: {
                type: 'f',
                value: 0.0
            },
            threshold: {
                type: 'f',
                value: 0.1
            },
            useTexture: {
                type: 'i',
                value: 1,
            },
            tMixTexture: {
                type: 't',
                value: null
            }
        };

        Promise.all([
            readFile(vertexShaderFile, new XMLHttpRequest(), ResponseType.Text),
            readFile(fragmentShaderFile, new XMLHttpRequest(), ResponseType.Text),
            loadTexture
        ]).then(([vertexShader, fragmentShader, texture]) => {
            uniforms.tMixTexture.value = texture;

            const viewportGeometry = new THREE.PlaneBufferGeometry(width, height);
            const viewportMaterial = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader
            });
            const viewport = new THREE.Mesh(viewportGeometry, viewportMaterial);

            this.scene.add(viewport);
        });

        this.uniforms = uniforms;
        this.clock = new THREE.Clock();
    },
    update(time) {
        time *= 0.001;

        if (!this.initialTime) {
            this.initialTime = time;
        }

        const transitionSpeed = 2.0;
        const delta = this.initialTime - time;
        let mixRatio = 1 + Math.sin(transitionSpeed * delta - Math.PI / 2);
        mixRatio = parseFloat(mixRatio.toFixed(2));
        this.uniforms.mixRatio.value = mixRatio;

        // Render fromScene
        this.renderer.setRenderTarget(this.fromActRenderTarget);
        const {scene: fromScene, camera: fromCamera} = this.from;
        this.renderer.render(fromScene, fromCamera);
        this.renderer.setRenderTarget(null);

        // Render toScene
        this.renderer.setRenderTarget(this.toActRenderTarget);
        const {scene: toScene, camera: toCamera} = this.to;
        this.renderer.render(toScene, toCamera);
        this.renderer.setRenderTarget(null);

        this.doneTransitioning = (mixRatio >= 0.99);
        if (this.doneTransitioning) {
            this.setDone();
        }
    },
    unload() {

    },
    teardown() {

    },
    setDone() {
        this.done = true;
    },
    next() {
        return this.to;
    }
};