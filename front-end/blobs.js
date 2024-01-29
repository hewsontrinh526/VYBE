// script.js to animate blobs smoothly
const gradient = document.getElementById('gradient');
let degree = 0;

function updateGradient() {
    gradient.style.background = `linear-gradient(${degree}deg, #97A9F6, #211134)`;
    degree = (degree + 1) % 360; // Increment the degree and loop back to 0 after 360
}

setInterval(updateGradient, 100); // Update the gradient every 100 milliseconds

const radialElement = document.querySelector('.radial-gradient');
let size = 50; // size for radial gradient

function animateRadialGradient() {
    radialElement.style.background = `radial-gradient(circle at ${size}% center, #ff6e7f, #bfe9ff)`;
    size = (size + 1) % 100; // Change size dynamically
}
setInterval(animateRadialGradient, 50);

const element = document.querySelector('.lava-lamp-gradient');
let angle = 0;
let colorShift = 0;

function animateGradient() {
    angle = (angle + 1) % 360;
    colorShift = (colorShift + 1) % 100;
    element.style.background = `linear-gradient(${angle}deg, hsl(${colorShift}, 100%, 50%), hsl(${(colorShift + 60) % 360}, 100%, 50%))`;
}

setInterval(animateGradient, 100);