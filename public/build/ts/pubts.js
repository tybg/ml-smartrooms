/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/dat-gui/dat-gui.d.ts" />
"use strict";
var boxExample;
var dat = new dat.GUI();
var ThreePsTutorial;
(function (ThreePsTutorial) {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    var light = new THREE.AmbientLight(0xffffff);
    var BoxExample = (function () {
        function BoxExample() {
            var _this = this;
            /**
             * Render the box
             */
            this.renderScene = function () {
                renderer.render(scene, _this.camera);
                requestAnimationFrame(_this.renderScene);
            };
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
        return BoxExample;
    })();
    ThreePsTutorial.BoxExample = BoxExample;
})(ThreePsTutorial || (ThreePsTutorial = {}));
window.onload = function () {
    boxExample = new ThreePsTutorial.BoxExample();
};
