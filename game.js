const log = what => console.log(what)
const ui = {}
const game = {
  input: {
    buttonPressed: false
  }
}

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

const stateManager = {
  state: 'title',
  states: {},
  changeState (state) {
    stateManager.state = state
    const impl = stateManager.states[state]
    impl && impl.onEnter && impl.onEnter()
  }
}

window.game = game
window.stateManager = stateManager
const titleState = {
  sprites: [],
  onEnter () {

  },
  update (delta) {
    if (game.input.buttonPressed) {
      game.input.buttonPressed = false
      stateManager.changeState('play')
    }
  },

  draw (ctx) {
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height)
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '32px monospace'
    ctx.fillText('TITLE', ui.canvas.width * 0.5, ui.canvas.height * 0.25)
  }
}

const playState = {
  sprites: [],
  onEnter () {
    const sprite = createSprite({ x: 0, y: 0, width: 16, height: 16, color: 'orange', active: true })
    sprite.xSpeed = 4
    sprite.ySpeed = 4
    sprite.update = delta => {
      sprite.x += sprite.xSpeed * delta
      sprite.y += sprite.ySpeed * delta

      if (sprite.x < 0 || sprite.x > ui.canvas.width) {
        sprite.xSpeed = -sprite.xSpeed
        sprite.x += sprite.xSpeed * delta
      }

      if (sprite.y < 0 || sprite.y > ui.canvas.height) {
        sprite.ySpeed = -sprite.ySpeed
        sprite.y += sprite.ySpeed * delta
      }
    }

    playState.sprites.push(sprite)
  },
  update (delta) {
    if (game.input.buttonPressed) {
      game.input.buttonPressed = false
      stateManager.changeState('menu')
    }

    playState.sprites.forEach(sprite => {
      sprite.update && sprite.update(delta)
    })
  },

  draw (ctx) {
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height)
    ctx.fillStyle = 'yellow'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '32px monospace'
    ctx.fillText('PLAY', ui.canvas.width * 0.5, ui.canvas.height * 0.25)

    playState.sprites.forEach(sprite => {
      sprite.draw && sprite.draw(ctx)
    })
  }
}


const menuState = {
  update (delta) {
    if (game.input.buttonPressed) {
      game.input.buttonPressed = false
      stateManager.changeState('title')
    }
  },

  draw (ctx) {
    ctx.fillStyle = 'purple'
    ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height)
    ctx.fillStyle = 'pink'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '32px monospace'
    ctx.fillText('MENU', ui.canvas.width * 0.5, ui.canvas.height * 0.25)
  }
}


stateManager.states['play'] = playState
stateManager.states['title'] = titleState
stateManager.states['menu'] = menuState

const boot = () => {
  ui.canvas = document.querySelector('.game')
  ui.ctx = ui.canvas.getContext('2d')

  game.obstacles = []

  game.player = {}

  const createObstacle = () => {
    const obstacle = createSprite({
      x: 860,
      y: 32,
      width: 200,
      height: 96,
      color: 'blue',
      active: true
    })

    obstacle.update = (delta) => {
      obstacle.y += 5 * delta
    }

    if (game.obstacles.length < 10) {
      game.obstacles.push(obstacle)
    }
  }

  setInterval(createObstacle, 700)

  const update = (delta) => {
    // log('updating')

    // game.obstacles.forEach(obstacle => {
    //   obstacle && obstacle.active && obstacle.update && obstacle.update(delta)
    // })

    const impl = stateManager.states[stateManager.state]
    impl && impl.update && impl.update(delta)

  }

  const draw = () => {
    // log('drawing')
    ui.ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height)

    // game.obstacles.forEach(obstacle => {
    //   obstacle && obstacle.visible && obstacle.draw && obstacle.draw(ui.ctx)
    // })

    const impl = stateManager.states[stateManager.state]
    impl && impl.draw && impl.draw(ui.ctx)
  }

  ui.canvas.addEventListener('click', () => {
    game.input.buttonPressed = true
  }, false)

  const mainLoop = (delta) => {
    update(delta * 0.001)
    draw()
    window.requestAnimationFrame(mainLoop)
  }

  mainLoop(0)
}

document.addEventListener('DOMContentLoaded', boot, false)
