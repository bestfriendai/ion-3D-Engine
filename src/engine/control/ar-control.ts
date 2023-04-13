import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { defaultPersonHeight, zIndex } from '../../core/constants';
import { resetCameraPosition } from '../../core/utils/utils';
import { toggleShowInstructions } from '../utils';


export class ARControls {
    camera: any;
    renderer: any;
    arButtonElm: any;
    scene: any;
    engine: any;

    
    constructor(engine, scene, camera, renderer){
        this.engine = engine;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.initWebXR();
    }


    initWebXR = () => {
        this.initARButton();

        this.renderer.xr.addEventListener( 'sessionstart', () => {
            console.info('AR Session starting...');
            // this.setARCameraPosition(this.camera.position, 0, this.camera.rotation);
        });

    }


    initARButton = () => {

        
    }

}
