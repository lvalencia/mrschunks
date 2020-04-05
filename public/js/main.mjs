import {THREE} from "./dependencies/three.mjs";
import Stats from "./dependencies/stats.mjs";
import Home from "./home.mjs";
import Puzzle from "./puzzle.mjs";
import {ObjectMediatorGraph} from "./objectMediatorGraph.mjs";
import {BlendSceneTransition} from "./blendSceneTransition.mjs";

const canvas = document.getElementById('scene');
const context = canvas.getContext('webgl2');
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

// State Graph
const actionTransitionGraph = Object.setPrototypeOf({
    adjacencyCollection: new Map()
}, ObjectMediatorGraph);

actionTransitionGraph.addObject(Home);
actionTransitionGraph.addObject(Puzzle);
actionTransitionGraph.addMediator(Home, Puzzle, BlendSceneTransition, Home.Transition.Game);

Home.init({canvas});
Home.load();

let current = Home;

function animate(time) {
    if (current.transitionTo) {
        const {value: transitions} = actionTransitionGraph.mediatedObjects(current);
        for (const [toAction, {mediator, label}] of transitions) {
            if (label === current.transitionTo) {
                mediator.init(current, toAction);
                mediator.load({canvas});
                current = mediator;
                break;
            }
        }
    }
    if (current.done) {
        current.unload();
        current = current.next();
    }

    current.update(time);

    const {camera, scene} = current;

    adjustView({canvas, renderer, camera});
    renderer.render(scene, camera);

    stats.update();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
