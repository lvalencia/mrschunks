import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";
import {BoardEffect} from "./board.mjs";

const {
    MathUtils: {
        degToRad,
        radToDeg
    }
} = THREE;

export function createTileInterfaceObject() {
    const TileInterface = {
        flip() {
            this.rotation.x = degToRad((radToDeg(this.rotation.x) + 180) % 360);
            this._updateTileState();
            this._hasBeenFlippedAtLeastOnce = true;
        },
        _updateTileState() {
            // right now just a boolean state
            this.tileState = !this.tileState;
        },
        get previouslyFlipped() {
            return this._hasBeenFlippedAtLeastOnce;
        }
    };
    return TileInterface;
}

export function makeTile(args = {}) {
    const defaultArgs = {
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        flipped: false,
        tileRotation: degToRad(90),
        effect: BoardEffect.None
    };

    args = Object.assign(defaultArgs, args);
    let {
        position: {
            x, y, z
        },
        flipped,
        tileRotation,
        effect
    } = args;

    const unit = 1;
    const planeBufferGeometry = new THREE.PlaneBufferGeometry(unit, unit, unit, unit);

    const topPlaneMaterial = new THREE.MeshBasicMaterial({
        color: Color.Primary,
        side: THREE.FrontSide
    });
    const bottomPlaneMaterial = new THREE.MeshBasicMaterial({
        color: Color.Accent,
        side: THREE.BackSide
    });

    const tilePivot = new THREE.Object3D();
    const tileUp = new THREE.Mesh(planeBufferGeometry, topPlaneMaterial);
    const tileDown = new THREE.Mesh(planeBufferGeometry, bottomPlaneMaterial);
    tilePivot.add(tileUp);
    tileUp.position.set(0, 0, 0.01);
    tilePivot.add(tileDown);
    tileDown.position.set(0, 0, -0.01);

    tilePivot.position.set(x, y, z);
    tilePivot.rotation.x = tileRotation;

    const tileInterfaceObject = Object.setPrototypeOf(createTileInterfaceObject(), tilePivot);

    if (flipped) {
        tileInterfaceObject.flip();
        tileInterfaceObject._hasBeenFlippedAtLeastOnce = false;
    }

    return Object.setPrototypeOf({
        topColor: topPlaneMaterial.color,
        bottomColor: bottomPlaneMaterial.color,
        effect
    }, tileInterfaceObject);
}
