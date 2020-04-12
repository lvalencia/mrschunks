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
    Space: 32
};

function createInputListenerInterface() {
    const InputLister = {
        onKeyDown(event) {
            this._setMovement(event, true);
        },
        onKeyUp(event) {
            this._setMovement(event, false);
        },
        setHero(hero) {
            this.hero = hero;
        },
        /*
         * The Idea behind passing should move would be if we wanted to have like a stop animation
         */
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
                case KeyCodes.Space:
                    this.hero.useEffect();
                    break;
            }
        }
    };
    return InputLister;
}

export function attachControls(hero = undefined) {
    const listener = Object.setPrototypeOf({
        hero,
    }, createInputListenerInterface());

    listener._boundOnKeyDown = listener.onKeyDown.bind(listener);
    listener._boundOnKeyUp = listener.onKeyUp.bind(listener);

    window.addEventListener('keydown', listener._boundOnKeyDown);
    window.addEventListener('keyup', listener._boundOnKeyUp);

    return listener;
}

export function detachControls(listener) {
    window.removeEventListener('keydown', listener._boundOnKeyDown);
    window.removeEventListener('keyup', listener._boundOnKeyUp);

    listener.hero = undefined;
}