import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { defaultPersonHeight, zIndex } from '../../core/constants';
import { resetCameraPosition } from '../../core/utils/utils';
import { toggleShowInstructions } from '../utils';


export class VRControls {
    camera: any;
    renderer: any;
    vrTeleIntersectPoint: any;
    vrBaseReferenceSpace: any;
    tempMatrix: any;
    vrTeleObjects: any[];
    vrButtonElm: any;
    controller1: any;
    scene: any;
    controller2: any;
    controllerGrip1: any;
    controllerGrip2: any;
    vrRaycaster: any;
    teleMarkerMesh: any;
    vrSelectIntersects: any;
    engine: any;
    controller1Connected: boolean;
    controller2Connected: boolean;
    personHeight: number;
    vrPointerLength: any;

    
    constructor(engine, scene, camera, renderer){
        this.engine = engine;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        this.personHeight = this.engine.controlOptions.personHeight || 3;
        this.vrPointerLength = this.engine.controlOptions.vrPointerLength || 15;

        this.vrTeleIntersectPoint = null;
        
        this.vrBaseReferenceSpace = null;
        
        this.tempMatrix = new THREE.Matrix4();
        
        this.vrTeleObjects = []; // Objects to intersect and move around
        
        // this.vrSelectObjects = []; // Objects to intersect and click
        
        this.controller1Connected = false;
        this.controller2Connected = false;

        this.initWebXR();
    }


    initWebXR = () => {

        /* WebXR */
        
        this.initVRButton();


        this.renderer.xr.enabled = true;
        this.renderer.xr.addEventListener( 'sessionstart', () => {
            this.vrBaseReferenceSpace = this.renderer.xr.getReferenceSpace();
            console.info('VR Session starting...');
            this.setVRCameraPosition(this.camera.position, 0, this.camera.rotation);
        });


        /* Controllers: */
        this.controller1 = this.renderer.xr.getController( 0 );
        this.controller1.addEventListener( 'selectstart', () => {this.onSelectStart('1')} );
        this.controller1.addEventListener( 'selectend', () => {this.onSelectEnd('1')} );
        this.controller1.addEventListener( 'connected', ( event ) => {

            this.controller1Connected = true;
            this.controller1.add( this.buildController( event.data ) );

        } );
        this.controller1.addEventListener( 'disconnected', () => {
    
            this.controller1Connected = false;
            this.controller1.remove( this.controller1.children[ 0 ] );
    
        });
        this.scene.add( this.controller1 );

        this.controller2 = this.renderer.xr.getController( 1 );
        this.controller2.addEventListener( 'selectstart', () => {this.onSelectStart('2')} );
        this.controller2.addEventListener( 'selectend', () => {this.onSelectEnd('2')} );
        this.controller2.addEventListener( 'connected', ( event ) => {

            this.controller2Connected = true;
            this.controller2.add( this.buildController( event.data ) );
            
        } );
        this.controller2.addEventListener( 'disconnected', () => {
    
            this.controller2Connected = false;
            this.controller2.remove( this.controller2.children[ 0 ] );
    
        } );
        this.scene.add( this.controller2 );

        const controllerModelFactory = new XRControllerModelFactory();

        this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
        this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
        this.scene.add( this.controllerGrip1 );

        this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
        this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );
        this.scene.add( this.controllerGrip2 );

        // Not necessary...
        // const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - this.vrPointerLength ) ] );
        // const line = new THREE.Line( geometry );
        // line.name = 'line';
        // line.scale.z = 5;
        // this.controller1.add( line.clone() );
        // this.controller2.add( line.clone() );

        const raycasterOrigin = new THREE.Vector3(0, 0, 0);
        const raycasterDirection = new THREE.Vector3(0, - 2, 0);
        const near = 0;
        const far = 20;
        this.vrRaycaster = new THREE.Raycaster(raycasterOrigin, raycasterDirection, near, far);


        /* teleMarkerMesh */
        this.teleMarkerMesh = new THREE.Mesh(
            new THREE.CircleGeometry( 0.25, 32 ).rotateX( - Math.PI / 2 ),
            new THREE.MeshBasicMaterial( { color: '#cbfdfd' } )
        );
        this.teleMarkerMesh.visible = false;
        this.scene.add( this.teleMarkerMesh );

    }
    

    onSelectStart = (controllerNum) => {
        if(controllerNum === '1') this.controller1.userData.isSelecting = true;
        if(controllerNum === '2') this.controller2.userData.isSelecting = true;
    }
    

    onSelectEnd = (controllerNum) => {
        
        let doMove = true;

        // If selecting buttons don't move...
        // if (this.vrSelectIntersects.length > 0){
            // console.log(this.vrSelectIntersects);
            // if (this.vrSelectIntersects[0].object.name.includes('boundary')){
            //     return;
            // }
            // if (this.vrSelectIntersects[0].object.name.includes('Cube009')){ 
            //     doMove = false;
            // }
        // }

        if(controllerNum === '1') this.controller1.userData.isSelecting = false;
        if(controllerNum === '2') {
            this.controller2.userData.isSelecting = false;
            // alert(controllerNum);
        }
        if ( this.vrTeleIntersectPoint && doMove) {
            // console.log(this.vrTeleIntersectPoint);

            // const offsetPosition = { x: - this.vrTeleIntersectPoint.x, y: - this.vrTeleIntersectPoint.y - 1.9, z: - this.vrTeleIntersectPoint.z, w: 1 };
            // const offsetRotation = new THREE.Quaternion();
            // const transform = new XRRigidTransform( offsetPosition, offsetRotation );
            // const teleportSpaceOffset = this.vrBaseReferenceSpace.getOffsetReferenceSpace( transform );
            
            // this.renderer.xr.setReferenceSpace( teleportSpaceOffset );

            this.setVRCameraPosition(this.vrTeleIntersectPoint, this.personHeight);
        }
    }


    setVRCameraPosition = (newPosition: THREE.Vector3, personHeight = 0, newRotation: any = new THREE.Quaternion()) => {
        const offsetPosition = { x: - newPosition.x, y: - newPosition.y - personHeight, z: - newPosition.z, w: 1 };
        const offsetRotation = newRotation;
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = this.vrBaseReferenceSpace.getOffsetReferenceSpace( transform );
        
        this.renderer.xr.setReferenceSpace( teleportSpaceOffset );
    }


    // getVRHeight = () => {
    //     const raycaster = new THREE.Raycaster();

    //     // this.raycaster.ray.origin.copy( this.camera.position );
        

    //     // Intersections are returned sorted by distance, closest first.
    //     const intersections = this.raycaster.intersectObjects(this.sceneMeshes, false);
    //     if (typeof intersections != 'undefined' && intersections.length > 0){
    //         // console.log(intersections[0].point.y);
    //         this.controls.getObject().position.y = intersections[0].point.y + this.personHeight;
    //     }else{
    //         this.controls.getObject().position.set(0,4,0);
    //     }
    // }


    buildController = ( data ) => {
        let geometry, material;

        switch ( data.targetRayMode ) {
    
            case 'tracked-pointer':
                geometry = new THREE.BufferGeometry();
                geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - this.vrPointerLength ], 3 ) );
                geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
                material = new THREE.LineBasicMaterial( { color: '#aad3ff' } ); // vertexColors: true, blending: THREE.AdditiveBlending
                return new THREE.Line( geometry, material );
    
            case 'gaze':
                geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                return new THREE.Mesh( geometry, material );
        }
    }


    updateControl = (delta, vrTeleportList) => {
        if(!this.renderer.xr.isPresenting) {
            return;
        }
        if (this.engine.controlOptions.vrTeleportEnabled) {
            this.updateVRTeleport(vrTeleportList);
        }
    }


    updateVRTeleport = (vrTeleportList) => {
        this.vrTeleIntersectPoint = undefined;

        if ( this.controller1.userData.isSelecting === true ) {

            this.tempMatrix.identity().extractRotation( this.controller1.matrixWorld );

            this.vrRaycaster.ray.origin.setFromMatrixPosition( this.controller1.matrixWorld );
            this.vrRaycaster.ray.direction.set(  0, 0, - 1 ).applyMatrix4( this.tempMatrix );
            
            // const intersects = this.vrRaycaster.intersectObjects( vrTeleportList );
            this.vrSelectIntersects = this.vrRaycaster.intersectObjects( vrTeleportList, false);
            
            if ( this.vrSelectIntersects.length > 0 ) {
                const firstIntersect = this.vrSelectIntersects[ 0 ];
                
                // skip if gui component
                if (firstIntersect.object && firstIntersect.object.compType && firstIntersect.object.compType.includes('gui')) return;
                
                this.vrTeleIntersectPoint = firstIntersect.point;
            }
    
        } else if ( this.controller2.userData.isSelecting === true ) {
    
            this.tempMatrix.identity().extractRotation( this.controller2.matrixWorld );
    
            this.vrRaycaster.ray.origin.setFromMatrixPosition( this.controller2.matrixWorld );
            this.vrRaycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );
    
            // const intersects = this.vrRaycaster.intersectObjects( vrTeleportList );
            this.vrSelectIntersects = this.vrRaycaster.intersectObjects( vrTeleportList, false);
    
            if ( this.vrSelectIntersects.length > 0 ) {
                const firstIntersect = this.vrSelectIntersects[ 0 ];

                // skip if gui component
                if (firstIntersect.object && firstIntersect.object.compType && firstIntersect.object.compType.includes('gui')) return;
                
                this.vrTeleIntersectPoint = firstIntersect.point;
            }
    
        }
    
        if ( this.vrTeleIntersectPoint ) this.teleMarkerMesh.position.copy( this.vrTeleIntersectPoint );
    
        this.teleMarkerMesh.visible = this.vrTeleIntersectPoint !== undefined;
    }


    initVRButton = () => {
        this.vrButtonElm = VRButton.createButton( this.renderer );
        document.body.appendChild(this.vrButtonElm);
        this.vrButtonElm.style.zIndex = `${zIndex + 1}`;

        this.vrButtonElm.addEventListener('click', () => toggleShowInstructions());

        const styleElm = document.createElement("style");
        const vrBtnCSSText = `
            #VRButton{
                border: 1px solid #5addc7 !important;
                text-decoration: none;
                font-family: "Lucida Console", "Courier New", monospace !important;
                color:#e8e8e8 !important;
                font-weight: bold !important;
                font-size: 15px !important;
                transition: all 0.5s !important;
                width: 100px !important;
                position: fixed !important;
                left: calc(50% - 50px);
                background-color: #303037 !important;
                opacity: 0.9 !important;
                z-index: ${zIndex + 11} !important;
            }
            #VRButton:hover{
                background-color: #737383 !important;
                border: 1px solid #f14d86 !important;
                box-shadow: 0 0 5px #4a4c4f !important;
                color:#dbe8ff !important;
                cursor: pointer;
                opacity: 0.8 !important;
            }
        `;
        styleElm.innerText = vrBtnCSSText;
        document.body.appendChild(styleElm);
    }

}
