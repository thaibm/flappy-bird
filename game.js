// SELECT CANVAS
const cvs = document.getElementById('flappy-bird');
const ctx = cvs.getContext('2d');
// GAME VARS AND CONST
let frames = 0;
const DEGREE = Math.PI / 180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = './img/sprite.png';

// GAME STATE
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};

// CONTROL THE GAME
cvs.addEventListener('click', function (event) {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      let rect = cvs.getBoundingClientRect();
      let clickX = event.clientX - rect.left;
      let clickY = event.clientY - rect.top;
      if (
        clickX >= startBtn.x &&
        clickX <= startBtn.x + startBtn.w &&
        clickY >= startBtn.y &&
        clickY <= startBtn.y + startBtn.h
      ) {
        state.current = state.getReady;
        bird.reset();
        score.reset();
        pipes.reset();
      }
      break;
  }
});
// START BUTTON
const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29,
};

// BACKGROUND
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};
// FOREGROUND
const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dX: 2,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },

  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dX) % (this.w / 2);
    }
  },
};
// BIRD
const bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 },
  ],
  x: 50,
  y: 150,
  w: 34,
  h: 26,

  frame: 0,

  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  radius: 12,

  draw: function () {
    let bird = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );

    ctx.restore();
  },

  flap: function () {
    this.speed = -this.jump;
  },

  update: function () {
    // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
    this.period = state.current === state.getReady ? 10 : 5;
    // INCREASE THE FRAME BY 1, EACH PERIOD
    this.frame += frames % this.period == 0 ? 1 : 0;
    // FRAME GOES FROM 0 TO 4, THEN AGAIN TO 0
    this.frame = this.frame % this.animation.length;

    if (state.current === state.getReady) {
      // RESET BIRD's POSITION
      this.y = 150;
      this.rotation = 0 * DEGREE;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;
        if (state.current == state.game) {
          state.current = state.over;
        }
      }

      // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
      if (this.speed >= this.jump) {
        this.rotation = 45 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },

  reset: function () {
    this.speed = 0;
  },
};

// GET READY MESSAGE
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,

  draw: function () {
    if (state.current === state.getReady) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

// GAME OVER MESSAGE
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,

  draw: function () {
    if (state.current === state.over) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

// PIPES
const pipes = {
  positions: [],
  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },

  w: 53,
  h: 400,
  gap: 85,
  maxYPos: -150,
  dX: 2,

  draw: function () {
    for (const p of this.positions) {
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;

      // TOP PIPE
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );
      // BOTTOM PIPE
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },

  update: function () {
    if (state.current != state.game) return;

    if (frames % 100 == 0) {
      this.positions.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }

    for (const p of this.positions) {
      let bottomPipeYPos = p.y + this.h + this.gap;
      // COLLISION DETECTION
      // TOP PIPE
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        state.current = state.over;
      }

      //BOTTOM PIPE
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeYPos &&
        bird.y - bird.radius < bottomPipeYPos + this.h
      ) {
        state.current = state.over;
      }

      // MOVE THE PIPE TO THE LEFT
      p.x -= this.dX;

      if (p.x + this.w <= 0) {
        // IF THE PIPE GO BEYOND CANVAS, WE DELETE THEM FROM ARRAY
        this.positions.shift();
        score.value += 1;

        score.best = Math.max(score.value, score.best);
        localStorage.setItem('bestScore', score.best);
      }
    }
  },

  reset: function () {
    this.positions = [];
  },
};

// SCORE
const score = {
  best: Number(localStorage.getItem('bestScore')) || 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';

    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = '35px Teko';
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (state.current == state.over) {
      ctx.font = '25px Teko';
      // SCORE VALUE
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      // BEST SCORE
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
  reset: function () {
    this.value = 0;
  },
};

/**
 * MAIN FUNCTION
 */

// DRAW
function draw() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}
// UPDATE
function update() {
  bird.update();
  fg.update();
  pipes.update();
}
// LOOP
function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();
