import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {Formula}  from '/Alone/gameCore/mecanics/Formula.js';
class LightsManager {
	conslog = true
	_GameConfig;
	order = 1
	_ambientLight; 
	_directionalLight;
	_hemiLight
	constructor(GameConfig) {
		this.SunSpeed = Math.PI/18000
		this._GameConfig = GameConfig
		this.BulbLigths = []
		this.lights = []
		this._init()
	}
	_init() {
		if (this._GameConfig.conslog) console.info('Lights Mounted !')
		// this._init_BulbsLights()

		this._init_SUNGroupe()
		// this._init_HemiLigth()
		this._init_AmbientLight()
		// this._init_DirectionalLight()
		
		// this.lights.push(this.light)
		// this.lights.push(this._hemiLight)
		this.lights.push(this.SUNGroupe)
		this.lights.push(this._ambientLight)
		// this.lights.push(this._directionalLight)
		
		if (this._GameConfig.conslog) console.log('lights',this.lights)
	}
	upadteSun(){
		this.SUNGroupe.rotation.y += this.SunSpeed
	}
	_init_SUNGroupe() {
		this.SUNGroupe = new THREE.Group();

		// let config = {
		// 	color: 0xffffff,
		// 	power: 1,
		// 	position: new THREE.Vector3(10, 10, 10),
		// 	size: new THREE.Vector3(5, 5, 5)
		// }


		// this.Sol = new THREE.Mesh(
		// 	new THREE.BoxGeometry(config.size.x, config.size.y, config.size.z),
		// 	new THREE.MeshPhongMaterial({ color: 'yellow', wireframe: false })
		// );
		// this.Sol.castShadow = false;
		// this.Sol.receiveShadow = true;
		// this.Sol.matrixAutoUpdate = true;
		// // this.Sol.material.transparent = true
		// this.Sol.name = "Sol";
		// this.Sol.position.set(config.position.x+5,config.position.y+5,config.position.z+5);



		let bulb_config = {
			name: 'bulb_Sol',
			color: 0xffffff,
			power: 1,
			position: new THREE.Vector3(0, 0, 20),
			size: ( 5, 16, 5),
			mat : {
				color: 0xFFFFFF00,
				emissive: 'yellow',
				emissiveIntensity: 2,
			}
		}


		let bulbGeometry = new THREE.SphereGeometry( bulb_config.size );
		let bulbMat = new THREE.MeshStandardMaterial(
			bulb_config.mat.emissive,
			bulb_config.mat.emissiveIntensity,
			bulb_config.mat.color
		);


		let bulbLight = new THREE.PointLight( bulb_config.color, .5, 200, .2 );
		bulbLight.castShadow = true;
		bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
		bulbLight.position.set(bulb_config.position.x,bulb_config.position.y,bulb_config.position.z);
		bulbLight.power = bulb_config.power;
		bulbLight.name = 'bulb_Sol';
		// this.BulbLigths.push(bulbLight)


		// let bulbGeometry = new THREE.SphereGeometry( 0.5, 16, 8 );
		// let bulbMat = new THREE.MeshStandardMaterial( {
		// 	emissive: color,
		// 	emissiveIntensity: 2,
		// 	color: 0xFFFFFF00
		// } );
		// let bulbLight = new THREE.PointLight( color, .5, 200, .2 );
		// bulbLight.castShadow = true;
		// bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
		// bulbLight.position.set(position.x,position.y,position.z)
		// bulbLight.power = power;
		// bulbLight.name = 'bulb_'+(index);
		// this.BulbLigths.push(bulbLight)
		// this.lights.push(bulbLight)
		// //this._Scene.add(bulbLight)










		// light
		this.SunLight = new THREE.DirectionalLight(
			bulb_config.color,
			bulb_config.power
		);
		this.SunLight.position.set(bulb_config.position.x,bulb_config.position.y,bulb_config.position.z);
		this.SunLight.castShadow = true;
		this.SunLight.shadow.bias = -0.001;

		this.SunLight.shadow.mapSize.width = 2048;
		this.SunLight.shadow.mapSize.height = 2048;
		this.SunLight.shadow.camera.near = 0.5;
		this.SunLight.shadow.camera.far = 500.0;


		this.SunLight.shadow.camera.left = 100;
		this.SunLight.shadow.camera.right = -100;
		this.SunLight.shadow.camera.top = 100;
		this.SunLight.shadow.camera.bottom = -100;

		this.SUNGroupe.add(this.SunLight)
		// this.SUNGroupe.add(this.Sol)
		this.SUNGroupe.add(bulbLight)
	}
	_init_BulbsLights() {
		let zz = 3
		let pow = 500
		let lightsNumber = 5
		let lightsGapY = this._GameConfig.floors.size.y / lightsNumber
		let start = 0 - (this._GameConfig.floors.size.y/2)

		// BULBS LIGTH
		for (let index = 0; index < lightsNumber ; index++) {
			let randomColorWithPrefix = this.generateRandomColor();
			this._init_NewBulbLight(randomColorWithPrefix,pow,{
				x:0,y:start + (index * lightsGapY),z:zz},index
			)
		}
	}
	generateRandomColor() {
		const colors = [0xFF0000, 0x00FF00, 0x0000FF]
		const randomColorHex = colors[Math.floor(Math.random() * colors.length)]
		return randomColorHex
	}
	  
	_init_HemiLigth(){
		this._hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, .5 );
			this._hemiLight.position.set( 0, 0, 20 );

	}
	_init_AmbientLight() {
		this._ambientLight = new THREE.AmbientLight(
			0xffff55,
			.2
			// this._GameConfig.get_ambientLight('color'),
			// this._GameConfig.get_ambientLight('intensity')
		)
		this._ambientLight.name = this._GameConfig.get_ambientLight('name');
	}
	_init_NewBulbLight(color,power,position,index) {
		
		let bulbGeometry = new THREE.SphereGeometry( 0.5, 16, 8 );
		let bulbMat = new THREE.MeshStandardMaterial( {
			emissive: color,
			emissiveIntensity: 2,
			color: 0xFFFFFF00
		} );
		let bulbLight = new THREE.PointLight( color, .5, 200, .2 );
		bulbLight.castShadow = true;
		bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
		bulbLight.position.set(position.x,position.y,position.z)
		bulbLight.power = power;
		bulbLight.name = 'bulb_'+(index);
		this.BulbLigths.push(bulbLight)
		this.lights.push(bulbLight)
		//this._Scene.add(bulbLight)

	}
	_init_DirectionalLight() {
		// this._directionalLight = new THREE.DirectionalLight(
		// 	this._GameConfig.get_directionalLight('color'),
		// 	this._GameConfig.get_directionalLight('intensity')
		// );
		this._directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		
		this._directionalLight.name = 'directionalLight_0';
				// this._directionalLight.castShadow = true;
				this._directionalLight.castShadow = this._GameConfig.get_directionalLight('castShadow')

				// this._directionalLight.shadow.camera.top = 20;
				// this._directionalLight.shadow.camera.bottom = - 20;
				// this._directionalLight.shadow.camera.left = - 20;
				// this._directionalLight.shadow.camera.right = 20;
				// this._directionalLight.shadow.camera.near = 0.1;
				this._directionalLight.shadow.camera.far = 1000;
				this._directionalLight.shadow.camera.near = this._GameConfig.get_directionalLight('shadow').camera.near;
				this._directionalLight.shadow.camera.far = this._GameConfig.get_directionalLight('shadow').camera.far;
				

		// this._directionalLight.name = this._GameConfig.get_directionalLight('name');
		this._directionalLight.penumbra = this._GameConfig.get_directionalLight('penumbra');
		// this._directionalLight.decay = this._GameConfig.get_directionalLight('decay');
		// this._directionalLight.distance = this._GameConfig.get_directionalLight('distance');
		this._directionalLight.shadow.mapSize.width = this._GameConfig.get_directionalLight('shadow').mapSize.width;
		this._directionalLight.shadow.mapSize.height = this._GameConfig.get_directionalLight('shadow').mapSize.height;
		// this._directionalLight.shadow.focus = this._GameConfig.get_directionalLight('shadow').focus;
		
		this._directionalLight.position.set(
			this._GameConfig.get_directionalLight('position').x,
			this._GameConfig.get_directionalLight('position').y,
			this._GameConfig.get_directionalLight('position').z
		)

	}
}
export {LightsManager}
