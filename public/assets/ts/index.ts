/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/dat-gui/dat-gui.d.ts" />
"use strict";

var boxExample : ThreePsTutorial.BoxExample;

module ThreePsTutorial{
	export class BoxExample{
		gui : dat.GUI = new dat.GUI();
		public scene : THREE.Scene = new THREE.Scene();
		public renderer : THREE.Renderer = new THREE.WebGLRenderer();
		public light : THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
		public otherLight = new THREE.DirectionalLight(0xffffff);
		public camera : THREE.PerspectiveCamera;
		public box : THREE.Mesh;
		constructor(){
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			document.getElementById('webgl-container').appendChild(this.renderer.domElement);
			//this.scene.add(this.light);
			this.otherLight.position.setZ(15);
			this.scene.add(this.otherLight);
			this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
			this.camera.position.z = 100;
			this.scene.add(this.camera);
			
			this.box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
			this.box.name = 'box';
			this.scene.add(this.box);
			this.addGui();
			this.renderScene();
		}
		
		/**
		 * Add dat-gui properties for the properties of an Object3D instance
		 * @param folderName The name of the folder to categorize each set of properties
		 * @param openRot Whether to open the {name} Rotation folder by default
		 * @param openPos Whether to open the {name} Position folder by default 
		 */
		private addObj3dProps(obj3d : THREE.Object3D, folderName : string, openRot : boolean = true, openPos: boolean = true){
			var rotFld = this.gui.addFolder(folderName + ' Rotation');
			rotFld.add(obj3d.rotation, 'x').step(0.05);
			rotFld.add(obj3d.rotation, 'y').step(0.05);
			rotFld.add(obj3d.rotation, 'z').step(0.05);
			var posFld = this.gui.addFolder(folderName + ' Position');
			posFld.add(obj3d.position, 'x').step(0.5);
			posFld.add(obj3d.position, 'y').step(0.5);
			posFld.add(obj3d.position, 'z').step(0.5);
			if(openRot)
				rotFld.open();
			if(openPos)
				posFld.open();
		}
		
		private addGui(){
			//this.gui.remember(this.scene);
			this.addObj3dProps(this.camera, 'Camera', false, false);
			this.addObj3dProps(this.otherLight, 'Directional Light', false, false);
			this.addObj3dProps(this.box, 'Box');
		}
		/**
		 * Render the box
		 */
		renderScene = () => {
			this.renderer.render(this.scene, this.camera);
			requestAnimationFrame(this.renderScene);
		}
	}	
}

window.onload = function() {
	boxExample = new ThreePsTutorial.BoxExample();
}