import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { FloorsConfig } from "./FloorsConfig.js";
class FloorsManager {
	GameConfig;
	floor = null;
	_maxAnisotropy;
	constructor(GameConfig) {
		this.GameConfig = GameConfig;
		this.GameConfig.Floors = new FloorsConfig();

		this.currentMapNum = this.GameConfig.defaultMapNum;

		this.activatedNumFloors = []
		this.allFloors = []

		// raccourcis
		this.floorsConfig = this.GameConfig.Floors.config;

		this._init();
	}
	_init() {
		this._initFirstFloor();
	}
	_initFirstFloor() {
		this.currentFloorMesh = this._get_floorMesh(this.currentMapNum);
		// this.floor = this._get_floorMesh(this.currentMapNum);

		this.activatedNumFloors.push(this.currentMapNum)
		// this.allFloors[this.currentMapNum] = currentFloorMesh
		this.allFloors.push(this.currentFloorMesh)
		

		// console.log("-------this.allFloors--------------------------");
		// console.log(this.allFloors);
		// console.log(this.activatedNumFloors);
		// console.log("------- ok ok ok ok o--------------------------");

	}
	addNewFloor(scene,currentMapNum) {
		// if (this.floor) {
			console.log('NEW FLOOOR-----------------')
			let currentFloorConfig = this.floorsConfig[currentMapNum];

			
			let newFloorMesh = this._get_floorMesh(currentMapNum);
			this.activatedNumFloors.push(currentMapNum)
			// this.allFloors[this.currentMapNum] = currentFloorMesh
			this.allFloors.push(newFloorMesh)
			console.log('------------GGGGGGGGGGGGGGGGGGGGG')
			console.log(this.allFloors)
			scene.add(newFloorMesh)
			
		// 	// scene.remove(this.floor)
		// 	this._GameConfig.floors = this.FloorConfig.get_config(FloorNum);
		// 	this.floor = this.get_floorMesh();

		// 	this._currentFloorNum = FloorNum;
		// 	scene.add(this.floor)
		// 	return this.floor
		// }
	}
	_get_floorMesh = (currentMapNum) => {
		let currentFloorConfig = this.floorsConfig[currentMapNum];
		console.log('---sdfgsdf----------------')
		console.log(currentFloorConfig)
		var groundGeometry = false;
		var groundMaterial = false;
		var mesh = false;
		// console.log("------AAAAAAAAAAA---------");
		// console.log(this.GameConfig.Floors);
		// console.log(currentFloorConfig.mode);

		switch (currentFloorConfig.mode.type) {
			case "BoxGeometry":
				groundGeometry = new THREE.BoxGeometry(
					currentFloorConfig.size.x,
					currentFloorConfig.size.y,
					currentFloorConfig.size.z
				);
				groundMaterial = new THREE.MeshPhongMaterial({
					color: currentFloorConfig.color,
				});
				mesh = new THREE.Mesh(groundGeometry, groundMaterial);
				mesh.position.x = currentFloorConfig.position.x;
				mesh.position.y = currentFloorConfig.position.y;
				mesh.position.z = -(currentFloorConfig.size.z / 2);
				break;
			case "PlaneGeometry":
				if (currentFloorConfig.mode.fileName) {
					const mapLoader = new THREE.TextureLoader();
					const boardTexture = mapLoader.load(
						this.GameConfig.Floors.floorsRootPath + currentFloorConfig.mode.fileName
					);
					boardTexture.encoding = THREE.sRGBEncoding;
					boardTexture.anisotropy = this.GameConfig.MaxAnisotropy;
					boardTexture.repeat.set(
						(currentFloorConfig.size.x / currentFloorConfig.repeat[0]) * 2,
						(currentFloorConfig.size.y / currentFloorConfig.repeat[1]) * 2
					);

					boardTexture.wrapS = THREE.RepeatWrapping;
					boardTexture.wrapT = THREE.RepeatWrapping;
					mesh = new THREE.Mesh(
						new THREE.PlaneGeometry(
							currentFloorConfig.size.x,
							currentFloorConfig.size.y,
							10,
							10
						),
						new THREE.MeshStandardMaterial({ map: boardTexture })
					);
					if (this.GameConfig.conslog) console.log(mesh);
				}
				break;
			default:
				break;
		}
		// create mesh
		if (!mesh === false) {
			mesh.castShadow = false;
			mesh.receiveShadow = true;
			mesh.name = "floor_" + currentFloorConfig.name;
			// si une position est indiqué
			// if(!typeof currentFloorConfig.position === 'undefined') mesh.position.set(currentFloorConfig.position);
			return mesh;
		}
		return false;
	};
}
export { FloorsManager };
