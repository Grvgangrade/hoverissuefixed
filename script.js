const amountCrystals = 20;

const pointLightIntMin = 600;
const pointLightIntMax = 1200;

const pointLightPosMin = 11;
const pointLightPosMax = 16;

const finPosMin = 0;
const finPosMax = -5;

const btmPosMin = -5;
const btmPosMax = -10;

var pointLightDirectionBackward = false;

const MAX_FRAMES_TO_WAIT = 500;
var framesUntilFire = Math.round(Math.random() * MAX_FRAMES_TO_WAIT);

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const colors = [
  0xff00ff, // pink
  0xffff00, // yellow
  0x00ffff  // aqua
];

var shapeEdges = [],
    edgesAll = [];



function createLights() {
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);

  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;

  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-100, 200, 50);
//  backLight.shadowDarkness = 0.1;
  backLight.castShadow = true;

  scene.add(light);
  scene.add(backLight);
  scene.add(shadowLight);
}

function createFloor() {
  floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1000, 1500),
    new THREE.MeshPhongMaterial({
//      color: 0x5F9EA0
      color: 0x222222
      //wireframe: true,
      
    })
  );

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -50;

  floor.receiveShadow = true;
  scene.add(floor);
}

//var intersected = [];

var mouse = new THREE.Vector3();
var INTERSECTEDHOVER = [],
    WASHOVERED = [],
    INTERSECTEDCLICK = [];

const scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
var renderer = new THREE.WebGLRenderer({antialias: false});
renderer.setSize(window.innerWidth * .6, window.innerHeight * .6);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// CONTROLS
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// STATS
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;
document.body.appendChild(stats.domElement);



//camera 
camera.position.z = 200; //130
camera.position.y = 50;
camera.position.x = -100;




//--- crystal build up ------------------------------

const crystalW = 20;
const topSplitW = crystalW/2;

var splitHeight = 70;
var topSplitGeom = new THREE.CylinderGeometry(
  0, topSplitW, splitHeight, 3, 1
);
topSplitGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, splitHeight/2, 0 ) );
console.log(topSplitGeom)

var topGeom = new THREE.CylinderGeometry(
  0, 20, 100, 4, 4
);
topGeom.castShadow = true;
topGeom.translate(0,70,0);

var bottomGeom = new THREE.CylinderGeometry(
  0, crystalW, 30, 4, 4
);
bottomGeom.castShadow = true;
//bottomGeom.translate(0,5,0);

var darkMat = new THREE.MeshPhongMaterial({
  color: 0x222222,
  shading: THREE.FlatShading,
  side: THREE.DoubleSide,
  shininess: 1000
  //wireframe: true
});

var yellowMat = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  shading: THREE.FlatShading,
  side: THREE.DoubleSide,
  //wireframe: true
});

var pinkMat = new THREE.MeshPhongMaterial({
  color: 0xe2017b,
  shading: THREE.FlatShading,
  side: THREE.DoubleSide
});

var aquaMat = new THREE.MeshPhongMaterial({
  color: 0x00ffff,
  shading: THREE.FlatShading,
  side: THREE.DoubleSide
});



function createLight(group) {
  let randomColorNumber = Math.floor(Math.random() * colors.length);
  let color = colors[randomColorNumber];
//console.log(color);
  const pointLight = new THREE.PointLight( color, 10, 100 );

  var lightBoxGeom = new THREE.OctahedronGeometry(10, 0);
  var lightBoxMat = new THREE.MeshPhongMaterial({
    color: color,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.4,
//    specular: 0xffffff,
    shininess: 100
  });

  const lightBoxGroup = new THREE.Object3D();
  lightBoxGroup.userData.parent = 'diamantGroup0';
  lightBoxGroup.name = 'lightBoxGroup';
  lightBoxGroup.add( pointLight );
  lightBoxGroup.rotateY(45 * (Math.PI/180));

  lightBoxGroup.position.set( 0, pointLightPosMin, 0 );


  var lightBox = new THREE.Mesh(lightBoxGeom, lightBoxMat);
  lightBoxGroup.add(lightBox);
  
  group.add(lightBoxGroup);
}



//diamands
const diamantsAll = [];

var diamantGroup = [];
var diamantGroupSpeed = [];
var finDirectionBackward = [];

for (var i = 0; i < amountCrystals; i++) {
  //group
  diamantGroup[i] = new THREE.Object3D();
  diamantGroup[i].name = 'diamantGroup' + i;
  diamantGroup[i].rotateY(35 * (Math.PI/180));
  
  diamantGroup[i].position.x = (Math.random() - 0.5) * 1000;
  diamantGroup[i].position.y = -50;
  diamantGroup[i].position.z = (Math.random() - 0.5) * 1000;
  
  // diamantGroup[i].position.x = i * 100;
  diamantsAll.push(diamantGroup[i]);
  scene.add(diamantGroup[i]);
  
  
  //speed
  // http://stackoverflow.com/a/13455101/1667461
  diamantGroupSpeed[i] = Math.random() / 100;
  diamantGroupSpeed[i] *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  
  
  //top
  var diamantTopGroup = new THREE.Object3D();
  diamantTopGroup.name = 'diamantTopGroup';
  diamantTopGroup.userData.parent = diamantGroup[i].name;
  diamantGroup[i].add(diamantTopGroup);

//   var diamantTopShape = new THREE.Mesh(topGeom, aquaMat);
//   diamantTopShape.rotateY(45 * (Math.PI/180));
//   diamantTopShape.castShadow = true;
//   diamantTopGroup.add(diamantTopShape);
  
  //fins
  finDirectionBackward[i] = false;
  
  var diamantAllFins = new THREE.Object3D();
  diamantAllFins.name = 'diamantAllFins' + i;
  diamantTopGroup.add( diamantAllFins );

  var diamantFinGroup = [];
  var diamantFin = [];


  for (var f = 0; f < 4; f++) {
    diamantFinGroup[f] = new THREE.Object3D();
    diamantFinGroup[f].userData.parent = diamantGroup[i].name;
    diamantFinGroup[f].name = 'diamantFinGroup' + f;
    diamantAllFins.add( diamantFinGroup[f] );

    diamantFin[f] = new THREE.Mesh( topSplitGeom, darkMat );
    shapeEdges.push(diamantFin[f]);
    diamantFin[f].userData.parent = diamantGroup[i].name;
    diamantFin[f].name = 'diamantFin' + f;
    diamantFin[f].rotation.x = 0.140; //0.143
    diamantFin[f].scale.setX(1.60); //1.72
    diamantFinGroup[f].add(diamantFin[f]);
  }

  diamantFinGroup[0].position.set(  -topSplitW,  topSplitW,  0         );
  diamantFinGroup[1].position.set(   0,          topSplitW, -topSplitW );
  diamantFinGroup[2].position.set(   0,          topSplitW,  topSplitW );
  diamantFinGroup[3].position.set(   topSplitW,  topSplitW,  0         );
  
  diamantFinGroup[0].rotateY(90  * (Math.PI/180)); //270
  diamantFinGroup[1].rotateY(0   * (Math.PI/180)); //180
  diamantFinGroup[2].rotateY(180 * (Math.PI/180)); //0
  diamantFinGroup[3].rotateY(270 * (Math.PI/180));  //90
  
  
  //bottom
  var diamantBottomShape = new THREE.Mesh(bottomGeom, darkMat);
  shapeEdges.push(diamantBottomShape);
  diamantBottomShape.userData.parent = diamantGroup[i].name;
  diamantBottomShape.name = 'diamantBottomShape';
  diamantBottomShape.castShadow = true;
  diamantBottomShape.rotation.x = Math.PI;
  diamantBottomShape.rotateY(45 * (Math.PI/180));
  diamantBottomShape.translateY(5);
  diamantGroup[i].add(diamantBottomShape);
  
  // add light
  createLight(diamantGroup[i]);
  // add edges
  createEdges(diamantGroup[i]);
}



// --- edges -------------------------------------------------
function createEdges(group) {
  // console.info('createEdges');
  // console.dir(shapeEdges);
  
  var edge;

  for (let i = 0; i < shapeEdges.length; i++) {
    let randomColorNumber = Math.floor(Math.random() * colors.length);
    let color = colors[randomColorNumber];
    
    // FIXME: idea - maybe set color for the whole diamant
    edge = new THREE.EdgesHelper( shapeEdges[i], color );
    edge.name = shapeEdges[i].name + '-edge';
    edge.material.linewidth = 1;

    edgesAll.push(edge);

    // scene.add(edge);
  }
}


function edgesSetScene(time, count) {
  setTimeout(function(){
    scene.remove(edgesAll[count]);
  }, time * 0.5);
}

function fireWhenReady() {
// console.info('fireWhenReady');
// console.log(framesUntilFire);

  if(--framesUntilFire === 0) {
//console.warn('framesUntilFire is 0');
    framesUntilFire = Math.round(Math.random() * MAX_FRAMES_TO_WAIT);
    
    const edgeW = getRandomIntInclusive(1,3);
    
    // FIXME: set different intervals for each diamant
    //        OR random diamant; not all at the same time
    
    for (var edgeCount = 0; edgeCount < edgesAll.length; edgeCount++) {
      
      scene.add(edgesAll[edgeCount]);
      edgesAll[edgeCount].material.linewidth = edgeW;
      edgesSetScene(framesUntilFire, edgeCount);

    }
           
   }

}


function pointLightIntensity() {
  if (pointLight.intensity <= pointLightIntMin) {
    pointLightDirectionBackward = true;
  }

  if (pointLight.intensity >= pointLightIntMax) {
    pointLightDirectionBackward = false;
  }

  if (pointLight.intensity > pointLightIntMin && pointLightDirectionBackward === false) {
    pointLight.intensity -= 10;
  }

  if (pointLightDirectionBackward === true) {
    pointLight.intensity += 5;
  }
}

// --- init & events -------------------------------------------------
var raycaster = new THREE.Raycaster();
var intersects;

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);

//createFloor();
createLights()
//render();

animate();
//console.dir(scene.children);

function onDocumentMouseMove(event) {
  event.preventDefault();

  // console.log(renderer.domElement.getBoundingClientRect());
  // console.log(renderer.domElement.width);
  var rect = renderer.domElement.getBoundingClientRect() // abs. size of element
       scaleX = renderer.domElement.width   // relationship bitmap vs. element for X
  //     scaleY = renderer.domElement.height 
  mouse.x = ((event.clientX - rect.left)/ scaleX) * 2 - 1;
  mouse.y = -((event.clientY - rect.top)/renderer.domElement.height) * 2 + 1;

  // console.log(event.clientX , event.clientY);
  // console.log(event.offsetX , event.offsetY);
  // mouse.x = (event.clientX  - event.target.offsetX / renderer.domElement.width) * 2 - 1;
  // mouse.y = -(event.clientY - event.target.offsetY / renderer.domElement.height) * 2 + 1;

  // mouse.unprojectVector(camera );   
  //      mouse.sub( camera.position );                
  //     mouse.normalize();

  //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function onDocumentMouseDown(event) {
  event.preventDefault();
// console.info('mouseDown');

var rect = renderer.domElement.getBoundingClientRect() // abs. size of element
scaleX = renderer.domElement.width   // relationship bitmap vs. element for X
//     scaleY = renderer.domElement.height 
mouse.x = ((event.clientX - rect.left)/ scaleX) * 2 - 1;
mouse.y = -((event.clientY - rect.top)/renderer.domElement.height) * 2 + 1;

  if (intersects.length > 0) {

    // console.info('mouse down intersect');
    // console.dir(intersects);
    
    let parentName = intersects[0].object.userData.parent;
console.log(parentName);
  
    if (parentName) {

      for (let c = 0; c < diamantsAll.length; c++) {
//console.dir(diamantsAll[c]);
        if (parentName === diamantsAll[c].name) {
//console.warn('HOVER BOOM!');
          diamantsAll[c].userData.blockHover = true;
          INTERSECTEDCLICK.push(diamantsAll[c]);
// console.log(intersected);
        }
      } //for

    } //if parentName 
  }
}

// function explode(INTERSECTED) {
//   const parentName = INTERSECTED.userData.parent;
// console.info(parentName);
  
//   if (parentName) {
    
//     for (let c = 0; c < diamantsAll.length; c++) {
// console.dir(diamantsAll[c]);
//       if (parentName === diamantsAll[c].name) {
// console.warn('BOOM!');
//        intersected.push(diamantsAll[c]);
// // console.log(intersected);
//       }
//     }
    
//   } //if parentName
// }

function modifyFins(fins, moveOut) {
  for (let f = 0; f < fins.length; f++) {
    const intersectedFin = fins[f].children[0];
//console.log(      intersectedFin.position.z);
    if (moveOut === true && finPosMax < intersectedFin.position.z) {
      intersectedFin.position.z -= 0.1;
    }
    
    if (moveOut === false && finPosMin > intersectedFin.position.z) {
      intersectedFin.position.z += 0.1;
    }
  }
}

function modifyLightBox(box, moveOut) {
//console.log(box.position.y, moveOut, pointLightPosMax);
  
  if (moveOut === true && pointLightPosMax > box.position.y) {
//console.log('up');
    box.position.y += 0.1;
  }

  if (moveOut === false && pointLightPosMin < box.position.y) {
    box.position.y -= 0.1;
  }
}

// FIXME: to make sure all animations are finished and we can remove EL from WASHOVERED use countdown till animations are finsihed, instead of adding EL to this func
function modifyBtm(el, btm, moveOut) {
  
//console.log(btm.position.y);
  
  if (moveOut === true && btmPosMax < btm.position.y) {
//console.log('up');
    btm.position.y -= 0.1;
  }

  if (moveOut === false && btmPosMin > btm.position.y) {
    btm.position.y += 0.1;
  }
  
  if (moveOut === false && btmPosMin <= btm.position.y) {
    removeFromArray(WASHOVERED, el);
  }

}

function onMouseOver(intersectedEl) {
  // console.info('onMouseOver');
  
  const sctdTopGroup = intersectedEl.children[0];
  const sctdBtm = intersectedEl.children[1];
  const sctdBoxGroup = intersectedEl.children[2];
  const sctdFins = sctdTopGroup.children[0].children;
//console.dir(sctdBoxGroup.name);

  modifyFins(sctdFins, true);
  modifyLightBox(sctdBoxGroup, true);
  modifyBtm(intersectedEl, sctdBtm, true);
}

function onMouseOut(intersectedEl) {
  // console.info('onMouseOut');
  
  const sctdTopGroup = intersectedEl.children[0];
  const sctdBtm = intersectedEl.children[1];
  const sctdBoxGroup = intersectedEl.children[2];
  const sctdFins = sctdTopGroup.children[0].children;
//console.dir(sctdFins.length);

  modifyFins(sctdFins, false);
  modifyLightBox(sctdBoxGroup, false);
  modifyBtm(intersectedEl, sctdBtm, false);
}

//remove el from array
function removeFromArray(array, el) {
  let index = array.indexOf(el);
  if (index > -1) {
// console.warn('removed: ' + el.name);
    array.splice(index, 1);
  }
}

// used for click
function animateDiamant(intersectedEl) {
  // console.info('animateDiamant');
  
  const sctdTopGroup = intersectedEl.children[0];
  const sctdBtm = intersectedEl.children[1];
  const sctdBoxGroup = intersectedEl.children[2];
  const sctdFins = sctdTopGroup.children[0].children;

  let currRotTop = Math.round(sctdTopGroup.rotation.y  / (Math.PI/180));
  if (180 > currRotTop) {
    sctdTopGroup.rotation.y += 5 * (Math.PI/180);
  } else {
    sctdTopGroup.rotation.y = 0;
    
    intersectedEl.userData.blockHover = false;
    removeFromArray(INTERSECTEDCLICK, intersectedEl);
  }

  let currRotBtm = Math.round(sctdBtm.rotation.y  / (Math.PI/180));
  if (180 > currRotBtm) {
    sctdBtm.rotation.y += 5 * (Math.PI/180);
  } else {
    sctdBtm.rotation.y = 0;
  }
}



function animate() {
  requestAnimationFrame(animate);
  controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
  stats.update();

  render();
}



function render() {
  
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children, true);
  
  
  fireWhenReady();
  
  //pointLightIntensity();
  
  
    
  // find intersections

// --- HOVER handling --------------------------------------
  if (intersects.length > 0) {
// console.dir(intersects);

    let parentName = intersects[0].object.userData.parent;
    let blockHover = intersects[0].object.userData.blockHover;
 // console.info(parentName);
  
    if (parentName && !blockHover) {

      for (let c = 0; c < diamantsAll.length; c++) {
        let el = diamantsAll[c];
  // console.dir(diamantsAll[c]);
        if (parentName === el.name) {
  // console.warn('HOVER BOOM!');
          
          // only push into array if it's not already in!
          if (-1 === INTERSECTEDHOVER.indexOf(el)) {
            INTERSECTEDHOVER.push(el);          
          }

        }
      }

    } //if parentName

  } else {

    if (0 < INTERSECTEDHOVER.length) {
      //get last element
        let lastEl = INTERSECTEDHOVER[INTERSECTEDHOVER.length - 1];
// console.info(lastEl.name);
        INTERSECTEDHOVER.pop();
        WASHOVERED.push(lastEl);
    }

  }

  if (0 < INTERSECTEDHOVER.length) {
    for (let c = 0; c < INTERSECTEDHOVER.length; c++) {
      onMouseOver(INTERSECTEDHOVER[c]);
    } //for
  }
  
  if (0 < WASHOVERED.length) {
// console.dir(WASHOVERED);
    for (let c = 0; c < WASHOVERED.length; c++) {
// console.warn(WASHOVERED[c].name);
      onMouseOut(WASHOVERED[c]);
    } //for
  }

  if (0 < INTERSECTEDCLICK.length) {
// console.dir(INTERSECTEDCLICK);
    for (let c = 0; c < INTERSECTEDCLICK.length; c++) {
      animateDiamant(INTERSECTEDCLICK[c]);
    } //for
  }
  
  renderer.render(scene, camera);
}
