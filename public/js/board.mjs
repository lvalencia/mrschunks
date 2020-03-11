import {THREE} from "./dependencies/three.mjs";
import defaultTileFlipper, {makeTileFlipper} from "./tileFlipper.mjs";

export const Board = {
    addTile(tile) {
        this._boardTiles.push(tile);
        this.add(tile);
    },
    onMove(position) {
        this._correctPosition(position);
        if (!this._sameAsPreviousPosition(position)) {
            this._tileFlipper.flip(this._boardTiles, position);
        }
        this._setAsPreviousPosition(position);
        this._checkBoardClearedCondition();
    },
    addOnClearedListener(listener) {
        this._listeners.push(listener);
    },
    _checkBoardClearedCondition() {
        // Right now Winning Condition is they're all in the same state
        const allFlipped = this._boardTiles.every((tile) => {
            return (!!tile.tileState) === (!!this._boardTiles[0].tileState);
        });

        if (allFlipped) {
            this._listeners.forEach(listener => {
                if (typeof listener.onCleared === 'function') {
                    listener.onCleared();
                }
            });
        }

        return allFlipped;
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
    },
    _sameAsPreviousPosition(position) {
        if (!this._previousPosition) {
            return false;
        }
        return this._previousPosition.equals(position);
    },
    _setAsPreviousPosition(position) {
        if (!this._previousPosition) {
            this._previousPosition = new THREE.Vector3();
        }
        this._previousPosition.copy(position);
    }
};

export function makeBoard(tileFlipper = defaultTileFlipper, x = 0, y = 0, z = 0) {
    const board = new THREE.Object3D();
    board.position.set(x, y, z);

    Object.setPrototypeOf(Board, board);
    return Object.setPrototypeOf({
        _previousPosition: null,
        _board: board,
        _boardTiles: [],
        _tileFlipper: makeTileFlipper(tileFlipper),
        _listeners: [],
    }, Board);
}

export default makeBoard();
