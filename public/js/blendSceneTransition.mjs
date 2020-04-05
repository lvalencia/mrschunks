export const BlendSceneTransition = {
    init(fromAct, toAct) {
        this.from = fromAct;
        this.to = toAct;

        this.from.setTransitionTo = undefined;
    },
    load(args) {
        const {
            canvas
        } = args;
        this.canvas = canvas;
    },
    update(time) {
        this.to.init();
        this.to.load({
            canvas: this.canvas
        });
        this.setDone();
    },
    unload() {

    },
    teardown() {

    },
    setDone() {
        this.done = true;
    },
    next() {
        return this.to;
    }
};