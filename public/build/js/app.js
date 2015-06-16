/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../typings/dat/dat.d.ts" />
"use strict";
define(["require", "exports"], function (require, exports) {
    var EnvMapper = (function () {
        function EnvMapper() {
            this.keys = ['none', 'reflection', 'refraction'];
            var path = '/build/img/examples/SwedishRoyalCastle/';
            var format = '.jpg';
            var urls = _.map(['px', 'nx', 'py', 'ny', 'pz', 'nz'], function (x) {
                return path + x + format;
            });
            var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
            this.reflection = THREE.ImageUtils.loadTextureCube(urls);
            this.reflection.format = THREE.RGBFormat;
            this.refraction = new THREE.Texture(this.reflection.image, THREE.CubeRefractionMapping);
            this.refraction.format = THREE.RGBFormat;
            this.none = null;
        }
        return EnvMapper;
    })();
    exports.EnvMapper = EnvMapper;
    var TextureMapper = (function () {
        function TextureMapper() {
            this.keys = ['none', 'grass'];
            this.none = null;
            this.grass = THREE.ImageUtils.loadTexture('/build/img/examples/grasslight-thin.jpg');
        }
        return TextureMapper;
    })();
    exports.TextureMapper = TextureMapper;
    var GuiBuilder = (function () {
        /**
         *
         */
        function GuiBuilder() {
            this.constants = {
                combine: {
                    "THREE.MultiplyOperation": THREE.MultiplyOperation,
                    "THREE.MixOperation": THREE.MixOperation,
                    "THREE.AddOperation": THREE.AddOperation
                },
                side: {
                    "THREE.FrontSide": THREE.FrontSide,
                    "THREE.BackSide": THREE.BackSide,
                    "THREE.DoubleSide": THREE.DoubleSide
                },
                shading: {
                    "THREE.NoShading": THREE.NoShading,
                    "THREE.FlatShading": THREE.FlatShading,
                    "THREE.SmoothShading": THREE.SmoothShading
                },
                colors: {
                    "THREE.NoColors": THREE.NoColors,
                    "THREE.FaceColors": THREE.FaceColors,
                    "THREE.VertexColors": THREE.VertexColors
                },
                blendingMode: {
                    "THREE.NoBlending": THREE.NoBlending,
                    "THREE.NormalBlending": THREE.NormalBlending,
                    "THREE.AdditiveBlending": THREE.AdditiveBlending,
                    "THREE.SubtractiveBlending": THREE.SubtractiveBlending,
                    "THREE.MultiplyBlending": THREE.MultiplyBlending,
                    "THREE.CustomBlending": THREE.CustomBlending
                },
                equations: {
                    "THREE.AddEquation": THREE.AddEquation,
                    "THREE.SubtractEquation": THREE.SubtractEquation,
                    "THREE.ReverseSubtractEquation": THREE.ReverseSubtractEquation
                },
                destinationFactors: {
                    "THREE.ZeroFactor": THREE.ZeroFactor,
                    "THREE.OneFactor": THREE.OneFactor,
                    "THREE.SrcColorFactor": THREE.SrcColorFactor,
                    "THREE.OneMinusSrcColorFactor": THREE.OneMinusSrcColorFactor,
                    "THREE.SrcAlphaFactor": THREE.SrcAlphaFactor,
                    "THREE.OneMinusSrcAlphaFactor": THREE.OneMinusSrcAlphaFactor,
                    "THREE.DstAlphaFactor": THREE.DstAlphaFactor,
                    "THREE.OneMinusDstAlphaFactor": THREE.OneMinusDstAlphaFactor
                },
                sourceFactors: {
                    "THREE.DstColorFactor": THREE.DstColorFactor,
                    "THREE.OneMinusDstColorFactor": THREE.OneMinusDstColorFactor,
                    "THREE.SrcAlphaSaturateFactor": THREE.SrcAlphaSaturateFactor
                }
            };
            //Set up demo stuff
            this.envMaps = new EnvMapper();
            this.textureMaps = new TextureMapper();
        }
        GuiBuilder.prototype.handleColorChange = function (color) {
            return function (value) {
                if (typeof value === "string") {
                    value = value.replace('#', '0x');
                }
                color.setHex(value);
            };
        };
        GuiBuilder.prototype.updateMorphs = function (mesh, material) {
            return function () {
                mesh.updateMorphTargets();
                material.needsUpdate = true;
            };
        };
        GuiBuilder.prototype.updateTexture = function (material, materialKey, textures) {
            return function (key) {
                material[materialKey] = textures[key];
                material.needsUpdate = true;
            };
        };
        GuiBuilder.prototype.needsUpdate = function (material, geometry) {
            return function () {
                material.shading = +material.shading; //Ensure number
                material.vertexColors = +material.vertexColors; //Ensure number
                material.side = +material.side; //Ensure number
                material.needsUpdate = true;
                geometry.verticesNeedUpdate = true;
                geometry.normalsNeedUpdate = true;
                geometry.colorsNeedUpdate = true;
            };
        };
        ;
        GuiBuilder.prototype.addPhongMaterialGui = function (gui, mesh, material, geometry) {
            var data = {
                color: material.color.getHex(),
                emissive: material.emissive.getHex(),
                specular: material.specular.getHex(),
                envMaps: this.envMaps.keys,
                map: this.textureMaps.keys,
                lightMap: this.textureMaps.keys,
                specularMap: this.textureMaps.keys,
                alphaMap: this.textureMaps.keys
            };
            var folder = gui.addFolder((mesh.name || '') + 'MeshPhongMaterial');
            folder.addColor(data, 'color').onChange(this.handleColorChange(material.color));
            folder.addColor(data, 'emissive').onChange(this.handleColorChange(material.emissive));
            folder.addColor(data, 'specular').onChange(this.handleColorChange(material.specular));
            folder.add(material, 'shininess', 1, 100);
            folder.add(material, 'shading', this.constants.shading).onChange(this.needsUpdate(material, geometry));
            folder.add(material, 'wireframe');
            folder.add(material, 'wireframeLinewidth', 0, 10);
            folder.add(material, 'vertexColors', this.constants.colors);
            folder.add(material, 'fog');
            folder.add(data, 'envMaps', this.envMaps.keys).onChange(this.updateTexture(material, 'envMap', this.envMaps));
            folder.add(data, 'map', this.textureMaps.keys).onChange(this.updateTexture(material, 'map', this.textureMaps));
            folder.add(data, 'lightMap', this.textureMaps.keys).onChange(this.updateTexture(material, 'lightMap', this.textureMaps));
            folder.add(data, 'specularMap', this.textureMaps.keys).onChange(this.updateTexture(material, 'specularMap', this.textureMaps));
            folder.add(data, 'alphaMap', this.textureMaps.keys).onChange(this.updateTexture(material, 'alphaMap', this.textureMaps));
        };
        return GuiBuilder;
    })();
    exports.GuiBuilder = GuiBuilder;
});

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
