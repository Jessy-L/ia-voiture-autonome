class Car {

    // constructeur de la voiture
    // prend en paramètre la position x, y, la largeur et la hauteur
    constructor(x,y,width,height, controlsType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // vitesse de la voiture
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damage = false;

        this.useBrain = controlsType == "IA"

        if(controlsType != "BOT") {
            // on crée les capteur
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                // nombre de neurones d'entrée
                // 1 neurone par capteur
                // 4 => valeur de sortie
                [this.sensor.rayCount, 6, 4]
            )
        }

        // on crée les contrôles
        this.controls = new Controls(controlsType);
    }

    // update de la voiture

    update(roadBorders, traffic) {
        if(!this.damaged){
            this.#move()
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                // s => sensor
                s => s == null ? 0 : 1 - s.offset
            )
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            
            // console.log(outputs);

            if (this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.reverse = outputs[1];
                this.controls.left = outputs[2];
                this.controls.right = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        // on vérifie si la voiture est en collision avec les bordures
        for (let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        // on vérifie si la voiture est en collision avec le traffic
        for (let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }


    #createPolygon() {
        const points = [];
        // on calcule le rayon du cercle englobant la voiture
        const rad = Math.hypot(this.width, this.height) / 2;
        // on calcule l'angle entre le centre de la voiture
        const alpha = Math.atan2(this.width, this.height);
        // on calcule les points du polygone
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
    
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
    
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
    
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
        // console.log("Angle          : " + (this.angle).toFixed(2));
        // console.log("Vitesse (Px/s) : " + (this.speed).toFixed(2));
    }
    
    draw(ctx, color, drawSensor = false) {

        if (this.damaged) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = color;
        }

        ctx.beginPath();
        // on dessine le polygone
        // on commence par le premier point
        // on dessine une ligne jusqu'au premier point
        // on dessine une ligne jusqu'au deuxième point
        // on dessine une ligne jusqu'au troisième point
        // on dessine une ligne jusqu'au quatrième point
        // on ferme le polygone
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor && drawSensor) {
            // on dessine les capteurs
            this.sensor.draw(ctx);
        }
    }
}