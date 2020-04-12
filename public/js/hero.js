import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";
import {uuidv4} from "./utils/mathUtils.js";
import {BoardEffects} from "./board.mjs";

const UNIT_OF_MOVEMENT = 1;

export function createHeroInterfaceObject() {
    const Hero = {
        uuid: uuidv4(),
        addHeroEventsDelegate(listener) {
            this.listeners.push(listener);
        },
        removeHeroEventsDelegates() {
            while (this.listeners.pop()) {
            }
        },
        useEffect() {
            // Simple one and done for now
            this.listeners.forEach(listener => {
                if (typeof listener.onEffect === 'function') {
                    listener.onEffect(this.effect);
                }
            });
            this.effect = undefined;
        },
        _notifyMove() {
            this.listeners.forEach(listener => {
                if (typeof listener.onMove === 'function') {
                    listener.onMove(this.position);
                }
            });
        },
        set moveUp(shouldMove) {
            if (shouldMove) {
                this.position.y += this.movementUnit;
                this._notifyMove();
            }
        },
        set moveDown(shouldMove) {
            if (shouldMove) {
                this.position.y -= this.movementUnit;
                this._notifyMove();
            }
        },
        set moveRight(shouldMove) {
            if (shouldMove) {
                this.position.x += this.movementUnit;
                this._notifyMove();
            }
        },
        set moveLeft(shouldMove) {
            if (shouldMove) {
                this.position.x -= this.movementUnit;
                this._notifyMove();
            }
        },
        set moveForward(shouldMove) {
            if (shouldMove) {
                this.position.z -= this.movementUnit;
                this._notifyMove();
            }
        },
        set moveBackward(shouldMove) {
            if (shouldMove) {
                this.position.z += this.movementUnit;
                this._notifyMove();
            }
        }
    };
    return Hero;
}

export function makeHero(args = {}) {
    const defaultArgs = {
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        effect: BoardEffects.None,
        scale: 0.6
    };

    args = Object.assign(defaultArgs, args);
    const {
        position: {
            x, y, z
        },
        effect,
        scale
    } = args;

    const heroPivot = new THREE.Object3D();

    const bodyUnit = 1;
    const bodyBox = new THREE.BoxBufferGeometry(bodyUnit, bodyUnit, bodyUnit);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: Color.White
    });
    const body = new THREE.Mesh(bodyBox, bodyMaterial);
    heroPivot.add(body);
    // pull it up by half it's size
    body.position.set(0, bodyUnit / 2, 0);

    const headScaleFactor = 4;
    const headUnit = bodyUnit / headScaleFactor;
    const headBox = new THREE.BoxBufferGeometry(headUnit, headUnit, headUnit);
    const headMaterial = new THREE.MeshBasicMaterial({
        color: Color.Secondary
    });
    const head = new THREE.Mesh(headBox, headMaterial);
    heroPivot.add(head);
    // Put it on top of the box, also pull it up by half it's size
    head.position.set(0, bodyUnit + (headUnit / 2), 0);

    heroPivot.position.set(x,y,z);
    const scalarFactor = scale;
    heroPivot.scale.set(scalarFactor, scalarFactor, scalarFactor);

    const heroInterfaceObject = Object.setPrototypeOf(createHeroInterfaceObject(), heroPivot);
    const heroInterface = Object.setPrototypeOf({
        movementUnit: UNIT_OF_MOVEMENT,
        listeners: [],
        effect
    }, heroInterfaceObject);

    heroPivot._interface = heroInterface;

    return heroInterface;
}

export default makeHero();