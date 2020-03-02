import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";

const {
    MathUtils: {
        degToRad,
        radToDeg
    }
} = THREE;

// Keep it stupid simple because you'll probably be swapping these out with Textures
// lets make a 10x10 board of squares
const defaultRotation = degToRad(90);

/*
 * @TODO
 *  Would actually make an object that presents an abstraction for a tile interface with commands like
 *  flip, bounce, shake, etc
*/
export function makeTile(x = 0, y = 0, z = 0, tileRotation = defaultRotation) {
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
    tileUp.position.set(0, 0, 0.1);
    tilePivot.add(tileDown);
    tileDown.position.set(0, 0, -0.1);

    tilePivot.position.set(x, y, z);
    tilePivot.rotation.x = tileRotation;

    const TileInterface = {
        flip() {
            tilePivot.rotation.x = degToRad((radToDeg(tilePivot.rotation.x) + 180) % 360);
            this._hasBeenFlippedAtLeastOnce = true;
        },
        get previouslyFlipped() {
           return this._hasBeenFlippedAtLeastOnce;
        },
        get topColor() {
            return topPlaneMaterial.color;
        },
        get bottomColor() {
            return bottomPlaneMaterial.color;
        }
    };
    Object.setPrototypeOf(TileInterface, tilePivot);

    return Object.create(TileInterface);
}

