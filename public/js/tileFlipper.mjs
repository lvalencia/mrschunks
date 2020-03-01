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
                const leftTile = x-1 === tx && z === tz;
                const rightTile = x+1 === tx && z === tz;
                const aboveTile = x === tx && z-1 === tz;
                const belowTile = x === tx && z+1 === tz;
                const isAdjacentTile = leftTile || rightTile || aboveTile || belowTile;

                boolAcc = boolAcc || isAdjacentTile;
            }

            if (this._flipCurrent) {
                const isCurrentTile = x === tx && z === tz;

                boolAcc = boolAcc || isCurrentTile;
            }

            return boolAcc;
        });

        tilesToFlip.forEach(tile => tile.flip());
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

export default Object.setPrototypeOf({
    _behavior: FlipBehavior.Current
}, TileFlipper);

