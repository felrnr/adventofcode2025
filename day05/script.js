var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

let parts = data.split('\n\n')
    .map(lines => lines.split('\n').map(line => line.trim()));
const ranges = parts[0].map(line => line.split('-').map(Number));
const products = parts[1].map(Number);

const sum = (a, b) => a + b;

// Part 1
const part1 = products
    .filter(productId =>
        ranges.some(([minId, maxId]) => productId >= minId && productId <= maxId)
    ).length;
console.log(`Part 1: ${part1}`);

// Part 2
function mergeRanges(ranges) {
    ranges.sort((a, b) => a[0] - b[0]);
    let merged = [];
    let currentRange;

    for (let range of ranges) {
        if (!currentRange) {
            currentRange = range;
            continue;
        }

        if (range[0] <= currentRange[1]) {
            currentRange[1] = Math.max(currentRange[1], range[1]);
        } else {
            merged.push(currentRange);
            currentRange = range;
        }
    }

    if (currentRange) merged.push(currentRange);

    return merged;
}

const part2 = mergeRanges(ranges)
    .map(([minId, maxId]) => maxId - minId + 1)
    .reduce(sum, 0);
console.log(`Part 2: ${part2}`);
