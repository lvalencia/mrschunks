import {makeTile} from "./tile.mjs";
import {makeBoard} from "./board.mjs";
import {makeHero} from "./hero.js";

const HOST = 'http://localhost:8080';

const READY_STATE = {
    DONE: 4
};
const HTTP_STATUS = {
    OK: 200
};
const REQUEST_METHOD = {
    GET: "GET"
};
const RESPONSE_TYPE = {
    JSON: "json"
};

// basic file loader
function readFile(url, request = new XMLHttpRequest()) {
    return new Promise((resolve) => {
        request.onreadystatechange = function readyStateChanged() {
            if (this.readyState === READY_STATE.DONE && this.status === HTTP_STATUS.OK) {
                resolve(request.response);
            }
        };
        request.responseType = RESPONSE_TYPE.JSON;
        request.open(REQUEST_METHOD.GET, `${HOST}${url}`);
        request.send();
    });
}

// Basic Level Loader
export const LevelLoader = {
    loadNextLevel() {
        return new Promise((resolve) => {
            if (!this.loadedLevels) {
                this._loadLevels().then(() => {
                    resolve(this.loadLevel(0));
                });
                return;
            }
            resolve(this.loadLevel(this.level + 1));
        });
    },
    loadLevel(level) {
        // keep track of level
        this.level = level;
        const currentLevel = this.levels[level];

        const {
            flipBehavior
        } = currentLevel.board;
        // Build out level
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

            const boardTile = makeTile(x,y,z, flipped);
            tiles.push(boardTile);
            board.addTile(boardTile);
        });

        const {
            position: {
                x,
                y,
                z
            }
        } = currentLevel.hero;

        const hero = makeHero(x,y,z);

        return {
            board,
            tiles,
            hero
        };
    },
    _loadLevels() {
        return new Promise((resolve) => {
            this._fileLoader(this._levelsFile).then((levels) => {
                this.levels = levels;
                this.loadedLevels = true;
                resolve();
            });
        });
    }
};

export default Object.setPrototypeOf({
    // levels are a json file for now
    _levelsFile: '/assets/levels.json',
    _fileLoader: readFile
}, LevelLoader);

