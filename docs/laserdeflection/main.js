title = "Laser Deflection";

description = `
[Hold]
 Rotate Shield
`;

characters = [];

// Game options
options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
  theme: "dark",
};

// Shield properties
let shield;
const shieldDistanceFromCore = 10;
const shieldRotationSpeed = 0.2;

// Laser array
let lasers;

function update() {
  if (!ticks) {
    // Initialize the shield
    shield = { angle: 0 };

    // Initialize lasers array
    lasers = [];
  }

  color("cyan");
  box(50, 50, 5, 5);

  // Rotate the shield on button press
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    shield.angle += shieldRotationSpeed;
  }

  // Calculate the shield's position
  const shieldPos = vec(50, 50).addWithAngle(
    shield.angle,
    shieldDistanceFromCore
  );

  // Draw the shield
  color("blue");
  bar(shieldPos, 8, 4, shield.angle + PI / 2);

  // Spawn lasers based on difficulty
  if (ticks % floor(60 - difficulty) === 0) {
    lasers.push(createLaser());
  }

  // Update and draw lasers
  remove(lasers, (laser) => {
    laser.pos.add(laser.vel);

    // Draw laser
    color("red");
    const c = bar(laser.pos, 6, 3, laser.angle).isColliding.rect;
    // Check for collision with shield
    if (!laser.isReflected && c.blue) {
      deflectLaser(laser);
    }

    // Check if laser hits the core
    if (c.cyan) {
      endGame();
      return false;
    }

    // Remove laser if it goes off screen
    return isOffScreen(laser.pos);
  });
}

function createLaser() {
  const sa = rnd(PI * 2);
  const startPos = vec(50, 50).addWithAngle(sa, 70);
  const speed = (1 + rnd(sqrt(difficulty) - 1)) * 0.5;
  const angle = startPos.angleTo(50, 50) + rnds(0.2);
  const velocity = vec(speed).rotate(angle);
  play("laser");

  return { pos: startPos, vel: velocity, angle, isReflected: false };
}

function deflectLaser(laser) {
  const sn = shield.angle - PI / 2;
  const ra = sn - (laser.angle - sn);
  const ls = laser.vel.length;
  laser.angle = ra;
  laser.vel.set(ls).rotate(ra);
  laser.isReflected = true;
  play("hit");
  addScore(1);
}

function endGame() {
  play("explosion");
  end();
}

function isOffScreen(pos) {
  return !pos.isInRect(-50, -50, 200, 200);
}
