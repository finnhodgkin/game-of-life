const c = document.getElementById('myCanvas');
const ctx = c.getContext('2d');

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

let alive = tick(generateRandomSeed(c.height, c.width, .1), c.width, c.height)
drawLife(alive)

setInterval(() => {
  drawLife(alive)
  alive = tick(alive, c.width, c.height)
}, 1000);
