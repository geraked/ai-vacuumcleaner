import Action from './action.js';

export default class VcBackend {

    constructor() {
        this.m = 0;
        this.n = 0;
        this.envTable = [];
        this.agentPos = [];
        this.percept = [];
        this.action = Action.noOp;
        this.isFinished = false;
        this.checkedCellNo = 0;
        this.dirtNo = 0;
        this.suckNo = 0;
        this.actionNo = 0;
    }

    _initiateEnv() {
        for (let i = 0; i < this.m; i++) {
            this.envTable[i] = [];
            for (let j = 0; j < this.n; j++) {
                let rand = Math.floor(Math.random() * 2);
                this.envTable[i][j] = rand;
                if (rand === 1)
                    this.dirtNo++;
            }
        }
    }

    reset() {
        this.envTable = [];
        this.agentPos = [0, 0];
        this.isFinished = false;
        this.checkedCellNo = 1;
        this.dirtNo = 0;
        this.suckNo = 0;
        this.actionNo = 0;
        this._initiateEnv();
        this.percept = [0, 0, this.envTable[0][0]];
        this.action = Action.noOp;
    }

    env(action) {
        let row = this.agentPos[0];
        let col = this.agentPos[1];
        let percept = [];
        let status;

        if (action === Action.moveRight) {
            this.agentPos = [row, ++col];
        } else if (action === Action.moveLeft) {
            this.agentPos = [row, --col];
        } else if (action === Action.moveUp) {
            this.agentPos = [--row, col];
        } else if (action === Action.moveDown) {
            this.agentPos = [++row, col];
        } else if (action === Action.suck) {
            this.envTable[row][col] = 0;
        }

        status = this.envTable[row][col];
        percept = [row, col, status];
        return percept;
    }

    agent(percept) {
        let row = percept[0];
        let col = percept[1];
        let status = percept[2];
        let action = Action.noOp;

        if (status === 1) {
            action = Action.suck;
            this.suckNo++;
            this.actionNo++;
        } else if (this.checkedCellNo === this.m * this.n) {
            action = Action.noOp;
        } else if ((col === this.n - 1 && row % 2 === 0) || (col === 0 && row % 2 === 1)) {
            action = Action.moveDown;
            this.actionNo++;
            this.checkedCellNo++;
        } else if (row % 2 === 0) {
            action = Action.moveRight;
            this.actionNo++;
            this.checkedCellNo++;
        } else if (row % 2 === 1) {
            action = Action.moveLeft;
            this.actionNo++;
            this.checkedCellNo++;
        }

        return action;
    }

    nextStep() {
        this.action = this.agent(this.percept);
        this.percept = this.env(this.action);
        if (this.action === Action.noOp) {
            this.isFinished = true;
        }
    }

}