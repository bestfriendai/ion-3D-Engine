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





  const canvas = document.querySelector('.webgl')
  
  const loader = new FBXLoader(loadingManager)
  const [laptop, obj1] = await Promise.all([
    loader.loadAsync('/laptop.fbx'),
    loader.loadAsync('/beanbag.fbx')
  ]).catch(error => { console.error(error) });
  
  let modelY = 6.4;
  let rotateX = Math.PI / 42;
  const scene = new THREE.Scene()


  const ground = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshPhongMaterial( { color: '#a1a1a1', depthWrite: false } ) );
  ground.rotation.x = - Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add( ground );

  
  scene.background = new THREE.Color(0x443333);
  scene.fog = new THREE.Fog(0x443333, -100, 76);
  //axes helper
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);
  
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
  scene.add(camera)
  
  //light--------------------------------------------
  const light = new THREE.PointLight(0x8B8181, 6, 70);
  light.position.set(40, 25, 24);
  scene.add(light);
  
  const leftPointLight = new THREE.PointLight(0x7F6C6C, 5, 70);
  leftPointLight.position.set(9, 15, -2.3);
  leftPointLight.castShadow = true
  leftPointLight.shadow.mapSize.set(1500, 1500)
  scene.add(leftPointLight);
  
  const PointLight = new THREE.PointLight(0x7F6C6C, 6, 80);
  PointLight.position.set(-3.2, 11, 4.2);
  scene.add(PointLight);
  
  const hemiLight = new THREE.HemisphereLight(0x443333, 0x111122, 5);
  scene.add(hemiLight);
  
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.ShadowMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    }),
  );
  plane.rotation.x = - Math.PI / 2;
  plane.scale.setScalar(200);
  plane.receiveShadow = true;
  scene.add(plane);
  
  //–renderer----------------------------------
  
  // /* ADDED COMMENT */
  // No need for creating your own animation loop and renderer, ion does it when you do: engine.start()
  // If you want to configure the ion renderer or enable shadowMap for example, you can set 
  // graphicsOptions: {
  //   shadowMapEnabled: true,
  //   shadowMapType: THREE.PCFShadowMap,
  //   outputEncoding: THREE.sRGBEncoding, 
  //   toneMapping: THREE.LinearToneMapping,
  //   physicallyCorrectLights: true,
  // },

  // For full doc visit: https://github.com/samrun0/ion-3D-Engine/wiki/API-Reference

  // So you can comment these:
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0xf8a5c2);
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  
  //----ion 3d
  const engine = new ION.Engine({
    canvas: canvas,
    /* ADDED COMMENT */
    // should set fullScreen: false, if making fullscreen after dblclick event
    fullScreen: true, 
    scene,
    controlOptions: {
      vrTeleportEnabled: false,
      vrTeleportList: [ground],
      framebufferScaleFactor: 2,
      showInstructions: false,
      personHeight: 4,
    },
    /* ADDED COMMENT */
    // Make sure you have the latest version of ION in which you can just select ION.OrbitControl option like below:
    // In case you want to access the control object: engine.control
    // For more control types like ION.SpaceControl please check the docs
    control: ION.SpaceControl,
    // camera: camera, // pass the camera to the engine so it knows about your custom camera
  });
  
  // engine.camera.position.set(3, 3.8, 3.2);
  engine.camera.rotation.y = -3
  
  //--------------controls------------------------
  const controls = new OrbitControls(engine.camera, canvas)
  controls.dampingFactor = 0.03
  controls.enableDamping = true
  controls.update()  


  /* Laptop Component */
  const rootElement = document.getElementsByClassName('main')[0];
  const guiComponent = new ION.GUIComponent({
  rootElement: rootElement,
    /* ADDED COMMENT */
    // this is number of pixels that will be equal to 1 ThreeJS world unit
    pixelRatio: 150
  });
  guiComponent.position.set(0.4, 3.8, 3.235); //increase z to stick
  guiComponent.rotation.x = 0.129
  guiComponent.rotation.y = 3.222
  guiComponent.rotation.z = 0.005
  // guiComponent.scale.set(1.3, 1.3, 1.3);
  
  /* Entity */
  const guiEntity = new ION.Entity();
  guiEntity.addComponent(guiComponent);
  engine.addEntity(guiEntity);
  
  /* System */
  const guiSystem = new ION.GUISystem();
  engine.addSystem(guiSystem);

  
  engine.start();
  
  //-----helpers-----------------------------------

  /* ADDED COMMENT */
  // by setting fullScreen: true, when instantiating the engine it does handle resize event so no need for this:
  // So you can comment these:
  // window.addEventListener('resize', () => {
  //   sizes.width = window.innerWidth
  //   sizes.height = window.innerHeight
  //   engine.camera.aspect = sizes.width / sizes.height
  //   engine.camera.updateProjectionMatrix()
  //   renderer.setSize(sizes.width, sizes.height)
  //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // });
  
  window.addEventListener('dblclick', () => {
    const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullScreenElement) {
    if (canvas.requestFullscreen)
      canvas.requestFullscreen()
    else if (canvas.webkitRequestFullscreen)
      canvas.webkitRequestFullscreen
    }
    else {
      document.exitFullscreen()
    }
  });


  const loadingManager = new THREE.LoadingManager()
  loadingManager.onStart = () => {
    console.log('texture load started')
  }
  loadingManager.onProgress = () => {
    console.log('model loading In progress')
  }
  loadingManager.onLoad = () => {
    console.log('all model loaded')
    engine.camera.position.set(0.4, 3.9, 2.3);
    engine.camera.rotation.x = 0.129
    engine.camera.rotation.y = 3.222
    engine.camera.rotation.z = -0.01
    // engine.control and by passing 
    // controls.target.x = 0.41
    // controls.target.y = 3.8
    // controls.target.z = 3
    // controls.update()
    scene.add(laptop, obj1)
  }
  loadingManager.onError = () => {
    console.log('model loading errored!!')
  }


  // /* ADDED COMMENT */
  // No need for creating your own animation loop and renderer, ion does it when you do: engine.start()
  // So you can comment these (even though it works...):
  const tick = () => {
  renderer.render(scene, engine.camera)
    window.requestAnimationFrame(tick)
  }
  tick()

  // You can call your functions or update anything you want in each frame by setting a runtime callback:
  engine.setRuntimeCallback(() => {
    // console.log('Running at each frame...');
  });
















  // const scene = new THREE.Scene();
  // scene.background = new THREE.Color( '#a3a3a3' );
  // scene.fog = new THREE.Fog( '#a3a3a3', 10, 200 );

  // const ground = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshPhongMaterial( { color: '#a1a1a1', depthWrite: false } ) );
  // ground.rotation.x = - Math.PI / 2;
  // ground.position.y = 0;
  // ground.receiveShadow = true;
  // scene.add( ground );


  // const light = new THREE.AmbientLight( '#ffffff', 0.35);
  // scene.add( light );


  // const hemiLight = new THREE.HemisphereLight( 0xffffff, '#8e8d8d' , 0.9);
  // hemiLight.position.set( 0, 10, 0 );
  // scene.add( hemiLight );


  // const light1 = new THREE.PointLight( '#f1efdd', 1.2, 100 );
  // light1.position.set( 10, 26, 22 );
  // light1.castShadow = true;
  // scene.add( light1 );










  // /* Engine: */
  // const canvas = document.getElementById('viewport');
  // const engine = new ION.Engine({
  //     canvas: canvas,
  //     fullScreen: true,
  //     scene,
  //     control: ION.SpaceControl,

  //     controlOptions: {
  //       vrTeleportEnabled: true,
  //       vrTeleportList: [ground],
  //       framebufferScaleFactor: 2,
  //       showInstructions: false,
  //       personHeight: 4,
  //     },
      
  //     stats: true,
  //     statsOptions: {
  //       stats3D: false,
  //     },

  //     vrEnabled: true,
  //     graphicsOptions: {
  //         shadowMapEnabled: false,
  //         shadowMapType: THREE.PCFShadowMap,
  //         // outputEncoding: THREE.sRGBEncoding, 
  //         // toneMapping: THREE.LinearToneMapping,
  //         // physicallyCorrectLights: true,
  //     },

  // });




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





  // const canvasContainerElement = document.getElementById('html-page-container');
  // const canvasGuiComponent = new ION.GUIComponent({
  //     rootElement: canvasContainerElement,
  //     pixelRatio: 120,
  // });
  // canvasGuiComponent.position.set(0,4,-5);

  // /* Entity */
  // const canvasGuiEntity = new ION.Entity();
  // canvasGuiEntity.addComponent(canvasGuiComponent);
  // // engine.addEntity(canvasGuiEntity);





  // // https://threejs.org/manual/en/primitives.html#Diagram-CylinderGeometry

  // const radiusTop =  10.0;  
  // const radiusBottom =  10.0;  
  // const height =  5.0;  
  // const radialSegments = 11;  
  // const heightSegments =  1;  
  // const openEnded = true;  
  // const thetaStart = Math.PI * 0.20;  
  // const thetaLength = Math.PI * 0.30;  
  // const geometry = new THREE.CylinderGeometry(
  //   radiusTop, radiusBottom, height,
  //   radialSegments, heightSegments,
  //   openEnded,
  //   thetaStart, thetaLength );


  //   canvasGuiComponent.setGeometry(geometry);










  // /* System */
  // const guiSystem = new ION.GUISystem();
  // engine.addSystem(guiSystem);


  /* Engine Start */
  // engine.start();



  ION.hideLoadingScreen();

});



