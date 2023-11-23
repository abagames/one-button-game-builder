title = "TOWER CLIMB";
description = `
[Hold]
 Stretch Tower
`;

characters = [
  `
  ll
  ll
llllll
  ll
 llll
ll  ll
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

/** @type {Vector} */
let player;
/** @type {number} */
let towerHeight;
/** @type {{pos: Vector, vel: Vector}[]} */
let obstacles;

function update() {
  if (!ticks) {
    player = vec(50, 95);
    towerHeight = 10;
    obstacles = [];
  }

  color("red");
  rect(0, 0, 100, 2);
  color("black");
  const towerTop = player.y - towerHeight;
  line(player.x, 100, player.x, towerTop, 4);

  if (input.isPressed) {
    towerHeight += difficulty;
    play("laser"); // 塔の伸びる音
  } else {
    towerHeight += (10 - towerHeight) * 0.05;
  }

  if (player.y - towerHeight < 0) {
    play("explosion");
    end();
  }

  // 障害物の追加
  if (ticks % floor(50 / difficulty) === 0) {
    const side = rnd() < 0.5 ? 0 : 100;
    obstacles.push({
      pos: vec(side, rnd(0, 100)),
      vel: vec(side === 0 ? 1 : -1, 0).mul(rnd(0.3, difficulty * 0.3)),
    });
    play("hit"); // 障害物の出現音
  }

  // 障害物の更新
  remove(obstacles, (o) => {
    o.pos.add(o.vel);
    color("red");
    const collision = box(o.pos, 5).isColliding.rect.black;

    if (collision) {
      // 障害物が塔に当たったときの処理
      play("powerUp"); // 壊れる音
      particle(o.pos); // 粒子効果
      addScore(ceil(100 / sqrt(abs(o.pos.y - towerTop) + 1)), o.pos.x, o.pos.y); // スコア加算
      return true; // 障害物を削除
    }
    return o.pos.x < 0 || o.pos.x > 100;
  });

  color("blue");
  if (char("a", player.x, towerTop - 4).isColliding.rect.red) {
    play("explosion");
    end();
  }
}
