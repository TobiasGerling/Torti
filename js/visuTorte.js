

var scene3d = document.getElementById("scene3d");
var CANVAS_WIDTH = scene3d.clientWidth;
var CANVAS_HEIGHT = scene3d.clientHeight;
var allCakes = [];
var layerArray = [];
var cakePath = "";
const tortendurchmesser = 3;
const tortenhoehe = 39.8;
const rotationSpeed = 0.005;
var currentColorLayer1 = "#37eddb";
var colorInputLayer1;
var currentColorLayer2 = "#37eddb";
var colorInputLayer2;
var currentColorLayer3 = "#37eddb";
var colorInputLayer3;
var cakeSelection = document.getElementById("cakeSelection");




// Defining a variable for our two models
var layer1;
var layer1Rim;
var layer2;
var layer2Rim;
var layer3;
var layer3Rim;
var layer3Group = new THREE.Group();
var layer2Group = new THREE.Group();
var layer1Group = new THREE.Group();
var animationFrame;




window.addEventListener("load", startup, false);


// SCENE

scene = new THREE.Scene();

// CAMERA 

camera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 120;
camera.position.z = 200;



// LIGHTNING
const light = new THREE.HemisphereLight(0xffffff, 1)
light.position.set(0, 50, 60)

scene.add(light)

// RENDERER

renderer = new THREE.WebGLRenderer();

renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
renderer.setClearColor("#DDDDDD")
scene3d.appendChild(renderer.domElement);

//STARTUP


function startup(){

  //allCakes.json ist eine Liste aller Kuchen die aktuell auf dem Server gespeichert sind. 
  fetchAllCakesOnServer()
  



   

    /* Eventlistener fuer ColorPicker werden angemeldet  */
    colorPickerLayer1 = document.getElementById("colorPickerLayer1");
    colorPickerLayer1.addEventListener("change", updateLayer1, false);

    colorPickerLayer2 = document.getElementById("colorPickerLayer2");
    colorPickerLayer2.addEventListener("change", updateLayer2, false);

    colorPickerLayer3 = document.getElementById("colorPickerLayer3");
    colorPickerLayer3.addEventListener("change", updateLayer3, false);
}

//Methode update all wird bei immer aufgerufen wenn der ColorPicker geschlossen wird
function updateLayer1(){
    currentColor = event.target.value;

    layer1.setColor(currentColor);
  }

  function updateLayer2(){
    currentColor = event.target.value;

    layer2.setColor(currentColor);
  }

  function updateLayer3(){
    currentColor = event.target.value;

    layer3.setColor(currentColor);
  }




// GEOMETRY & MATERIALS

function draw(currentlySelectedCake){
// Load  Cake
var cakeLoader = new THREE.MTLLoader();
var element1Path1 = "uploads/" +currentlySelectedCake + "/Element1.mtl";
var element1Path2 = "uploads/" +currentlySelectedCake + "/Element1.obj";
var element2Path1 = "uploads/" +currentlySelectedCake + "/Element2.mtl";
var element2Path2 = "uploads/" +currentlySelectedCake + "/Element2.obj";
cakeLoader.load(element1Path1, function (materials) {    
    materials.preload();

    // Load the Cake
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(element1Path2 , function (object) {
        
        layer1 = object.clone();
        layer2 = object.clone(); 
        layer3 = object.clone();


        

        layer1.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
            }
          });

          layer2.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
            }
          });

          layer3.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
            }
          });

        layer2.position.y = tortenhoehe;
        layer3.position.y = tortenhoehe*2*0.75;

     
        camera.lookAt(layer2.position);
        
       

    });

    


});

// Load a Dekor
var dekoLoader = new THREE.MTLLoader();

dekoLoader.load(element2Path1, function (materials) {    
    materials.preload();

    // Load the Cake
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(element2Path2, function (object) {
        
        layer1Rim = object.clone();
        layer2Rim = object.clone(); 
        layer3Rim = object.clone();

       

        layer1Rim.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
            }
          });

          layer2Rim.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
            }
          });

          layer3Rim.traverse((child) => {
            if (child.isMesh) {
              child.material = child.material.clone();
            }
          });

        layer2Rim.position.y = tortenhoehe;
        layer3Rim.position.y = tortenhoehe*2*0.75;

     
        camera.lookAt(layer2.position);
        
       

    });

    


});

}

// FINISH SCENE SETUP
function animate(){


    

    animationFrame = requestAnimationFrame(animate);
    
    if(layer1Group != null){
        layer1Group.rotation.y += rotationSpeed;
        
        setColor(layer1);
           
    }

    if(layer2Group != null){
        layer2Group.rotation.y += rotationSpeed;
        setColor(layer2);
        scaleObject(layer2,0.75,0.5,0.75);        
        scaleObject(layer2Rim,0.75,0.5,0.75);        
    }

    if(layer3Group != null){
        layer3Group.rotation.y += rotationSpeed;
        setColor(layer3);
        scaleObject(layer3, 0.5,0.25,0.5);        
        scaleObject(layer3Rim, 0.5,0.25,0.5);        
    }
 
    
    renderer.render(scene, camera);

   
}


function showLayers(){
    
    if (layerArray.length == 2) {
    
        
        layer3Group.add(layer3)
        layer3Group.add(layer3Rim)
        layer3Group.name = "Layer3"
        
        layerArray.push(layer3Group);
        
       
        }
    if (layerArray.length == 1) {

        
        layer2Group.add(layer2)
        layer2Group.add(layer2Rim)
        layer2Group.name = "Layer2"

        layerArray.push(layer2Group);
       
    }
    if (layerArray.length == 0) {


        layer1Group.add(layer1)
        layer1Group.add(layer1Rim)
        layer1Group.name = "Layer1"

        layerArray.push(layer1Group);
       
    }

    drawLayers();
    
}

function deleteLayer(){

    var objectName = layerArray[layerArray.length-1].name;
   
    var currentObject = scene.getObjectByName(objectName);
    scene.remove(currentObject);

    layerArray.pop(); 

    cancelAnimationFrame(animationFrame);
    animate();
}


function drawLayers(){

    layerArray.forEach(element => {
        
        var objectInScene = scene.getObjectByName(element.name);

        if(objectInScene == null) {
            scene.add(element);

        }
    });

    cancelAnimationFrame(animationFrame);
    animate();
}

function setColor(object){

    object.setColor = function(color){
        object.traverse((child) => {
            if (child.isMesh) {
              child.material.color.set(color);
            }
          });
}

}

function scaleObject(object,x,y,z){
       object.scale.set(x,y,z);
    }


function fetchAllCakesOnServer(){

  fetch('allCakesJSON.json')
  .then(response => response.json())
  .then(function(data){
    
    allCakes=data;
    allCakes.splice(0,2);
    populateCakeSelection()
  });

  
}

function populateCakeSelection(){
 
  
  allCakes.forEach(option => {
    var eintrag = document.createElement("option");
    eintrag.textContent = option;
    eintrag.value = option;
    cakeSelection.appendChild(eintrag);
    
  });
}

function selectionChanged(){
 var currentlySelectedCake = cakeSelection.value;
 draw(currentlySelectedCake);
}






