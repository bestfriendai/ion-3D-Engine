import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


import * as ION from '../../../src/ion-3d-engine';
// import * as ION from 'ion-3d-engine';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


ION.showLoadingScreen();


window.addEventListener('load', () => {




  const scene = new THREE.Scene();
  scene.background = new THREE.Color( '#a3a3a3' );
  scene.fog = new THREE.Fog( '#a3a3a3', 10, 200 );

  const ground = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshPhongMaterial( { color: '#a1a1a1', depthWrite: false } ) );
  ground.rotation.x = - Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add( ground );


  const light = new THREE.AmbientLight( '#ffffff', 0.35);
  scene.add( light );


  const hemiLight = new THREE.HemisphereLight( 0xffffff, '#8e8d8d' , 0.9);
  hemiLight.position.set( 0, 10, 0 );
  scene.add( hemiLight );


  const light1 = new THREE.PointLight( '#f1efdd', 1.2, 100 );
  light1.position.set( 10, 26, 22 );
  light1.castShadow = true;
  scene.add( light1 );







  /* Engine: */
  const canvas = document.getElementById('viewport');
  const engine = new ION.Engine({
      canvas: canvas,
      fullScreen: true,
      scene,
      control: ION.SpaceControl,

      controlOptions: {
        vrTeleportEnabled: true,
        vrTeleportList: [ground],
        framebufferScaleFactor: 2,
        showInstructions: false,
        personHeight: 4,
      },
      
      stats: true,
      statsOptions: {
        stats3D: false,
      },

      vrEnabled: true,
      graphicsOptions: {
          shadowMapEnabled: false,
          shadowMapType: THREE.PCFShadowMap,
          // outputEncoding: THREE.sRGBEncoding, 
          // toneMapping: THREE.LinearToneMapping,
          // physicallyCorrectLights: true,
      },

  });




  // const statsComponent = engine.engineStats.statsEntity.getComponent(ION.GUI_COMPONENT_TYPE);

  // engine.setRuntimeCallback(() => {
  //   ION.positionInFront(engine.camera, statsComponent, -2, 2, -6);
  // });

  // engine.camera.position.set(-3, 4, 13);
  // engine.camera.rotateY(-Math.PI/7);

  // engine.vrControl.vrButtonElm.addEventListener('click', () => {
  //   engine.camera.position.set(-11, 4, 5);
  // });


  const canvasContainerElement = document.getElementById('canvas-container');
  const canvasGuiComponent = new ION.GUIComponent({
      rootElement: canvasContainerElement,
      pixelRatio: 120,
  });
  // canvasGuiComponent.position.set(1.61, 3.12, 9.446);
  // canvasGuiComponent.rotateY(-Math.PI/4.5);
  // canvasGuiComponent.rotateX(-Math.PI/13);
  // canvasGuiComponent.scale.set(0.65, 0.65, 0.65);

  /* Entity */
  const canvasGuiEntity = new ION.Entity();
  canvasGuiEntity.addComponent(canvasGuiComponent);
  engine.addEntity(canvasGuiEntity);

  

  const toolbarElement = document.getElementById('toolbar');
  const toolbarGuiComponent = new ION.GUIComponent({
      rootElement: toolbarElement,
      pixelRatio: 120,
  });
  toolbarGuiComponent.position.set(2.9, 3.12, 10.9);
  toolbarGuiComponent.rotateY(-Math.PI/3);
  toolbarGuiComponent.rotateX(-Math.PI/28);
  toolbarGuiComponent.scale.set(0.65, 0.65, 0.65);

  /* Entity */
  const toolbarGuiEntity = new ION.Entity();
  toolbarGuiEntity.addComponent(toolbarGuiComponent);
  engine.addEntity(toolbarGuiEntity);





  // https://threejs.org/manual/en/primitives.html#Diagram-CylinderGeometry

  const radiusTop =  10.0;  
  const radiusBottom =  10.0;  
  const height =  5.0;  
  const radialSegments = 11;  
  const heightSegments =  1;  
  const openEnded = true;  
  const thetaStart = Math.PI * 0.20;  
  const thetaLength = Math.PI * 0.30;  
  const geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height,
    radialSegments, heightSegments,
    openEnded,
    thetaStart, thetaLength );


    canvasGuiComponent.setGeometry(geometry);










  /* System */
  const guiSystem = new ION.GUISystem();
  engine.addSystem(guiSystem);


  /* Engine Start */
  engine.start();



  ION.hideLoadingScreen();

});



