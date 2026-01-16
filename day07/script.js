var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const board = data.split('\n').map(line => line.trim().split(''));
const TileType = {
  EMPTY: '.',
  START: 'S',
  SPLITTER: '^',
  BEAM: '|'
};

const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;

function drawBoard(board, toFile=false) {
    const prefixWidth = board.length.toString().length;
    const lines = board
        .map((row, y) => y.toString().padStart(prefixWidth) + ' ' + row.join(''));

    console.log("Board:");
    lines.forEach(line => console.log(line));
    console.log('\n');

    if (toFile) fs.writeFileSync(path.join(__dirname, "solution.map"), lines.join('\n'));
}

// Part 1
function simulateBeam(board) {
    let simBoard = board.map(row => row.slice());
    let splittersHit = 0;

    for (let y = 0; y < simBoard.length - 1; y++) {
        for (let x = 0; x < simBoard[y].length; x++) {
            if (simBoard[y][x] === TileType.START) {
                simBoard[y+1][x] = TileType.BEAM;
            } else if (simBoard[y][x] === TileType.BEAM) {
                if (simBoard[y+1][x] === TileType.EMPTY) {
                    simBoard[y+1][x] = TileType.BEAM;
                } else if (simBoard[y+1][x] === TileType.SPLITTER) {
                    simBoard[y+1][x-1] = TileType.BEAM;
                    simBoard[y+1][x+1] = TileType.BEAM;
                    splittersHit++;
                }
            }
        }
    }

    return { splittersHit, simBoard};
}

const { splittersHit, simBoard } = simulateBeam(board);
drawBoard(simBoard, false);

console.log(`Part 1: ${splittersHit}`);


// Part 2
function simulateBeamQuantum(board) {
    let simBoard = board.map(row => row.slice());

    const isBeam = (cell) => !isNaN(cell);

    for (let y = 0; y < simBoard.length - 1; y++) {
        // drawBoard(simBoard, false);

        for (let x = 0; x < simBoard[y].length; x++) {
            if (simBoard[y][x] === TileType.START) {
                simBoard[y+1][x] = 1;
            } else if (isBeam(simBoard[y][x])) {
                const beamIntensity = simBoard[y][x];
                let targets = [];

                if (simBoard[y+1][x] === TileType.EMPTY || isBeam(simBoard[y+1][x])) {
                    targets.push([y+1, x]);
                } else if (simBoard[y+1][x] === TileType.SPLITTER) {
                    targets.push([y+1, x-1]);
                    targets.push([y+1, x+1]);
                }

                targets.forEach(([targetY, targetX]) => {
                    if (simBoard[targetY][targetX] === TileType.EMPTY) {
                        simBoard[targetY][targetX] = beamIntensity;
                    } else {
                        simBoard[targetY][targetX] += beamIntensity;
                    }
                });
            }
        }
    }

    const totalTimelines = simBoard.at(-1).filter(cell => !isNaN(cell)).reduce(sum, 0);
    return { totalTimelines, simBoard};
}

const { totalTimelines } = simulateBeamQuantum(board);
console.log(`Part 2: ${totalTimelines}`);
