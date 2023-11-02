// 1. Deposit money
// 2. Determine no. of lines to bet on 
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user has won
// 6. Pay out if won
// 7. Play again


const promptUser = require('prompt-sync')();  //access the prompt-sync module; parentheses at the end are to call a function; prompt-user needs to be installed via npm

const ROWS: number = 3;
const COLS: number = 3;

const SYMBOLS_COUNT: object = {
    'A': 2,
    'B': 4,
    'C': 6,
    'D': 8
};

const SYMBOL_VALUES: object = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 1
};


const deposit = () => {
    // Ask the user about the deposit that he wants to place
    while (true) {
    const depositAmount = parseFloat(promptUser('Enter a deposit amount: ')); // get the value from the user and convert it to the float

    if (isNaN(depositAmount) || depositAmount <= 0) {
        console.log('Invalid input. Please try again');
    }
    else {
        return depositAmount;
    };
    };
};

const getNumberOfLines = () => {
    // Define the number of lines the user wants to bet on
    while (true) {
        const numberOfLines = parseFloat(promptUser('Enter a number of lines (1-3): ')); // get the value from the user and convert it to the float
    
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log('Invalid input. Please try again');
        }
        else {
            return numberOfLines;
        }
        }
}


const getBetAmount = (balance: number, noOfLines: number) => {
    // Receive the amount of money that the user wants to bet
    while (true) {
        const betAmount = parseFloat(promptUser('Please, enter how much money You would like to bet on each line: ')); // get the value from the user and convert it to the float
    
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / noOfLines) {
            console.log('Invalid input. Please try again');
        }
        else {
            return betAmount;
        }
        }
}

const spinMachine = () => {
    // Unpacking symbols into the "symbols" array
    const symbols: Array<string> = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol)
        }
    }
    // Create the reels of the slot machine
    const reels: Array<Array<String>> = [[], [], []]
    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols]; // copy the symbols, as we need to have all symbols available to maintain probability
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random()*reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);  // remove one element recently used - to conserve probability
        }
    }
    return reels
    
}

const transpose = (reels: Array<Array<String>>) => {
    // Transposing the reels into outcome arrays (actual reels)
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        };
    };
    return rows
}


const printRows = (rows) => {
    // Print out the rows in a nice way
    let printedRows: String = '';
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (j < COLS - 1) {
            printedRows += rows[i][j];
            printedRows += ' | '
            };
            if (j === COLS - 1) {
                printedRows += rows[i][j];
            }

        }
        printedRows += '\n';
    }
    return printedRows
}
const checkWin = (rows, linesBetOn: number, bet: number) => {
    //Checking if the User won by comparing the number of lines bet on to number of reels with identical symbols
    let winnings: number = 0;
    let countWinningRows: number = 0;
    for (let row of rows) {
        let allSame = true;
        for (const symbol of row) {
            if (symbol != row[0]) {
                allSame = false;
                break;
            }
        }
    if (allSame) {
        countWinningRows += 1;
        winnings += bet * SYMBOL_VALUES[row[0]] 
    }
    }
    if (countWinningRows === linesBetOn) {
        return winnings
    }
    return 0;
    
}


const game = () => {
    //Whole game logic wrapped up into one main function
    let balance = deposit();

    while (true) {
        console.log(`Your balance is: ${balance}`);
        const numberOfLines = getNumberOfLines();
        const betAmount = getBetAmount(balance, numberOfLines);
        balance -= betAmount * numberOfLines;
        let reel = spinMachine();
        let rowsTransposed = transpose(reel);
        let printedRows = printRows(rowsTransposed);
        console.log(printedRows);
        let moneyWon = checkWin(rowsTransposed, numberOfLines, betAmount);
        balance += moneyWon;
        console.log(`You won \$${moneyWon}`);
        console.log(`Your balance is ${balance}`);
        if (balance <= 0) {
            console.log('You ran out of money!');
            break;
        }
        const askQuit = promptUser('Do You want to play again? Y/N ');
        if (askQuit === 'N' || askQuit === 'n') {
            console.log(`Exiting the game with balance of ${balance}`);
            break;
        }

        };
};

game();


