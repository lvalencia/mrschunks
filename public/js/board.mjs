import {THREE} from "./dependencies/three.mjs";
import {FlipBehavior, TileFlipper} from "./tileFlipper.mjs";

export function makeBoard(x = 0, y = 0, z = 0) {
    const board = new THREE.Object3D();
    board.position.set(x, y, z);

    const BoardInterface = {
        addTile(tile) {
            this._boardTiles.push(tile);
            board.add(tile);
        },
        onMove(position) {
            this._tileFlipper.flip(this._boardTiles, position);
            this._correctPosition(position);
        },
        _correctPosition(position) {
            const boundingBox = new THREE.Box3().setFromObject(board);
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

    Object.setPrototypeOf(BoardInterface, board);
    return Object.setPrototypeOf({
        _boardTiles: [],
        _tileFlipper: Object.setPrototypeOf({
            _behavior: FlipBehavior.Adjacent
        }, TileFlipper)
    }, BoardInterface);
}
