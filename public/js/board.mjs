import {THREE} from "./dependencies/three.mjs";
import defaultTileFlipper, {makeTileFlipper} from "./tileFlipper.mjs";

export function createBoardInterfaceObject() {
    const Board = {
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
        removeOnClearedListeners() {
            while (this._listeners.pop()) {
            }
        },
        initialPosition(position) {
            this._setAsPreviousPosition(position);
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
            if (!this._isWithinBounds(position)) {
                // Put Back in Bounds
                this._boardTiles.sort(({position: tilePositionA}, {position: tilePositionB}) => {
                    // sort by closest tile to current position
                    return position.distanceTo(tilePositionA) - position.distanceTo(tilePositionB);
                });
                const {x, y, z} = this._boardTiles[0].position;
                position.set(x, position.y, z);
            }
        },
        _isWithinBounds(position) {
            for (const tile of this._boardTiles) {
                const boundingBox = new THREE.Box3().setFromObject(tile);
                if (boundingBox.containsPoint(position)){
                    return true;
                }
            }
            return false;
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
    return Board;
}

export function makeBoard(tileFlipper = defaultTileFlipper, x = 0, y = 0, z = 0) {
    const board = new THREE.Object3D();
    board.position.set(x, y, z);

    const boardInterfaceObject = Object.setPrototypeOf(createBoardInterfaceObject(), board);
    return Object.setPrototypeOf({
        _previousPosition: null,
        _board: board,
        _boardTiles: [],
        _tileFlipper: makeTileFlipper(tileFlipper),
        _listeners: [],
    }, boardInterfaceObject);
}

export default makeBoard();
