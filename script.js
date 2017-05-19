/**
 * @description Count neighbours to left and right, or if 'x' is next to the
 * edge then check the other side
 * @param  {Array} row        Array of numbers representing alive cells
 * @param  {Number} x         X position to check from
 * @param  {Boolean} isOwnRow Should 'x' be included in the count
 * @return {Number}           The number of currently alive neighbours
 */
const checkNeighboursX = (row, x, isOwnRow, width) => {
  let neighbours = 0

  // Check if position to the left is at the edge of the array
  neighbours += (x - 1 >= 0) ?
    // Check if the neighbour to the left exists
    (row.indexOf(x - 1) !== -1) ? 1 : 0 :
    // If the neighbour is less than 0 check the other end of the array
    (row.indexOf(width) !== -1) ? 1 : 0

  // Only check the middle neighbour if isOwnRow is false
  neighbours += (!isOwnRow && row.indexOf(x) !== -1) ? 1 : 0

  // Check if position to the right is at the edge of the array
  neighbours += (x + 1 <= width) ?
    // Check if the neighbour to the right exists
    (row.indexOf(x + 1) !== -1) ? 1 : 0 :
    // If right neighbour is more than max width, check other end of row array
    (row.indexOf(0) !== -1) ? 1 : 0

  return neighbours
}

/**
 * @description Count alive neighbours to the left and right as well as above
 * and below
 * @param  {Object} alive Object with keys of rows and values (array) of cols
 * @param  {Number} x     X position to check from
 * @param  {Number} y     Y position to check from
 * @return {Number}       Total number of alive neighbours exactly 1 step away
 */
const countNeighbours = (alive, x, y, width, height) => {
  let neighbours = 0

  // Check row above is greater than zero and has at least one live cell
  neighbours += (y > 0 && alive[y - 1]) ?
    // Count number of alive neighbours in row above
    checkNeighboursX(alive[y - 1], x, false, width) :
    // If row above is less than zero and has at least one live cell
    (y <= 0 && alive[height]) ?
    // Count number of alive neighbours in row on other end
    checkNeighboursX(alive[height], x, false, width) : 0

  // If own row exists then check neighbours but not self
  neighbours += alive[y] ? checkNeighboursX(alive[y], x, true, width) : 0

  // Opposite of above
  neighbours += (y < height && alive[y + 1]) ?
    checkNeighboursX(alive[y + 1], x, false, width) :
    (y >= height-1 && alive[0]) ?
    checkNeighboursX(alive[0], x, false, width) : 0

  return neighbours
}

/**
 * Check if a cell is live
 * @param  {Object}  alive Object with keys of rows and values (arrays) of cols
 * @param  {Number}  x     x position
 * @param  {Number}  y     y position
 * @return {Boolean}       Is alive?
 */
const isCellAlive = (alive, x, y) => alive[y] ?
  alive[y].indexOf(x) !== -1 : false

/**
 * Should cell be alive in the next round?
 * @param  {Object} alive Keys: y positions, values: arrays of live x positions
 * @param  {Number} x     X position
 * @param  {Number} y     Y position
 * @return {Boolean}      Should the cell be alive next round?
 */
const shouldCellLive = (...args) => {
  // Check the neighbour count and whether the cell is alive
  const [count, alive] = [countNeighbours(...args), isCellAlive(...args)]
  // Cell lives if count is 3 or count is 2 and cell is currently living
  return (count === 3) ? true : (alive && count === 2) ? true : false
}

/**
 * Build the tick's living cell coordinates
 * @param  {Object} alive Keys: y positions, values: arrays of live x positions
 * @return {Object} Keys: y positions, values: arrays of live x positions
 */
const tick = (alive, width, height) => {
  const arrayToCheck = []
  Object.keys(alive).forEach((y) => {
    alive[y].forEach(x => {
      xLow = (x-1 >= 0) ? x - 1 : width
      xHigh = (x+1 <= width) ? x + 1 : 0
      yLow = (Number(y)-1 >= 0) ? Number(y)-1 : height
      yHigh = (Number(y)+1 <= height) ? Number(y)+1 : 0

      arrayToCheck.push(`${xLow} ${yLow}`,
        `${x} ${yLow}`,
        `${xHigh} ${yLow}`,
        `${xLow} ${y}`,
        `${x} ${y}`,
        `${xHigh} ${y}`,
        `${xLow} ${yHigh}`,
        `${x} ${yHigh}`,
        `${xHigh} ${yHigh}`)
    })
  })

  setToCheck = new Set(arrayToCheck)

  const nextTick = [...setToCheck].reduce((acc, coord) => {
    const [x, y] = coord.split(' ')
    if (shouldCellLive(alive, Number(x), Number(y), width, height)) {
      if (acc[y]) {
        acc[y].push(Number(x))
      } else {
        acc[y] = [Number(x)]
      }
    }
    return acc
  }, {})

  return nextTick
}

/**
 * Generate a random seed Object
 * @param  {Number} width
 * @param  {Number} height
 * @param  {Number} chance A number from 0-1 that determines if cell is live
 * @return {Object}        Keys: y positions, values: arrays of live x positions
 */
const generateRandomSeed = (width, height, chance) => {
  // Initial an array of rows
  return Array.from({length: height}, _ => {
    // Fill each row with an initial array of numbered cols
    return Array.from({length: width}, (x, index) => index)
      // Filter the columns by chance
      .filter(x => Math.random() <= chance)
  })
  // Reduce rows and cols to an object containing rows with live cells
  .reduce((acc, row, index) => {
    if (row.length) acc[index] = row
    return acc
  }, {})
};

/* istanbul ignore else */
if (typeof module !== 'undefined') {
  module.exports = {
    checkNeighboursX,
    isCellAlive,
    countNeighbours,
    shouldCellLive,
  }
}
