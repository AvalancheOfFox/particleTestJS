
// base set up
const canvas = document.getElementById('canvasOne');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let particlesArray = []

// mouse position

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/90) * (canvas.width/90)
}

// sets mouse coordinates on mouse move
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y
    }
)

// sets mouseout event
window.addEventListener('mouseout',
    function(event){
        mouse.x = null;
        mouse.y = null
    }
)

// create particles
class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // draw single particle
    draw(){
        ctx.beginPath();
        ctx.arc(this.x , this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ffffff'   //add in randomness for colors later
        ctx.fill();
    }

    // monitor particle position, mouse position
    update(){
        // check if particle is within canvas boundaries
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX
        }
        if(this.y > canvas.height || this.y < 0){
            this.directionY  = -this.directionY
        }
        // collision detection -- mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy)
        if(distance < mouse.radius + this.size){
             if(mouse.x < this.x && this.x < canvas.width - this.size* 10){
                 this.x += 10;
             }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        // move the particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.draw();
    }
}

// fill particlesArray

function init(){
    particlesArray = [];
    let numParticles = (canvas.height*canvas.width)/9000;
    for(let i=0; i<numParticles; i++){
        let size = (Math.random()* 5)+ 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#ffffff'

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}
// draw connecting lines
function connect() {
    let opacityVal = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < ((canvas.width / 7) * (canvas.height / 7))) {
                opacityVal = 1 - (distance/20000)
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityVal + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// animation
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i=0; i < particlesArray.length ; i++){
        particlesArray[i].update();
    }
    connect();
}

// resize responsive
window.addEventListener('resize', 

    function(){
        window.width = innerWidth;
        window.height = innerHeight;
        mouse.radius = ((canvas.height/90) * (canvas.width/90));
        init();
    })




init();
animate();
