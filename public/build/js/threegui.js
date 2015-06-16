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