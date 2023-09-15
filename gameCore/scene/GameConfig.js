import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class GameConfig {
	version = 0.000002;
	conslog = true
	sceneName = '3DExperience';
	pauseModalText = 'Pause Console !';
	canvasId = 'game';
	#renderer = false;
	// config;
	#directionalLight = false;
	#ambientLight = false;
	#spotLight = false;
	#orbitcontrols = true;
	order = 0
	gravity = 0.001
	constructor(conslog) {
		this.conslog = conslog
		this.#Init()
	}
	#Init(conslog) {
		this.#renderer = {
			// color: 0x000000,
			color: 0xB7C3F3,
			clearcolor: 0x00FF00,
			intensity: new Number(0.0),
			shadowMapenabled: true,
			shadowMaptype: 'THREE.PCFSoftShadowMap',
			colorManagement:true,
			outputEncoding: 'THREE.SRGBColorSpace'
		}
		this.#ambientLight = {
			name:'ambientLight',
			color: 0xFF0000,
			intensity: 0.1
		}
		this.#directionalLight = {
			name:'directionalLight',
			color: 0xFFFFFF,
			intensity: .2,
			castShadow: true,
			position: new THREE.Vector3(3, 10, 300),
			lookat: new THREE.Vector3(0, 0, 0),
			penumbra: 1,
			decay: 1,
			distance: 3000,
			shadow: {
				mapSize: {
					width: 2048,
					height: 2048
				},
				camera: {
					near: 1,
					far: 5000
				},
				focus: 1
			},
			lookat: new THREE.Vector3(0, 0, 0),
		}
		this.#spotLight = {
			name:'spotLight',
			color: 0xffffff,
			intensity: 0.5,
			position: new THREE.Vector3(1, 1, 1),
			angle: Math.PI / 4,
			penumbra: 0.1,
			decay: 0.1,
			distance: 1,
			castShadow: {
				mapSize: {
					width: 512,
					height: 512
				},
				camera: {
					near: 1,
					far: 5000
				},
				focus: 1
			},
			lookat: new THREE.Vector3(0, 0, 0),
		}
		if (this.conslog) console.info('Config Mounted !','conslog:',this.conslog)
	}

	set_value(varName,data) {
		this[varName] = data
		if (this.conslog) console.log(varName+ 'set to : '+this[varName])
	}
	get_renderer(value) {
		if (this.#renderer && this.#renderer[value]) {
			return this.#renderer[value]
		}
		if (this.conslog) console.error("'" + value + '" n\'existe pas (get_renderer)')

	}
	get_directionalLight(value) {
		if (this.#directionalLight && this.#directionalLight[value]) {
			return this.#directionalLight[value]
		}
		if (this.conslog) console.error("'" + value + '" n\'existe pas (get_directionalLight)')
	}
	get_ambientLight(value) {
		if (this.#ambientLight && this.#ambientLight[value]) {
			return this.#ambientLight[value]
		}
		if (this.conslog) console.error("'" + value + '" n\'existe pas (get_ambientLight)')
	}
	get_orbitcontrols() {
		return this.#orbitcontrols
	}
}
export {GameConfig}
