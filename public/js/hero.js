import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";
import {uuidv4} from "./utils/mathUtils.js";

const UNIT_OF_MOVEMENT = 1;

export function createHeroInterfaceObject() {
    const Hero = {
        uuid: uuidv4(),
        addOnMoveListener(listener) {
            this.listeners.push(listener);
        },
        _notifyListeners() {
            this.listeners.forEach(listener => {
                if (typeof listener.onMove === 'function') {
                    listener.onMove(this.position);
                }
            });
        },
        set moveUp(shouldMove) {
            if (shouldMove) {
                this.position.y += this.movementUnit;
                this._notifyListeners();
            }
        },
        set moveDown(shouldMove) {
            if (shouldMove) {
                this.position.y -= this.movementUnit;
                this._notifyListeners();
            }
        },
        set moveRight(shouldMove) {
            if (shouldMove) {
                this.position.x += this.movementUnit;
                this._notifyListeners();
            }
        },
        set moveLeft(shouldMove) {
            if (shouldMove) {
                this.position.x -= this.movementUnit;
                this._notifyListeners();
            }
        },
        set moveForward(shouldMove) {
            if (shouldMove) {
                this.position.z -= this.movementUnit;
                this._notifyListeners();
            }
        },
        set moveBackward(shouldMove) {
            if (shouldMove) {
                this.position.z += this.movementUnit;
                this._notifyListeners();
            }
        }
    };
    return Hero;
}
const defaultX = 0;
const defaultY = 0;
const defaultZ = 0;
export function makeHero(options = {x: defaultX, y: defaultY, z: defaultZ}) {
    const {
        x,
        y,
        z,
        scale
    } = options;

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

    heroPivot.position.set(x || defaultX, y || defaultY, z || defaultZ);
    const scalarFactor = scale || 0.6;
    heroPivot.scale.set(scalarFactor, scalarFactor, scalarFactor);

    const heroInterfaceObject = Object.setPrototypeOf(createHeroInterfaceObject(), heroPivot);
    const heroInterface = Object.setPrototypeOf({
        movementUnit: UNIT_OF_MOVEMENT,
        listeners: []
    }, heroInterfaceObject);

    heroPivot._interface = heroInterface;

    return heroInterface;
}

export default makeHero();