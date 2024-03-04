// Допоміжна функція: генерація випадкового розв'язку
function generateRandomSolution(n) {
    const solution = [];
    for (let i = 0; i < n; i++) {
        solution.push(Math.floor(Math.random() * n));
    }
    return solution;
}

// Допоміжна функція: оцінка розв'язку (кількість конфліктів)
function calculateConflicts(solution) {
    let conflicts = 0;
    for (let i = 0; i < solution.length - 1; i++) {
        for (let j = i + 1; j < solution.length; j++) {
            if (solution[i] === solution[j] || Math.abs(solution[i] - solution[j]) === Math.abs(i - j)) {
                conflicts++;
            }
        }
    }
    return conflicts;
}

// Допоміжна функція: копіювання розв'язку
function copySolution(solution) {
    return solution.slice();
}

// Допоміжна функція: вивід розв'язку на екран у вигляді шахової дошки
function printSolution(solution) {
    const n = solution.length;
    for (let i = 0; i < n; i++) {
        let row = '';
        for (let j = 0; j < n; j++) {
            row += (solution[i] === j) ? ' Q ' : ' . ';
        }
        console.log(row);
    }
    console.log('\n');
}

// Основна функція: алгоритм відпалу
function simulatedAnnealing(n, maxIterations, coolingRate) {
    let currentSolution = generateRandomSolution(n);
    let currentConflicts = calculateConflicts(currentSolution);

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const temperature = 1.0 - iteration / maxIterations;

        // Генеруємо новий стан
        const newSolution = copySolution(currentSolution);
        const randomRow = Math.floor(Math.random() * n);
        const randomColumn = Math.floor(Math.random() * n);
        newSolution[randomRow] = randomColumn;

        const newConflicts = calculateConflicts(newSolution);

        // Обчислюємо різницю у вартості між новим і поточним станом
        const delta = newConflicts - currentConflicts;

        // Перевіряємо чи приймаємо новий стан
        if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
            currentSolution = copySolution(newSolution);
            currentConflicts = newConflicts;
        }
    }

    return currentSolution;
}

// Генетичний алгоритм
function geneticAlgorithm(n, populationSize, generations) {
    // Ініціалізація початкової популяції
    let population = Array.from({ length: populationSize }, () => generateRandomSolution(n));

    for (let generation = 0; generation < generations; generation++) {
        // Оцінка кожного індивіда
        var evaluatedPopulation = population.map(individual => ({ solution: individual, conflicts: calculateConflicts(individual) }));

        // Сортування популяції за кількістю конфліктів (менше краще)
        evaluatedPopulation.sort((a, b) => a.conflicts - b.conflicts);

        // Створення нової популяції за допомогою схрещування та мутації
        const newPopulation = [];
        for (let i = 0; i < populationSize; i += 2) {
            const parent1 = evaluatedPopulation[i].solution;
            const parent2 = evaluatedPopulation[i + 1].solution;
            const crossoverPoint = Math.floor(Math.random() * n);

            const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
            const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));

            newPopulation.push(child1);
            newPopulation.push(child2);
        }

        // Проведення мутації
        newPopulation.forEach(individual => {
            if (Math.random() < 0.1) {
                const mutationPoint = Math.floor(Math.random() * n);
                individual[mutationPoint] = Math.floor(Math.random() * n);
            }
        });

        // Переведення нової популяції в основну
        population = newPopulation;
    }

    // Повернення найкращого розв'язку
    return evaluatedPopulation[0].solution;
}

function outputSolutionOnBoard(solution) {
    const n = solution.length;
    let cellsRows = document.querySelectorAll(".cells__row");

    for (let i = 0; i < n; i++) {
        let cellsCells = cellsRows[i].querySelectorAll(".cells__cell");
        for (let j = 0; j < n; j++) {
            if (solution[i] === j) {
                cellsCells[j].classList.add("cells__cell_dama");
            }
        }
    }
}

function buildBoard(boardSize) {
// <div class="chess__cells cells">
// <div class="cells__row cells__first-color">
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
// </div>
// <div class="cells__row cells__second-color">
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
//   <div class="cells__cell"></div>
// </div>
    let cells = document.querySelector(".cells");



    for (let i = 0; i < boardSize; i++) {
        if (!(i % 2) /*парне*/) {
            let cellsRowFirst = document.createElement("div");
            cellsRowFirst.classList.add("cells__row");
            cellsRowFirst.classList.add("cells__first-color");

            cells.appendChild(cellsRowFirst);

            let cellsRowsTemp = cells.querySelectorAll(".cells__row");
            

            for (let j = 0; j < boardSize; j++) {
                let cell = document.createElement("div");
                cell.classList.add("cells__cell");
                cell.style.height = `${60 / boardSize}vh`;
                cell.style.width = `${60 / boardSize}vh`;

                cellsRowsTemp[i].appendChild(cell);
            }
        } else {
            let cellsRowSecond = document.createElement("div");
            cellsRowSecond.classList.add("cells__row");
            cellsRowSecond.classList.add("cells__second-color");

            cells.appendChild(cellsRowSecond);

            let cellsRowsTemp = cells.querySelectorAll(".cells__row");

            for (let j = 0; j < boardSize; j++) {
                let cell = document.createElement("div");
                cell.classList.add("cells__cell");
                cell.style.height = `${60 / boardSize}vh`;
                cell.style.width = `${60 / boardSize}vh`;

                cellsRowsTemp[i].appendChild(cell);
            }
        }
    }
}

async function start(boardSize, maxIterations, coolingRate, populationSize, generations) {
    if (boardSize > 3) {
        console.log("Алгоритм відпалу:");
        const simulatedAnnealingSolution = simulatedAnnealing(boardSize, maxIterations, coolingRate);
        printSolution(simulatedAnnealingSolution);
        await buildBoard(boardSize);
        outputSolutionOnBoard(simulatedAnnealingSolution);
        console.log("Генетичний алгоритм:");
        const geneticAlgorithmSolution = geneticAlgorithm(boardSize, populationSize, generations);
        printSolution(geneticAlgorithmSolution);
    } else {
        console.log("Розв\'язку не існує");
    }
}

// Приклад використання:
const boardSize = 15; // Розмір шахової дошки
// Для алгоритму відпалу:
const maxIterations = 10000; // Максимальна кількість ітерацій
const coolingRate = 0.03; // Коефіцієнт охолодження
// Для генетичного алгоритму:
const populationSize = 1000; // Розмір популяції
const generations = 10000; // Кількість поколінь

start(boardSize, maxIterations, coolingRate, populationSize, generations);