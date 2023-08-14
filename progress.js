// const chalk = require('chalk');

var print = {
    setFormat: function(fn) {
        this.format = fn || ((result) => 'complete.');
    },
    printStatus(result) {
        if (!this.numOfLinesToClear) {
            this.numOfLinesToClear = true;
        } else {
            process.stdout.moveCursor(0, -1);
        }
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        let output = this.format(result);
        process.stdout.write(output || 'none');
    },
};

function progress(formatfn) {
    var printer = Object.create(print);
    printer.setFormat(formatfn);
    return printer;
}

// var printer = progress((result) => {
//     return `fetch cve total: ${chalk.cyan(result.total)}, complete:${chalk.green(result.complete)}\n`;
// });

// for (var i = 0; i < 10000; i++) {
//     printer.printStatus({ total: 10000, complete: i });
// }

module.exports = progress;
