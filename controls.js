class Controls {

    constructor() {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        this.#addkeyboradListeners();
    }

    // configuration des touches
    #addkeyboradListeners() {
        document.addEventListener('keydown', (event) => {
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
        });

        document.addEventListener('keyup', (event) => {
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
        });
    }
}