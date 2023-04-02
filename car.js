class Car {

    // constructeur de la voiture
    // prend en paramètre la position x, y, la largeur et la hauteur
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // vitesse de la voiture
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        // on crée les capteur
        this.sensor = new Sensor(this);
        // on crée les contrôles
        this.controls = new Controls();
    }

    // update de la voiture

    update(roadBorders) {
        this.#move()
        this.sensor.update(roadBorders);
    }


    // on bouge la voiture en fonction des touches
    #move() {

        // contrôles verticaux
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // on limite la vitesse
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        // this.speed *= 1 - this.friction;
        
        // on applique la friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // on arrête la voiture si elle va trop lentement
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {

            // on détermine si on tourne à droite ou à gauche
            // en fonction de la vitesse
            // si la vitesse est positive, on tourne à droite
            // si la vitesse est négative, on tourne à gauche
            // on utilise la fonction Math.sign()
            // qui retourne 1 si le nombre est positif
            // et -1 si le nombre est négatif
            // const flip = Math.sign(this.speed);
            // on peut aussi utiliser une ternaire

            const flip = this.speed > 0 ? 1 : -1;
        
            // contrôles horizontaux
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        // on limite l'angle
        // if (this.angle > Math.PI / 4) {
        //     this.angle = Math.PI / 4;
        // }
        // if (this.angle < -Math.PI / 4) {
        //     this.angle = -Math.PI / 4;
        // }

        
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
        
        // on affiche les infos
        // this.#displayInfos();
        console.log("Angle          : " + (this.angle).toFixed(2));
        console.log("Vitesse (Px/s) : " + (this.speed).toFixed(2));
    }
    
    draw(ctx) {

        // on sauvegarde le contexte
        ctx.save();

        // on translate le contexte
        ctx.translate(this.x, this.y);

        // on tourne le contexte
        ctx.rotate(-this.angle);

        // on dessine la voiture
        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();

        // on dessine les capteurs
        this.sensor.draw(ctx);
    }
}