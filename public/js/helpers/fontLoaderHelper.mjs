import {THREE} from "../dependencies/three.mjs";

export const FontLoader = {
    onProgress(callback) {
        this.onProgressCallback = callback;
    },
    load(fontAssetUrl) {
        return new Promise((resolve, reject) => {
            this.loader.load(fontAssetUrl, resolve, this.onProgressCallback, reject);
        });
    },
    parse(json) {
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        return this.loader.parse(json);
    }
};

export default Object.setPrototypeOf({
    loader: new THREE.FontLoader()
}, FontLoader);

