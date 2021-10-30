

var scene3d = document.getElementById("scene3d");
var CANVAS_WIDTH = scene3d.clientWidth;
var CANVAS_HEIGHT = scene3d.clientHeight;
var allCakes = [];
var currentCakeElements = [];
var layerArray = [];
var cakePath = "";
const tortendurchmesser = 3;
const tortenhoehe = 39.8;
const rotationSpeed = 0.005;
var colorInputLayer1;
var colorInputLayer2;
var colorInputLayer3;
var cakeSelection = document.getElementById("cakeSelection");
var cakeSelectionForm = document.getElementById("cakeSelectionForm");
var layer1Elements = [];
var layer2Elements = [];
var layer3Elements = [];






// Defining a variable for our two models
var layer1;
var layer2;
var layer3;
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
  fetchAllCakesOnServer();

  

  

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
    layer1Elements[0].setColor(currentColor);

  }

  function updateLayer2(){
    currentColor = event.target.value;
    layer2Elements[0].setColor(currentColor);

  }

  function updateLayer3(){
    currentColor = event.target.value;
    layer3Elements[0].setColor(currentColor);

  }




// GEOMETRY & MATERIALS

function objectLoader(i, materialPath, objectPath){
  
  
  var cakeLoader = new THREE.MTLLoader();
  
  

  cakeLoader.load(materialPath, function (materials) { 
 
    materials.preload();

    // Load the Cake
    var objLoader = new THREE.OBJLoader(manager);
    objLoader.setMaterials(materials);
    objLoader.load(objectPath , function (object) {

      layer1 = object.clone();
      layer2 = object.clone(); 
      layer3 = object.clone();

      layer1.name = "Layer1Part" + i;
      layer2.name = "Layer2Part" + i;
      layer3.name = "Layer3Part" + i;



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

        layer1Elements.push(layer1);      
        layer2Elements.push(layer2);
        layer3Elements.push(layer3);


      layer2.position.y = tortenhoehe;
      layer3.position.y = tortenhoehe*2*0.75;

      scaleObject(layer2,0.75,0.5,0.75);
      scaleObject(layer3, 0.5,0.25,0.5); 

   
      camera.lookAt(layer2.position);
     
  });
 
});


}

function draw(currentlySelectedCake){

layerArray = [];
// Load  Cake

var i;

for (i = 0; i < currentCakeElements.length; i+=1){

  if(currentCakeElements[i].endsWith(".mtl")){

    var materialPath = "uploads/" + currentlySelectedCake + "/" + currentCakeElements[i];
    var objectPath = "uploads/" + currentlySelectedCake + "/" + currentCakeElements[i+1];

    objectLoader(i, materialPath, objectPath);
  }
 
}



}

// FINISH SCENE SETUP


//Array welches die die aktuell sichtbaren Layers beinhalten. Wird eine Layer geloescht wird diese aus diesem Array herausgenommen
function showLayers(){
    
    if (layerArray.length == 2) {
    
        
 
        layerArray.push(layer3Elements);
        
       
        }
    if (layerArray.length == 1) {



        layerArray.push(layer2Elements);
       
    }
    if (layerArray.length == 0) {



        layerArray.push(layer1Elements);
       
    }

    drawLayers();
    
}

function deleteLayer(){
  var todeleteElementIndex = layerArray.length -1; 
   layerArray[todeleteElementIndex].forEach(element => {
    var objectInScene = scene.getObjectByName(element.name);
    scene.remove(objectInScene);
 }); 


  layerArray.pop(); 
  
}

function deleteAllLayers(){
  layerArray.forEach(layer => {
    layer.forEach(element => {
      scene.remove(scene.getObjectByName(element.name));
      
    });
    
  });
layerArray = [];
layer1Elements = [];
layer2Elements = [];
layer3Elements = [];
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

  deleteAllLayers();

var currentlySelectedCake = cakeSelection.value; 
//Form Data wird benoetigt um grosse Mengen an Daten per "$_POST["currentlySelectedCake"];" in PHP abzurufen 
var formData = new FormData();
formData.append("currentlySelectedCake", currentlySelectedCake);

 fetch("test.php", {
  method: 'POST',
  body: formData,
}).then((response) => {
  
  fetchCurrentCakeElements(currentlySelectedCake);
})
  

}

function fetchCurrentCakeElements(currentlySelectedCake){
 fetch('currentCakeElements.json')
  .then(response => response.json())
  .then(function(data){
    
    currentCakeElements=data;
    currentCakeElements.splice(0,2);
    draw(currentlySelectedCake);
    
  });
}



function drawLayers(){

  layerArray.forEach(layer => {
      
      layer.forEach((element, index) => {
        var objectInScene = scene.getObjectByName(element.name);
        if(index == 0){
          
          setColor(element);
        }
        if(objectInScene == null) {
            
            scene.add(element);
            

        }
    });
        
      });
      

  cancelAnimationFrame(animationFrame);
  animate();
}
function animate(){

  animationFrame = requestAnimationFrame(animate);
  layerArray.forEach(layer => {

    
        
    layer.forEach((element, index) => {

      element.rotation.y += rotationSpeed;
    });
       /*  setColor(layer1); */ 
           
    });

  
  
  renderer.render(scene, camera);

 
}


