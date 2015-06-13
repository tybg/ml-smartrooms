/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/dat-gui/dat-gui.d.ts" />

"use strict";
var boxExample : ThreePsTutorial.BoxExample;
var dat = new dat.GUI();
module ThreePsTutorial{
	var scene : THREE.Scene = new THREE.Scene();
	var renderer : THREE.Renderer = new THREE.WebGLRenderer();
	var light : THREE.AmbientLight = new THREE.AmbientLight(0xffffff);	
	
	export class BoxExample{		
		public camera : THREE.PerspectiveCamera;
		public box : THREE.Mesh;
		constructor(){
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.getElementById('webgl-container').appendChild(renderer.domElement);
			scene.add(light);
			this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
			this.camera.position.z = 100;
			scene.add(this.camera);
			
			this.box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0000FF }));
			this.box.name = 'box';
			scene.add(this.box);
			this.renderScene();
		}
		
		/**
		 * Render the box
		 */
		renderScene = () => {
			renderer.render(scene, this.camera);
			requestAnimationFrame(this.renderScene);
		}
	}	
}

window.onload = function() {
	boxExample = new ThreePsTutorial.BoxExample();
}