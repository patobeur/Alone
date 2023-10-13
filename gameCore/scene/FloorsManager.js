import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { FloorsConfig } from "./FloorsConfig.js";
class FloorsManager {
	constructor(GameConfig) {
		this.GameConfig = GameConfig;
		this.GameConfig.Floors = new FloorsConfig();
		this.activatedNumFloors = []
		this.allFloors = []

		// raccourcis
		this.config = this.GameConfig.Floors.config;

	}
	_init() {
		this.addFirstFloor();
	}
	addFirstFloor() {
		this.newFloorMesh = this._get_floorMesh(this.GameConfig.defaultMapNum);
		this.activatedNumFloors.push(this.GameConfig.defaultMapNum)
		this.allFloors.push(this.newFloorMesh)
	}
	addNewFloor(scene,newMapNum) {
			// console.log('addNewFloor-----------------')
			let newFloorMesh = this._get_floorMesh(newMapNum);
			this.activatedNumFloors.push(newMapNum)
			// this.allFloors[this.newMapNum] = currentFloorMesh
			this.allFloors.push(newFloorMesh)
			scene.add(newFloorMesh)
			
		// 	// scene.remove(this.floor)
		// 	this._GameConfig.floors = this.FloorConfig.get_config(FloorNum);
		// 	this.floor = this.get_floorMesh();

		// 	this._currentFloorNum = FloorNum;
		// 	scene.add(this.floor)
		// 	return this.floor
		// }
	}
	_get_floorMesh = (MapNum) => {
		let floorConfig = this.config[MapNum];
		var groundGeometry = false;
		var groundMaterial = false;
		var mesh = false;
		// console.log("------AAAAAAAAAAA---------");
		// console.log(this.GameConfig.Floors);
		// console.log(floorConfig.mode);

		switch (floorConfig.mode.type) {
			case "BoxGeometry":
				groundGeometry = new THREE.BoxGeometry(
					floorConfig.size.x,
					floorConfig.size.y,
					floorConfig.size.z
				);
				groundMaterial = new THREE.MeshPhongMaterial({
					color: floorConfig.color,
				});
				mesh = new THREE.Mesh(groundGeometry, groundMaterial);
				mesh.position.x = floorConfig.position.x;
				mesh.position.y = floorConfig.position.y;
				mesh.position.z = -(floorConfig.size.z / 2);
				break;
			case "PlaneGeometry":
				if (floorConfig.mode.fileName) {
					const mapLoader = new THREE.TextureLoader();
					const boardTexture = mapLoader.load(
						this.GameConfig.Floors.floorsRootPath + floorConfig.mode.fileName
					);
					boardTexture.encoding = THREE.sRGBEncoding;
					boardTexture.anisotropy = this.GameConfig.MaxAnisotropy;
					boardTexture.repeat.set(
						(floorConfig.size.x / floorConfig.repeat[0]) * 2,
						(floorConfig.size.y / floorConfig.repeat[1]) * 2
					);

					boardTexture.wrapS = THREE.RepeatWrapping;
					boardTexture.wrapT = THREE.RepeatWrapping;
					mesh = new THREE.Mesh(
						new THREE.PlaneGeometry(
							floorConfig.size.x,
							floorConfig.size.y,
							10,
							10
						),
						new THREE.MeshStandardMaterial({ map: boardTexture })
					);
					mesh.position.x = floorConfig.position.x;
					mesh.position.y = floorConfig.position.y;
					mesh.position.z = 0;
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
			mesh.name = "floor_" + floorConfig.name;
			// si une position est indiqué
			// if(!typeof floorConfig.position === 'undefined') mesh.position.set(floorConfig.position);
			return mesh;
		}
		return false;
	};
}
export { FloorsManager };
