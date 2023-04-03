class Controls {

    constructor(type) {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        switch (type) {
            case 'KEYS':
                this.#addkeyboradListeners();
                break;
            case 'BOT':
                this.forward = true;
                break;
        }
    }

    // configuration des touches
    #addkeyboradListeners() {
        document.onkeydown=(event) => {
            switch (event.key) {
                case 'z':
                    this.forward = true;
                    break;
                case 's':
                    this.reverse = true;
                    break;
                case 'q':
                    this.left = true;
                    break;
                case 'd':
                    this.right = true;
                    break;
            }
            // console.table(this);
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case 'z':
                    this.forward = false;
                    break;
                case 's':
                    this.reverse = false;
                    break;
                case 'q':
                    this.left = false;
                    break;
                case 'd':
                    this.right = false;
                    break;
            }
            // console.table(this);
        };
    }
}