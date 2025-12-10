var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const instructions = data.split('\n')
    .map(row => row.trim())
    .map(row => [{'L': -1, 'R':1}[row.charAt(0)], parseInt(row.slice(1))]);

// Part 1
let counter = 50;
let score = 0;
for (const [direction, value] of instructions) {
    counter += (direction * value);
    while (counter < 0) counter += 100;
    while (counter >= 100) counter -= 100;
    if (counter === 0) score += 1;
}
console.log(`Final score: ${score}`);

// Part 2
counter = 50;
score = 0;
for (const [direction, value] of instructions) {
    // If counter started at 0, avoid counting first rotaion
    if (counter === 0 && direction === -1) counter = 100;
    counter += (direction * value);

    // crossed 0 turning right
    while (counter > 100) {
        score += 1;
        counter -= 100;
    }

    // crossed 0 turning left
    while (counter < 0){
        score += 1;
        counter += 100;
    }

    // end on 0
    if (counter === 0 || counter === 100) {
        score += 1;
        counter = 0;
    }
}
console.log(`Final score: ${score}`);
