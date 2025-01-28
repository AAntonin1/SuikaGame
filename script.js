function addCurrentFruit(Fruit){
    const newCurrentFruit = Bodies.circle(cursorX, 75, Fruit.radius, {
        isSleeping: true,
        label : Fruit.label,
        render : {
            fillStyle: Fruit.color,
            //sprite: { texture: `/img/${Fruit.label}.png` },
            restitution: 0.2,
        }
    });
    Composite.add(engine.world, newCurrentFruit);
    currentFruit = newCurrentFruit;
}

function addFruitCollid(Fruit, x, y){
    const newFruit = Bodies.circle(x, y, Fruit.radius, {
        label : Fruit.label,
        render : {
            fillStyle: Fruit.color,
            //sprite: { texture: `/img/${Fruit.label}.png` },
            restitution: 0.2,
        }
    });
    Composite.add(engine.world, newFruit);
}

function handleMouseMove(e){
    const rect = document.querySelector("canvas").getBoundingClientRect();
    let posX = e.clientX - rect.left;
    if(posX > 60 && posX < 560){
        Body.setPosition(currentFruit, {
            x: posX,
            y: 75 - rect.top,
        })
        cursorX = posX;
    }
}

function resetGame(){
    let circleArray= [];
    let allBodies = Composite.allBodies(engine.world);
    allBodies.forEach(Bodie => {
        if(Bodie.circleRadius > 0) circleArray.push(Bodie);
    })
    Composite.remove(engine.world, circleArray);
    scoreTotal = 0
    scoreDiv.innerText = scoreTotal;

    randomFruitsID = Math.floor(Math.random() * 5);
    addCurrentFruit(TabFruits[randomFruitsID]);

}


const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Collision = Matter.Collision,
    Event = Matter.Events,
    Mouse = Matter.Mouse;

let currentFruit = 0;


const engine = Engine.create();
const render = Render.create({
    engine,
    element : document.getElementById("game"),
    options: {
        width: 620,
        height: 700,
        background: "#FFEBCD",
        wireframes: false,
    }
});

const ground = Bodies.rectangle(310, 700, 620, 10, { isStatic: true });
const leftSide = Bodies.rectangle(1, 490, 10, 700, { isStatic: true });
const rightSide = Bodies.rectangle(620, 490, 10, 700, { isStatic: true });
const hideTop = Bodies.rectangle(310, 70, 620, 140, {
    isStatic: true,
    isSensor: true,
    render: {
        fillStyle: "white",
    }});
const topLine = Bodies.rectangle(310, 140, 620, 5, {
    label: "topLine",
    isStatic: true,
    isSensor: true,
    render : {
        fillStyle: "#FFEBCD",
    }});


let listElements = []
listElements.push(ground);
listElements.push(leftSide);
listElements.push(rightSide);
listElements.push(topLine);
listElements.push(hideTop);


let composite = Composite.add(engine.world, listElements);
Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

let cursorX = 0;

// Evenement Fenetre

let flagOut = false;
let TabFruits = FRUITS;
let randomFruitsID = TabFruits[Math.floor(Math.random() * 5)];
let disableCollision = false;
addCurrentFruit(randomFruitsID);

window.addEventListener("click", (e) => {
    if(flagOut) return
    disableAction = true;
    flagOut = true;
    window.removeEventListener("mousemove", handleMouseMove);
    setTimeout(() => {
        window.addEventListener("mousemove", handleMouseMove);
    }, 500)
    currentFruit.isSleeping = false;

    setTimeout(() => {
        randomFruitsID = Math.floor(Math.random() * 5);
        addCurrentFruit(TabFruits[randomFruitsID]);
        disableAction = false;
        flagOut = false;
    }, 500)
})

window.addEventListener("mousemove", handleMouseMove);

let scoreTotal = 0;
const scoreDiv = document.getElementById("scoreTotal");
Event.on(engine, "collisionStart", (e) => {
    e.pairs.forEach((collision) => {
        if (collision.bodyA.label === collision.bodyB.label){
            const xBodyA = collision.bodyA.position.x;
            const yBodyA = collision.bodyA.position.y;
            const xBodyB = collision.bodyB.position.x;
            const yBodyB = collision.bodyB.position.y;
            const xBodyC = (xBodyB + xBodyA) / 2;
            const yBodyC = (yBodyB + yBodyA) / 2;
            const indexCurrentF = TabFruits.findIndex(Fruit => Fruit.label === collision.bodyA.label);

            Composite.remove(engine.world, [collision.bodyA, collision.bodyB]);
            scoreTotal += TabFruits[indexCurrentF].point;
            scoreDiv.innerHTML = scoreTotal;

            addFruitCollid(TabFruits[indexCurrentF + 1], xBodyC, yBodyC);

        }

        if ((collision.bodyA.label === "topLine" || collision.bodyB.label === "topLine") &&
            !disableAction)
        {
            alert("Game over");
            resetGame();
        }

    })
})







