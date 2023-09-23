import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class FloorsManager {
	_GameConfig
	_currentImmat = 1 // current floor
	floor = null
	floorConfig = null
	order = 2
	_maxAnisotropy
	floorsRootPath = './gameCore/3dAssets/floors/'
	backgroundsRootPath = './gameCore/3dAssets/backgrounds/'
	constructor(GameConfig) {

		this._GameConfig = GameConfig
		this._init()
	}
	_init() {
		this._initFloor()
		if (this._GameConfig.conslog) {
			console.info('Floors Mounted !')
			console.log('floor', this.floor)
			console.log('floorConfig', this._GameConfig.floors)
		}
	}
	_initFloor() {
		this._GameConfig.floors = this.get_floorConfig()
		this.floor = this.get_floorMesh()
	}
	get_floorMesh = () => {

		var groundGeometry = false
		var groundMaterial = false
		var mesh = false
		switch (this._GameConfig.floors.mode.type) {
			case 'BoxGeometry':
				groundGeometry = new THREE.BoxGeometry(this._GameConfig.floors.size.x, this._GameConfig.floors.size.y, this._GameConfig.floors.size.z);
				groundMaterial = new THREE.MeshPhongMaterial({ color: this._GameConfig.floors.color });
				mesh = new THREE.Mesh(groundGeometry, groundMaterial);
				// somme updates
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				mesh.name = 'floor_' + this._GameConfig.floors.name;
				if (this._GameConfig.conslog) console.log(this._GameConfig.floors.size)
				console.log(
					0 - (this._GameConfig.floors.size.x / 2),
					0 - (this._GameConfig.floors.size.y / 2),
					0 - (this._GameConfig.floors.size.z / 2)
				)
				// groundMaterial = new THREE.MeshPhongMaterial({ map: texture })
				break;
			case 'PlaneGeometry':
				if (this._GameConfig.floors.mode.fileName) {
					const mapLoader = new THREE.TextureLoader();
					const boardTexture = mapLoader.load(this.floorsRootPath + this._GameConfig.floors.mode.fileName);
					boardTexture.encoding = THREE.sRGBEncoding;
					boardTexture.anisotropy = this._GameConfig.MaxAnisotropy;
					boardTexture.repeat.set((this._GameConfig.floors.size.x / this._GameConfig.floors.repeat[0]) * 2, (this._GameConfig.floors.size.y / this._GameConfig.floors.repeat[1]) * 2);

					boardTexture.wrapS = THREE.RepeatWrapping;
					boardTexture.wrapT = THREE.RepeatWrapping;
					mesh = new THREE.Mesh(
						new THREE.PlaneGeometry(this._GameConfig.floors.size.x, this._GameConfig.floors.size.y, 10, 10),
						new THREE.MeshStandardMaterial({ map: boardTexture })
					);
					mesh.castShadow = false;
					mesh.receiveShadow = true;
					mesh.name = 'floor_' + this._GameConfig.floors.name;
					if (this._GameConfig.conslog) console.log(mesh)
				}
				break;
			default:
				console.error('???')
				groundGeometry = false
				groundMaterial = false
				break;
		}
		// create mesh
		if (!mesh === false) {
			// si une position est indiqué
			// if(!typeof this._GameConfig.floors.position === 'undefined') mesh.position.set(this._GameConfig.floors.position);
			return mesh;
		}
		return false;
	}
	get_floorConfig = () => {
		let floorsconfig = {
			0: {
				name: 'groundZero',
				fullName: 'Lobby Room',
				mode: { type: 'BoxGeometry', },
				size: { x: 16, y: 32, z: .1 },
				color: 0xEAEAEA,
				receiveShadow: true,
				repeat: [8, 8],
				spawns: [
					{ x: 0, y: -15.5, z: 5 },
					{ x: 0, y: 0, z: 0 },
				],
				mobs: { number: 10 }
			},
			1: {
				name: 'groundOne',
				fullName: 'Ground-One',
				imagesize: { x: 512, y: 512 },
				mode: {
					type: 'PlaneGeometry',
					fileName: 'stone_floor_736x736.jpg',
					size: { x: 512, y: 512 }
				},
				size: { x: 350, y: 350, z: .1 },
				color: 0x1c1c1c,
				receiveShadow: true,
				repeat: [64, 64],
				spawns: [
					{ x: 0, y: -30, z: 20 },
					{ x: 0, y: 0, z: 5 },
				],
				mobs: { number: 101 }
			}
		}
		let config = floorsconfig[this._currentImmat]
		// get position if not
		// if(typeof config.position === 'undefined') config.position = { x: -(config.size.x/2), y: -(config.size.y/2), z: -(config.size.z/2) };
		return config
	}
	get_plan() {
		const mapLoader = new THREE.TextureLoader();
		// const backgroundScene = mapLoader.load('./gameCore/3dAssets/textures/grid64_512.png');
		const backgroundScene = mapLoader.load(this.backgroundsRootPath + '2k_stars_milky_way.jpg');
		backgroundScene.anisotropy = this._maxAnisotropy;
		backgroundScene.wrapS = THREE.RepeatWrapping;
		backgroundScene.wrapT = THREE.RepeatWrapping;
		backgroundScene.repeat.set(20, 20);
		backgroundScene.encoding = THREE.sRGBEncoding;

		const mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(1000, 1000, 10, 10),
			new THREE.MeshStandardMaterial({ map: backgroundScene }));
		// mesh.castShadow = false;
		mesh.position.z = -7
		// mesh.receiveShadow = true;
		// mesh.rotation.x = -Math.PI / 2;
		if (this._GameConfig.conslog) console.log(mesh)
		return mesh
	}
	setFloorByImmat(Immat) {
		if (this.floor) {
			this._Scene.remove(this.floor);
			this.floor = null
			this._currentImmat = Immat
			this.initFloor()
		}
	}
}
export { FloorsManager }


