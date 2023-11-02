// 1. Deposit money
// 2. Determine no. of lines to bet on 
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user has won
// 6. Pay out if won
// 7. Play again
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var promptUser = require('prompt-sync')(); //access the prompt-sync module; parentheses at the end are to call a function; prompt-user needs to be installed via npm
var ROWS = 3;
var COLS = 3;
var SYMBOLS_COUNT = {
    'A': 2,
    'B': 4,
    'C': 6,
    'D': 8
};
var SYMBOL_VALUES = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 1
};
var deposit = function () {
    // Ask the user about the deposit that he wants to place
    while (true) {
        var depositAmount = parseFloat(promptUser('Enter a deposit amount: ')); // get the value from the user and convert it to the float
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log('Invalid input. Please try again');
        }
        else {
            return depositAmount;
        }
        ;
    }
    ;
};
var getNumberOfLines = function () {
    // Define the number of lines the user wants to bet on
    while (true) {
        var numberOfLines = parseFloat(promptUser('Enter a number of lines (1-3): ')); // get the value from the user and convert it to the float
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log('Invalid input. Please try again');
        }
        else {
            return numberOfLines;
        }
    }
};
var getBetAmount = function (balance, noOfLines) {
    // Receive the amount of money that the user wants to bet
    while (true) {
        var betAmount = parseFloat(promptUser('Please, enter how much money You would like to bet on each line: ')); // get the value from the user and convert it to the float
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / noOfLines) {
            console.log('Invalid input. Please try again');
        }
        else {
            return betAmount;
        }
    }
};
var spinMachine = function () {
    // Unpacking symbols into the "symbols" array
    var symbols = [];
    for (var _i = 0, _a = Object.entries(SYMBOLS_COUNT); _i < _a.length; _i++) {
        var _b = _a[_i], symbol = _b[0], count = _b[1];
        for (var i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    // Create the reels of the slot machine
    var reels = [[], [], []];
    for (var i = 0; i < COLS; i++) {
        var reelSymbols = __spreadArray([], symbols); // copy the symbols, as we need to have all symbols available to maintain probability
        for (var j = 0; j < ROWS; j++) {
            var randomIndex = Math.floor(Math.random() * reelSymbols.length);
            var selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // remove one element recently used - to conserve probability
        }
    }
    return reels;
};
var transpose = function (reels) {
    // Transposing the reels into outcome arrays (actual reels)
    var rows = [];
    for (var i = 0; i < ROWS; i++) {
        rows.push([]);
        for (var j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
        ;
    }
    ;
    return rows;
};
var printRows = function (rows) {
    // Print out the rows in a nice way
    var printedRows = '';
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            if (j < COLS - 1) {
                printedRows += rows[i][j];
                printedRows += ' | ';
            }
            ;
            if (j === COLS - 1) {
                printedRows += rows[i][j];
            }
        }
        printedRows += '\n';
    }
    return printedRows;
};
var checkWin = function (rows, linesBetOn, bet) {
    //Checking if the User won by comparing the number of lines bet on to number of reels with identical symbols
    var winnings = 0;
    var countWinningRows = 0;
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var allSame = true;
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var symbol = row_1[_a];
            if (symbol != row[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            countWinningRows += 1;
            winnings += bet * SYMBOL_VALUES[row[0]];
        }
    }
    if (countWinningRows === linesBetOn) {
        return winnings;
    }
    return 0;
};
var game = function () {
    //Whole game logic wrapped up into one main function
    var balance = deposit();
    while (true) {
        console.log("Your balance is: " + balance);
        var numberOfLines = getNumberOfLines();
        var betAmount = getBetAmount(balance, numberOfLines);
        balance -= betAmount * numberOfLines;
        var reel = spinMachine();
        var rowsTransposed = transpose(reel);
        var printedRows = printRows(rowsTransposed);
        console.log(printedRows);
        var moneyWon = checkWin(rowsTransposed, numberOfLines, betAmount);
        balance += moneyWon;
        console.log("You won $" + moneyWon);
        console.log("Your balance equals " + balance);
        if (balance <= 0) {
            console.log('You ran out of money!');
            break;
        }
        var askQuit = promptUser('Do You want to play again? Y/N ');
        if (askQuit === 'N' || askQuit === 'n') {
            console.log("Exiting the game with balance of " + balance);
            break;
        }
    }
    ;
};
game();
