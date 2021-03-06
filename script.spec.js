const {
  checkNeighboursX,
  countNeighbours,
  isCellAlive,
  shouldCellLive,
  buildSetToCheck,
  tick,
  generateRandomSeed,
} = require('./script')

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
  it('If at start of array and nothing on other end', () => {
    expect(checkNeighboursX([0,1,2], 0, false, 3)).toEqual(2)
  })
  it('If at end of array and nothing on other end', () => {
    expect(checkNeighboursX([1,2,3], 3, false, 3)).toEqual(2)
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

describe('countNeighbours counts all surrounding alive cells', () => {
  const alive = {
    0: [0, 1, 2],
    1: [0, 1, 2],
    2: [0, 1, 2],
  }
  it('Completely surrounded cell returns 8', () => {
    expect(countNeighbours(alive, 1, 1, 2, 2)).toEqual(8)
  })
  it('In an only alive 3x3 grid always return 8', () => {
    expect(countNeighbours(alive, 2, 2, 2, 2)).toEqual(8)
    expect(countNeighbours(alive, 0, 2, 2, 2)).toEqual(8)
    expect(countNeighbours(alive, 0, 1, 2, 2)).toEqual(8)
  })
  it('A cell with no neighbours returns 0', () => {
    expect(countNeighbours(alive, 5, 5, 10, 10))
  })

  const lessAlive = {
    0: [0, 1, 2],
    6: [0, 1, 2],
  }
  it('Checks row on opposite side when at the edge', () => {
    expect(countNeighbours(lessAlive, 1, 0, 6, 6)).toEqual(5)
  })
  it('Checks row on opposite side when at the edge', () => {
    expect(countNeighbours(lessAlive, 1, 6, 6, 6)).toEqual(5)
  })
})

describe('shouldCellLive decides if cells should live', () => {
  const alive = {
    0: [0, 1, 2],
    1: [0, 1, 2],
    2: [0, 1, 2],
    3: [0],
  }

  it('Three live cells and alive returns TRUE', () => {
    expect(shouldCellLive(alive, 0, 0, 10, 10)).toEqual(true)
  })
  it('Two cells and alive returns TRUE', () => {
    expect(shouldCellLive(alive, 0, 3, 10, 10)).toEqual(true)
  })
  it('Three cells and dead returns TRUE', () => {
    expect(shouldCellLive(alive, 3, 0, 10, 10)).toEqual(false)
  })
  it('Two cells and dead returns FALSE', () => {
    expect(shouldCellLive(alive, 3, 0, 10, 10)).toEqual(false)
  })
  it('Eight cells and alive returns FALSE', () => {
    expect(shouldCellLive(alive, 1, 1, 10, 10)).toEqual(false)
  })
  it('No cells returns FALSE', () => {
    expect(shouldCellLive(alive, 8, 8, 10, 10)).toEqual(false)
  })
  it('Four cells returns false', () => {
    expect(shouldCellLive(alive, 0, 0, 10, 3)).toEqual(false)
  })
})

describe('buildSetToCheck builds a non-repeating collection of X/Y strings', () => {
  const sort = (a, b) => Number(a.replace(/\s/g, '')) - Number(b.replace(/\s/g, ''))
  const smallAlive = {
    0: [0, 1],
    1: [0, 1],
  }

  it('All alive cells returns every combo of X/Y strings', () => {
    const result = [
      '0 0', '1 0', '0 1', '1 1',
    ].sort(sort)
    expect([...buildSetToCheck(smallAlive, 1, 1)].sort(sort)).toEqual(result)
  })

  it('Alive cells in the top left corner of large box check other side', () => {
    const resultLargerBounds = [
      '0 0', '1 0', '2 0', '5 0',
      '0 1', '1 1', '2 1', '5 1',
      '0 2', '1 2', '2 2', '5 2',
      '0 5', '1 5', '2 5', '5 5',
    ].sort(sort)
    expect([...buildSetToCheck(smallAlive, 5, 5)].sort(sort)).toEqual(resultLargerBounds)
  })


  it('Should return every X/Y with an alive cell in the middle of a 3x3', () => {
    const mediumAlive = {
      0: [0, 1, 2],
      1: [0, 1, 2],
      2: [0, 1, 2],
    }
    const result = [
      '0 0', '1 0', '2 0',
      '0 1', '1 1', '2 1',
      '0 2', '1 2', '2 2',
    ].sort(sort)
    expect([...buildSetToCheck(mediumAlive, 2, 2)].sort(sort)).toEqual(result)
  })

})

describe('tick decides what cells should be alive in the next round', () => {
  const alive = {
    0: [0, 1, 2],
    1: [0, 1, 2],
    2: [0, 1, 2],
  }
  const result = {}

  it('Should not return the same array as was passed in', () => {
    expect(tick(alive, 2, 2)).not.toBe(alive)
  })

  it('Should return a dead box when all alive in a 3x3', () => {
    expect(tick(alive, 2, 2)).toEqual(result)
  })

  const alive2x2 = {
    1: [1, 2],
    2: [1, 2],
  }
  it('Should return a square alive when there\'s a square alive not near an edge', () => {
    expect(tick(alive2x2, 3, 3)).toEqual(alive2x2)
  })
})

describe('generateRandomSeed returns a collection of rows and cols', () => {
  it('Should give all rows and cols when chance is set to 1', () => {
    const result = {
      0: [0, 1, 2],
      1: [0, 1, 2],
      2: [0, 1, 2],
    }
    expect(generateRandomSeed(2, 2, 1)).toEqual(result)
  })

  it('Should return an empty object when chance is set to 0', () => {
    const result = {}
    expect(generateRandomSeed(2, 2, 0)).toEqual(result)
  })
})
