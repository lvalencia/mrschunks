import {THREE} from './dependencies/three.mjs';
import {OrbitControls} from './dependencies/OrbitControls.js';
import guiControlsHelper from "./helpers/guiControlsHelper.mjs";
import {LevelBuilder} from "./levelBuilder.js";
import {attachControls, detachControls} from "./heroControls.mjs";
import {readFile} from "./utils/fileReader.mjs";

const DEBUG = true;

const PuzzleAction = {
    init() {
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
        camera.position.set(0, 7, 5);
        camera.lookAt(0, 0, 0);

        this.scene = scene;
        this.camera = camera;
    },
    load() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        this.currentLevel = 0;
        this.shouldBuildNextLevel = true;
        const levelsFile = '/json/levels.json';
        readFile(levelsFile).then((levels) => {
            this.levelBuilder = Object.setPrototypeOf({
                levels
            }, LevelBuilder);
        });

        this.listener = attachControls();

        // Debug Behavior should be moved into debug objects that no-op if we're not doing debug stuff
        if (DEBUG) {
            const controls = new OrbitControls(this.camera, this.canvas);
            controls.target.set(0, 0, 0);
            controls.update();
        }
    },
    update(time) {
        // There has to be a better way to do this than semaphore programming
        if (this.shouldBuildNextLevel && this.levelBuilder.canBuild(this.currentLevel)) {
            const {
                board,
                tiles,
                hero
            } = this.levelBuilder.build(this.currentLevel);

            this.scene.add(board);
            board.addBoardEventsDelegate(this);

            this.listener.setHero(hero);
            this.scene.add(hero);
            hero.addHeroEventsDelegate(board);

            this.currentBoard = board;
            this.currentHero = hero;

            // Debug Behavior should be moved into debug objects that no-op if we're not doing debug stuff
            if (DEBUG) {
                guiControlsHelper.addTiles(tiles);
                guiControlsHelper.addTileFlipBehavior(board._tileFlipper);
            }

            this.shouldBuildNextLevel = false;
            this.currentLevel += 1;
        }
    },
    unload() {
        detachControls(this.listener);
    },
    // Free up references for possible GC
    teardown() {

    },
    // on Board Cleared
    onCleared() {
        /*
         * What we should actually do:
         * Play a winning animation
         * Prompt for next level or do a transition to next level
         * when there aren't any more indicate that it's finished
         */
        this.currentHero.removeHeroEventsDelegates();
        this.currentBoard.removeBoardEventsDelegates();

        this.scene.remove(this.currentHero);
        this.scene.remove(this.currentBoard);

        // Debug Behavior should be moved into debug objects that no-op if we're not doing debug stuff
        if (DEBUG) {
            guiControlsHelper.removeTiles();
            guiControlsHelper.removeTileFlipBehavior();
        }

        this.shouldBuildNextLevel = true;
    },
    onFailed() {
        this.currentHero.removeHeroEventsDelegates();
        this.currentBoard.removeBoardEventsDelegates();

        this.scene.remove(this.currentHero);
        this.scene.remove(this.currentBoard);

        // Debug Behavior should be moved into debug objects that no-op if we're not doing debug stuff
        if (DEBUG) {
            guiControlsHelper.removeTiles();
            guiControlsHelper.removeTileFlipBehavior();
        }

        this.currentLevel -= 1; // Redo Level
        this.shouldBuildNextLevel = true;
    }
};

export default PuzzleAction;
