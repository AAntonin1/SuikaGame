function addCurrentFruit(Fruit){
    const newCurrentFruit = Bodies.circle(cursorX, 75, Fruit.radius, {
        isSleeping: true,
        label : Fruit.label,
        render : {
            fillStyle: Fruit.color,
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
    element : document.getElementById("container"),
    options: {
        width: 620,
        height: 700,
        background: "#FFEBCD",
        showAxes: true,
        showPositions: true,
        wireframes: false,
    }
});

const ground = Bodies.rectangle(310, 700, 620, 10, { isStatic: true });
const leftSide = Bodies.rectangle(1, 350, 10, 700, { isStatic: true });
const rightSide = Bodies.rectangle(620, 350, 10, 700, { isStatic: true });


let listElements = []
listElements.push(ground);
listElements.push(leftSide);
listElements.push(rightSide);


Composite.add(engine.world, listElements);
Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

let cursorX = 0;

// Evenement Fenetre

let flagOut = false;
let TabFruits = FRUITS;
let randomFruitsID = TabFruits[Math.floor(Math.random() * 5)];
console.log();
addCurrentFruit(randomFruitsID);

window.addEventListener("click", (e) => {
    if(flagOut) return
    flagOut = true;
    window.removeEventListener("mousemove", handleMouseMove);
    setTimeout(() => {
        window.addEventListener("mousemove", handleMouseMove);

    }, 500)
    currentFruit.isSleeping = false;

    setTimeout(() => {
        randomFruitsID = Math.floor(Math.random() * 5);
        addCurrentFruit(TabFruits[randomFruitsID]);
        flagOut = false;
    }, 500)
})

window.addEventListener("mousemove", handleMouseMove);

Event.on(engine, "collisionStart", (e) => {
    e.pairs.forEach((collision) => {
        if (collision.bodyA.label === collision.bodyB.label){
            Composite.remove(engine.world, [collision.bodyA, collision.bodyB]);
            const xBodyA = collision.bodyA.position.x;
            const yBodyA = collision.bodyA.position.y;
            const xBodyB = collision.bodyB.position.x;
            const yBodyB = collision.bodyB.position.y;

            const xBodyC = (xBodyB + xBodyA) / 2;
            const yBodyC = (yBodyB + yBodyA) / 2;
            const indexCurrentF = TabFruits.findIndex(Fruit => Fruit.label === collision.bodyA.label);
            addFruitCollid(TabFruits[indexCurrentF + 1], xBodyC, yBodyC);

        }
    })
})






