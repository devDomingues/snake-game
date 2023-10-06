//Elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const size = 30
const speed = 100
const snake = [
  { x: 270, y: 270 },
  { x: 300, y: 270 },
]
const food = {
  x : randomPosition(),
  y : randomPosition(),
  color : randomColor() 
}

let direction = ''
let loopId = ''

const audio = document.querySelector('.audio')


//Events
document.addEventListener('keydown', ({key}) => {
  if(key == 'ArrowUp'  && direction != 'down'){
    direction = 'up'
  }
  if(key == 'ArrowRight' && direction != 'left') {
    direction = 'right'
  }
  if(key == 'ArrowDown' && direction != 'up') {
    direction = 'down'
  }
  if(key == 'ArrowLeft' && direction != 'right') {
    direction = 'left'
  }
})


//Functions
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}
function randomPosition() {
  const number = randomNumber( 0, canvas.width - size)
  return Math.round(number / 30) * 30
}
function randomColor() {
  const red = randomNumber(0, 255)
  const green = randomNumber(0, 255)
  const blue = randomNumber(0, 255)

  return `rgb( ${red}, ${green}, ${blue})`
}

function drawFood() {
  const { x, y, color} = food

  ctx.shadowColor = color
  ctx.shadowBlur = 6
  ctx.fillStyle = color
  ctx.fillRect( x, y, size, size)
  ctx.shadowBlur = 0
}

function drawSnake() {
  ctx.fillStyle = '#ddd'

  snake.forEach((position, index) => {

    if(index == snake.length - 1) {
      ctx.fillStyle = '#fff'
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

function checkEat() {
  const head = snake[snake.length - 1]

  if(head.x == food.x && head.y == food.y) {
    audio.play()
    snake.push(head)

    let x = randomPosition()
    let y = randomPosition()

    while(snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition()
      y = randomPosition()
    }

    food.x = x
    food.y = y
    food.color = randomColor()
  }
}

function checkCollision() {
  const head = snake[snake.length - 1]
  const body = snake.length - 2

  const walls = canvas.width - size
  const wallsCollision = head.x < 0 || head.x > walls || head.y < 0 || head.y > walls
  
  const selfCollision = snake.find((position, index) => {
    return index < body && position.x == head.x && position.y == head.y
  })

  if(wallsCollision || selfCollision) {
    alert('voce bateu na parede!')
  }
}

function drawGrid() {
  ctx.lineWidth = 1
  ctx.strokeStyle = '#191919'

  for (let i = size; i < canvas.width; i += size) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, canvas.width)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(canvas.width, i)
    ctx.stroke()
  }
}



function gameLoop() {
  clearInterval(loopId)

  ctx.clearRect(0, 0, canvas.width, canvas.width)
  drawGrid()
  drawFood()
  moveSnake()
  drawSnake()
  checkEat()
  checkCollision()
  
  loopId = setTimeout(() => {
    gameLoop()
  }, speed)
}

gameLoop()




