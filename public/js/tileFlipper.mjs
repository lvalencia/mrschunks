export const FlipBehavior = {
    Adjacent: 'FLIP_ADJACENT',
    Current: 'FLIP_CURRENT'
};

export const TileFlipper = {
    flip(tiles, position) {
        const tilesToFlip = tiles.filter(({position: {x: tx, y: ty, z: tz}}) => {
            const {x, y, z} = position;

            switch (this._behavior) {
                case FlipBehavior.Adjacent:
                    const leftTile = x-1 === tx && z === tz;
                    const rightTile = x+1 === tx && z === tz;
                    const aboveTile = x === tx && z-1 === tz;
                    const belowTile = x === tx && z+1 === tz;
                    return leftTile || rightTile || aboveTile || belowTile;
                case FlipBehavior.Current:
                default:
                    return x === tx && z === tz;
            }
        });

        tilesToFlip.forEach(tile => tile.flip());
    }
};

export default Object.setPrototypeOf({
    _behavior: FlipBehavior.Current
}, TileFlipper);

