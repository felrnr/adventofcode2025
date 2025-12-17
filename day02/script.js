var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const ranges = data.split(',')
    .map(range => range.split('-').map(Number));

const sum = (a, b) => a + b;

// Part 1
function findProductIdDoublesInRange(range) {
    const minIdLength = Math.ceil(range[0].toString().length / 2);
    const maxIdLength = Math.floor(range[1].toString().length / 2);
    let validProductIds = [];

    for (let idLength = Math.max(minIdLength, 1); idLength <= maxIdLength; idLength++) {
        for (let id = 10**(idLength - 1); id < 10**idLength; id++) {
            const productId = parseInt(id.toString().repeat(2));

            if (productId > range[1]) break;
            if (productId >= range[0])
                validProductIds.push(productId);
        }
    }

    return validProductIds;
}

const part1 = ranges
    .flatMap(findProductIdDoublesInRange)
    .reduce(sum, 0);
console.log(`Part 1: ${part1}`);


// Part 2
function findProductIdMutliplesInRange(range) {
    const minIdLength = 1;
    const maxIdLength = Math.floor(range[1].toString().length / 2);
    let validProductIds = new Set();

    for (let idLength = minIdLength; idLength <= maxIdLength; idLength++) {
        const minRepeats = Math.max(Math.ceil(range[0].toString().length / idLength), 2);
        const maxRepeats = Math.floor(range[1].toString().length / idLength);

        for (let id = 10**(idLength - 1); id < 10**idLength; id++) {
            for (let repeatCount = minRepeats; repeatCount <= maxRepeats; repeatCount++) {
                const productId = parseInt(id.toString().repeat(repeatCount));

                if (productId > range[1]) break;
                if (productId >= range[0])
                    validProductIds.add(productId)
            }
        }
    }

    return Array.from(validProductIds);
}

const part2 = ranges
    .flatMap(findProductIdMutliplesInRange)
    .reduce(sum, 0);
console.log(`Part 2: ${part2}`);
