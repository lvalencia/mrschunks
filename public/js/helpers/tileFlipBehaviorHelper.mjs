import {FlipBehavior} from "../tileFlipper.mjs";

export function TileFlipBehaviorHelper(tileFlipper) {
    Object.assign(this, {
        tileFlipper
    });

    Object.defineProperty(this, 'adjacent', {
        get() {
            return (this.tileFlipper._behavior & FlipBehavior.Adjacent) !== 0;
        },
        set(checked) {
            if (checked) {
                this.tileFlipper._behavior = this.tileFlipper._behavior | FlipBehavior.Adjacent
            } else {
                this.tileFlipper._behavior = this.tileFlipper._behavior ^ FlipBehavior.Adjacent
            }
        }
    });
    Object.defineProperty(this, 'current', {
        get() {
            return (this.tileFlipper._behavior & FlipBehavior.Current) !== 0;
        },
        set(checked) {
            if (checked) {
                this.tileFlipper._behavior = this.tileFlipper._behavior | FlipBehavior.Current
            } else {
                this.tileFlipper._behavior = this.tileFlipper._behavior ^ FlipBehavior.Current
            }
        }
    });
    Object.defineProperty(this, 'once', {
        get() {
            return (this.tileFlipper._behavior & FlipBehavior.Once) !== 0;
        },
        set(checked) {
            if (checked) {
                this.tileFlipper._behavior = this.tileFlipper._behavior | FlipBehavior.Once
            } else {
                this.tileFlipper._behavior = this.tileFlipper._behavior ^ FlipBehavior.Once
            }
        }
    });
}

export function addTileFlipBehavior(gui, tileFlipper) {
    const folder = gui.addFolder('Flip Behavior');
    const tileFlipHelper = new TileFlipBehaviorHelper(tileFlipper);

    folder.add(tileFlipHelper, 'adjacent');
    folder.add(tileFlipHelper, 'current');
    folder.add(tileFlipHelper, 'once');

    folder.open();
}