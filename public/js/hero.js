import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";


// Keep it stupid simple because you'll probably be swapping these out with Textures
// For now lets just make a box with a box head
export function makeHero(x = 0, y = 0, z = 0) {
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

    heroPivot.position.set(x, y, z);
    const scalarFactor = 0.6;
    heroPivot.scale.set(scalarFactor, scalarFactor, scalarFactor);

    const movementUnit = 1;
    const HeroInterface = {
        addOnMoveListener(listener) {
            this.listeners.push(listener);
        },
        _notifyListeners() {
            this.listeners.forEach(listener => {
                if (typeof listener.onMove === 'function') {
                    listener.onMove(heroPivot.position);
                }
            });
        },
        set moveUp(shouldMove) {
            heroPivot.position.y += movementUnit;
            this._notifyListeners();
        },
        set moveDown(shouldMove) {
            heroPivot.position.y -= movementUnit;
            this._notifyListeners();
        },
        set moveRight(shouldMove) {
            heroPivot.position.x += movementUnit;
            this._notifyListeners();
        },
        set moveLeft(shouldMove) {
            heroPivot.position.x -= movementUnit;
            this._notifyListeners();
        },
        set moveForward(shouldMove) {
            heroPivot.position.z -= movementUnit;
            this._notifyListeners();
        },
        set moveBackward(shouldMove) {
            heroPivot.position.z += movementUnit;
            this._notifyListeners();
        }
    };

    Object.setPrototypeOf(HeroInterface, heroPivot);

    return Object.setPrototypeOf({
        listeners: []
    },HeroInterface);
}