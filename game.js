const log = what => console.log(what)
const ui = {}
const game = {}

const createSprite = ({ x, y, width, height, color, active }) => {
  const sprite = {
    x,
    y,
    active,
    visible: true,
    draw (ctx) {
      ctx.save()
      ctx.fillStyle = color
      ctx.fillRect(sprite.x, sprite.y, width, height)
      ctx.restore()
    },
    update (delta) {
      sprite.x -= 20 * delta
    }
  }

  return sprite
}

const boot = () => {
  ui.canvas = document.querySelector('.game')
  ui.ctx = ui.canvas.getContext('2d')

  game.obstacles = []

  game.player = {}

  const obstacle = createSprite({
    x: 860,
    y: 32,
    width: 200,
    height: 96,
    color: 'blue',
    active: true
  })

  game.obstacles.push(obstacle)

  const update = (delta) => {
    // log('updating')

    game.obstacles.forEach(obstacle => {
      obstacle && obstacle.active && obstacle.update && obstacle.update(delta)
    })
  }

  const draw = () => {
    // log('drawing')
    ui.ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height)

    game.obstacles.forEach(obstacle => {
      obstacle && obstacle.visible && obstacle.draw && obstacle.draw(ui.ctx)
    })
  }

  const mainLoop = (delta) => {
    update(delta * 0.001)
    draw()
    window.requestAnimationFrame(mainLoop)
  }

  mainLoop(0)
}

document.addEventListener('DOMContentLoaded', boot, false)
