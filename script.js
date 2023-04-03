const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

// donne le context 2d 
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
// build de la route
const road = new Road( 
    carCanvas.width / 2, 
    carCanvas.width * 0.9,
);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
    // bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

// build la voiture
// const car = new Car(
//     // on place la voiture au centre de la route
//     // - getLaneCenter(0) => 0 = la voie de gauche
//     // - getLaneCenter(1) => 1 = la voie centrale
//     // - getLaneCenter(2) => 2 = la voie de droite
//     // - 0|1|2|3.......
//     road.getLaneCenter(1),
//     100,
//     30,
//     50,
//     "KEYS",
//     3
// );

const car = new Car(
    // on place la voiture au centre de la route
    // - getLaneCenter(0) => 0 = la voie de gauche
    // - getLaneCenter(1) => 1 = la voie centrale
    // - getLaneCenter(2) => 2 = la voie de droite
    // - 0|1|2|3.......
    road.getLaneCenter(1),
    100,
    30,
    50,
    "IA",
    3
);

// build du traffic
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "BOT", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "BOT", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "BOT", 2),
    new Car(road.getLaneCenter(2), -600, 30, 50, "BOT", 2),
    new Car(road.getLaneCenter(1), -600, 30, 50, "BOT", 2),
    new Car(road.getLaneCenter(3), -700, 30, 50, "BOT", 2),
]

animate()

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars() {
    const cars = [];
    for(let i = 0; i < N; i++) {
        cars.push(new Car(
            road.getLaneCenter(1),
            100,
            30,
            50,
            "IA"
        ));
    }
    return cars;
}

// boucle d'animation
function animate(time) {

    for(let i = 0; i < traffic.length; i++) {
        // on envoie un tableau vide car on ne veut pas que 
        // les IA se choc entre elles
        traffic[i].update(road.borders, []);
    }

    for (let i= 0 ; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    // car.update(road.borders, traffic);

    const bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;

    for (let i= 0 ; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;

    bestCar.draw(carCtx, 'blue', true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}


