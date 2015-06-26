/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../typings/dat/dat.d.ts" />
"use strict";

export interface MapWithKeys {
	none: void,
	keys: string[]
}

export class EnvMapper implements MapWithKeys {
	none : void;
	reflection : THREE.Texture;
	refraction : THREE.Texture;
	keys : string[] = ['none', 'reflection', 'refraction'];
	constructor() {
		var path = '/build/images/examples/SwedishRoyalCastle/';
		var format : string = '.jpg';
		var urls : string[] = _.map(['px', 'nx', 'py', 'ny', 'pz', 'nz'], function(x : string){
			return path + x + format;
		});
	
		var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
		this.reflection = THREE.ImageUtils.loadTextureCube(urls);
		this.reflection.format = THREE.RGBFormat;
	
		this.refraction = new THREE.Texture(this.reflection.image, THREE.CubeRefractionMapping );
		this.refraction.format = THREE.RGBFormat;
		this.none = null;
	}
}

export class TextureMapper implements MapWithKeys {
	none: void;
	keys: string[] = ['none', 'grass']
	grass: THREE.Texture;		
	constructor() {
		this.none = null;
		this.grass = THREE.ImageUtils.loadTexture('/build/images/examples/grasslight-thin.jpg');
	}
}

export class GuiBuilder {	
	//Demo Stuff ()
	envMaps : EnvMapper;
	textureMaps : TextureMapper;
	
	/**
	 *
	 */
	constructor() {
		//Set up demo stuff
		//this.envMaps = new EnvMapper();
		//this.textureMaps = new TextureMapper();		
	}
	
	private constants = {
		combine: {	
			"THREE.MultiplyOperation" : THREE.MultiplyOperation,
			"THREE.MixOperation" : THREE.MixOperation,
			"THREE.AddOperation" : THREE.AddOperation
	
		},	
		side : {	
			"THREE.FrontSide" : THREE.FrontSide,
			"THREE.BackSide" : THREE.BackSide,
			"THREE.DoubleSide" : THREE.DoubleSide
	
		},	
		shading : {	
			"THREE.NoShading" : THREE.NoShading,
			"THREE.FlatShading" : THREE.FlatShading,
			"THREE.SmoothShading" : THREE.SmoothShading
	
		},	
		colors : {	
			"THREE.NoColors" : THREE.NoColors,
			"THREE.FaceColors" : THREE.FaceColors,
			"THREE.VertexColors" : THREE.VertexColors	
		},	
		blendingMode : {	
			"THREE.NoBlending" : THREE.NoBlending,
			"THREE.NormalBlending" : THREE.NormalBlending,
			"THREE.AdditiveBlending" : THREE.AdditiveBlending,
			"THREE.SubtractiveBlending" : THREE.SubtractiveBlending,
			"THREE.MultiplyBlending" : THREE.MultiplyBlending,
			"THREE.CustomBlending" : THREE.CustomBlending	
		},	
		equations : {	
			"THREE.AddEquation" : THREE.AddEquation,
			"THREE.SubtractEquation" : THREE.SubtractEquation,
			"THREE.ReverseSubtractEquation" : THREE.ReverseSubtractEquation
		},	
		destinationFactors : {	
			"THREE.ZeroFactor" : THREE.ZeroFactor,
			"THREE.OneFactor" : THREE.OneFactor,
			"THREE.SrcColorFactor" : THREE.SrcColorFactor,
			"THREE.OneMinusSrcColorFactor" : THREE.OneMinusSrcColorFactor,
			"THREE.SrcAlphaFactor" : THREE.SrcAlphaFactor,
			"THREE.OneMinusSrcAlphaFactor" : THREE.OneMinusSrcAlphaFactor,
			"THREE.DstAlphaFactor" : THREE.DstAlphaFactor,
			"THREE.OneMinusDstAlphaFactor" : THREE.OneMinusDstAlphaFactor	
		},	
		sourceFactors : {	
			"THREE.DstColorFactor" : THREE.DstColorFactor,
			"THREE.OneMinusDstColorFactor" : THREE.OneMinusDstColorFactor,
			"THREE.SrcAlphaSaturateFactor" : THREE.SrcAlphaSaturateFactor
		}
	}
		
	private handleColorChange ( color ) {
		return function (value){
			if (typeof value === "string") {
				value = value.replace('#', '0x');
			}		
			color.setHex(value);
	    };		
	}
	
	private updateMorphs (mesh : THREE.Mesh, material : THREE.Material) {
		return function () {		
			mesh.updateMorphTargets();
			material.needsUpdate = true;
		};		
	}
	
	private updateTexture (material : THREE.Material, materialKey : string, textures : MapWithKeys) {		
		return function (key) {		
			material[materialKey] = textures[key];
			material.needsUpdate = true;		
		};		
	}
	
	private needsUpdate ( material, geometry ) {
		return function () {	
			material.shading = +material.shading; //Ensure number
			material.vertexColors = +material.vertexColors; //Ensure number
			material.side = +material.side; //Ensure number
			material.needsUpdate = true;
			geometry.verticesNeedUpdate = true;
			geometry.normalsNeedUpdate = true;
			geometry.colorsNeedUpdate = true;	
		};
	}
	
	addPhongMaterialGui(gui : dat.GUI, mesh : THREE.Mesh, material : THREE.MeshPhongMaterial, geometry : THREE.Geometry){
		var data = {
			color : material.color.getHex(),
			emissive : material.emissive.getHex(),
			specular : material.specular.getHex(),
			envMaps : this.envMaps.keys,
			map : this.textureMaps.keys,
			lightMap : this.textureMaps.keys,
			specularMap : this.textureMaps.keys,
			alphaMap : this.textureMaps.keys
		};
		
		var folder = gui.addFolder((mesh.name || '') + 'MeshPhongMaterial');

		folder.addColor( data, 'color' ).onChange(this.handleColorChange(material.color));
		folder.addColor( data, 'emissive' ).onChange(this.handleColorChange(material.emissive));
		folder.addColor( data, 'specular' ).onChange(this.handleColorChange(material.specular));
	
		folder.add( material, 'shininess', 1, 100);
		folder.add( material, 'shading', this.constants.shading).onChange( this.needsUpdate( material, geometry ) );
		folder.add( material, 'wireframe' );
		folder.add( material, 'wireframeLinewidth', 0, 10 );
		folder.add( material, 'vertexColors', this.constants.colors);
		folder.add( material, 'fog' );
		folder.add( data, 'envMaps', this.envMaps.keys).onChange( this.updateTexture( material, 'envMap', this.envMaps ) );
		folder.add( data, 'map', this.textureMaps.keys).onChange( this.updateTexture( material, 'map', this.textureMaps ) );
		folder.add( data, 'lightMap', this.textureMaps.keys ).onChange( this.updateTexture( material, 'lightMap', this.textureMaps ) );
		folder.add( data, 'specularMap', this.textureMaps.keys).onChange( this.updateTexture( material, 'specularMap', this.textureMaps ) );
		folder.add( data, 'alphaMap', this.textureMaps.keys).onChange( this.updateTexture( material, 'alphaMap', this.textureMaps ) );
	}
	
	addLightGui(gui : dat.GUI, light : THREE.Light){
		var lightFld = gui.addFolder(light.name || light.type);
		lightFld.addColor(light, 'color');
		if(_.has(light, 'angle'))
			lightFld.add(light, 'angle').step(Math.PI / 12);
		if(_.has(light, 'distance'))
			lightFld.add(light, 'distance');
		if(_.has(light, 'intensity'))				
			lightFld.add(light, 'intensity');			
	}
	
	/**
	 * Add dat-gui properties for the properties of an Object3D instance
	 * @param folderName The name of the folder to categorize each set of properties
	 * @param openRot Whether to open the {name} Rotation folder by default
	 * @param openPos Whether to open the {name} Position folder by default 
	 */
	addObj3dProps(gui : dat.GUI, obj3d : THREE.Object3D, folderName : string, openRot : boolean = false, openPos: boolean = false){
        var rotFld = gui.addFolder(folderName + ' Rotation');
        var rotStep = Math.PI / 12;
        rotFld.add(obj3d.rotation, 'x').step(rotStep).listen();
        rotFld.add(obj3d.rotation, 'y').step(rotStep).listen();
        rotFld.add(obj3d.rotation, 'z').step(rotStep).listen();
		var posFld = gui.addFolder(folderName + ' Position');
		posFld.add(obj3d.position, 'x').step(0.5).listen();
        posFld.add(obj3d.position, 'y').step(0.5).listen();
        posFld.add(obj3d.position, 'z').step(0.5).listen();
		if(openRot)
			rotFld.open();
		if(openPos)
			posFld.open();
    }
    
    addVector3Controls(gui : dat.GUI, vector3 : THREE.Vector3, step : number = 0.5, name : string = 'Vector3') : dat.GUI {
        var v3Fld = gui.addFolder(name);
        v3Fld.add(vector3, 'x').step(step);
        v3Fld.add(vector3, 'y').step(step);
        v3Fld.add(vector3, 'z').step(step);
        return v3Fld;
    }
}