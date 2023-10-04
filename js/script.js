const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const size = 30
const snake = [
  { x: 270, y: 270 },
  { x: 300, y: 270 },
]
let direction = 'down'



function drawSnake() {
  ctx.fillStyle = '#bbb'

  snake.forEach((position, index) => {

    if(index == snake.length - 1) {
      ctx.fillStyle = '#fff'
    } else if( index == snake.length - 2) {
      ctx.fillStyle = '#ddd'
    }
    ctx.fillRect(position.x, position.y, size, size)

  })
}

function moveSnake() {
  if(!direction) return

  const head = snake[snake.length - 1]
 
  if(direction == 'up') {
    snake.push({ x: head.x, y: head.y - size })
  }
  if(direction == 'right') {
    snake.push({ x: head.x + size, y: head.y })
  }
  if(direction == 'down') {
    snake.push({ x: head.x, y: head.y + size })
  }
  if(direction == 'left') {
    snake.push({ x: head.x - size, y: head.y })
  }

  snake.shift()
}

function gameLoop() {
  ctx.clearRect(0, 0, 600, 600)

  moveSnake()
  drawSnake()

  setTimeout(() => {
    gameLoop()
  }, 300)
}


gameLoop()



