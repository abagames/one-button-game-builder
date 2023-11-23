title = "TIME TRAVEL RUN";
description = `
[Hold] Slow time
`;
characters = [
  `
 ll
 ll
llll
l  l
`,
  `
r r r
 rrr
rrrrr
 rrr
r r r
`,
  `
 yyy
y   y
y   y
y   y
 yyy
`,
];

const G = {
  WIDTH: 100,
  HEIGHT: 100,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

class Player {
  constructor() {
    this.pos = vec(G.WIDTH * 0.5, G.HEIGHT * 0.9);
    this.speed = 1; // プレイヤーの移動速度
  }

  update() {
    // プレイヤーを左右に動かす
    this.pos.x += this.speed;

    // 画面の端に達したら方向転換
    if (this.pos.x < 0 || this.pos.x > G.WIDTH) {
      this.speed *= -1;
    }

    char("a", this.pos);
  }
}

class Obstacle {
  constructor(x) {
    this.pos = vec(x, 0);
    this.baseSpeed = 1;
    this.speedIncreaseFactor = 0.0003;
    this.scoreAdded = false;
  }

  update() {
    const speed = this.baseSpeed + ticks * this.speedIncreaseFactor;
    this.pos.y += input.isPressed ? speed * 0.3 : speed;

    char("b", this.pos);
    return this.pos.y < G.HEIGHT;
  }
}

class Coin {
  constructor(x) {
    this.pos = vec(x, 0);
    this.baseSpeed = 1;
    this.speedIncreaseFactor = 0.0003;
  }

  update() {
    const speed = this.baseSpeed + ticks * this.speedIncreaseFactor;
    this.pos.y += input.isPressed ? speed * 0.3 : speed;

    char("c", this.pos);
    return this.pos.y < G.HEIGHT;
  }
}

let player;
let obstacles = [];
let coins = [];

function update() {
  if (!ticks) {
    player = new Player();
    obstacles = [];
    coins = [];
  }

  player.update();

  // 難易度(difficult)に応じて障害物の出現頻度と数を調整
  if (ticks % ceil(90 / difficulty) === 0) {
    const obstacleCount = floor(difficulty);
    for (let i = 0; i < obstacleCount; i++) {
      obstacles.push(new Obstacle(rnd(G.WIDTH)));
    }
  }

  obstacles = obstacles.filter((o) => {
    o.update();

    if (o.pos.y > player.pos.y && !o.scoreAdded) {
      addScore(1);
      o.scoreAdded = true;
    }
    // 衝突判定
    if (char("b", o.pos).isColliding.char.a) {
      end(); // ゲームオーバー
      play("explosion"); // 衝突音
    }

    return o.pos.y < G.HEIGHT;
  });

  if (ticks % ceil(60 / difficulty) === 0) {
    const coinCount = floor(difficulty);
    for (let i = 0; i < coinCount; i++) {
      coins.push(new Coin(rnd(G.WIDTH)));
    }
  }

  coins = coins.filter((c) => {
    c.update();

    // 衝突判定
    if (char("c", c.pos).isColliding.char.a) {
      addScore(10, c.pos);
      play("coin");
      return false;
    }

    return c.pos.y < G.HEIGHT;
  });
}
