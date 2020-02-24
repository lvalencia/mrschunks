import {THREE} from '../dependencies/three.mjs';

const AxisGrid = {
    get visible() {
        return this._visible;
    },
    set visible(visible) {
        this._visible = visible;
        this.grid.visible = visible;
        this.axes.visible = visible;
    }
};

export function AxisGridHelper(node, units = 10, Three = THREE) {
    const axes = new Three.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2; // After Grid
    node.add(axes);

    const grid = new Three.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    Object.assign(this, {
        grid,
        axes,
    });

    Object.setPrototypeOf(this, AxisGrid);

    this.visible = false;
}
