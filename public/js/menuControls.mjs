const OUT_OF_BOUNDS = -Infinity;

const KeyCodes = {
    Mouse: {
        Left: 0,
        Wheel: 1,
        Right: 2,
        Back: 3,
        Forward: 4
    },
    Enter: 13
};

function createInputListenerInterface() {
    const InputListener = {
        onMouseMove(event) {
            const rect = this.canvas.getBoundingClientRect();
            // Position relative to canvas
            const canvasRelativeX = event.clientX - rect.left;
            const canvasRelativeY = event.clientY - rect.top;

            // Relative position relative to camera
            const {
                clientWidth,
                clientHeight
            } = this.canvas;
            const worldAspectRatio = this.camera.aspect;
            const normalizedX = (canvasRelativeX / clientWidth) * worldAspectRatio - 1;
            const normalizedY = (canvasRelativeY / clientHeight) * -worldAspectRatio + 1;

            // Save
            this.position.x = normalizedX;
            this.position.y = normalizedY;
        },
        onMouseOut() {
            this._clearPosition();
        },
        onMouseLeave() {
            this._clearPosition();
        },
        onTouchStart(event) {
            // prevent the window from scrolling
            event.preventDefault();
            this.onMouseMove(event.touches[0]);
        },
        onTouchMove(event) {
            this.onMouseMove(event.touches[0]);
        },
        onTouchEnd() {
            this._clearPosition();
        },
        onMouseDown(event) {
            this.mouseAction.isClicked = true;
            this.mouseAction.button = event.button;
        },
        onMouseUp() {
            this.mouseAction.isClicked = false;
        },
        onKeyDown(event) {

        },
        get normalizedMousePosition() {
            return this.position;
        },
        _clearPosition() {
            this.position.x = OUT_OF_BOUNDS;
            this.position.y = OUT_OF_BOUNDS;
        },
    };
    return InputListener;
}

export function attachControls(camera, canvas) {
    const listener = Object.setPrototypeOf({
        position: {x: OUT_OF_BOUNDS, y: OUT_OF_BOUNDS},
        camera,
        canvas,
        mouseAction: {isClicked: false, button: KeyCodes.Mouse.Left},
    }, createInputListenerInterface());

    listener._boundOnMouseMove = listener.onMouseMove.bind(listener);
    listener._boundOnMouseOut = listener.onMouseOut.bind(listener);
    listener._boundOnMouseDown = listener.onMouseDown.bind(listener);
    listener._boundOnMouseUp = listener.onMouseUp.bind(listener);
    listener._boundOnMouseLeave = listener.onMouseLeave.bind(listener);
    listener._boundOnTouchStart = listener.onTouchStart.bind(listener);
    listener._boundOnTouchMove = listener.onTouchMove.bind(listener);
    listener._boundOnTouchEnd = listener.onTouchEnd.bind(listener);

    window.addEventListener('mousemove', listener._boundOnMouseMove);
    window.addEventListener('mouseout', listener._boundOnMouseOut);
    window.addEventListener('mousedown', listener._boundOnMouseDown);
    window.addEventListener('mouseup', listener._boundOnMouseUp);
    window.addEventListener('mouseleave', listener._boundOnMouseLeave);
    window.addEventListener('touchstart', listener._boundOnTouchStart, {passive: false});
    window.addEventListener('touchmove', listener._boundOnTouchMove);
    window.addEventListener('touchend', listener._boundOnTouchEnd);
    return listener;
}

export function detachControls(listener) {
    window.removeEventListener('mousemove', listener._boundOnMouseMove);
    window.removeEventListener('mouseout', listener._boundOnMouseOut);
    window.removeEventListener('mousedown', listener._boundOnMouseDown);
    window.removeEventListener('mouseup', listener._boundOnMouseUp);
    window.removeEventListener('mouseleave', listener._boundOnMouseLeave);
    window.removeEventListener('touchstart', listener._boundOnTouchStart);
    window.removeEventListener('touchmove', listener._boundOnTouchMove);
    window.removeEventListener('touchend', listener._boundOnTouchEnd);

    // Defaults
    listener.position = {x: OUT_OF_BOUNDS, y: OUT_OF_BOUNDS};
    listener.mouseAction = {isClicked: false, button: KeyCodes.Mouse.Left};
}