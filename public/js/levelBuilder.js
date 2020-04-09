import {makeTile} from "./tile.mjs";
import {makeBoard} from "./board.mjs";
import {makeHero} from "./hero.js";

export const LevelBuilder = {
    canBuild(level) {
        return this.levels.length > level;
    },
    build(level) {
        const currentLevel = this.levels[level];

        const {
            flipBehavior
        } = currentLevel.board;
        const board = makeBoard(flipBehavior);
        const tiles = [];
        currentLevel.tiles.forEach((tile) => {
            const {
                position: {
                    x,
                    y,
                    z
                },
                flipped
            } = tile;

            const boardTile = makeTile(x, y, z, flipped);
            tiles.push(boardTile);
            board.addTile(boardTile);
        });

        const {
            position
        } = currentLevel.hero;

        const hero = makeHero(position);
        board.initialPosition(position);

        return {
            board,
            tiles,
            hero
        };
    },
};
