/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../typings/dat/dat.d.ts" />
/// <reference path="../../../typings/domready/domready.d.ts" />
"use strict";
define(["require", "exports", 'threegui', 'domready'], function (require, exports, ThreeGui, domready) {
    var boxExample;
    var ThreePsTutorial;
    (function (ThreePsTutorial) {
        var BoxExample = (function () {
            function BoxExample() {
                var _this = this;
                this.gui = new dat.GUI();
                //Scene/Renderer
                this.scene = new THREE.Scene();
                this.renderer = new THREE.WebGLRenderer();
                //Lights
                this.light = new THREE.AmbientLight(0xffffff);
                this.otherLight = new THREE.SpotLight(0xffffff, 1, 100, 2);
                /**
                 * Render the box
                 */
                this.renderScene = function () {
                    _this.renderer.render(_this.scene, _this.camera);
                    requestAnimationFrame(_this.renderScene);
                };
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                document.getElementById('webgl-container').appendChild(this.renderer.domElement);
                //Add Lighting
                //this.scene.add(this.light);
                this.otherLight.position.setZ(25);
                this.scene.add(this.otherLight);
                //Configure Camera
                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
                this.camera.position.z = 100;
                this.scene.add(this.camera);
                //Instantiate Objects			
                this.box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshPhongMaterial({ ambientColor: 0x0000ff, specular: 15 }));
                this.box.name = 'Box';
                this.scene.add(this.box);
                //Add GUI
                this.addGui();
                this.addLightGui(this.otherLight);
                this.renderScene();
            }
            /**
             * Add dat-gui properties for the properties of an Object3D instance
             * @param folderName The name of the folder to categorize each set of properties
             * @param openRot Whether to open the {name} Rotation folder by default
             * @param openPos Whether to open the {name} Position folder by default
             */
            BoxExample.prototype.addObj3dProps = function (obj3d, folderName, openRot, openPos) {
                if (openRot === void 0) { openRot = true; }
                if (openPos === void 0) { openPos = true; }
                var rotFld = this.gui.addFolder(folderName + ' Rotation');
                rotFld.add(obj3d.rotation, 'x').step(0.05);
                rotFld.add(obj3d.rotation, 'y').step(0.05);
                rotFld.add(obj3d.rotation, 'z').step(0.05);
                var posFld = this.gui.addFolder(folderName + ' Position');
                posFld.add(obj3d.position, 'x').step(0.5);
                posFld.add(obj3d.position, 'y').step(0.5);
                posFld.add(obj3d.position, 'z').step(0.5);
                if (openRot)
                    rotFld.open();
                if (openPos)
                    posFld.open();
            };
            BoxExample.prototype.addLightGui = function (light) {
                var lightFld = this.gui.addFolder(light.name || light.type);
                lightFld.addColor(light, 'color');
                if (_.has(light, 'angle'))
                    lightFld.add(light, 'angle').step(Math.PI / 12);
                if (_.has(light, 'distance'))
                    lightFld.add(light, 'distance');
                if (_.has(light, 'intensity'))
                    lightFld.add(light, 'intensity');
            };
            BoxExample.prototype.addGui = function () {
                //this.gui.remember(this.scene);
                this.addObj3dProps(this.camera, 'Camera', false, false);
                this.addObj3dProps(this.box, 'Box', false, false);
                this.addObj3dProps(this.otherLight, this.otherLight.type);
                var threeGuiBuilder = new ThreeGui.GuiBuilder();
                threeGuiBuilder.addPhongMaterialGui(this.gui, this.box, this.box.material, this.box.geometry);
            };
            return BoxExample;
        })();
        ThreePsTutorial.BoxExample = BoxExample;
    })(ThreePsTutorial || (ThreePsTutorial = {}));
    domready(function () {
        boxExample = new ThreePsTutorial.BoxExample();
    });
});