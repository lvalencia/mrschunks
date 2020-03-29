import fontLoaderHelper from "./helpers/fontLoaderHelper.mjs";
import {THREE} from "./dependencies/three.mjs";
import {Color} from "./color.mjs";
import {Font} from "./font.mjs";
import {uuidv4} from "./utils/mathUtils.js";

const defaultFont = fontLoaderHelper.parse(Font.JSONString.IndieFlower);
const defaultText = 'The face of the moon was in shadow.';

export function createTextInterfaceObject() {
    const Text = {
        uuid: uuidv4(),
        switchToAccentColor() {
            const {accentEmissive, accentColor} = this.palette;
            this.material.emissive.setHex(accentEmissive);
            this.material.color.set(accentColor);
        },
        restoreOriginalColor() {
            const {emissive, color} = this.palette;
            this.material.emissive.setHex(emissive);
            this.material.color.set(color);
        }
    };
    return Text;
}

export function makeText(text = defaultText, options = {font: defaultFont}) {
    const {
        font,
        fontSize,
        thickness,
        color,
        emissive,
        opacity,
        accentColor,
        accentEmissive
    } = options;

    const textBufferGeometry = new THREE.TextBufferGeometry(text, {
        font,
        // This probably needs to be adjustable or settings passed in
        // actually all this should be adjustable through dat.gui
        size: fontSize || 16,
        height: thickness || 1, // thickness
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshPhongMaterial({
        color: color || Color.AccentText,
        emissive: emissive || 0x0,
        opacity: opacity || 1.0
    });

    const textMesh = new THREE.Mesh(textBufferGeometry, textMaterial);
    // Adjust the center of the textMesh
    textBufferGeometry.computeBoundingBox();
    textBufferGeometry.boundingBox.getCenter(textMesh.position).multiplyScalar(-1);

    const textPivot = new THREE.Object3D();
    textPivot.add(textMesh);

    const textInterfaceObject = Object.setPrototypeOf(createTextInterfaceObject(), textPivot);
    const textInterface = Object.setPrototypeOf({
        geometry: textBufferGeometry,
        material: textMaterial,
        palette: {
            color,
            emissive,
            accentColor,
            accentEmissive
        }
    }, textInterfaceObject);

    textPivot._interface = textInterface;

    return textInterface;
}