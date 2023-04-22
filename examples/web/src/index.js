import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


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


// ION.showLoadingScreen();


window.addEventListener('load', async () => {





  // Credit for background images goes to: polyhaven.com
  const setSceneBackground = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    scene.background = loader.load([
        './background/px.png',
        './background/nx.png',
        './background/py.png',
        './background/ny.png',
        './background/pz.png',
        './background/nz.png',
    ]);
  }




  



  






  const scene = new THREE.Scene();
  scene.background = new THREE.Color( '#a3a3a3' );
  setSceneBackground(scene);
  scene.fog = new THREE.Fog( '#a3a3a3', 10, 200 );

  // const ground = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshPhongMaterial( { color: '#a1a1a1', depthWrite: false } ) );
  // ground.rotation.x = - Math.PI / 2;
  // ground.position.y = 0;
  // ground.receiveShadow = true;
  // scene.add( ground );


  const light = new THREE.AmbientLight( '#ffffff', 0.35);
  scene.add( light );


  const hemiLight = new THREE.HemisphereLight( 0xffffff, '#8e8d8d' , 0.9);
  hemiLight.position.set( 0, 10, 0 );
  scene.add( hemiLight );


  const light1 = new THREE.PointLight( '#f1efdd', 0.5, 100 );
  light1.position.set( 10, 26, 22 );
  light1.castShadow = true;
  scene.add( light1 );






  // /* Adding other objects: */
  // const geometry1 = new THREE.BoxGeometry( 2, 2, 2 );
  // const material = new THREE.MeshStandardMaterial({ color: new THREE.Color('#e3f0fb') });
  // const cube = new THREE.Mesh( geometry1, material );
  // cube.position.set(-3, 1, -6);
  // cube.castShadow = true;
  // scene.add( cube );

  // const radius = 1;
  // const coneHeight = 2;
  // const coneRadialSegments = 22;
  // const coneGeometry = new THREE.ConeGeometry( radius, coneHeight, coneRadialSegments );
  // const coneMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('#e3bcc9') });
  // const cone = new THREE.Mesh( coneGeometry, coneMaterial );
  // cone.castShadow = true;
  // cone.position.set(2, 1, -5);
  // scene.add( cone );

  // const radiusTop1 = 1;
  // const radiusBottom1 = 1;
  // const cylinderHeight = 3;
  // const cylinderRadialSegments = 28;
  // const cylinderGeometry = new THREE.CylinderGeometry(radiusTop1, radiusBottom1, cylinderHeight, cylinderRadialSegments );
  // const cylinderMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('#e8fbd4') });
  // const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  // cylinder.castShadow = true;
  // cylinder.position.set(-19, 1.5, 0);
  // scene.add( cylinder );


  // const octaRadius = 1;
  // const octaGeometry = new THREE.OctahedronGeometry( octaRadius );
  // const octaMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('#7d9a9e') });
  // const octahedron = new THREE.Mesh( octaGeometry, octaMaterial );
  // octahedron.castShadow = true;
  // octahedron.position.set(-5, 0.57, 3);
  // octahedron.rotation.set(Math.PI/3.2, Math.PI/4, 0);
  // scene.add( octahedron );


  // const torusRadius = 1.4; 
  // const tubeRadius = 0.6;
  // const radialSegments1 = 8;
  // const tubularSegments = 24;
  // const torusGeometry = new THREE.TorusGeometry( torusRadius, tubeRadius, radialSegments1, tubularSegments );
  // const torusMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('#b1b092') });
  // const torus = new THREE.Mesh( torusGeometry, torusMaterial );
  // torus.castShadow = true;
  // torus.position.set(+4, 0.3, 5);
  // torus.rotateX(Math.PI/2);
  // scene.add( torus );
















  /* Engine: */
  const canvas = document.getElementById('viewport');
  const engine = new ION.Engine({
      canvas: canvas,
      fullScreen: true,
      scene,
      control: ION.SpaceControl,

      controlOptions: {
        vrTeleportEnabled: true,
        vrTeleportList: [],
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
          // outputEncoding: THREE.sRGBEncoding, // RGBADepthPacking
          // toneMapping: THREE.LinearToneMapping, // ACESFilmicToneMapping
          // physicallyCorrectLights: true,
      },

  });


  // engine.camera.position.set(3, 3.8, 3.2);
  engine.camera.rotateY(-Math.PI/0.7);
  



  // const statsComponent = engine.engineStats.statsEntity.getComponent(ION.GUI_COMPONENT_TYPE);

  // engine.setRuntimeCallback(() => {
  //   ION.positionInFront(engine.camera, statsComponent, -2, 2, -6);
  // });

  // engine.camera.position.set(-3, 4, 13);
  // engine.camera.rotateY(-Math.PI/7);

  // engine.vrControl.vrButtonElm.addEventListener('click', () => {
  //   engine.camera.position.set(-11, 4, 5);
  // });


  // const canvasContainerElement = document.getElementById('canvas-container');
  // const canvasGuiComponent = new ION.GUIComponent({
  //     rootElement: canvasContainerElement,
  //     pixelRatio: 120,
  // });
  // // canvasGuiComponent.position.set(1.61, 3.12, 9.446);
  // // canvasGuiComponent.rotateY(-Math.PI/4.5);
  // // canvasGuiComponent.rotateX(-Math.PI/13);
  // // canvasGuiComponent.scale.set(0.65, 0.65, 0.65);

  // /* Entity */
  // const canvasGuiEntity = new ION.Entity();
  // canvasGuiEntity.addComponent(canvasGuiComponent);
  // engine.addEntity(canvasGuiEntity);

  

  // const toolbarElement = document.getElementById('toolbar');
  // const toolbarGuiComponent = new ION.GUIComponent({
  //     rootElement: toolbarElement,
  //     pixelRatio: 120,
  // });
  // toolbarGuiComponent.position.set(2.9, 3.12, 10.9);
  // toolbarGuiComponent.rotateY(-Math.PI/3);
  // toolbarGuiComponent.rotateX(-Math.PI/28);
  // toolbarGuiComponent.scale.set(0.65, 0.65, 0.65);

  // /* Entity */
  // const toolbarGuiEntity = new ION.Entity();
  // toolbarGuiEntity.addComponent(toolbarGuiComponent);
  // engine.addEntity(toolbarGuiEntity);











  
  const mat2 = new THREE.MeshStandardMaterial({
    // color: '#fff', // no need
    side: THREE.DoubleSide,
    transparent: true,
    fog: false,
    
    // metalness: 0.01,
    // roughness: 0.8,
    // emissive: 0.1,
  });

  const mat = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 1,
    envMapIntensity: 0.9,
    clearcoat: 1,
    transparent: true,
    transmission: 1,
    opacity: 0.8,
    reflectivity: 0.2,
    side: THREE.DoubleSide,
    // color: new THREE.Color('#cccccc00'),
})

  const canvasContainerElement = document.getElementById('html-page-container');
  const canvasGuiComponent = new ION.GUIComponent({
      rootElement: canvasContainerElement,
      pixelRatio: 120,
      material: mat2,
    
      
      textureConstants: {
        // premultiplyAlpha: true,
        flipY: false,
        // minFilter: THREE.LinearFilter,
        // magFilter: THREE.LinearFilter,
        // generateMipmaps: true,

        // mapping: THREE.CubeRefractionMapping,
      },

  });
  canvasGuiComponent.position.set(-3, 5, 3);
  canvasGuiComponent.rotateY(-Math.PI/2);
  canvasGuiComponent.rotateZ(Math.PI);

  canvasGuiComponent.rotateY(-Math.PI/2);

  /* Entity */
  const canvasGuiEntity = new ION.Entity();
  canvasGuiEntity.addComponent(canvasGuiComponent);
  engine.addEntity(canvasGuiEntity);



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
    radiusTop, 
    radiusBottom, 
    height,
    radialSegments, 
    heightSegments,
    openEnded,
    thetaStart, 
    thetaLength );

  canvasGuiComponent.setGeometry(geometry);


  
  const bgMesh = new THREE.Mesh(geometry, mat);
  // bgMesh.scale.set(0.96, 0.96, 0.96);
  bgMesh.position.set(-3, 5, 3); //set(-3.5,4,2.5);
  bgMesh.rotateY(-Math.PI/2);
  bgMesh.rotateZ(Math.PI);

  bgMesh.rotateY(-Math.PI/2);

  scene.add(bgMesh);







  /* System */
  const guiSystem = new ION.GUISystem();
  engine.addSystem(guiSystem);


  /* Engine Start */
  engine.start();



  ION.hideLoadingScreen();

});



