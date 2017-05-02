const c = document.getElementById('myCanvas');
const ctx = c.getContext('2d');

const checkNeighboursX = (row, x, self) => {
  let neighbours = 0
  // If at the edge then check the other side
  if (x-1 >= 0) {
    neighbours += row.indexOf(x - 1) !== -1 ? 1 : 0
  } else {
    neighbours += row.indexOf(c.width-1) !== -1 ? 1 : 0
  }
  if (row.indexOf(x) !== -1 && !self) {
    neighbours++
  }
  // If at the edge then check the other side
  if (x+1 <= c.width-1) {
    neighbours += row.indexOf(x + 1) !== -1 ? 1 : 0
  } else {
    neighbours += row.indexOf(0) !== -1 ? 1 : 0
  }
  return neighbours
}

const countNeighbours = (aliveList, x, y) => {
  let neighbours = 0
  if (y > 0 && aliveList[y - 1]) {
    neighbours += checkNeighboursX(aliveList[y - 1], x)
  } else if (y <= 0 && aliveList[c.height-1]){
    neighbours += checkNeighboursX(aliveList[c.height-1], x)
  }
  if (aliveList[y]) {
    neighbours += checkNeighboursX(aliveList[y], x, true)
  }
  if (y < (c.height-1) && aliveList[y + 1]) {
    neighbours += checkNeighboursX(aliveList[y + 1], x)
  } else if (y >= c.height-1 && aliveList[0]) {
    neighbours += checkNeighboursX(aliveList[0], x)
  }
  return neighbours
}

const isCellAlive = (aliveList, x, y) => {
  return aliveList[y] ?
    aliveList[y].indexOf(x) !== -1 :
    false
}

const shouldCellLive = (...args) => {
  const count = countNeighbours(...args)
  const alive = isCellAlive(...args)

  return count === 3 ? true :
    alive && count === 2 ? true :
    false
}

const tick = (aliveObj) => {
  const arrayToCheck = []
  Object.keys(aliveObj).forEach((y) => {
    aliveObj[y].forEach(x => {
      xLow = (x-1 >= 0) ? x - 1 : c.width - 1
      xHigh = (x+1 <= c.width-1) ? x + 1 : 0
      yLow = (Number(y)-1 >= 0) ? Number(y)-1 : c.height-1
      yHigh = (Number(y)+1 <= c.height-1) ? Number(y)+1 : 0

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

    if (shouldCellLive(aliveObj, Number(x), Number(y))) {
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

const drawLife = (lifeObj) => {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, c.width, c.height)
  // Draw each life as a pixel
  Object.keys(lifeObj).forEach((y) => {
    lifeObj[y].forEach(x => {
      ctx.fillStyle = '#fff'
      ctx.fillRect(Number(x), Number(y), 1, 1)
    })
  })
}

const seed = {}
// LINE GEN

// for (let i = 0; i < c.height; i++) {
//   let row = []
//   let no = false;
//   for (let j = 0; j < c.width; j++) {
//     if (i === 250 || i === 251) {
//       row.push(j)
//       no = true
//     }
//   }
//   if (no) {
//     console.log('happening');
//     seed[i] = row
//   }
// }

//RANDOM GEN
const chance = .05
for (let i = 0; i < c.height; i++) {
  const row = []
  for (let j = 0; j < c.width; j++) {
    if (Math.random() <= chance) {
      row.push(j)
    }
  }
  if (row[0]) {
    seed[i] = row
  }
}

drawLife(seed)
let alive = tick(seed)

setInterval(() => {
  drawLife(alive)
  alive = tick(alive)
}, 1);
