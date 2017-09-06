const yargs = require('yargs').argv

const isCli = yargs['$0'] !== ''

console.log(isCli, yargs);
// exports.generateDiffs = function() {
//
// }
// // json / pngs
//
// exports.testDiffs = function() {
//
// }
//
// exports.generateHtmlPreview = function() {
//
// }

function generateDiffs() {

}

module.exports = () => {
  console.log('a');
}
