import {makeTile} from "./tile.mjs";
import {makeBoard} from "./board.mjs";
import {makeHero} from "./hero.js";
import conditionBuilder from "./conditionBuilder.mjs";

export const LevelBuilder = {
    canBuild(level) {
        return this.levels.length > level;
    },
    build(level) {
        const currentLevel = this.levels[level];

        const {
            conditions: stateConditions,
            flipBehavior,
        } = currentLevel.board;

        const conditions = Object.entries(stateConditions).map(([state, conditions]) => {
            return conditionBuilder.build(state, conditions);
        });

        const board = makeBoard({
            tileFlipBehavior: flipBehavior,
            boardConditions: conditions
        });
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
            position,
            effect
        } = currentLevel.hero;

        const hero = makeHero({effect, position});
        board.initialPosition(position);

        return {
            board,
            tiles,
            hero
        };
    },
};
