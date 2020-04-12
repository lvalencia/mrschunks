import {THREE} from "./dependencies/three.mjs";
import {FlipBehavior, makeTileFlipper} from "./tileFlipper.mjs";
import {PuzzleState} from "./conditionBuilder.mjs";

export const BoardEffects = {
    None: 'NONE',
    FlipAll: 'FLIP_ALL'
};

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
                this._numberOfMoves += 1;
            }
            this._setAsPreviousPosition(position);
            this._checkBoardConditions();
        },
        onEffect(effect) {
            // use switch for now
            switch(effect) {
                case BoardEffects.FlipAll:
                    this._boardTiles.forEach((tile) => {
                        this._tileFlipper.flip(this._boardTiles, tile.position);
                    });
                    break;
            }
        },
        // This could be improved with a tag
        addBoardEventsDelegate(listener) {
            this._listeners.push(listener);
        },
        removeBoardEventsDelegates() {
            while (this._listeners.pop()) {
            }
        },
        initialPosition(position) {
            this._setAsPreviousPosition(position);
        },
        _checkBoardConditions() {
            const conditionArgs = {
                moves: this._numberOfMoves,
                tiles: this._boardTiles,
                tileState: this._boardTiles[0].tileState
            };
            const condition = this._conditions.find((condition) => condition.isState(conditionArgs));
            if (condition) {
                // This can be replaced with Condition Handlers
                if (condition.state === PuzzleState.WonBonus) {
                    this._listeners.forEach(listener => {
                        if (typeof listener.onCleared === 'function') {
                            listener.onCleared();
                        }
                    });
                    // and would award a bonus or something
                }
                if (condition.state === PuzzleState.Won) {
                    this._listeners.forEach(listener => {
                        if (typeof listener.onCleared === 'function') {
                            listener.onCleared();
                        }
                    });
                }
                if (condition.state === PuzzleState.Lost) {
                    this._listeners.forEach(listener => {
                        if (typeof listener.onFailed === 'function') {
                            listener.onFailed();
                        }
                    });
                }
            }
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
                if (boundingBox.containsPoint(position)) {
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

export function makeBoard(args = {}) {
    const defaultArgs = {
        tileFlipBehavior: FlipBehavior.Current,
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        boardConditions: []
    };

    args = Object.assign(defaultArgs, args);
    let {
        tileFlipBehavior,
        position: {
            x, y, z
        },
        boardConditions
    } = args;

    const board = new THREE.Object3D();
    board.position.set(x, y, z);

    const boardInterfaceObject = Object.setPrototypeOf(createBoardInterfaceObject(), board);
    return Object.setPrototypeOf({
        _previousPosition: null,
        _board: board,
        _boardTiles: [],
        _tileFlipper: makeTileFlipper(tileFlipBehavior),
        _conditions: boardConditions,
        _listeners: [],
        _numberOfMoves: 0
    }, boardInterfaceObject);
}

export default makeBoard();
