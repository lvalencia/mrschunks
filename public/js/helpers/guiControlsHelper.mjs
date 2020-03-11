import * as dat from "../dependencies/dat.gui.mjs";
import {TileColorHelper} from "./tileColorHelper.mjs";
import {TileFlipBehaviorHelper} from "./tileFlipBehaviorHelper.mjs";

export const GuiControlsHelper = {
    addTiles(tiles) {
        const tileColorHelper = new TileColorHelper(tiles);
        this._topColor = this.gui.addColor(tileColorHelper, 'topColor');
        this._bottomColor = this.gui.addColor(tileColorHelper, 'bottomColor');
    },
    addTileFlipBehavior(tileFlipper) {
        const folder = this.gui.addFolder('Flip Behavior');
        this._folder = folder;

        const tileFlipHelper = new TileFlipBehaviorHelper(tileFlipper);

        this._adjacent = folder.add(tileFlipHelper, 'adjacent');
        this._current = folder.add(tileFlipHelper, 'current');
        this._once = folder.add(tileFlipHelper, 'once');

        folder.open();
    },
    removeTiles() {
        this.gui.remove(this._topColor);
        this.gui.remove(this._bottomColor);

        this._topColor = undefined;
        this._bottomColor = undefined;
    },
    removeTileFlipBehavior() {
        this._folder.remove(this._adjacent);
        this._folder.remove(this._current);
        this._folder.remove(this._once);
        this.gui.removeFolder(this._folder);

        this._adjacent = undefined;
        this._current = undefined;
        this._once = undefined;
        this._folder = undefined;
    }
};

const gui = new dat.GUI();
export default Object.setPrototypeOf({
    gui
}, GuiControlsHelper);
