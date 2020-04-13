export const FlipBehavior = {
    Adjacent: 1,
    Current: 2,
    Once: 4
};

export const TileFlipper = {
    flip(tiles, position) {
        const tilesToFlip = tiles.filter((tile) => {
            const {position: {x: tx, y: ty, z: tz}} = tile;
            const {x, y, z} = position;

            if (this._flipOnce && tile.previouslyFlipped) {
                return false;
            }

            let boolAcc = false;
            if (this._flipAdjacent) {
                boolAcc = boolAcc || this._isAdjacent({
                    xA: x,
                    xB: tx,
                    zA: z,
                    zB: tz
                });
            }

            if (this._flipCurrent) {
                boolAcc = boolAcc || this._isCurrent({
                    xA: x,
                    xB: tx,
                    zA: z,
                    zB: tz
                });
            }

            return boolAcc;
        });

        this._flipTiles(tilesToFlip);
    },
    flipAll(tiles) {
        this._flipTiles(tiles);
    },
    flipAdjacent(tiles, position) {
        const tilesToFlip = tiles.filter((tile) => {
            const {position: {x: tx, y: ty, z: tz}} = tile;
            const {x, y, z} = position;

            return this._isAdjacent({
                xA: x,
                xB: tx,
                zA: z,
                zB: tz
            });
        });

        this._flipTiles(tilesToFlip);
    },
    flipCurrent(tiles, position) {
        const tileToFlip = this._getCurrentTile(tiles, position);

        this._flipTiles([tileToFlip]);
    },
    // This might not be right abstraction
    applyEffect(tiles, position) {
        const tile = this._getCurrentTile(tiles, position);
        tile.useEffect();
    },
    _getCurrentTile(tiles, position) {
        return tiles.find((tile) => {
            const {position: {x: tx, y: ty, z: tz}} = tile;
            const {x, y, z} = position;

            return this._isCurrent({
                xA: x,
                xB: tx,
                zA: z,
                zB: tz
            });
        });
    },
    _flipTiles(tiles) {
        tiles.forEach((tile) => {
            tile.flip()
        });
    },
    _isCurrent({xA, xB, zA, zB}) {
        return xA === xB && zA === zB;
    },
    _isAdjacent({xA, xB, zA, zB}) {
        const leftTile = xA - 1 === xB && zA === zB;
        const rightTile = xA + 1 === xB && zA === zB;
        const aboveTile = xA === xB && zA - 1 === zB;
        const belowTile = xA === xB && zA + 1 === zB;
        return leftTile || rightTile || aboveTile || belowTile;
    },
    get _flipAdjacent() {
        return (this._behavior & FlipBehavior.Adjacent) !== 0;
    },
    get _flipCurrent() {
        return (this._behavior & FlipBehavior.Current) !== 0;
    },
    get _flipOnce() {
        return (this._behavior & FlipBehavior.Once) !== 0;
    }
};

export function makeTileFlipper(flipBehavior) {
    return Object.setPrototypeOf({
        _behavior: flipBehavior
    }, TileFlipper);
}

export default Object.setPrototypeOf({
    _behavior: FlipBehavior.Current
}, TileFlipper);

