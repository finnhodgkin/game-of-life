const { checkNeighboursX, isCellAlive } = require('./script')
describe('checkNeighboursX function works as expected', () => {
  it('If X isn\'t near any live cells', () => {
    expect(checkNeighboursX([1,2,3], 10, true, 20)).toEqual(0)
  })
  it('If X and its neighbours are live AND self is set to FALSE then 3', () => {
    expect(checkNeighboursX([1,2,3], 2, false, 20)).toEqual(3)
  })
  it('If X and its neighbours are live AND self is set to TRUE then 2', () => {
    expect(checkNeighboursX([1,2,3], 2, true, 20)).toEqual(2)
  })
  it('If at start of array checks end', () => {
    expect(checkNeighboursX([0,1,2,3], 0, false, 3)).toEqual(3)
  })
  it('If at end of array checks start', () => {
    expect(checkNeighboursX([0,1,2,3], 3, false, 3)).toEqual(3)
  })
})

describe('isCellAlive checks if a single cell is alive', () => {
  const alive = {
    0: [1, 2, 3, 4],
    1: [0, 2, 5, 7]
  }
  it('Coordinate with live cell returns true', () => {
    expect(isCellAlive(alive, 1, 0)).toEqual(true);
  })
  it('Coordinate with dead cell returns false', () => {
    expect(isCellAlive(alive, 1, 1)).toEqual(false);
  })
  it('Coordinate outside known rows returns false', () => {
    expect(isCellAlive(alive, 1, 10)).toEqual(false);
  })
  it('Coordinate outside known cols returns false', () => {
    expect(isCellAlive(alive, 10, 1)).toEqual(false);
  })
})
