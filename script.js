const canvas = document.getElementById('myCanvas');
canvas.width = 200;

// donne le context 2d 
const ctx = canvas.getContext('2d');
// build de la route
const road = new Road( 
    canvas.width / 2, 
    canvas.width * 0.9,
);

// build la voiture
const car = new Car(
    // on place la voiture au centre de la route
    // - getLaneCenter(0) => 0 = la voie de gauche
    // - getLaneCenter(1) => 1 = la voie centrale
    // - getLaneCenter(2) => 2 = la voie de droite
    // - 0|1|2|3.......
    road.getLaneCenter(1),
    100,
    30,
    50
);

animate()

// boucle d'animation
function animate() {
    car.update(road.borders);

    canvas.height = window.innerHeight;
    
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}


