export const PickHelper = {
    intersectedInterfaceObjects: {},
    pick(listener, time) {
        const position = listener.normalizedMousePosition;
        this.raycaster.setFromCamera(position, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        for (const intersect of intersects) {
            // We need a better way of referencing our objects
            const interfaceObject = this._interface(intersect.object);
            if (interfaceObject) {
                this._saveIntersectedObject(interfaceObject);
                if (interfaceObject.hasOwnProperty('onHover')) {
                    interfaceObject.onHover(time);
                }
                const {
                    mouseAction: {
                        isClicked
                    }
                } = listener;
                if (interfaceObject.hasOwnProperty('onClick') && isClicked) {
                    interfaceObject.onClick();
                }
            }
        }
        if (intersects.length === 0) {
            for (const uuid of Object.keys(this.intersectedInterfaceObjects)) {
                const interfaceObject = this.intersectedInterfaceObjects[uuid];
                if (interfaceObject.hasOwnProperty('onLeave')) {
                    interfaceObject.onLeave();
                }
                delete this.intersectedInterfaceObjects[uuid];
            }
        }
    },
    _interface(object) {
        if (!object) {
            return;
        }
        if (object.hasOwnProperty('_interface')) {
            return object._interface;
        }
        return this._interface(object.parent);
    },
    _saveIntersectedObject(intersectedObject) {
        if (!this.intersectedInterfaceObjects[intersectedObject.uuid]) {
            this.intersectedInterfaceObjects[intersectedObject.uuid] = intersectedObject;
        }
    }
};

