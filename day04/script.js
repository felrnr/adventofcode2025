var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString();

const board = data.split('\n').map(line => line.trim().split(''));
const dimensions = [board.length, board[0].length];
const isInBounds = ([y, x], [yMax, xMax]=dimensions) => (x >= 0 && x < xMax) && (y >= 0 && y < yMax);
const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

const TileType = {
    EMPTY: '.',
    PAPER_ROLL: '@',
    PAPER_ACCESSIBLE: 'x',
}

function markAccessibleAreas(board) {
    const newBoard = board.map((row, y) =>
        row.slice().map((cell, x) => {
            if (cell === TileType.EMPTY) return cell;

            const paperNeighbours = neighbours.map(([dy, dx]) => [y + dy, x + dx])
                .filter(pos => isInBounds(pos))
                .filter(([ny, nx]) => board[ny][nx] === TileType.PAPER_ROLL)
                .length;
            return (paperNeighbours < 4) ? TileType.PAPER_ACCESSIBLE : TileType.PAPER_ROLL;
        })
    );

    return newBoard;
}

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
let markedBoard = markAccessibleAreas(board);
// drawBoard(markedBoard, false);

const part1 = markedBoard
    .flatMap(row => row.filter(cell => cell === TileType.PAPER_ACCESSIBLE))
    .length;
console.log(`Part 1: ${part1}`);


// Part 2
function findAllAccessiblePaperRolls(board) {
    let totalRollsAccessed = 0;
    let currentBoard = board;

    while (true) {
        // drawBoard(currentBoard, false);
        let newIterationBoard = markAccessibleAreas(currentBoard);
        const markedTilesCount = newIterationBoard
            .flatMap(row => row.filter(cell => cell === TileType.PAPER_ACCESSIBLE))
            .length;

        if (markedTilesCount === 0) break;
        totalRollsAccessed += markedTilesCount;

        // drawBoard(newIterationBoard, false);
        currentBoard = newIterationBoard.map(row =>
            row.map(cell => (cell === TileType.PAPER_ACCESSIBLE) ? TileType.EMPTY : cell)
        );
    }

    return totalRollsAccessed;
}

const part2 = findAllAccessiblePaperRolls(board);
console.log(`Part 2: ${part2}`);
