/*
 * This Object is going to be a very specific data structure
 *
 * In Abstract
 *
 * It is a Graph whose Vertices are the objects that represent a "state"
 * and Edges represent a Mediator (https://en.wikipedia.org/wiki/Mediator_pattern) to handle the interaction of
 * transitioning from one object to the other
 *      Vertices need a well defined interface
 *      Edges need a well defined interface
 *
 * Interface
 *
 * addObject(o) - adds an object to the OMG (assuming it doesnt exist), outcomes: ADDED, DUPLICATE, FAILED
 * removeObject(o) - removes the object from the OMG (if it is there) (and its mediators), outcomes: REMOVED, NOT_IN_OMG, FAILED
 * getObject(o) - retrieves the object (based on identification -- remains to be seen) (if it is there), outcomes: RETURNS_OBJECT, NOT_IN_OMG, FAILED
 * addMediator(o1,o2,m) - adds a mediator from o1 to o2 in the OMG (if there isn't one already), outcomes: ADDED, HAS_MEDIATOR, DUPLICATE, FAILED
 * removeMediator(o1,o2) - removes a mediator from o1 to o2 in the OMG (if it is there), outcomes: REMOVED, NOT_IN_OMG, FAILED
 * getMediator(o1,o2) - retrieves the mediator from o1 to o2 in the OMG (if it is there), outcomes: RETURNS_MEDIATOR, NOT_IN_OMG, FAILED
 * hasMediator(o1,o2) - checks whether or not there's a mediator from o1 to o2. (note: o1 to o2, is distinct from o2 to o1), outcomes: true or false
 * mediatedObjects(o1) - returns a list of objects that o1 has a mediator for, outcomes: empty array, or array of 1 or more objects
 *
 * // Not a primitive - wont include
 * replaceObject(o, o') - developers can roll their own with: addObject(o'), mediatedObjects(o), getMediator(o, mo), addMediator(o', m), removeObject(oa
 *
 */

export const ObjectMediatorGraphOperationResult = {
    AddedObject: 'ADDED_OBJECT',
    FailedAlreadyExists: 'FAILED_EXISTS',
    RemovedObject: 'REMOVED_OBJECT',
    FailedNotInObjectMediatorGraph: 'FAILED_NOT_IN_OBJECT_MEDIATOR_GRAPH',
    RetrievedObject: 'RETRIEVED_OBJECT',
    FailedMediatorAlreadyExists: 'FAILED_MEDIATOR_ALREADY_EXISTS',
    AddedMediator: 'ADDED_MEDIATOR',
    FailedMediatorNotInObjectMediatorGraph: 'FAILED_MEDIATOR_NOT_IN_OBJECT_MEDIATOR_GRAPH',
    RemovedMediator: 'REMOVED_MEDIATOR',
    RetrievedMediator: 'RETRIEVED_MEDIATOR',
    CheckedExistence: 'CHECKED_EXISTENCE',
    RetrievedMediatedObjects: 'RETRIEVED_MEDIATED_OBJECTS'
};

// @TODO - DRY this out
// @TODO - This is foundational, should definitely be unit tested
export const ObjectMediatorGraph = {
    // O(1)
    addObject(obj) {
        if (this.adjacencyCollection.has(obj)) {
            return {result: ObjectMediatorGraphOperationResult.FailedAlreadyExists};
        }

        this.adjacencyCollection.set(obj, new Map());

        return {result: ObjectMediatorGraphOperationResult.AddedObject};
    },
    // O(V)
    removeObject(obj) {
        if (!this.adjacencyCollection.has(obj)) {
            return {result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph};
        }

        for (const [_, value] of this.adjacencyCollection) {
            value.delete(obj);
        }

        this.adjacencyCollection.delete(obj);

        return {result: ObjectMediatorGraphOperationResult.RemovedObject};
    },
    // O(1)
    addMediator(fromObj, toObj, mediator, label = '') {
        if (!this.adjacencyCollection.has(fromObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: fromObj
            }
        }
        if (!this.adjacencyCollection.has(toObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: toObj
            }
        }
        const {
            result,
            value: hasMediator
        } = this.hasMediator(fromObj, toObj);

        if (result === ObjectMediatorGraphOperationResult.CheckedExistence && hasMediator) {
            return {result: ObjectMediatorGraphOperationResult.FailedMediatorAlreadyExists};
        }

        const from = this.adjacencyCollection.get(fromObj);
        from.set(toObj, {label, mediator});

        return {
            result: ObjectMediatorGraphOperationResult.AddedMediator,
            mediator
        };
    },
    // O(1)
    removeMediator(fromObj, toObj) {
        if (!this.adjacencyCollection.has(fromObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: fromObj
            }
        }
        if (!this.adjacencyCollection.has(toObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: toObj
            }
        }

        const from = this.adjacencyCollection.get(fromObj);

        const result = from.delete(toObj) ?
            ObjectMediatorGraphOperationResult.RemovedMediator :
            ObjectMediatorGraphOperationResult.FailedMediatorNotInObjectMediatorGraph;

        return {result};
    },
    // O(1)
    getMediator(fromObj, toObj) {
        if (!this.adjacencyCollection.has(fromObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: fromObj
            }
        }
        if (!this.adjacencyCollection.has(toObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: toObj
            }
        }

        const from = this.adjacencyCollection.get(fromObj);
        const maybeMediator = from.get(toObj);

        const result = maybeMediator ?
            ObjectMediatorGraphOperationResult.RetrievedObject :
            ObjectMediatorGraphOperationResult.FailedMediatorNotInObjectMediatorGraph;

        return {
            result,
            value: maybeMediator
        };
    },
    // O(1)
    hasMediator(fromObj, toObj) {
        if (!this.adjacencyCollection.has(fromObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: fromObj
            }
        }
        if (!this.adjacencyCollection.has(toObj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: toObj
            }
        }

        const from = this.adjacencyCollection.get(fromObj);

        return {
            result: ObjectMediatorGraphOperationResult.CheckedExistence,
            value: from.has(toObj)
        }
    },
    // O(1)
    mediatedObjects(obj) {
        if (!this.adjacencyCollection.has(obj)) {
            return {
                result: ObjectMediatorGraphOperationResult.FailedNotInObjectMediatorGraph,
                value: obj
            }
        }
        const from = this.adjacencyCollection.get(obj);

        return {
            result: ObjectMediatorGraphOperationResult.RetrievedMediatedObjects,
            value: from
        };
    }
};

