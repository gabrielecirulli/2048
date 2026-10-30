// The Grid: a neon floor receding to the horizon, with light cycles racing
// across it, drawn on a full-screen canvas behind the game
function GridBackdrop(canvas) {
  this.canvas   = canvas;
  this.context  = canvas.getContext("2d");
  this.cycles   = [];
  this.motes    = [];
  this.cameraZ  = 0;
  this.lastTime = null;
  this.still    = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  this.resize();
  window.addEventListener("resize", this.resize.bind(this));

  GridBackdrop.CYCLE_COLORS.forEach(function (color) {
    this.cycles.push(this.spawnCycle(color));
  }, this);

  for (var i = 0; i < 40; i++) {
    this.motes.push(this.spawnMote(true));
  }

  if (this.still) {
    // Let the cycles lay down some trail, then render a single frame
    for (var step = 0; step < 90; step++) {
      this.update(1 / 30);
    }
    this.draw();
  } else {
    this.frame = this.frame.bind(this);
    window.requestAnimationFrame(this.frame);
  }
}

// Distances are in world units; the camera hovers over the floor at y = 0
GridBackdrop.CELL          = 2;
GridBackdrop.CAMERA_HEIGHT = 1.4;
GridBackdrop.CAMERA_SPEED  = 2.5; // Units per second
GridBackdrop.NEAR          = 0.5;
GridBackdrop.FAR           = 90;
GridBackdrop.WALL_HEIGHT   = 0.55;
GridBackdrop.TRAIL_LENGTH  = 34;

// Light cycles stay inside this arena, measured from the camera
GridBackdrop.ROAM_X    = 18;
GridBackdrop.ROAM_NEAR = 6;
GridBackdrop.ROAM_FAR  = 46;

GridBackdrop.CYCLE_COLORS = [
  "111, 240, 255", "111, 240, 255", "255, 154, 46", "255, 154, 46"
];

GridBackdrop.HEADINGS = [
  { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }
];

GridBackdrop.prototype.resize = function () {
  var ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  this.width   = window.innerWidth;
  this.height  = window.innerHeight;
  this.horizon = Math.round(this.height * 0.42);
  this.focal   = Math.max(this.width, this.height * 1.2) * 0.6;

  this.canvas.width  = Math.round(this.width * ratio);
  this.canvas.height = Math.round(this.height * ratio);
  this.context.setTransform(ratio, 0, 0, ratio, 0, 0);

  this.ridges  = [this.buildRidge(11, 0.11, 0.45),
                  this.buildRidge(23, 0.06, 1)];
  this.skyline = this.buildSkyline(5);

  if (this.still && this.cycles.length) this.draw();
};

// Seeded noise so the scenery doesn't reshuffle on every resize
GridBackdrop.prototype.random = function (seed) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

GridBackdrop.prototype.buildRidge = function (seed, height, brightness) {
  var random = this.random(seed);
  var points = [];
  var peak   = this.height * height;

  for (var x = -20; x <= this.width + 60; x += 20 + random() * 40) {
    // Mountains rise toward the edges of the screen, framing the board
    var edge = Math.abs(x / this.width - 0.5) * 2;
    var lift = peak * (0.25 + 0.75 * edge) * (0.35 + random() * 0.65);

    points.push({ x: x, y: this.horizon - lift });
  }

  return { points: points, brightness: brightness };
};

// A distant cluster of towers, like Tron City on the horizon
GridBackdrop.prototype.buildSkyline = function (seed) {
  var random = this.random(seed);
  var center = this.width * 0.17;
  var spread = this.width * 0.08;
  var towers = [{ x: center, width: 7, height: this.height * 0.13 }];

  for (var i = 0; i < 18; i++) {
    var offset  = (random() * 2 - 1) * spread;
    var falloff = 1 - Math.abs(offset) / spread;

    towers.push({
      x:      center + offset,
      width:  4 + random() * 10,
      height: this.height * (0.015 + falloff * random() * 0.08)
    });
  }

  return towers;
};

GridBackdrop.prototype.frame = function (time) {
  var elapsed = this.lastTime === null ? 0 : (time - this.lastTime) / 1000;

  this.lastTime = time;
  this.update(Math.min(elapsed, 0.05));
  this.draw();

  window.requestAnimationFrame(this.frame);
};

GridBackdrop.prototype.update = function (elapsed) {
  this.cameraZ += GridBackdrop.CAMERA_SPEED * elapsed;

  this.cycles.forEach(function (cycle) {
    this.moveCycle(cycle, elapsed);
  }, this);

  this.motes.forEach(function (mote, index) {
    if (mote.z - this.cameraZ < GridBackdrop.NEAR) {
      this.motes[index] = this.spawnMote(false);
    }
  }, this);
};

GridBackdrop.prototype.spawnCycle = function (color) {
  var cell    = GridBackdrop.CELL;
  var x       = Math.round((Math.random() - 0.5) * 14) * cell;
  var z       = Math.round((this.cameraZ + 12 + Math.random() * 28) / cell);
  var heading = GridBackdrop.HEADINGS[Math.floor(Math.random() * 4)];

  return {
    color:   color,
    x:       x,
    z:       z * cell,
    heading: heading,
    speed:   9 + Math.random() * 5,
    trail:   [{ x: x, z: z * cell }]
  };
};

GridBackdrop.prototype.spawnMote = function (anywhere) {
  var ahead = anywhere ? 2 + Math.random() * 50 : 45 + Math.random() * 10;

  return {
    x: (Math.random() - 0.5) * 40,
    y: 0.3 + Math.random() * 5,
    z: this.cameraZ + ahead
  };
};

// Cycles ride along grid lines, deciding whether to turn at each crossing
GridBackdrop.prototype.moveCycle = function (cycle, elapsed) {
  var cell     = GridBackdrop.CELL;
  var distance = cycle.speed * elapsed;

  while (distance > 0) {
    var axis      = cycle.heading.x ? "x" : "z";
    var direction = cycle.heading[axis];
    var position  = cycle[axis];
    var crossing  = direction > 0 ? (Math.floor(position / cell) + 1) * cell :
                                    (Math.ceil(position / cell) - 1) * cell;
    var step      = Math.abs(crossing - position);

    if (step > distance) {
      cycle[axis] = position + direction * distance;
      break;
    }

    cycle[axis] = crossing;
    distance   -= step;
    this.steer(cycle);
  }

  this.trimTrail(cycle);
};

// Turn 90 degrees now and then, and always before leaving the arena
GridBackdrop.prototype.steer = function (cycle) {
  var heading = cycle.heading;
  var look    = GridBackdrop.CELL * 3;
  var options = [
    heading,
    { x: -heading.z, z: heading.x },
    { x: heading.z, z: -heading.x }
  ];
  var open = options.filter(function (option) {
    return this.inArena(cycle.x + option.x * look, cycle.z + option.z * look);
  }, this);
  var choice;

  if (!open.length) {
    choice = this.towardCenter(cycle, options);
  } else if (open[0] === heading && Math.random() < 0.9) {
    choice = heading;
  } else {
    choice = open[Math.floor(Math.random() * open.length)];
  }

  if (choice !== heading) {
    cycle.heading = choice;
    cycle.trail.push({ x: cycle.x, z: cycle.z });
  }
};

GridBackdrop.prototype.inArena = function (x, z) {
  var depth = z - this.cameraZ;

  return Math.abs(x) <= GridBackdrop.ROAM_X &&
         depth >= GridBackdrop.ROAM_NEAR && depth <= GridBackdrop.ROAM_FAR;
};

GridBackdrop.prototype.towardCenter = function (cycle, options) {
  var middle = (GridBackdrop.ROAM_NEAR + GridBackdrop.ROAM_FAR) / 2;
  var target = this.cameraZ + middle;
  var best   = options[0];
  var bestDistance = Infinity;

  options.forEach(function (option) {
    var distance = Math.abs(cycle.x + option.x) +
                   Math.abs(cycle.z + option.z - target);

    if (distance < bestDistance) {
      best         = option;
      bestDistance = distance;
    }
  });

  return best;
};

// Cut the oldest end of the trail so it never exceeds its maximum length
GridBackdrop.prototype.trimTrail = function (cycle) {
  var points = cycle.trail;
  var length = 0;
  var prev   = cycle;

  for (var i = points.length - 1; i >= 0; i--) {
    var point   = points[i];
    var segment = Math.abs(prev.x - point.x) + Math.abs(prev.z - point.z);

    if (length + segment >= GridBackdrop.TRAIL_LENGTH) {
      var keep = (GridBackdrop.TRAIL_LENGTH - length) / segment;

      points[i] = {
        x: prev.x + (point.x - prev.x) * keep,
        z: prev.z + (point.z - prev.z) * keep
      };
      points.splice(0, i);
      return;
    }

    length += segment;
    prev    = point;
  }
};

GridBackdrop.prototype.project = function (x, y, depth) {
  var scale = this.focal / depth;

  return {
    x: this.width / 2 + x * scale,
    y: this.horizon + (GridBackdrop.CAMERA_HEIGHT - y) * scale
  };
};

GridBackdrop.prototype.draw = function () {
  var ctx = this.context;

  ctx.globalCompositeOperation = "source-over";
  this.drawSky(ctx);
  this.drawScenery(ctx);
  this.drawFloor(ctx);

  ctx.globalCompositeOperation = "lighter";
  this.drawMotes(ctx);
  this.cycles.forEach(function (cycle) {
    this.drawCycle(ctx, cycle);
  }, this);

  ctx.globalCompositeOperation = "source-over";
  this.drawFog(ctx);

  ctx.globalCompositeOperation = "lighter";
  this.drawHorizon(ctx);

  ctx.globalCompositeOperation = "source-over";
  this.drawVignette(ctx);
};

GridBackdrop.prototype.drawSky = function (ctx) {
  var sky = ctx.createLinearGradient(0, 0, 0, this.horizon);

  sky.addColorStop(0, "#000204");
  sky.addColorStop(0.7, "#021018");
  sky.addColorStop(1, "#06303d");

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, this.width, this.horizon);
};

GridBackdrop.prototype.drawScenery = function (ctx) {
  var horizon = this.horizon;

  this.ridges.forEach(function (ridge) {
    var points = ridge.points;

    ctx.beginPath();
    ctx.moveTo(points[0].x, horizon);
    points.forEach(function (point) {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, horizon);
    ctx.closePath();
    ctx.fillStyle = "#01070b";
    ctx.fill();

    // Rim light along the ridgeline
    ctx.beginPath();
    points.forEach(function (point, index) {
      if (index) ctx.lineTo(point.x, point.y);
      else ctx.moveTo(point.x, point.y);
    });
    ctx.lineWidth   = 1;
    ctx.strokeStyle = "rgba(94, 230, 255, " + 0.35 * ridge.brightness + ")";
    ctx.stroke();
  });

  this.skyline.forEach(function (tower) {
    var left = Math.round(tower.x - tower.width / 2) + 0.5;
    var top  = Math.round(horizon - tower.height) + 0.5;

    ctx.fillStyle   = "#010609";
    ctx.strokeStyle = "rgba(94, 230, 255, 0.3)";
    ctx.fillRect(left, top, tower.width, tower.height);
    ctx.strokeRect(left, top, tower.width, tower.height);
  });

  // Beacon on the tallest spire
  var spire = this.skyline[0];

  ctx.fillStyle = "rgba(220, 250, 255, 0.9)";
  ctx.fillRect(spire.x - 1, horizon - spire.height - 3, 2, 3);
};

GridBackdrop.prototype.drawFloor = function (ctx) {
  var cell  = GridBackdrop.CELL;
  var far   = GridBackdrop.FAR;
  var near  = Math.max(GridBackdrop.NEAR, GridBackdrop.CAMERA_HEIGHT *
                       this.focal / (this.height - this.horizon));
  var reach = Math.ceil(this.width / 2 / this.focal * far / cell);
  var floor = ctx.createLinearGradient(0, this.horizon, 0, this.height);

  floor.addColorStop(0, "#03141b");
  floor.addColorStop(1, "#010508");
  ctx.fillStyle = floor;
  ctx.fillRect(0, this.horizon, this.width, this.height - this.horizon);

  // Lines running away from the viewer, toward the vanishing point
  ctx.beginPath();
  for (var i = -reach; i <= reach; i++) {
    var start = this.project(i * cell, 0, near);
    var end   = this.project(i * cell, 0, far);

    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  }
  ctx.lineWidth   = 3;
  ctx.strokeStyle = "rgba(60, 200, 255, 0.08)";
  ctx.stroke();
  ctx.lineWidth   = 1;
  ctx.strokeStyle = "rgba(110, 225, 255, 0.4)";
  ctx.stroke();

  // Lines across the floor, scrolling toward the viewer as the camera advances
  var first = Math.ceil((this.cameraZ + near) / cell) * cell;

  for (var z = first; z - this.cameraZ < far; z += cell) {
    var depth = z - this.cameraZ;
    var y     = this.project(0, 0, depth).y;
    var width = Math.min(2.2, Math.max(0.6, 6 / depth));

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(this.width, y);
    ctx.lineWidth   = width * 3;
    ctx.strokeStyle = "rgba(60, 200, 255, 0.08)";
    ctx.stroke();
    ctx.lineWidth   = width;
    ctx.strokeStyle = "rgba(110, 225, 255, 0.45)";
    ctx.stroke();
  }
};

GridBackdrop.prototype.drawMotes = function (ctx) {
  ctx.fillStyle = "rgb(150, 235, 255)";

  this.motes.forEach(function (mote) {
    var depth = mote.z - this.cameraZ;

    if (depth < GridBackdrop.NEAR) return;

    var point = this.project(mote.x, mote.y, depth);
    var size  = Math.min(2.5, 6 / depth);

    ctx.globalAlpha = Math.max(0, Math.min(1, (55 - depth) / 15)) * 0.5;
    ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
  }, this);

  ctx.globalAlpha = 1;
};

GridBackdrop.prototype.drawCycle = function (ctx, cycle) {
  var points = cycle.trail.concat({ x: cycle.x, z: cycle.z });
  var total  = GridBackdrop.TRAIL_LENGTH;
  var walked = 0;

  // Walk from the rider back to the tail, fading the wall as it ages
  for (var i = points.length - 1; i > 0; i--) {
    var head   = points[i];
    var tail   = points[i - 1];
    var length = Math.abs(head.x - tail.x) + Math.abs(head.z - tail.z);

    if (length > 0.001) {
      this.drawWall(ctx, cycle.color, head, tail,
                    1 - walked / total, 1 - (walked + length) / total);
    }

    walked += length;
  }

  this.drawRider(ctx, cycle);
};

// A trail is a translucent wall of light with a white-hot top edge,
// mirrored faintly in the glossy floor
GridBackdrop.prototype.drawWall = function (ctx, color, a, b, fadeA, fadeB) {
  var near   = GridBackdrop.NEAR;
  var depthA = a.z - this.cameraZ;
  var depthB = b.z - this.cameraZ;

  if (depthA < near && depthB < near) return;

  // Clip the wall where it passes behind the camera
  if (depthA < near || depthB < near) {
    var t    = (near - depthA) / (depthB - depthA);
    var cut  = { x: a.x + (b.x - a.x) * t, z: this.cameraZ + near };
    var fade = fadeA + (fadeB - fadeA) * t;

    if (depthA < near) {
      a = cut;
      fadeA = fade;
      depthA = near;
    } else {
      b = cut;
      fadeB = fade;
      depthB = near;
    }
  }

  var wall = { a: a, b: b, depthA: depthA, depthB: depthB,
               fadeA: fadeA, fadeB: fadeB };

  this.drawBand(ctx, wall, -0.8, 0, color, 0.07);
  this.drawBand(ctx, wall, 0, 1, color, 0.16);
  this.drawBand(ctx, wall, 0.6, 1.3, color, 0.07);
  this.drawBand(ctx, wall, 0.78, 1.12, color, 0.14);
  this.drawBand(ctx, wall, 0.9, 1, "235, 253, 255", 0.85);
  this.drawBand(ctx, wall, 0, 0.06, color, 0.6);
};

// Fill a horizontal strip of a wall, between two heights given as fractions
// of the wall's height
GridBackdrop.prototype.drawBand = function (ctx, wall, low, high, color,
                                            strength) {
  var height   = GridBackdrop.WALL_HEIGHT;
  var p1       = this.project(wall.a.x, low * height, wall.depthA);
  var p2       = this.project(wall.a.x, high * height, wall.depthA);
  var p3       = this.project(wall.b.x, high * height, wall.depthB);
  var p4       = this.project(wall.b.x, low * height, wall.depthB);
  var gradient = ctx.createLinearGradient(p1.x, p1.y, p4.x, p4.y);

  gradient.addColorStop(0, "rgba(" + color + ", " +
                           wall.fadeA * strength + ")");
  gradient.addColorStop(1, "rgba(" + color + ", " +
                           wall.fadeB * strength + ")");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.closePath();
  ctx.fill();
};

GridBackdrop.prototype.drawRider = function (ctx, cycle) {
  var depth = cycle.z - this.cameraZ;

  if (depth < GridBackdrop.NEAR + 1) return;

  var heading = cycle.heading;
  var front   = { x: cycle.x + heading.x * 0.6, z: cycle.z + heading.z * 0.6 };
  var back    = { x: cycle.x - heading.x * 0.9, z: cycle.z - heading.z * 0.9 };
  var body    = { a: front, b: back,
                  depthA: front.z - this.cameraZ,
                  depthB: back.z - this.cameraZ,
                  fadeA: 1, fadeB: 1 };

  // The bike itself: a low, bright capsule of light
  this.drawBand(ctx, body, 0.1, 0.9, cycle.color, 0.5);
  this.drawBand(ctx, body, 0.3, 0.7, "255, 255, 255", 0.7);

  // Bloom around the rider, and its reflection in the floor
  this.drawGlow(ctx, this.project(cycle.x, 0.3, depth),
                this.focal * 0.8 / depth, cycle.color, 1);
  this.drawGlow(ctx, this.project(cycle.x, -0.3, depth),
                this.focal * 0.5 / depth, cycle.color, 0.3);
};

GridBackdrop.prototype.drawGlow = function (ctx, point, radius, color,
                                            strength) {
  var glow = ctx.createRadialGradient(point.x, point.y, 0,
                                      point.x, point.y, radius);

  glow.addColorStop(0, "rgba(255, 255, 255, " + 0.9 * strength + ")");
  glow.addColorStop(0.12, "rgba(" + color + ", " + 0.7 * strength + ")");
  glow.addColorStop(0.4, "rgba(" + color + ", " + 0.15 * strength + ")");
  glow.addColorStop(1, "rgba(" + color + ", 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
};

// Distant floor dissolves into haze, so the grid lines never shimmer
GridBackdrop.prototype.drawFog = function (ctx) {
  var bottom = this.project(0, 0, 25).y;
  var middle = (this.project(0, 0, 60).y - this.horizon) /
               (bottom - this.horizon);
  var fog    = ctx.createLinearGradient(0, this.horizon, 0, bottom);

  fog.addColorStop(0, "rgba(4, 24, 32, 1)");
  fog.addColorStop(middle, "rgba(4, 24, 32, 0.7)");
  fog.addColorStop(1, "rgba(4, 24, 32, 0)");

  ctx.fillStyle = fog;
  ctx.fillRect(0, this.horizon, this.width, bottom - this.horizon);
};

GridBackdrop.prototype.drawHorizon = function (ctx) {
  var radius = this.width * 0.7;

  // Haze glowing up from the horizon
  ctx.save();
  ctx.translate(this.width / 2, this.horizon);
  ctx.scale(1, 0.18);

  var haze = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);

  haze.addColorStop(0, "rgba(94, 230, 255, 0.22)");
  haze.addColorStop(0.4, "rgba(94, 230, 255, 0.07)");
  haze.addColorStop(1, "rgba(94, 230, 255, 0)");
  ctx.fillStyle = haze;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  ctx.restore();

  // The horizon line itself
  var line = ctx.createLinearGradient(0, 0, this.width, 0);

  line.addColorStop(0, "rgba(94, 230, 255, 0)");
  line.addColorStop(0.5, "rgba(190, 248, 255, 0.85)");
  line.addColorStop(1, "rgba(94, 230, 255, 0)");
  ctx.fillStyle = line;
  ctx.fillRect(0, this.horizon - 0.5, this.width, 1.5);
};

GridBackdrop.prototype.drawVignette = function (ctx) {
  var size     = Math.max(this.width, this.height);
  var x        = this.width / 2;
  var y        = this.height * 0.45;
  var vignette = ctx.createRadialGradient(x, y, size * 0.25, x, y, size * 0.8);

  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.7)");

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, this.width, this.height);
};
