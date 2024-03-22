import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
// import { Inspector } from '@babylonjs/inspector';
import * as GUI from '@babylonjs/gui/2D';

const canvas = document.getElementById('renderCanvas');

export const engine = new BABYLON.Engine(canvas);

// Global Mannequin colour variable
var shade  = new BABYLON.Color3(0.93,.909,.8667)

// Global slider value variables
var weight_value = 0
var height_value=0
var weightSlider 
var heightSlider
// Global sari component variables
var blouse1
var blouse2
var blouse3
var blouse4


export const createScene = async function() {

  //Creating scene
  const scene = new BABYLON.Scene(engine);
  scene.createDefaultLight(1,1,1);
  const camera = new BABYLON.ArcRotateCamera("camera",Math.PI/2, 4, 5, new BABYLON.Vector3(3, 3,1),scene);
  camera.setTarget(new BABYLON.Vector3(0, 0.9, 0));
  camera.attachControl(true);
  scene.collisionsEnabled = true

  //Camera angle range
  camera.lowerBetaLimit = 1.3;
  camera.upperBetaLimit = Math.PI/2;
  camera.lowerRadiusLimit = 2
  camera.upperRadiusLimit = 5
  
  
  //GUI for sliders
  var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const panel = new GUI.StackPanel();
  panel.width = "220px";
  panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  const panel2 = new GUI.StackPanel();
  panel2.width = "220px";
  panel2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel2.paddingTop =400;
  panel.paddingTop=200;
  advancedTexture.addControl(panel);
  advancedTexture.addControl(panel2);



//Dome
const dome = BABYLON.SceneLoader.ImportMesh(
    '',
    './',
    'TT_DOME_01.glb',
    scene,
    function(meshes){
      const mesh1 = meshes[0]
      const mesh2 = meshes[1]

      const dome_mat = mesh2.material
      dome_mat.albedoTexture = new BABYLON.Texture("TT_DOME_02.jpg",scene);
      mesh2.material = dome_mat
      dome_mat.albedoTexture.uAng = Math.PI
      dome_mat.unlit = true
      mesh1.position = new BABYLON.Vector3(5.22,0.05,-0.46)

      var button4 = GUI.Button.CreateSimpleButton("but4", "showroom");
      button4.width = 0.1;
      button4.height = 0.07;
      button4.color = "white";
      button4.fontSize = 15;
      // button1.background = "green";
      button4.onPointerUpObservable.add(function() {
        dome_mat.albedoTexture = new BABYLON.Texture("TT_DOME_01.jpg",scene);  
        setDomeTexture("TT_DOME_01.jpg",scene)        
        mesh1.position = new BABYLON.Vector3(0.21,0.05,0.47)
        button4.color = "black"
        button5.color = "white"
      });
      button4.left = -600
      advancedTexture2.addControl(button4);

      var button5 = GUI.Button.CreateSimpleButton("but5", "Studio");
      button5.width = 0.1;
      button5.height = 0.07;
      button5.color = "black";
      button5.fontSize = 15;
      // button1.background = "green";
      button5.onPointerUpObservable.add(function() {
        dome_mat.albedoTexture = new BABYLON.Texture("TT_DOME_02.jpg",scene);   
        setDomeTexture("TT_DOME_02.jpg",scene)    
        button4.color = "white"
        button5.color = "black"
        mesh1.position = new BABYLON.Vector3(5.22,0.05,-0.46)  
      });
      button5.left =  -600
      button5.top = 100
      advancedTexture2.addControl(button5);
          
      
    }
)


  const Mannequin = await BABYLON.SceneLoader.ImportMeshAsync(
    '',
    './',
    'model (1).glb',
    scene)
  const mannequin = Mannequin
  const meshes = mannequin.meshes
  var root = meshes[0]
  const sari1 = meshes[1]
  const sari2 = meshes[2]
  const sari3 = meshes[3]
  const sari4 = meshes[4]
  const body = meshes[5]
  
  var angle = 0.005;
  var axis = new BABYLON.Vector3(0,1,0);
  scene.registerAfterRender(function () { 
    root.rotate(axis, angle, BABYLON.Space.WORLD);
    });
  
   //Sliders
    weightSlider = new GUI.Slider();
    weightSlider.minimum = 0;
    weightSlider.maximum = 0.7;
    weightSlider.value = weight_value;
    weightSlider.height = "15px";
    weightSlider.width = "200px";
    weightSlider.step = 0.01

    weightSlider.onValueChangedObservable.add(function(value) {
      setWeight(value,scene)
      //Changes overweight morph targets for sarees and mannequin 
      weight_value = value
    });

    //Mannequin height sliders
    heightSlider = new GUI.Slider();
    heightSlider.minimum = 0.98;
    heightSlider.maximum = 1.02;
    heightSlider.value = height_value;
    heightSlider.height = "100px";
    heightSlider.width = "15px";
    heightSlider.step = -0.0001
    heightSlider.isVertical = true;

    //Scale mannequin
    heightSlider.onValueChangedObservable.add(function(value) {
      setHeight(value,scene)
    });

    // Control panels
    panel2.addControl(heightSlider);
    panel.addControl(weightSlider)

   //Initializing sari component textures
  var sari1_mat = sari1.material
  var sari2_mat = sari2.material
  var sari3_mat = sari3.material
  var sari4_mat = sari4.material
  sari1_mat.albedoTexture = blouse1
  sari2_mat.albedoTexture = blouse2
  sari3_mat.albedoTexture = blouse3
  sari4_mat.albedoTexture = blouse4

  //Default mannequin material colour
  scene.materials[1]['_albedoColor'] = shade

  var button1 = GUI.Button.CreateSimpleButton("but1", "saree 2");
  button1.width = 0.1;
  button1.height = 0.07;
  button1.color = "white";
  button1.fontSize = 15;
  // button1.background = "green";
  button1.onPointerUpObservable.add(function() {   
    button1.color = "black"
    button2.color = "white"
    button3.color = "white"
    setSariTexture("sari2",scene)
          
  });
  button1.top = 325
  advancedTexture2.addControl(button1);

  var button2 = GUI.Button.CreateSimpleButton("but2", "saree 3");
  button2.width = 0.09;
  button2.height = 0.07;
  button2.color = "white";
  button2.fontSize = 15;
  button2.onPointerUpObservable.add(function() {
    button1.color = "white"
    button2.color = "black"
    button3.color = "white"
    setSariTexture("sari3",scene)
  });
  button2.left = 200
  button2.top = 325
  advancedTexture2.addControl(button2);
    


  var button3 = GUI.Button.CreateSimpleButton("but2", "saree 1");
  button3.width = 0.09;
  button3.height = 0.07;
  button3.color = "white";
  button3.fontSize = 15;
  // button3.background = "green";
  button3.onPointerUpObservable.add(function() {
    button1.color = "white"
    button2.color = "white"
    button3.color = "black"
    setSariTexture("sari1",scene)
  });
  button3.left = -200
  button3.top = 325
  button2.color = "black"
  advancedTexture2.addControl(button3);

  // const meshes = mannequin.meshes

  // const root = meshes[0]
  //     const sari1 = meshes[1]
  //     const sari2 = meshes[2]
  //     const sari3 = meshes[3]
  //     const sari4 = meshes[4]
  //     const body = meshes[5]

  //     // Initializing sari component textures
  //     var sari1_mat = sari1.material
  //     var sari2_mat = sari2.material
  //     var sari3_mat = sari3.material
  //     var sari4_mat = sari4.material
  //     sari1_mat.albedoTexture = blouse1
  //     sari2_mat.albedoTexture = blouse2
  //     sari3_mat.albedoTexture = blouse3
  //     sari4_mat.albedoTexture = blouse4


  //     //Sliders
  //     var weightSlider = new GUI.Slider();
  //     weightSlider.minimum = -1;
  //     weightSlider.maximum = 0.7;
  //     weightSlider.value = weight_value;
  //     weightSlider.height = "15px";
  //     weightSlider.width = "200px";
  //     weightSlider.step = 0.01

  //     weightSlider.onValueChangedObservable.add(function(value) {
  //       //Changes overweight morph targets for sarees and mannequin 
  //       weight_value = value
  //       if (value>=0){ 
  //           // header.text = ("Weight: " + parseInt(value*114))
  //           body.morphTargetManager.getTarget(1).influence = weight_value;
  //           sari1.morphTargetManager.getTarget(1).influence =weight_value;
  //           sari2.morphTargetManager.getTarget(1).influence =weight_value;
  //           sari3.morphTargetManager.getTarget(1).influence =weight_value;
  //           sari4.morphTargetManager.getTarget(1).influence =weight_value;

  //       //Changes underweight morph targets for sarees and mannequin  
  //       }else{ 
  //         weight_value = -value
  //         weightSlider.step = -0.01
  //         // header.text = ("Weight: " + (value*40)) ;
  //         body.morphTargetManager.getTarget(2).influence = weight_value;
  //         sari1.morphTargetManager.getTarget(0).influence =weight_value;
  //         sari2.morphTargetManager.getTarget(0).influence =weight_value;
  //         sari3.morphTargetManager.getTarget(0).influence =weight_value;
  //         sari4.morphTargetManager.getTarget(0).influence =weight_value;
  //       }
  //     });

  //     //Mannequin height sliders
  //     var heightSlider = new GUI.Slider();
  //     heightSlider.minimum = 0.98;
  //     heightSlider.maximum = 1.02;
  //     heightSlider.value = height_value;
  //     heightSlider.height = "100px";
  //     heightSlider.width = "15px";
  //     heightSlider.step = -0.0001
  //     heightSlider.isVertical = true;

  //     //Scale mannequin
  //     heightSlider.onValueChangedObservable.add(function(value) {
  //       height_value = value
  //       header2.text = ("height: " + value);
  //       root.scaling.y = height_value;
  //       root.scaling.x = height_value;
  //       root.scaling.z = -height_value;
  //     });

  //   // Control panels
  //   panel2.addControl(heightSlider);
  //   panel.addControl(weightSlider)

   
  //   //Default mannequin material colour
  //   scene.materials[5]['_albedoColor'] = shade

  // var button1 = GUI.Button.CreateSimpleButton("but1", "saree 2");
  // button1.width = 0.1;
  // button1.height = 0.07;
  // button1.color = "white";
  // button1.fontSize = 15;
  // // button1.background = "green";
  // button1.onPointerUpObservable.add(function() {
  //   setSariTexture("sari2",scene)
    
              
  // });
  // button1.top = 325
  // advancedTexture2.addControl(button1);

  return scene;
}

var scene =  await createScene();

/**Change Mannequin colour
 * r,g,b : number
 * returns Color3 object
 **/
export function setMannequinColor(r,g,b) {
  scene.materials[1]['_albedoColor'] = new BABYLON.Color3(r/255,g/255,b/255)
  shade = new BABYLON.Color3(r,g,b)
  return shade;
}

export function setHeight(value,scene) {
  var meshes  = scene.meshes
  var root= meshes[2]
  heightSlider.value = value
  heightSlider.onValueChangedObservable.add(function(value) {
    height_value = value
    root.scaling.y = height_value;
    root.scaling.x = height_value;
    root.scaling.z = -height_value;
  });
}

export function setWeight(value,scene) {
  var meshes  = scene.meshes
  const sari1 = meshes[4]
  const sari2 = meshes[5]
  const sari3 = meshes[6]
  const sari4 = meshes[7]
  const body = meshes[3]
  console.log(body.morphTargetManager)
  weightSlider.value = value
  weightSlider.onValueChangedObservable.add(function(value) {
    //Changes overweight morph targets for sarees and mannequin 
    weight_value = value
    // if (value>=0){ 
        // header.text = ("Weight: " + parseInt(value*114))
        body.morphTargetManager.getTarget(1).influence = value;
        sari1.morphTargetManager.getTarget(1).influence =value;
        sari2.morphTargetManager.getTarget(1).influence =value;
        sari3.morphTargetManager.getTarget(1).influence =value;
        sari4.morphTargetManager.getTarget(1).influence =value;
  
  }) 
}


export function setDomeTexture(dome_type,scene) {
  const dome_mat = scene.meshes[1].material
  dome_mat.albedoTexture = new BABYLON.Texture(dome_type,scene)
  dome_mat.albedoTexture.uAng = Math.PI
  scene.meshes[1].material = dome_mat
}

/**Change sari colours
 * sari_type : string 
 * scene : BABYLON.Scene
**/
export function setSariTexture(sari_type,scene) { 
  scene.materials[2]['_albedoTexture'] = new BABYLON.Texture("./Taneira/"+sari_type+"/Inner_Design_DM.jpg",scene);
  scene.materials[3]['_albedoTexture'] = new BABYLON.Texture("./Taneira/"+sari_type+"/Pallu_DM.png",scene);
  scene.materials[4]['_albedoTexture'] = new BABYLON.Texture("./Taneira/"+sari_type+"/Blouse_DM.jpg",scene);
  scene.materials[5]['_albedoTexture'] = new BABYLON.Texture("./Taneira/"+sari_type+"/Blouse_Border_DM.jpg",scene);

}
setSariTexture("sari3",scene)


// Hex to RGB values
function hexToRgbA(hex) {
  var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16)
  };
}

// Frontened communication
window.onmessage = async function(e) {
  if (e.data.id == "execute-sceneSetup") {
    scene = await createScene()
    }
  else if(e.data.id == "execute-configureManequinn") {
    
    if (e.data.args.category =="shade") {
      var color  = hexToRgbA(e.data.args.value)
      console.log(color['r'],color['g'],color['b'])
      setMannequinColor(color['r'],color['g'],color['b'])
    } 
    else if (e.data.args.category == 'mannequin'){
      var saree = e.data.args.value.textureID
      setSariTexture(saree,scene)
    }
    else if (e.data.args.category == 'weight'){
      var weight = e.data.args.value
      setWeight(weight,scene)
    }
    else if (e.data.args.category == 'height'){
      var height = e.data.args.value
      setHeight(height,scene)
    }
  }
};


// Acknowledgement messages

// window.top.postMessage({
//   "id":"execute-configureManequinn",
//   "args":{
//      "category":"shade",
//      "value":"#debc47"
//   }
// }, '*')


engine.runRenderLoop(function(){
  scene.render();
});

window.addEventListener('resize', function(){
  engine.resize();
});


// scene explorer
// Inspector.Show(scene, {});