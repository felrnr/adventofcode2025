var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const banks = data.split('\n').map(line => line.trim().split('').map(Number));

const sum = (a, b) => a + b;

// Part 1
function findMaxJoltageInBankSimple(bank) {
    let battery1Idx = 0;
    let battery2Idx = 0;

    for (let i = 1; i < bank.length-1; i++) {
        if (bank[i] > bank[battery1Idx]) {
            battery1Idx = i;
        }
    }

    battery2Idx = battery1Idx + 1;
    for (let i = battery1Idx + 2; i < bank.length; i++) {
        if (bank[i] > bank[battery2Idx]) {
            battery2Idx = i;
        }
    }

    return 10*bank[battery1Idx] + bank[battery2Idx];
}

const part1 = banks
    .map(findMaxJoltageInBankSimple)
    .reduce(sum, 0);
console.log(`Part 1: ${part1}`);

// part 2
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

const part2 = banks
    .map(bank => findMaxJoltageInBank(bank, 12))
    .reduce(sum, 0);
console.log(`Part 2: ${part2}`);
