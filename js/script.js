//Elements
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const score = document.querySelector('.score')
const finalScore = document.querySelector('.final-score > span')
const menuInitial = document.querySelector('.menu.initial')
const menuGameOver = document.querySelector('.menu.game-over')
const size = 30
const initialPosition = { x: 270, y: 270 }
let snake = [initialPosition]
const food = {
  x : randomPosition(),
  y : randomPosition(),
  color : randomColor() 
}
let audioLoop = 0
let direction = ''
let loopId = ''

const audio =  new Audio('../assets/collect-retro.mp3')
const audioGameOver = new Audio('../assets/game-over-arcade.mp3')

let sound = document.querySelector('.sound')
const audioOn = document.querySelector('.audio.on')
const audioOff = document.querySelector('.audio.muted')

let level = 1
let levels = ['facil', 'normal', 'dificil']

let speeds = [125, 100, 75]
let speed = speeds[level]

const left = document.querySelector('.left')
const right = document.querySelector('.right')
const difficulty = document.querySelector('.difficulty')

//Events 

left.addEventListener('click', updateLeft)
right.addEventListener('click', updateRigth)

sound.addEventListener('click', updateSound)

document.querySelector('.btn.start').addEventListener('click', startGame)
document.querySelector('.btn.restart').addEventListener('click', restartGame)
document.querySelector('.btn.lobby').addEventListener('click', returnLobby)
canvas.style.filter = 'blur(5px)'
updateLevel()


//Functions
function updateLeft() {
  level = (level - 1 + levels.length) % levels.length
  updateLevel()
}
function updateRigth() {
  level = (level + 1) % levels.length
  updateLevel()
}
function updateSound() {
  if(audioOn.classList.contains('off')) {
    audioOn.classList.remove('off')
    audioOff.classList.add('off')
    return
  }
  if(audioOff.classList.contains('off')) {
    audioOff.classList.remove('off')
    audioOn.classList.add('off')
    return
  }
}
function keydown({key}) {
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
}

function updateLevel() {
  difficulty.innerText = levels[level]
}

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

function ActuallScore() {
  score.innerText = parseInt(score.innerText) + 10
}

function checkEat() {
  const head = snake[snake.length - 1]
  
  if(head.x == food.x && head.y == food.y) {
    audio.play()
    snake.push(head)
    ActuallScore()
    
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
    gameOver()
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

function startGame() {
  if(audioOn.classList.contains('off')) {
    audio.muted = true
    audioGameOver.muted = true
  } else {
    audio.muted = false
    audioGameOver.muted = false
  }
  
  menuInitial.style.display = 'none'
  score.style.display = 'flex'
  canvas.style.filter = 'none'
  snake = [initialPosition]
  audioLoop = 0
  speed = speeds[level]

  
  document.addEventListener('keydown', keydown)

  gameLoop()
}

function gameOver() {
  direction = undefined
  document.removeEventListener('keydown', keydown)

  while (audioLoop <= 0) {
    audioGameOver.play()
    audioLoop++
  }

  score.style.display = 'none'
  menuGameOver.style.display = 'flex'
  finalScore.innerText = score.innerText
  canvas.style.filter = 'blur(5px)'
}

function restartGame() {
  score.innerText = '00'
  score.style.display = 'flex'
  menuGameOver.style.display = 'none'
  canvas.style.filter = 'none'
  snake = [initialPosition]
  audioLoop = 0
  
  document.addEventListener('keydown', keydown)
}

function returnLobby() {
  menuGameOver.style.display = 'none'
  menuInitial.style.display = 'flex'
  canvas.style.filter = 'blur(5px)'
  score.innerText = '00'
  snake = [initialPosition]
  audioLoop = 0
  
}

