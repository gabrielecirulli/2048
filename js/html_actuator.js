function HTMLActuator() {
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.score = 0;

  this.size = 4;
  this.cell = 1.15;
  this.gap = 0.18;
  this.tileMeshes = {};
  this.animating = false;
  this.bgMode = "scenery";

  this.initScene();
}

HTMLActuator.prototype.boardSpan = function () {
  return this.size * this.cell + (this.size - 1) * this.gap;
};

HTMLActuator.prototype.cellToWorld = function (x, y) {
  var span = this.boardSpan();
  var step = this.cell + this.gap;
  return {
    x: -span / 2 + this.cell / 2 + x * step,
    z: -span / 2 + this.cell / 2 + y * step
  };
};

HTMLActuator.prototype.tileColor = function (value) {
  var colors = {
    2: 0xeee4da,
    4: 0xede0c8,
    8: 0xf2b179,
    16: 0xf59563,
    32: 0xf67c5f,
    64: 0xf65e3b,
    128: 0xedcf72,
    256: 0xedcc61,
    512: 0xedc850,
    1024: 0xedc53f,
    2048: 0xedc22e
  };
  return colors[value] || 0x3c3a32;
};

HTMLActuator.prototype.tileHeight = function (value) {
  return 0.35 + Math.log2(value) * 0.22;
};

HTMLActuator.prototype.makeLabelTexture = function (value) {
  var canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  var ctx = canvas.getContext("2d");
  var bg = this.tileColor(value);
  var r = (bg >> 16) & 255;
  var g = (bg >> 8) & 255;
  var b = bg & 255;
  ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = value <= 4 ? "#776e65" : "#f9f6f2";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var text = String(value);
  ctx.font = "bold " + (text.length > 3 ? 72 : text.length > 2 ? 96 : 120) + "px Helvetica, Arial, sans-serif";
  ctx.fillText(text, 128, 136);

  var texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};

HTMLActuator.prototype.initScene = function () {
  var mount = document.getElementById("scene");
  var width = mount.clientWidth;
  var height = mount.clientHeight;

  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0x1a1d24);
  this.scene.fog = new THREE.Fog(0x1a1d24, 12, 28);

  this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  this.renderer.setSize(width, height);
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(this.renderer.domElement);

  // Straight top-down: slightly offset on Z so OrbitControls has a stable up axis
  this.defaultCameraPosition = new THREE.Vector3(0, 11, 0.001);
  this.defaultTarget = new THREE.Vector3(0, 0, 0);

  this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  this.controls.enableDamping = true;
  this.controls.dampingFactor = 0.08;
  this.controls.minDistance = 5;
  this.controls.maxDistance = 32;
  this.controls.maxPolarAngle = Math.PI * 0.495;
  this.camera.position.copy(this.defaultCameraPosition);
  this.controls.target.copy(this.defaultTarget);
  this.controls.update();

  var self = this;
  var recenterButton = document.querySelector(".recenter-button");
  if (recenterButton) {
    recenterButton.addEventListener("click", function (event) {
      event.preventDefault();
      self.recenter();
    });
  }

  var backgroundButton = document.querySelector(".background-button");
  if (backgroundButton) {
    backgroundButton.addEventListener("click", function (event) {
      event.preventDefault();
      self.swapBackground();
    });
  }

  // Soft fill only — one directional light casts all shadows
  this.ambient = new THREE.AmbientLight(0xffffff, 0.35);
  this.scene.add(this.ambient);

  this.keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
  this.keyLight.position.set(4, 14, 6);
  this.keyLight.target.position.set(0, 0, 0);
  this.scene.add(this.keyLight);
  this.scene.add(this.keyLight.target);

  this.keyLight.castShadow = true;
  this.keyLight.shadow.mapSize.set(2048, 2048);
  this.keyLight.shadow.bias = -0.0005;
  this.keyLight.shadow.normalBias = 0.02;
  this.keyLight.shadow.radius = 3;

  var extent = 18;
  this.keyLight.shadow.camera.left = -extent;
  this.keyLight.shadow.camera.right = extent;
  this.keyLight.shadow.camera.top = extent;
  this.keyLight.shadow.camera.bottom = -extent;
  this.keyLight.shadow.camera.near = 1;
  this.keyLight.shadow.camera.far = 50;
  this.keyLight.shadow.camera.updateProjectionMatrix();

  this.buildBoard();
  this.buildScenery();
  this.applyBackground("scenery");

  window.addEventListener("resize", function () {
    var w = mount.clientWidth;
    var h = mount.clientHeight;
    self.camera.aspect = w / h;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(w, h);
  });

  this.animate();
};

HTMLActuator.prototype.recenter = function () {
  this.camera.position.copy(this.defaultCameraPosition);
  this.camera.up.set(0, 1, 0);
  this.controls.target.copy(this.defaultTarget);
  this.controls.update();
};

HTMLActuator.prototype.swapBackground = function () {
  this.applyBackground(this.bgMode === "studio" ? "scenery" : "studio");
};

HTMLActuator.prototype.applyBackground = function (mode) {
  this.bgMode = mode;

  if (mode === "scenery") {
    this.scene.background = new THREE.Color(0x87b8d8);
    this.scene.fog = new THREE.Fog(0xa8cce0, 28, 85);
    this.studioGround.visible = false;
    this.sceneryGroup.visible = true;
    this.controls.maxDistance = 32;
  } else {
    this.scene.background = new THREE.Color(0x1a1d24);
    this.scene.fog = new THREE.Fog(0x1a1d24, 12, 28);
    this.studioGround.visible = true;
    this.sceneryGroup.visible = false;
    this.controls.maxDistance = 18;
  }
};

HTMLActuator.prototype.buildBoard = function () {
  var span = this.boardSpan();
  var boardGeo = new THREE.BoxGeometry(span + 0.55, 0.35, span + 0.55);
  var boardMat = new THREE.MeshStandardMaterial({
    color: 0x2a3038,
    roughness: 0.85,
    metalness: 0.1
  });
  var board = new THREE.Mesh(boardGeo, boardMat);
  board.position.y = -0.175;
  board.castShadow = true;
  board.receiveShadow = true;
  this.scene.add(board);

  var rimGeo = new THREE.BoxGeometry(span + 0.7, 0.12, span + 0.7);
  var rimMat = new THREE.MeshStandardMaterial({ color: 0x3d4654, roughness: 0.7 });
  var rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 0.02;
  rim.castShadow = true;
  rim.receiveShadow = true;
  this.scene.add(rim);

  var padGeo = new THREE.BoxGeometry(this.cell, 0.08, this.cell);
  var padMat = new THREE.MeshStandardMaterial({ color: 0x3a4250, roughness: 0.9 });

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var pad = new THREE.Mesh(padGeo, padMat);
      var pos = this.cellToWorld(x, y);
      pad.position.set(pos.x, 0.06, pos.z);
      pad.castShadow = true;
      pad.receiveShadow = true;
      this.scene.add(pad);
    }
  }

  this.studioGround = new THREE.Mesh(
    new THREE.CircleGeometry(20, 48),
    new THREE.MeshStandardMaterial({ color: 0x12151a, roughness: 1 })
  );
  this.studioGround.rotation.x = -Math.PI / 2;
  this.studioGround.position.y = -0.36;
  this.studioGround.receiveShadow = true;
  this.scene.add(this.studioGround);
};

HTMLActuator.prototype.makePineTree = function (x, z, scale) {
  scale = scale || 1;
  var tree = new THREE.Group();

  var trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * scale, 0.24 * scale, 1.1 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.95 })
  );
  trunk.position.y = 0.55 * scale;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  var foliageMat = new THREE.MeshStandardMaterial({ color: 0x3f7a46, roughness: 0.85 });
  var layers = [
    { y: 1.35 * scale, r: 1.05 * scale, h: 1.4 * scale },
    { y: 2.05 * scale, r: 0.78 * scale, h: 1.15 * scale },
    { y: 2.65 * scale, r: 0.5 * scale, h: 0.9 * scale }
  ];

  for (var i = 0; i < layers.length; i++) {
    var cone = new THREE.Mesh(
      new THREE.ConeGeometry(layers[i].r, layers[i].h, 8),
      foliageMat
    );
    cone.position.y = layers[i].y;
    cone.castShadow = true;
    cone.receiveShadow = true;
    tree.add(cone);
  }

  tree.position.set(x, -0.36, z);
  return tree;
};

HTMLActuator.prototype.makeRoundTree = function (x, z, scale) {
  scale = scale || 1;
  var tree = new THREE.Group();

  var trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16 * scale, 0.22 * scale, 1.4 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x7a5533, roughness: 0.95 })
  );
  trunk.position.y = 0.7 * scale;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  var canopyMat = new THREE.MeshStandardMaterial({ color: 0x4f9a4a, roughness: 0.8 });
  var canopy = new THREE.Mesh(new THREE.SphereGeometry(1.15 * scale, 12, 10), canopyMat);
  canopy.position.y = 1.85 * scale;
  canopy.scale.set(1.15, 0.9, 1.1);
  canopy.castShadow = true;
  canopy.receiveShadow = true;
  tree.add(canopy);

  var canopy2 = new THREE.Mesh(new THREE.SphereGeometry(0.7 * scale, 10, 8), canopyMat);
  canopy2.position.set(0.55 * scale, 1.55 * scale, -0.2 * scale);
  canopy2.castShadow = true;
  canopy2.receiveShadow = true;
  tree.add(canopy2);

  tree.position.set(x, -0.36, z);
  return tree;
};

HTMLActuator.prototype.makeGrassTuft = function (x, z, scale) {
  scale = scale || 1;
  var tuft = new THREE.Group();
  var greens = [0x6aaa4a, 0x5d9a42, 0x78b85a];
  var bladeMat = new THREE.MeshStandardMaterial({
    color: greens[Math.floor(Math.abs(x * 10 + z * 7)) % 3],
    roughness: 0.95,
    side: THREE.DoubleSide
  });

  for (var i = 0; i < 6; i++) {
    var blade = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08 * scale, (0.35 + i * 0.05) * scale),
      bladeMat
    );
    blade.position.set(
      (i - 2.5) * 0.07 * scale,
      ((0.35 + i * 0.05) * scale) / 2,
      (i % 2) * 0.04 * scale
    );
    blade.rotation.y = i * 0.5;
    blade.rotation.z = (i - 2.5) * 0.12;
    blade.castShadow = true;
    tuft.add(blade);
  }

  tuft.position.set(x, -0.36, z);
  return tuft;
};

HTMLActuator.prototype.makeBush = function (x, z, scale) {
  scale = scale || 1;
  var bush = new THREE.Group();
  var mat = new THREE.MeshStandardMaterial({ color: 0x3f8f45, roughness: 0.88 });
  var main = new THREE.Mesh(new THREE.SphereGeometry(0.55 * scale, 10, 8), mat);
  main.position.y = 0.4 * scale;
  main.scale.set(1.2, 0.85, 1.1);
  main.castShadow = true;
  main.receiveShadow = true;
  bush.add(main);

  var side = new THREE.Mesh(new THREE.SphereGeometry(0.35 * scale, 8, 6), mat);
  side.position.set(0.35 * scale, 0.3 * scale, 0.15 * scale);
  side.castShadow = true;
  bush.add(side);

  bush.position.set(x, -0.36, z);
  return bush;
};

HTMLActuator.prototype.makeFlower = function (x, z, color, scale) {
  scale = scale || 1;
  var flower = new THREE.Group();

  var stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02 * scale, 0.025 * scale, 0.35 * scale, 5),
    new THREE.MeshStandardMaterial({ color: 0x3f7a35, roughness: 0.9 })
  );
  stem.position.y = 0.18 * scale;
  flower.add(stem);

  var petalMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });
  for (var i = 0; i < 5; i++) {
    var petal = new THREE.Mesh(new THREE.SphereGeometry(0.07 * scale, 6, 5), petalMat);
    var angle = (i / 5) * Math.PI * 2;
    petal.position.set(
      Math.cos(angle) * 0.08 * scale,
      0.38 * scale,
      Math.sin(angle) * 0.08 * scale
    );
    petal.scale.set(1, 0.55, 1);
    flower.add(petal);
  }

  var center = new THREE.Mesh(
    new THREE.SphereGeometry(0.05 * scale, 6, 5),
    new THREE.MeshStandardMaterial({ color: 0xf2d85a, roughness: 0.6 })
  );
  center.position.y = 0.38 * scale;
  flower.add(center);

  flower.position.set(x, -0.36, z);
  flower.rotation.y = (x + z) * 1.7;
  return flower;
};

HTMLActuator.prototype.makePebble = function (x, z, scale) {
  scale = scale || 1;
  var colors = [0x9a9590, 0x7d7974, 0xb0aaa3, 0x8e8880];
  var pebble = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.12 * scale, 0),
    new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.abs(x * 13 + z * 5)) % 4],
      roughness: 0.95
    })
  );
  pebble.position.set(x, -0.3, z);
  pebble.rotation.set(x * 0.7, z * 1.1, 0.4);
  pebble.scale.set(1 + (scale % 0.4), 0.55, 0.85 + (scale % 0.3));
  pebble.castShadow = true;
  pebble.receiveShadow = true;
  return pebble;
};

HTMLActuator.prototype.buildScenery = function () {
  this.sceneryGroup = new THREE.Group();
  this.sceneryGroup.visible = false;

  var grass = new THREE.Mesh(
    new THREE.CircleGeometry(48, 64),
    new THREE.MeshStandardMaterial({ color: 0x5d8f4a, roughness: 0.95 })
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.36;
  grass.receiveShadow = true;
  this.sceneryGroup.add(grass);

  // Stone patio under the board, lit by the same key light
  var patio = new THREE.Mesh(
    new THREE.CylinderGeometry(5.2, 5.2, 0.18, 48),
    new THREE.MeshStandardMaterial({ color: 0xb7b0a3, roughness: 0.9, metalness: 0.05 })
  );
  patio.position.y = -0.27;
  patio.castShadow = true;
  patio.receiveShadow = true;
  this.sceneryGroup.add(patio);

  var path = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.06, 10),
    new THREE.MeshStandardMaterial({ color: 0xc4b8a5, roughness: 0.92 })
  );
  path.position.set(0, -0.32, 8.5);
  path.receiveShadow = true;
  path.castShadow = true;
  this.sceneryGroup.add(path);

  // Lake off to the side
  var lakeBed = new THREE.Mesh(
    new THREE.CircleGeometry(4.8, 32),
    new THREE.MeshStandardMaterial({ color: 0x3a5f3a, roughness: 1 })
  );
  lakeBed.rotation.x = -Math.PI / 2;
  lakeBed.position.set(-11, -0.34, 9);
  lakeBed.scale.set(1.35, 1, 0.85);
  lakeBed.receiveShadow = true;
  this.sceneryGroup.add(lakeBed);

  var lake = new THREE.Mesh(
    new THREE.CircleGeometry(4.4, 32),
    new THREE.MeshStandardMaterial({
      color: 0x3a8fbf,
      roughness: 0.18,
      metalness: 0.35
    })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(-11, -0.3, 9);
  lake.scale.set(1.35, 1, 0.85);
  lake.receiveShadow = true;
  this.sceneryGroup.add(lake);

  // Shore rocks around the lake
  var shoreMat = new THREE.MeshStandardMaterial({ color: 0x8a8680, roughness: 0.95 });
  var shore = [
    [-7.2, 7.5, 0.4], [-8.5, 11.5, 0.5], [-13.5, 6.8, 0.45],
    [-14.2, 10.5, 0.55], [-10.5, 12.8, 0.35], [-12.8, 12.2, 0.42]
  ];
  for (var s = 0; s < shore.length; s++) {
    var shoreRock = new THREE.Mesh(new THREE.DodecahedronGeometry(shore[s][2], 0), shoreMat);
    shoreRock.position.set(shore[s][0], -0.22, shore[s][1]);
    shoreRock.rotation.set(0.2, s * 0.7, 0.15);
    shoreRock.castShadow = true;
    shoreRock.receiveShadow = true;
    this.sceneryGroup.add(shoreRock);
  }

  // Low hills around the clearing
  var hillMat = new THREE.MeshStandardMaterial({ color: 0x4f7d40, roughness: 1 });
  var hills = [
    { x: -14, z: -10, sx: 8, sy: 2.2, sz: 7 },
    { x: 15, z: -8, sx: 9, sy: 2.8, sz: 8 },
    { x: 13, z: 14, sx: 8, sy: 2.4, sz: 7 },
    { x: 0, z: -16, sx: 12, sy: 3.2, sz: 6 }
  ];
  for (var h = 0; h < hills.length; h++) {
    var hill = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), hillMat);
    hill.scale.set(hills[h].sx, hills[h].sy, hills[h].sz);
    hill.position.set(hills[h].x, -0.36, hills[h].z);
    hill.castShadow = true;
    hill.receiveShadow = true;
    this.sceneryGroup.add(hill);
  }

  // Distant mountains — staggered/overlapping, varied slopes, centered snow
  var mountainMat = new THREE.MeshStandardMaterial({ color: 0x6d7585, roughness: 0.95 });
  var snowMat = new THREE.MeshStandardMaterial({ color: 0xeef3f8, roughness: 0.75 });
  var mountains = [
    // steep skinny
    { x: -30, z: -32, r: 7, h: 20, ry: 0.15, sx: 1.05, sz: 0.9 },
    // broad gentle
    { x: -18, z: -36, r: 14, h: 13, ry: -0.35, sx: 1.15, sz: 1.05 },
    // tall steep
    { x: -8, z: -34, r: 9, h: 24, ry: 0.08, sx: 0.95, sz: 1.0 },
    // medium
    { x: 4, z: -39, r: 11, h: 18, ry: 0.45, sx: 1.2, sz: 0.85 },
    // steep
    { x: 14, z: -33, r: 8, h: 22, ry: -0.2, sx: 1.0, sz: 1.1 },
    // broad
    { x: 26, z: -37, r: 12, h: 12, ry: 0.55, sx: 1.25, sz: 0.9 },
    // medium-steep
    { x: 34, z: -29, r: 8.5, h: 17, ry: -0.1, sx: 1.0, sz: 1.05 },
    // broad side peak
    { x: -38, z: -24, r: 11, h: 14, ry: 0.3, sx: 0.9, sz: 1.2 },
    // small steep
    { x: -22, z: -28, r: 5.5, h: 14, ry: -0.5, sx: 1.1, sz: 0.85 },
    // small broad
    { x: 20, z: -28, r: 9, h: 11, ry: 0.25, sx: 1.15, sz: 0.95 }
  ];
  for (var m = 0; m < mountains.length; m++) {
    var mt = mountains[m];
    var peak = new THREE.Mesh(new THREE.ConeGeometry(mt.r, mt.h, 6 + (m % 3)), mountainMat);
    peak.position.set(mt.x, mt.h / 2 - 1.2, mt.z);
    peak.rotation.y = mt.ry;
    peak.scale.set(mt.sx, 1, mt.sz);
    peak.castShadow = true;
    peak.receiveShadow = true;
    this.sceneryGroup.add(peak);

    var snow = new THREE.Mesh(
      new THREE.ConeGeometry(mt.r * 0.38, mt.h * 0.28, 7),
      snowMat
    );
    snow.position.set(mt.x, mt.h - mt.h * 0.14 - 1.2, mt.z);
    snow.rotation.y = mt.ry;
    snow.scale.set(mt.sx, 1, mt.sz);
    snow.castShadow = true;
    snow.receiveShadow = true;
    this.sceneryGroup.add(snow);
  }

  var pines = [
    [-7.5, -5.5, 1.1], [-9.2, 2.5, 0.95], [7.8, -4.8, 1.05],
    [9.5, 1.8, 1.35], [-3.5, -9.5, 1.15], [11.5, 5.5, 1.2],
    [-16, -6, 1.4], [16, -12, 1.3], [-14, 4, 1.0],
    [13, -6, 0.9], [-18, -14, 1.2], [18, 8, 1.15],
    [-10, -12, 0.85], [8, -14, 1.05]
  ];
  for (var t = 0; t < pines.length; t++) {
    this.sceneryGroup.add(this.makePineTree(pines[t][0], pines[t][1], pines[t][2]));
  }

  var rounds = [
    [-6.8, 7.2, 1.15], [7.2, 8.0, 1.0], [3.8, -9.0, 0.95],
    [-11, -2, 1.05], [5.5, 11.5, 1.2], [-5.5, 12.5, 0.9],
    [14, 2, 1.1], [-15, 10, 1.0], [12, 12, 0.95],
    [-8, -8, 1.1], [6, 14, 0.85], [-12, 14, 1.05]
  ];
  for (var rt = 0; rt < rounds.length; rt++) {
    this.sceneryGroup.add(this.makeRoundTree(rounds[rt][0], rounds[rt][1], rounds[rt][2]));
  }

  var bushes = [
    [-5.5, 2.8, 0.9], [5.0, 3.2, 1.1], [-4.2, -4.5, 0.8],
    [4.8, -5.0, 1.0], [-8.5, 6.5, 1.15], [8.2, 7.0, 0.95],
    [-2.0, 10.5, 0.85], [3.0, 11.2, 1.05], [9.5, -2.5, 0.9],
    [-9.8, -4.0, 1.0], [1.5, -7.5, 0.8], [-6.5, 9.0, 1.1]
  ];
  for (var b = 0; b < bushes.length; b++) {
    this.sceneryGroup.add(this.makeBush(bushes[b][0], bushes[b][1], bushes[b][2]));
  }

  var tufts = [
    [-5.8, 3.2, 1.1], [-4.5, 5.5, 0.9], [5.2, 4.0, 1.0],
    [4.8, 6.2, 1.2], [-3.2, -5.8, 0.85], [3.5, -6.4, 1.05],
    [-8.2, 5.5, 1.15], [-9.5, 7.8, 0.95], [6.5, -3.5, 1.0],
    [-2.5, 8.5, 1.1], [2.2, 9.0, 0.9], [8.8, 9.5, 1.05],
    [-6.2, -3.0, 1.0], [7.0, 5.5, 0.85], [-1.5, -8.0, 1.15],
    [5.8, -8.2, 0.95], [-10.5, 3.5, 1.05], [10.2, 3.0, 0.9],
    [-7.5, 10.5, 1.0], [7.8, 11.0, 1.1], [0.5, 12.0, 0.95],
    [-4.0, 13.0, 1.05], [9.0, -7.0, 0.85], [-12.0, 7.5, 1.0]
  ];
  for (var g = 0; g < tufts.length; g++) {
    this.sceneryGroup.add(this.makeGrassTuft(tufts[g][0], tufts[g][1], tufts[g][2]));
  }

  var flowerColors = [0xe85d75, 0xf0a830, 0xc49dff, 0xff6b6b, 0xf7f1e3];
  var flowers = [
    [-5.0, 4.0], [-4.2, 4.8], [-3.5, 3.6], [4.5, 4.2], [5.3, 5.0],
    [4.0, 5.8], [-6.5, 6.0], [6.2, 6.5], [-3.8, -4.8], [3.2, -5.2],
    [4.5, -4.0], [-7.5, 8.0], [-8.0, 8.8], [2.5, 10.0], [3.5, 10.8],
    [-1.0, 9.5], [8.0, 4.5], [-9.0, 5.0], [7.5, -1.5], [-2.8, 6.8],
    [1.8, 7.5], [-5.5, -2.5], [6.8, 8.5], [-10.2, 8.5]
  ];
  for (var f = 0; f < flowers.length; f++) {
    this.sceneryGroup.add(this.makeFlower(
      flowers[f][0],
      flowers[f][1],
      flowerColors[f % flowerColors.length],
      0.85 + (f % 3) * 0.12
    ));
  }

  var pebbles = [
    [-5.4, 3.5, 1.0], [-4.8, 3.9, 0.7], [-5.1, 4.4, 0.85],
    [5.0, 3.8, 0.9], [5.4, 4.3, 0.65], [4.7, 4.6, 1.1],
    [-3.5, -5.2, 0.8], [-3.0, -5.6, 0.7], [3.8, -5.5, 0.95],
    [4.2, -5.0, 0.75], [-7.0, 5.8, 0.6], [-7.4, 6.2, 0.85],
    [6.5, 5.2, 0.7], [7.0, 5.6, 0.9], [-8.8, 7.2, 0.65],
    [0.8, 8.2, 0.8], [1.2, 8.6, 0.55], [-1.5, -6.5, 0.9],
    [2.0, -7.0, 0.7], [8.5, 2.5, 0.85], [-6.0, -1.5, 0.75],
    [5.5, -2.8, 0.6], [-4.5, 7.5, 0.95], [3.0, 6.0, 0.7],
    [-9.5, 4.2, 0.8], [9.2, 6.8, 0.65], [-2.2, 5.0, 0.55],
    [1.5, -4.5, 0.9], [-11.5, 6.5, 0.75], [-10.8, 11.0, 0.85]
  ];
  for (var p = 0; p < pebbles.length; p++) {
    this.sceneryGroup.add(this.makePebble(pebbles[p][0], pebbles[p][1], pebbles[p][2]));
  }

  var rockMat = new THREE.MeshStandardMaterial({ color: 0x8a8680, roughness: 0.95 });
  var rocks = [
    [-5.2, 4.6, 0.45], [5.5, 5.1, 0.55], [-4.8, -6.2, 0.35],
    [6.1, -5.4, 0.4], [-7.8, -1.5, 0.5], [8.5, -3.8, 0.42],
    [2.5, 12.5, 0.38], [-13.0, 1.0, 0.48]
  ];
  for (var r = 0; r < rocks.length; r++) {
    var rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rocks[r][2], 0), rockMat);
    rock.position.set(rocks[r][0], -0.2, rocks[r][1]);
    rock.rotation.set(0.3, r * 0.8, 0.1);
    rock.castShadow = true;
    rock.receiveShadow = true;
    this.sceneryGroup.add(rock);
  }

  this.scene.add(this.sceneryGroup);
};

HTMLActuator.prototype.createTileMesh = function (tile) {
  var height = this.tileHeight(tile.value);
  var geo = new THREE.BoxGeometry(this.cell * 0.92, height, this.cell * 0.92);
  var texture = this.makeLabelTexture(tile.value);
  var sideColor = this.tileColor(tile.value);
  var materials = [
    new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.45, metalness: 0.15 }),
    new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.45, metalness: 0.15 }),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.35, metalness: 0.05 }),
    new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.55, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.45, metalness: 0.15 }),
    new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.45, metalness: 0.15 })
  ];
  var mesh = new THREE.Mesh(geo, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { value: tile.value, height: height, texture: texture };
  return mesh;
};

HTMLActuator.prototype.tileKey = function (tile) {
  return tile.x + ":" + tile.y + ":" + tile.value;
};

HTMLActuator.prototype.clearTiles = function () {
  var self = this;
  Object.keys(this.tileMeshes).forEach(function (key) {
    var mesh = self.tileMeshes[key];
    self.scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.forEach(function (mat) {
      if (mat.map) mat.map.dispose();
      mat.dispose();
    });
  });
  this.tileMeshes = {};
};

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearTiles();

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (!cell) return;
        var mesh = self.createTileMesh(cell);
        var world = self.cellToWorld(cell.x, cell.y);
        var height = mesh.userData.height;
        mesh.position.set(world.x, height / 2 + 0.08, world.z);

        if (cell.mergedFrom || !cell.previousPosition) {
          mesh.scale.set(0.01, 0.01, 0.01);
          self.tweenScale(mesh, 1);
        }

        self.scene.add(mesh);
        self.tileMeshes[self.tileKey(cell)] = mesh;
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false);
      } else if (metadata.won) {
        self.message(true);
      }
    }
  });
};

HTMLActuator.prototype.tweenScale = function (mesh, target) {
  var start = performance.now();
  var duration = 180;
  function step(now) {
    var t = Math.min(1, (now - start) / duration);
    var e = 1 - Math.pow(1 - t, 3);
    mesh.scale.setScalar(0.01 + (target - 0.01) * e);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
};

HTMLActuator.prototype.animate = function () {
  var self = this;
  requestAnimationFrame(function () { self.animate(); });
  this.controls.update();
  this.renderer.render(this.scene, this.camera);
};

HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.updateScore = function (score) {
  var difference = score - this.score;
  this.score = score;
  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;
    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";
  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
