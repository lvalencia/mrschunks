import * as dat from "../dependencies/dat.gui.mjs";
import {TileColorHelper} from "./tileColorHelper.mjs";
import {TileFlipBehaviorHelper} from "./tileFlipBehaviorHelper.mjs";

export const GuiControlsHelper = {
    addTiles(tiles) {
        const tileColorHelper = new TileColorHelper(tiles);
        this.gui.addColor(tileColorHelper, 'topColor');
        this.gui.addColor(tileColorHelper, 'bottomColor');
    },
    addTileFlipBehavior(tileFlipper) {
        const folder = this.gui.addFolder('Flip Behavior');
        const tileFlipHelper = new TileFlipBehaviorHelper(tileFlipper);

        folder.add(tileFlipHelper, 'adjacent');
        folder.add(tileFlipHelper, 'current');
        folder.add(tileFlipHelper, 'once');

        folder.open();
    }
};

const gui = new dat.GUI();
export default Object.setPrototypeOf({
    gui
}, GuiControlsHelper);
