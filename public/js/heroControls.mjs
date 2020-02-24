const KeyCodes = {
    W: 87,
    Up: 38,
    A: 65,
    Left: 37,
    S: 83,
    Down: 40,
    D: 68,
    Right: 39,
    R: 82, // Transpose Up
    F: 70, // Transpose Down
};

export function attachControls(hero) {
    /*
     * Logic -  We need to listen to keyUp and keyDown events and then listen to the keys we want to listen to with
     * respective key codes
     *
     * so basically listen for w a s d and up down left right
     * when we get an event we indicate that we're expecting to move, and we send the move to the hero as long as we
     * are keyed down, and when we are key up we stop sending the move to the hero
     *
     * and the hero object decides how to deal with that input e.g. it can ignore until it's finishes it's current transition etc
     *
     * another alternative is we send the commands to the board and shift the board, but that might look and feel weird
     */

    const InputLister = {
        onKeyDown(event) {
            this._setMovement(event, true);
        },
        onKeyUp(event) {
            this._setMovement(event, false);
        },
        _setMovement({keyCode}, shouldBeMoving) {
            switch (keyCode) {
                case KeyCodes.Up:
                case KeyCodes.W:
                    this.hero.moveForward = shouldBeMoving;
                    break;

                case KeyCodes.Left:
                case KeyCodes.A:
                    this.hero.moveLeft = shouldBeMoving;
                    break;

                case KeyCodes.Down:
                case KeyCodes.S:
                    this.hero.moveBackward = shouldBeMoving;
                    break;

                case KeyCodes.Right:
                case KeyCodes.D:
                    this.hero.moveRight = shouldBeMoving;
                    break;

                case KeyCodes.R:
                    this.hero.moveUp = shouldBeMoving;
                    break;
                case KeyCodes.F:
                    this.hero.moveDown = shouldBeMoving;
                    break;
            }
        }
    };

    const listener = Object.setPrototypeOf({
        hero
    }, InputLister);

    window.addEventListener('keydown', (event) => listener.onKeyDown(event), false);
    window.addEventListener('keyup', (event) => listener.onKeyUp(event), false);
}