title = "LAST STAND";

description = `
[Tap]  Turn
[Hold] Defense
`;

characters = [
  `
  l
bblbb
bblbb
 bbb
`,
  `
rrlrr
rrlrr
  l
  l
`,
  `
bb
bb
bb

bb
`,
  `
r

r
r
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7,
};

/** @type {{x: number, vx: number, mode: string}} */
let player;
let switchTimer;
let fireCooldown = 0;

/** @type {{x: number, y: number, vy: number, type: string, cooldown: number}[]} */
let enemies;
/** @type {{x: number, y: number, vx: number, vy: number, fromPlayer: boolean}[]} */
let bullets;
let enemySpawnTimer;
const bulletSpeed = 1.2;

function update() {
  if (!ticks) {
    player = { x: 50, vx: 1, mode: "attack" };
    enemies = [];
    bullets = [];
    enemySpawnTimer = 0;
    fireCooldown = 0;
    score = 0;
  }

  // Difficulty scaling
  const enemySpawnRate = 60 / difficulty;
  enemySpawnTimer--;

  if (enemySpawnTimer <= 0) {
    enemies.push({
      x: rnd(10, 90),
      y: 0,
      vy: rnd(0.2, 0.3) * difficulty, // Increase speed with difficulty
      type: "normal",
      cooldown: rnd(60 / difficulty), // Decrease cooldown with difficulty
    });
    enemySpawnTimer = enemySpawnRate;
  }

  // Player movement and mode switching
  player.x += player.vx;
  if ((player.vx > 0 && player.x > 90) || (player.vx < 0 && player.x < 10)) {
    player.vx *= -1;
  } else if (input.isJustPressed) {
    player.vx *= -1;
  }
  player.mode = input.isPressed ? "defense" : "attack";

  // Draw player
  color("black");
  char("a", player.x, 90);
  if (player.mode === "defense") {
    box(player.x + 1, 87, 11, 3);
  }

  // Player firing logic
  fireCooldown--;
  if (fireCooldown <= 0 && player.mode === "attack") {
    play("laser");
    bullets.push({
      x: player.x,
      y: 80,
      vx: 0,
      vy: -bulletSpeed * 1.2,
      fromPlayer: true,
    });
    fireCooldown = 16;
  }

  // Update bullets
  remove(bullets, (b) => {
    b.y += b.vy;
    const c = char(b.fromPlayer ? "c" : "d", b.x, b.y).isColliding;
    if (!b.fromPlayer) {
      if (c.rect.black) {
        play("hit");
        addScore(10, b.x, b.y);
        return true;
      }
      if (c.char.a) {
        play("explosion");
        end();
        return true;
      }
    }
    return b.y < 0 || b.y > 100;
  });

  // Update enemies
  color("red");
  remove(enemies, (e) => {
    e.y += e.vy;
    e.cooldown--;
    if (e.cooldown <= 0) {
      bullets.push({
        x: e.x,
        y: e.y,
        vx: 0,
        vy: bulletSpeed,
        fromPlayer: false,
      });
      e.cooldown = 60 / difficulty;
    }
    const c = char("b", e.x, e.y).isColliding.char;
    if (c.c) {
      play("powerUp");
      particle(e.x, e.y);
      addScore(ceil(e.y), e.x, e.y);
      return true;
    } else if (c.a) {
      play("explosion");
      end();
    }
    return e.y > 100;
  });
}
