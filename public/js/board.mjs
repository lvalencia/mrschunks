import {THREE} from "./dependencies/three.mjs";

export function makeBoard(x = 0, y = 0, z = 0) {
    const board = new THREE.Object3D();
    board.position.set(x, y, z);

    const BoardInterface = {
        addTile(tile) {
            this._boardTiles.push(tile);
            board.add(tile);
        },
        onMove(position) {
            const boundingBox = new THREE.Box3().setFromObject(board);

            const tileToFlip = this._boardTiles.find(({position: {x: tx, y: ty, z: tz}}) => {
                const {x, y, z} = position;
                return x === tx && z === tz;
            });

            if (tileToFlip) {
                tileToFlip.flip();
            }

            if (!boundingBox.containsPoint(position)) {
                // Put Back in Bounds
                this._boardTiles.sort(({position: tilePositionA}, {position: tilePositionB}) => {
                    return position.distanceTo(tilePositionA) - position.distanceTo(tilePositionB);
                });
                const {x, y, z} = this._boardTiles[0].position;
                position.set(x, position.y, z);
            }
        },
    };

    Object.setPrototypeOf(BoardInterface, board);
    return Object.setPrototypeOf({
        _boardTiles: []
    }, BoardInterface);
}
