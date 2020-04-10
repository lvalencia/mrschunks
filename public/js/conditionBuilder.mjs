export const PuzzleState = {
    Unknown: 'UNKNOWN',
    WonBonus: 'WON_BONUS',
    Won: 'WON',
    Lost: 'LOST'
};

function allTilesSame({tiles, tileState}) {
    return allTilesAreTileState(tileState)({tiles});
}

function allTilesAreTileState(tileState) {
    return function areAllTileState({tiles}) {
        return tiles.every((tile) => {
            return (!!tile.tileState) === (!!tileState);
        });
    }
}

function movesCompareToMaxMoves(booleanOperator, maxMoves) {
    return function compareToMaxMoves({moves}) {
        return booleanOperator(moves, maxMoves);
    }
}

const ConditionType = {
    AllTiles: "ALL_TILES",
    MaxMoves: "MAX_MOVES"
};

const Condition = {
    isState(args) {
        return this.evaluators.reduce((acc, evaluator) => {
            return this.booleanOperation(acc, evaluator(args))
        }, this.baseAccumulator);
    }
};

const AllTilesConditionBuilder = {
    State: {
        Same: "SAME",
        Flipped: "FLIPPED",
        NotFlipped: "NOT_FLIPPED"
    },
    canBuild(conditionType) {
        return ConditionType.AllTiles === conditionType;
    },
    build(expectedState) {
        switch (expectedState) {
            case this.State.Flipped:
                return allTilesAreTileState(true);
            case this.State.NotFlipped:
                return allTilesAreTileState(false);
            case this.State.Same:
            default:
                return allTilesSame;
        }
    }
};

const MaxMovesConditionBuilder = {
    canBuild(conditionType) {
        return ConditionType.MaxMoves === conditionType;
    },
    build(maxMoves, state) {
        return movesCompareToMaxMoves(
            this._valueComparisonOperation(state),
            maxMoves
        );
    },
    _valueComparisonOperation(state) {
        switch (state) {
            case PuzzleState.Lost:
                return (a,b) => a >= b;
            case PuzzleState.Won:
            case PuzzleState.WonBonus:
            default:
                return (a,b) => a <= b;
        }
    }
};

export const ConditionBuilder = {
    build(state, conditions) {
        const evaluators = Object.entries(conditions).map(([rule, value]) => {
            for (const conditionBuilder of this.conditionBuilders) {
                if (conditionBuilder.canBuild(rule)) {
                    return conditionBuilder.build(value, state);
                }
            }
            throw new Error(`Unsupported Condition: ${rule}`);
        });

        const {
            booleanOperation,
            baseAccumulator
        } =  this._reduceOperatorsFor(state);

        return Object.setPrototypeOf({
            evaluators,
            booleanOperation,
            baseAccumulator,
            state
        }, Condition);
    },
    _reduceOperatorsFor(state) {
        switch (state) {
            case PuzzleState.Won:
            case PuzzleState.WonBonus:
                return {
                    booleanOperation: (a,b) => a && b,
                    baseAccumulator: true
                };
            case PuzzleState.Lost:
                return {
                    booleanOperation: (a,b) => a || b,
                    baseAccumulator: false
                };
            default:
                return (x) => x;
        }
    }
};

export default Object.setPrototypeOf({
    conditionBuilders: [
        AllTilesConditionBuilder,
        MaxMovesConditionBuilder
    ]
}, ConditionBuilder);
