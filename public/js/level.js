import {makeTile} from "./tile.mjs";
import {makeBoard} from "./board.mjs";
import {makeHero} from "./hero.js";
import {attachControls, detachControls} from "./heroControls.mjs";
import guiControlsHelper from "./helpers/guiControlsHelper.mjs";

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
        return new Promise((resolve, reject) => {
            if (!this.loadedLevels) {
                this._loadLevels().then(() => {
                    resolve(this.loadLevel(0));
                });
                return;
            }
            // Check Within bounds -- there's a cleaner way to do this
            if (this.levels.length > this.level + 1) {
                resolve(this.loadLevel(this.level + 1));
            } else {
                reject();
            }
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

export const LevelClearedListener = {
    onCleared() {
        /*
         * What we should actually do:
         * Play a winning animation
         * Prompt for next level or do a transition to next level
         * when there aren't any more indicate that it's finished
         */


        // Teardown - really tearing down should be the responsibility of each object itself
        //  ALl this has potential for leaks btw, you should check we did a proper teardown
        if (this.hero) {
            detachControls(this.hero);
            while (this.hero.listeners.pop()) {}
            this.scene.remove(this.hero);
        }
        if (this.board) {
            while (this.board._listeners.pop()) {}
            this.scene.remove(this.board);
            this.guiControlsHelper.removeTiles();
            this.guiControlsHelper.removeTileFlipBehavior();
        }

        this.levelLoader.loadNextLevel().then(({board, tiles, hero}) => {
            Object.assign(this, {
                board, tiles, hero
            });

            this.scene.add(board);
            board.addOnClearedListener(this);
            this.scene.add(hero);
            attachControls(hero);
            hero.addOnMoveListener(board);
            this.guiControlsHelper.addTiles(tiles);
            this.guiControlsHelper.addTileFlipBehavior(board._tileFlipper);
        }).catch(() => {
            // No more Levels
        })
    }
};

export default Object.setPrototypeOf({
    // levels are a json file for now
    _levelsFile: '/assets/levels.json',
    _fileLoader: readFile
}, LevelLoader);

