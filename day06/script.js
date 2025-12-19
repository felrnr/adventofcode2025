var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;


// Part 1
const problems_raw = data.split('\n')
    .map(line => line.trim().split(/\s+/).map(item => isNaN(item) ? item : Number(item)));

const problems = problems_raw[0].map((_, problemNr) => problems_raw.map(row => row[problemNr]));

const solve = (problem) => (problem.pop() === '+') ? problem.reduce(sum, 0) : problem.reduce(multiply, 1);
const part1 = problems.map(solve);

console.log(`Part 1: ${part1.reduce(sum, 0)}`);


// part 2
// Read by column instead of line
function readProblemsByColumn(data) {
    const lines = data.split('\n').map(line => line.replace('\n', ''));
    const maxLineLength = Math.max(...lines.map(line => line.length));
    lines.forEach((line, idx) => lines[idx] = line.padEnd(maxLineLength, ' '));

    const operators = lines.at(-1).trim().split(/\s+/);
    const inputs = lines[0].split('')
        .map((_, colIdx) => lines.slice(0, -1).map(line => line[colIdx]))
        .map(chars => Number(chars.join('')));

    return { inputs, operators };
}

function collectProblemInputs(problemsArray) {
    let problemInputs = [];
    let currentProblem = [];
    problemsArray.forEach(item => {
        if (item !== 0) {
            currentProblem.push(item);
            return;
        }

        if (currentProblem.length === 0) return;

        problemInputs.push(currentProblem);
        currentProblem = [];
    });

    if (currentProblem.length > 0) problemInputs.push(currentProblem);

    return problemInputs;
}

const { inputs, operators } = readProblemsByColumn(data);

const part2 = collectProblemInputs(inputs)
    .map((inputs, idx) => solve([...inputs, operators[idx]]));
console.log(`Part 2: ${part2.reduce(sum, 0)}`);
