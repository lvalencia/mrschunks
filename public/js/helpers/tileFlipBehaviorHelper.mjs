import {FlipBehavior} from "../tileFlipper.mjs";

export function TileFlipBehaviorHelper(tileFlipper) {
    Object.assign(this, {
        tileFlipper
    });

    Object.defineProperty(this, 'behavior', {
        get () {
            return this.tileFlipper._behavior;
        },
        set(behavior) {
            this.tileFlipper._behavior =  behavior;
        }
    });
}

export function addTileFlipBehavior(gui, tileFlipper) {
    gui.add(new TileFlipBehaviorHelper(tileFlipper), 'behavior', [
        FlipBehavior.Adjacent,
        FlipBehavior.Current
    ]);
}