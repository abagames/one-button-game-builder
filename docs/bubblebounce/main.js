title = "BUBBLE BOUNCE";

description = `
[Hold] Turn
Collect Stars
Avoid Spikes
`;

characters = [
  // Bubble character
  `
 ll
l  l
l  l
 ll
`,
  // Star character
  `
  y
 y y
y   y
 y y
  y
`,
  // Spike character
  `
r r
 r
r r
`,
];

const G = {
  WIDTH: 100,
  HEIGHT: 150,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

// Game runtime variables
let player;
let stars;
let spikes;

function update() {
  if (!ticks) {
    player = { pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5), speed: 1, vSpeed: 1 };
    stars = [];
    spikes = [];
  }

  // Player movement
  player.pos.x += player.speed;
  player.pos.y += player.vSpeed;
  if (player.pos.y > G.HEIGHT || player.pos.y < 0) {
    player.vSpeed *= -1;
  }

  if (input.isJustPressed) {
    player.speed *= -1;
    play("select");
  }
  player.pos.x = wrap(player.pos.x, 0, G.WIDTH);

  char("a", player.pos);

  // Star generation and logic
  if (ticks % Math.floor(100 / difficulty) === 0) {
    stars.push({ pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)) });
  }

  remove(stars, (s) => {
    char("b", s.pos);
    if (char("b", s.pos).isColliding.char.a) {
      addScore(10, s.pos);
      play("coin");
      return true;
    }
  });

  // Spike generation and logic
  if (ticks % Math.floor(150 / difficulty) === 0) {
    const pos = vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT));
    if (pos.distanceTo(player.pos) > 32) {
      spikes.push({ pos });
    }
  }

  remove(spikes, (sp) => {
    char("c", sp.pos);
    if (char("c", sp.pos).isColliding.char.a) {
      end();
      play("explosion");
      return true;
    }
  });
}
