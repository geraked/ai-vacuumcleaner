import Action from './action.js';
import VcBackend from './vc-backend.js';

export default class VcFrontend {

    constructor() {
        this.mInput = document.getElementById('m-num');
        this.nInput = document.getElementById('n-num');
        this.delay = document.getElementById('delay-num');
        this.startBtn = document.getElementById('start-btn');
        this.container = document.getElementById('table-wrapper');
        this.dirtNo = document.getElementById('dirt-no');
        this.checkedNo = document.getElementById('checked-no');
        this.suckNo = document.getElementById('suck-no');
        this.actionNo = document.getElementById('action-no');
        this.vcb = new VcBackend();
        this.agent;
        this.table;
        this.mInput.value = 10;
        this.nInput.value = 10;
        this.delay.value = 300;
        this.nextInterval;

        this.initiateListeners();
    }

    initiateListeners() {
        this.startBtn.onclick = () => {
            this.vcb.m = parseInt(this.mInput.value);
            this.vcb.n = parseInt(this.nInput.value);
            this.vcb.reset();
            this.createTable();
            this.dirtNo.innerText = `تعداد زباله‌ها: ${this.vcb.dirtNo}`;
            
            if (this.nextInterval) {
                clearInterval(this.nextInterval);
            }

            this.nextInterval = setInterval(() => {
                this.vcb.nextStep();
                this.checkedNo.innerText = `خانه‌های بررسی شده: ${this.vcb.checkedCellNo}`;
                this.suckNo.innerText = `تعداد مکش: ${this.vcb.suckNo}`;
                this.actionNo.innerText = `تعداد عمل‌ها: ${this.vcb.actionNo}`;

                let cell = document.querySelector(`#row-${this.vcb.agentPos[0]}-col-${this.vcb.agentPos[1]}`);

                if (this.vcb.action === Action.suck) {
                    let dirt = cell.querySelector('.dirt');
                    dirt.remove();
                } else {
                    cell.appendChild(this.agent);
                    this.agent.scrollIntoView({block: "center", inline: "center"});
                }

                if (this.nextInterval && this.vcb.isFinished) {
                    clearInterval(this.nextInterval);
                }
            }, this.delay.value);
        };
    }

    createTable() {
        if (this.table) {
            this.agent.remove();
            this.table.remove();
        }

        this.table = document.createElement('table');
        this.agent = document.createElement('span');
        this.agent.className = 'agent';
        this.agent.innerHTML = '<i class="fas fa-snowplow"></i>';

        for (let i = 0; i < this.vcb.m; i++) {
            let tr = document.createElement('tr');
            tr.id = `tr-${i}`;
            for (let j = 0; j < this.vcb.n; j++) {
                let td = document.createElement('td');
                let number = document.createElement('span');

                if (this.vcb.envTable[i][j] === 1)
                    td.innerHTML = '<span class="dirt"><i class="far fa-trash-alt"></i></span>';

                td.id = `row-${i}-col-${j}`;
                number.className = 'cell-number';
                number.innerText = `${i},${j}`;
                td.appendChild(number);
                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }

        this.container.appendChild(this.table);
        document.querySelector(`#row-${this.vcb.agentPos[0]}-col-${this.vcb.agentPos[1]}`).appendChild(this.agent);
    }

}