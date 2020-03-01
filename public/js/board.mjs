import {THREE} from "./dependencies/three.mjs";
import tileFlipper from "./tileFlipper.mjs";

export const Board = {
    addTile(tile) {
        this._boardTiles.push(tile);
        this.add(tile);
    },
    onMove(position) {
        this._tileFlipper.flip(this._boardTiles, position);
        this._correctPosition(position);
    },
    _correctPosition(position) {
        const boundingBox = new THREE.Box3().setFromObject(this._board);
        if (!boundingBox.containsPoint(position)) {
            // Put Back in Bounds
            this._boardTiles.sort(({position: tilePositionA}, {position: tilePositionB}) => {
                // sort by closest tile to current position
                return position.distanceTo(tilePositionA) - position.distanceTo(tilePositionB);
            });
            const {x, y, z} = this._boardTiles[0].position;
            position.set(x, position.y, z);
        }
    }
};

export function makeBoard(x = 0, y = 0, z = 0) {
    const board = new THREE.Object3D();
    board.position.set(x, y, z);

    Object.setPrototypeOf(Board, board);
    return Object.setPrototypeOf({
        _board: board,
        _boardTiles: [],
        _tileFlipper: tileFlipper
    }, Board);
}

export default makeBoard();
