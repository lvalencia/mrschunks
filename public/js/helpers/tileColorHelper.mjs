export function TileColorHelper(tiles) {
    Object.assign(this, {
        tiles
    });

    function makeRetriever(propertyName) {
        return {
            get() {
                return `#${this.tiles[0][propertyName].getHexString()}`
            },
            set(color) {
                this.tiles.forEach(tile => tile[propertyName].set(color));
            }
        }
    }

    Object.defineProperty(this, 'topColor', makeRetriever('topColor'));
    Object.defineProperty(this, 'bottomColor', makeRetriever('bottomColor'));
}