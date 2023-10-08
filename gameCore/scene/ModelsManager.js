import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { ModelsConfig } from "./ModelsConfig.js";
class ModelsManager {
	conslog = true;
	_LOADER;
	_scene;
	_MeshDatasList;
	allMeshsAndDatas = {};
	mixers = [];
	allFbx = [];
	constructor(datas) {
		this._fonctionretour = datas.fonctionretour;

		this._LOADER = new GLTFLoader();
		this.ModelsConfig = new ModelsConfig();
		this._Init();
	}

	async _Init() {
		this._MeshDatasList = this.ModelsConfig.config;

		await this.LoadModelsFrom_list();
		this.allModelsAndAnimations = this.AddModelsToSceneWithDefaultAnimation();
		this._fonctionretour(this.allModelsAndAnimations); // Call your callback function with loaded data
	}

	setMeshModel(type = "character", name = "Kimono_Female", animName = "Idle") {
		this.currentAnimation = animName;

		this.charGltf = this.allModelsAndAnimations[type][name].gltf;
		this.MegaMixer = new THREE.AnimationMixer(
			this.allModelsAndAnimations[type][name].gltf.scene
		);
		this.MegaClip = THREE.AnimationClip.findByName(
			this.allModelsAndAnimations[type][name].gltf.animations,
			animName
		);
		this.MegaAction = this.MegaMixer.clipAction(this.MegaClip);
		this.MegaAction.play(); // Joue l'animation par défaut

		this.allModelsAndAnimations[type][name].gltf = this.charGltf;
		this.allModelsAndAnimations[type][name].MegaMixer = this.MegaMixer;
		this.allModelsAndAnimations[type][name].MegaClip = this.MegaClip;
		this.allModelsAndAnimations[type][name].MegaAction = this.MegaAction;

		this.allModelsAndAnimations[type][name].changeAnimation = (
			animName
		) => {
			if (this.currentAnimation != animName) {
				this.currentAnimation = animName;
				this.MegaClip = THREE.AnimationClip.findByName(
					this.allModelsAndAnimations[type][name].gltf.animations,
					animName
				);
				this.MegaAction.stop();
				if (this.MegaClip) {
					this.MegaAction = this.MegaMixer.clipAction(this.MegaClip);
					this.MegaAction.play(); // Joue l'animation par défaut
				}
			}
		};
		// (
		// 		// this._GameConfig.playerChar = {
		// 		// 	charGltf: this.charGltf,
		// 		// 	MegaMixer: this.MegaMixer,
		// 		// 	MegaClip: this.MegaClip,
		// 		// 	MegaAction: this.MegaAction,
		// 		// };

		// 		// console.log('playerChar uuid',this.allModelsAndAnimations[type][name].gltf.scene.uuid)
		// 		// this.allModelsAndAnimations[type][name].MegaMixer =
		// 		// 	new THREE.AnimationMixer(
		// 		// 		this.allModelsAndAnimations[type][name].gltf.scene
		// 		// 	);

		// 		// this.allModelsAndAnimations[type][name].MegaClip =
		// 		// 	THREE.AnimationClip.findByName(
		// 		// 		this.allModelsAndAnimations[type][name].gltf.animations,
		// 		// 		animName
		// 		// 	);
		// 		// this.allModelsAndAnimations[type][name].MegaAction =
		// 		// 	this.allModelsAndAnimations[type][name].MegaMixer.clipAction(
		// 		// 		this.allModelsAndAnimations[type][name].MegaClip
		// 		// 	);
		// 		// this.allModelsAndAnimations[type][name].MegaAction.play()

		// 		// this.playerChar = {
		// 		// 	charGltf: this.charGltf,
		// 		// 	MegaMixer: this.MegaMixer,
		// 		// 	MegaClip: this.MegaClip,
		// 		// 	MegaAction: this.MegaAction,
		// 		// };
		// 		// return this.playerChar
		// )
	}
	// setMeshAnimationTo(animName = "Idle") {
	// 	console.log("------------------------------setMeshAnimationTo ");
	// 	if (this.currentAnimation != animName) {
	// 		console.log("------------------------------goind to ", animName);
	// 		this.MegaClip = THREE.AnimationClip.findByName(
	// 			this.charGltf.animations,
	// 			animName
	// 		);
	// 		console.log("this.MegaClip ", this.MegaClip);
	// 		if (this.MegaClip) {
	// 			this.MegaAction = this.MegaMixer.clipAction(this.MegaClip);
	// 			this.MegaAction.play(); // Joue l'animation par défaut
	// 			this.currentAnimation = animName;
	// 		}
	// 	}
	// }
	async LoadModelsFrom_list() {
		const indexedMeshs = [];
		for (const key in this._MeshDatasList) {
			if (this._MeshDatasList.hasOwnProperty.call(this._MeshDatasList, key)) {
				const meshAndDatas = this._MeshDatasList[key];
				indexedMeshs.push(this._LoadModel(meshAndDatas));
			}
		}
		await Promise.all(indexedMeshs);
	}

	async _LoadModel(meshAndDatas) {
		let positions = meshAndDatas.positions;
		let rotations = meshAndDatas.rotations;
		let scales = meshAndDatas.scales;
		let category = meshAndDatas.category;
		if (typeof meshAndDatas.path === "string") {
			await new Promise((resolve) => {
				this._LOADER.load(meshAndDatas.path, (gltf) => {
					gltf.scene.traverse((c) => (c.castShadow = true));
					if (positions) {
						gltf.scene.position.set(positions.x, positions.y, positions.z);
					}
					if (rotations) {
						if (rotations.x) gltf.scene.rotation.x = rotations.x;
						if (rotations.y) gltf.scene.rotation.y = rotations.y;
						if (rotations.z) gltf.scene.rotation.z = rotations.z;
					}
					if (scales) {
						if (scales.x) gltf.scene.scale.x = scales.x;
						if (scales.y) gltf.scene.scale.y = scales.y;
						if (scales.z) gltf.scene.scale.z = scales.z;
					}

					if (typeof this.allMeshsAndDatas[category] === "undefined") {
						this.allMeshsAndDatas[category] = {};
					}
					this.allMeshsAndDatas[category][meshAndDatas.name] = {
						mesh: gltf.scene,
						conf: meshAndDatas,
						gltf: gltf,
					};

					resolve();
				});
			});
		}
	}

	AddModelsToSceneWithDefaultAnimation() {
		for (const key in this.allMeshsAndDatas) {
			if (this.allMeshsAndDatas.hasOwnProperty(key)) {
				const category = this.allMeshsAndDatas[key];
				for (const modelKey in category) {
					if (category.hasOwnProperty(modelKey)) {
						const model = category[modelKey];
					}
				}
			}
		}
		return this.allMeshsAndDatas;
	}
}
export { ModelsManager };
