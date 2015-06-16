/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../typings/dat/dat.d.ts" />
/// <reference path="../../../typings/domready/domready.d.ts" />

"use strict";
import ThreeGui = require('threegui');
import domready = require('domready');
var boxExample : ThreePsTutorial.BoxExample;

module ThreePsTutorial{
	export class BoxExample{
		gui : dat.GUI = new dat.GUI();
		guiConfigProps
		//Scene/Renderer
		scene : THREE.Scene = new THREE.Scene();
		renderer : THREE.Renderer = new THREE.WebGLRenderer();
		//Lights
		light = new THREE.SpotLight(0xffffff, 1, 100, 2);
		dirLight = new THREE.DirectionalLight(0xffffff, 1);
		//Cameras
		camera : THREE.PerspectiveCamera;
		//Objects		
		mesh : THREE.Mesh;
		
		constructor(){
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			var renderContainer = document.getElementById('webgl-container')
			renderContainer.appendChild(this.renderer.domElement);
			
			//Add Lighting
			//this.scene.add(this.light);
			this.light.position.setZ(25);
			this.scene.add(this.light);
			this.dirLight.position.set(0, 25, 0);
			this.dirLight.rotation.x = Math.PI / 2;
			this.scene.add(this.dirLight);
			
			//Configure Camera
			this.camera = new THREE.PerspectiveCamera(75, renderContainer.clientWidth / renderContainer.clientHeight, 0.1, 1000);
			this.camera.position.z = 40;
			this.scene.add(this.camera);
			
			//Instantiate Objects			
			this.mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 3, 100, 16), new THREE.MeshPhongMaterial({ color: 0x2194CE, specular: 0x000000 }));
			this.mesh.name = 'Box';
			this.scene.add(this.mesh);
			
			//Add GUI
			this.addGui();
			this.renderScene();
		}
		
		private addResizeListener = function(){
			window.addEventListener('resize', function () {				
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);				
			}, false );
		}
		
		private addGui(){
			var threeGuiBuilder = new ThreeGui.GuiBuilder();
			threeGuiBuilder.addPhongMaterialGui(this.gui, this.mesh, <THREE.MeshPhongMaterial>this.mesh.material, this.mesh.geometry)			
			threeGuiBuilder.addLightGui(this.gui, this.light);
			threeGuiBuilder.addObj3dProps(this.gui, this.camera, 'Camera', false, false);
			//threeGuiBuilder.addObj3dProps(this.gui, this.mesh, 'Box', false, false);
			threeGuiBuilder.addObj3dProps(this.gui, this.light, this.light.type);
		}
		/**
		 * Render the box
		 */
		renderScene = () => {
			requestAnimationFrame(this.renderScene);			
			this.mesh.rotation.x += 0.005;
			this.mesh.rotation.y += 0.005;
			this.renderer.render(this.scene, this.camera);			
		};
	}	
}

domready(function() {
	boxExample = new ThreePsTutorial.BoxExample();
	
	window.addEventListener('resize', function () {				
		boxExample.camera.aspect = window.innerWidth / window.innerHeight;
		boxExample.camera.updateProjectionMatrix();
		boxExample.renderer.setSize(window.innerWidth, window.innerHeight);				
	}, false );
	
	window.addEventListener('mousemove', function(ev : MouseEvent) {
		if(ev.buttons === 1){
			if(ev.ctrlKey && !ev.altKey){
				boxExample.camera.rotation.x -= ev.movementY / 100;
				boxExample.camera.rotation.y -= ev.movementX / 100;
			}
			else if(ev.ctrlKey && ev.altKey){
				//console.log('ev.movement ' + ev.movementX + ', ' + ev.movementY);
				boxExample.camera.position.x += ev.movementX / 10;
				boxExample.camera.position.y -= ev.movementY / 10;
			}
			else if(ev.altKey && !ev.ctrlKey)
			{
				boxExample.light.position.x += ev.movementX / 10;
				boxExample.light.position.y -= ev.movementY / 10;
			}
		}
	});
});