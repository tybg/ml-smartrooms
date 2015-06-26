/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
var Threegui = require("threegui");
var socketio = require('socket.io-client');
var BoxExample = (function () {
    function BoxExample(htmlElem) {
        var _this = this;
        this.gui = new dat.GUI();
        //Scene/Renderer
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        //Lights
        this.spotLight = new THREE.SpotLight(0x3f51b5, 1.1, 270, THREE.Math.degToRad(30));
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight, 20, 20);
        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.pointLightDefaultPositions = [{ x: -7.5, y: -6, z: -50 }, { x: -7.5, y: -6, z: -10 }];
        this.rayCaster = new THREE.Raycaster();
        //Socket
        this.socket = socketio();
        /**
         * Render the box
         */
        this.renderScene = function () {
            requestAnimationFrame(_this.renderScene);
            _this.renderer.render(_this.scene, _this.camera);
            TWEEN.update();
        };
        this.renderContainer = htmlElem;
        this.renderer.setSize(this.renderContainer.clientWidth, this.renderContainer.clientHeight);
        this.renderContainer.appendChild(this.renderer.domElement);
        //Handle click events with RayCaster (see http://threejs.org/docs/#Reference/Core/Raycaster)
        this.renderer.domElement.addEventListener('click', function (evt) {
            _this.highlightSelected(_this.getContainerClickVector2(evt));
        });
        //Add dummy objects to target spotlights
        this.spotLightTarget = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        this.spotLightTarget.visible = false;
        this.scene.add(this.spotLightTarget);
        //Add Lighting
        this.spotLight.target = this.spotLightTarget;
        this.scene.add(this.spotLight);
        this.scene.add(this.spotLightHelper);
        this.scene.add(this.ambientLight);
        this.pointLights = _.map(this.pointLightDefaultPositions, function (pos) {
            var pl = new THREE.PointLight(0x00cc00, 1.0, 30);
            pl.position.x = pos.x;
            pl.position.y = pos.y;
            pl.position.z = pos.z;
            return pl;
        });
        _.each(this.pointLights, function (pl) {
            _this.scene.add(pl);
            var plHelper = new THREE.PointLightHelper(pl, 10);
            _this.scene.add(plHelper);
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
        loader.load('/models/floorplan_floor1.json', function (geometry, materials) {
            var material = new THREE.MeshFaceMaterial(materials);
            _this.mesh = new THREE.Mesh(geometry, material);
            //this.mesh.rotation.x = THREE.Math.degToRad(30);
            _this.scene.add(_this.mesh);
            _this.spotLight.position.set(_this.mesh.position.x, 10, _this.mesh.position.z);
            //this.spotLight.lookAt(this.mesh.position);
            _this.camera.lookAt(_this.mesh.position);
            //Add GUI
            _this.addGui();
            _this.renderScene();
        });
        this.socket.on('book', function (room) {
            console.log('booking room', room);
            _this.pointLights[parseInt(room, 10)].color = new THREE.Color(0xcc0000);
        });
    }
    BoxExample.prototype.getContainerClickVector2 = function (evt) {
        return new THREE.Vector2((evt.offsetX / this.renderer.domElement.clientWidth) * 2 - 1, -(evt.offsetY / this.renderer.domElement.clientHeight) * 2 + 1);
    };
    BoxExample.prototype.addGui = function () {
        var threeGuiBuilder = new Threegui.GuiBuilder();
        //threeGuiBuilder.addPhongMaterialGui(this.gui, this.mesh, <THREE.MeshPhongMaterial>this.mesh.material, this.mesh.geometry);
        threeGuiBuilder.addLightGui(this.gui, this.ambientLight);
        threeGuiBuilder.addLightGui(this.gui, this.spotLight);
        threeGuiBuilder.addObj3dProps(this.gui, this.ambientLight, this.ambientLight.type);
        threeGuiBuilder.addObj3dProps(this.gui, this.spotLight, this.spotLight.type);
    };
    BoxExample.prototype.addRayCasterDebug = function () {
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(this.rayCaster.ray.origin.x, this.rayCaster.ray.origin.y, this.rayCaster.ray.origin.z));
        geometry.vertices.push(new THREE.Vector3(this.rayCaster.ray.origin.x + (this.rayCaster.ray.direction.x * 100000), this.rayCaster.ray.origin.y + (this.rayCaster.ray.direction.y * 100000), this.rayCaster.ray.origin.z + (this.rayCaster.ray.direction.z * 100000)));
        var line = new THREE.Line(geometry, material);
        this.scene.add(line);
    };
    BoxExample.prototype.highlightSelected = function (normalizedClick) {
        var _this = this;
        this.rayCaster.setFromCamera(normalizedClick, this.camera);
        var intersects = this.rayCaster.intersectObject(this.mesh, true);
        intersects.forEach(function (intersection) {
            //console.log('Intersected at', intersection.point);
            var tweenPosition = _this.spotLight.position.clone();
            var slTween = new TWEEN.Tween(tweenPosition).to({ x: intersection.point.x, y: _this.spotLight.position.y, z: intersection.point.z }, 1000);
            slTween.easing(TWEEN.Easing.Exponential.Out);
            slTween.onUpdate(function () {
                _this.spotLight.position.set(tweenPosition.x, tweenPosition.y, tweenPosition.z);
                _this.spotLightTarget.position.x = intersection.point.x;
                _this.spotLightTarget.position.y = intersection.point.y;
                _this.spotLightTarget.position.z = intersection.point.z;
            });
            slTween.onComplete(function () {
                _this.spotLightHelper.update();
            });
            slTween.start();
        });
        //this.addRayCasterDebug();
    };
    return BoxExample;
})();
exports.BoxExample = BoxExample;
//# sourceMappingURL=ThreePsTutorial.js.map