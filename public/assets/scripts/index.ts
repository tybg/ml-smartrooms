/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/threejs/three-orbitcontrols.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../typings/tween.js/tween.js.d.ts" />
/// <reference path="../../../typings/dat/dat.d.ts" />
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ripples/ripples.d.ts" />
/// <reference path="../../../typings/domready/domready.d.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />

"use strict";
import ThreeGui = require('threegui');
import domready = require('domready');
import socketio = require('socket.io-client');

var boxExample : ThreePsTutorial.BoxExample;

module ThreePsTutorial{
	export class BoxExample{
		gui : dat.GUI = new dat.GUI();
		//Scene/Renderer
		scene : THREE.Scene = new THREE.Scene();
		renderer : THREE.Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
		renderContainer : HTMLElement;
		//Lights
		spotLight = new THREE.SpotLight(0x3f51b5, 1.1, 270, THREE.Math.degToRad(50));
		ambientLight = new THREE.AmbientLight(0xffffff);
        pointLights : THREE.PointLight[];
        pointLightDefaultPositions = [{ x: -7.5, y: -6, z: -50}, { x: -7.5, y: -6, z: -10}];
		//Cameras
		camera : THREE.PerspectiveCamera;
		//Objects
        mesh: THREE.Mesh;
        spotLightTarget: THREE.Mesh;
        //Controls
        orbitControls: THREE.OrbitControls;
        rayCaster = new THREE.Raycaster();
        
        //Socket
        socket = socketio();
		
		constructor(){
            this.renderContainer = document.getElementById('map-container');
			this.renderer.setSize(this.renderContainer.clientWidth, this.renderContainer.clientHeight);
			this.renderContainer.appendChild(this.renderer.domElement);
            //Handle click events with RayCaster (see http://threejs.org/docs/#Reference/Core/Raycaster)
            this.renderer.domElement.addEventListener('click', evt => {
                this.highlightSelected(this.getContainerClickVector2(evt));
            });

            //Add dummy objects to target spotlights
            this.spotLightTarget = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0x000000 }));
            this.spotLightTarget.visible = false;
            this.scene.add(this.spotLightTarget);

			//Add Lighting
            this.spotLight.target = this.spotLightTarget;
			this.scene.add(this.spotLight);
			this.scene.add(this.ambientLight);
            this.pointLights = _.map(this.pointLightDefaultPositions, (pos) => {
                var pl = new THREE.PointLight(0x00cc00, 1.0, 30);
                pl.position.x = pos.x;
                pl.position.y = pos.y;
                pl.position.z = pos.z;
                return pl;
            });
            _.each(this.pointLights, (pl) => {
                this.scene.add(pl);
            });
            this.scene.fog = new THREE.Fog(0x55aaff, 500, 1200);

			//Configure Camera
            this.camera = new THREE.PerspectiveCamera(90, this.renderContainer.clientWidth / this.renderContainer.clientHeight, 0.1, 1200);
            this.camera.position.y = 150;
            this.camera.position.z = 350;
            this.scene.add(this.camera);
            
            //Controls
            this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

			var loader = new THREE.JSONLoader();
            loader.load('/models/floorplan_floor1.json', (geometry, materials) => {
                var material = new THREE.MeshFaceMaterial(materials);
                this.mesh = new THREE.Mesh(geometry, material);
                //this.mesh.rotation.x = THREE.Math.degToRad(30);
                this.scene.add(this.mesh);
                this.spotLight.position.set(this.mesh.position.x, 100, this.mesh.position.z);
                //this.spotLight.lookAt(this.mesh.position);
                this.camera.lookAt(this.mesh.position);
                
                //Add GUI
                this.addGui();
                this.renderScene();
            });
            
            
            this.socket.on('book', room => {
                console.log('booking room', room);
                this.pointLights[parseInt(room, 10)].color = new THREE.Color(0xcc0000);
            });
        }

        private getContainerClickVector2(evt: MouseEvent): THREE.Vector2 {
            return new THREE.Vector2((evt.offsetX / this.renderer.domElement.clientWidth) * 2 - 1, -(evt.offsetY / this.renderer.domElement.clientHeight) * 2 + 1);
        }

		private addGui(){
            var threeGuiBuilder = new ThreeGui.GuiBuilder();
            //threeGuiBuilder.addPhongMaterialGui(this.gui, this.mesh, <THREE.MeshPhongMaterial>this.mesh.material, this.mesh.geometry);
            threeGuiBuilder.addLightGui(this.gui, this.ambientLight);
            threeGuiBuilder.addLightGui(this.gui, this.spotLight);
            threeGuiBuilder.addObj3dProps(this.gui, this.ambientLight, this.ambientLight.type);
            threeGuiBuilder.addObj3dProps(this.gui, this.spotLight, this.spotLight.type);
        }

        private addRayCasterDebug() {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            var geometry = new THREE.Geometry();

            geometry.vertices.push(new THREE.Vector3(this.rayCaster.ray.origin.x, this.rayCaster.ray.origin.y, this.rayCaster.ray.origin.z));
            geometry.vertices.push(new THREE.Vector3(this.rayCaster.ray.origin.x + (this.rayCaster.ray.direction.x * 100000), this.rayCaster.ray.origin.y + (this.rayCaster.ray.direction.y * 100000), this.rayCaster.ray.origin.z + (this.rayCaster.ray.direction.z * 100000)));
            var line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }

        private addSpotlightDebug(target?: THREE.Vector3) {
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(this.spotLight.position);
            geometry.vertices.push(target || this.mesh.position);
            var line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }

        highlightSelected(normalizedClick: THREE.Vector2) {
            this.rayCaster.setFromCamera(normalizedClick, this.camera);
            var intersects = this.rayCaster.intersectObject(this.mesh, true);
            intersects.forEach((intersection) => {
                console.log('Intersected at', intersection.point);
                var tweenPosition = this.spotLight.position.clone();
                var slTween = new TWEEN.Tween(tweenPosition).to({ x: intersection.point.x, y: this.spotLight.position.y, z: intersection.point.z }, 1000);
                slTween.easing(TWEEN.Easing.Exponential.Out);
                slTween.onUpdate(() => {
                    this.spotLight.position.set(tweenPosition.x, tweenPosition.y, tweenPosition.z);
                    this.spotLightTarget.position.x = intersection.point.x;
                    this.spotLightTarget.position.y = intersection.point.y;
                    this.spotLightTarget.position.z = intersection.point.z;
                });
                slTween.start();
            });
            //this.addRayCasterDebug();
        }
		/**
		 * Render the box
		 */
		renderScene = () => {
            requestAnimationFrame(this.renderScene);
            this.renderer.render(this.scene, this.camera);
            TWEEN.update();
		};
	}	
}

domready(() => {
    boxExample = new ThreePsTutorial.BoxExample();
	
    window.addEventListener('resize', () => {				
        boxExample.camera.aspect = boxExample.renderContainer.clientWidth / boxExample.renderContainer.clientHeight;
        boxExample.camera.updateProjectionMatrix();
        boxExample.renderer.setSize(boxExample.renderContainer.clientWidth, boxExample.renderContainer.clientHeight);				
    }, false );
	
    $.material.init();
    $('.dg.main').css('margin-top', boxExample.renderer.domElement.offsetTop + 'px');

    document.getElementById('enable-controls').addEventListener('change', function (evt) {
        boxExample.orbitControls.enabled = this.checked;
    });
});