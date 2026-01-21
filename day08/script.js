var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const nodePositions = data.split('\n').map(line => line.trim().split(',').map(Number));

const euclideanDistance = ([x1, y1, z1], [x2, y2, z2]) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;

function buildCircuits(positions, snapshotIteration) {
    let distances = [];
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const distance = euclideanDistance(positions[i], positions[j]);
            distances.push({ pair: [i, j], distance });
        }
    }

    distances.sort((a, b) => a.distance - b.distance);

    let result = {};
    let circuits = positions.map((_, index) => index);
    let circuitSizes = positions.map(() => 1);

    for (let distanceIndex = 0; distanceIndex < distances.length; distanceIndex++) {
        const { pair: [i, j], distance } = distances[distanceIndex];
        if (circuits[i] === circuits[j]) continue;

        const mergeSource = Math.max(circuits[i], circuits[j]);
        const mergeTarget = Math.min(circuits[i], circuits[j]);
        for (let k = 0; k < circuits.length; k++) {
            if (circuits[k] === mergeSource) {
                circuits[k] = mergeTarget;

                circuitSizes[mergeSource]--;
                circuitSizes[mergeTarget]++;
            }
        }

        if (distanceIndex === snapshotIteration - 1) {
            result.snapshot = {
                circuits: circuits.slice(),
                circuitSizes: circuitSizes.slice()
            };
        }

        if (circuitSizes[mergeTarget] === positions.length) {
            result.lastPair = [positions[i], positions[j]];
            break;
        }
    }

    return result;
}

const { snapshot, lastPair } = buildCircuits(nodePositions, 1000);
const part1 = snapshot.circuitSizes
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce(multiply, 1);
console.log(`Part 1: ${part1}`);


// Part 2
const part2 = lastPair.map(([x]) => x).reduce(multiply, 1);
console.log(`Part 2: ${part2}`);
