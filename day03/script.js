var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const banks = data.split('\n').map(line => line.trim().split('').map(Number));

const sum = (a, b) => a + b;

function findMaxJoltageInBank(bank, n=2) {
    let batteryIndices = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        const startIdx = (i === 0) ? 0 : batteryIndices[i-1] + 1;
        batteryIndices[i] = startIdx;

        const maxSearchIdx = bank.length - (n - (i + 1));
        for (let j = startIdx+1; j < maxSearchIdx; j++) {
            if (bank[j] > bank[batteryIndices[i]]) {
                batteryIndices[i] = j;
            }
        }
    }

    return batteryIndices.reduce((acc, i) => acc * 10 + bank[i], 0);
}

// Part 1
const part1 = banks
    .map(bank => findMaxJoltageInBank(bank))
    .reduce(sum, 0);
console.log(`Part 1: ${part1}`);

// part 2
const part2 = banks
    .map(bank => findMaxJoltageInBank(bank, 12))
    .reduce(sum, 0);
console.log(`Part 2: ${part2}`);
