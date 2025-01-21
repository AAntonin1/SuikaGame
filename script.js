
function addCurrentFruit(){
    const newCurrentFruit = Bodies.circle(310,75, 50 , {
        isSleeping: true,
    });
    Composite.add(engine.world, newCurrentFruit);
    currentFruit = newCurrentFruit;
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
    Body = Matter.Body;
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

const ground = Bodies.rectangle(310, 700, 620, 3, { isStatic: true });
const leftSide = Bodies.rectangle(1, 350, 2, 700, { isStatic: true });
const rightSide = Bodies.rectangle(620, 350, 2, 700, { isStatic: true });


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
addCurrentFruit();
window.addEventListener("click", (e) => {
    window.removeEventListener("mousemove", handleMouseMove);
    setTimeout(() => {
        window.addEventListener("mousemove", handleMouseMove);
    }, 750)
    currentFruit.isSleeping = false;
    setTimeout(() => {
        addCurrentFruit();
    }, 750)
})

window.addEventListener("mousemove", handleMouseMove);






