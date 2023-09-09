import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
class ModelsManager {
	conslog = true
	order=1
	_LOADER
	_FBXLOADER
	_GameConfig;
	_GameConfig
	_scene
    allModels
	_list
	mixers = []
	allFbx = []
	constructor(gameConfig,scene) {
		this._GameConfig = gameConfig
		this.conslog = this._GameConfig.conslog
		this._scene = scene
		this._LOADER = new GLTFLoader();
        this.allModels = {}
		this._Init()
	}
	_Init() {
		// this._LOADER = new THREE.GLTFLoader();
		this._FBXLOADER = new FBXLoader();
		// this.LoadAnimatedModel()
		this._list = this.get_List()
		this.LoadModelsFrom_list()
	}
	LoadAnimatedModel() {
		const loader = this._FBXLOADER
		loader.setPath('./gameCore/3dObjects/characters/base/');
		loader.load('Casual_Female.fbx', (fbx) => {
			fbx.scale.setScalar(0.01);
			fbx.position.y = -59
			fbx.position.x = -1
			fbx.rotation.x = Math.PI/2
			fbx.traverse(c => {
				c.castShadow = true;
			});

			loader.load('Casual_Female.fbx', (anim) => {
				const m = new THREE.AnimationMixer(fbx);
				this.mixers.push(m);
				const idle = m.clipAction(anim.animations[16]);
				idle.play();
			});

			this.allFbx.push(fbx)
			this._scene.add(fbx);
		},
		this.comptabilise());
	}
	comptabilise(data=false){
		console.log('comptabilise:',data)
	}
	LoadModelsFrom_list() {
		this.counter = 0
		for (const key in this._list) {
			if (this._list.hasOwnProperty.call(this._list, key)) {
				const element = this._list[key];
				this._LoadModel(element)
				this.counter++
			}
		}
	}
	_LoadModel(confdatas) {
		let positions = confdatas.positions
		let rotations = confdatas.rotations
		let scales = confdatas.scales
		let category = confdatas.category
		let parentModelName = confdatas.parentModelName
		if (typeof confdatas.path === 'string' )  {
			this._LOADER.load(confdatas.path, (gltf) => {
				gltf.scene.traverse(c => c.castShadow = true);
				if(positions){gltf.scene.position.set(positions.x,positions.y,positions.z,)}
				if(rotations){if(rotations.x) gltf.scene.rotation.x = rotations.x;if(rotations.y) gltf.scene.rotation.y = rotations.y;if(rotations.z) gltf.scene.rotation.z = rotations.z;}
				if(scales){if(scales.x) gltf.scene.scale.x = scales.x;if(scales.y) gltf.scene.scale.y = scales.y;if(scales.z) gltf.scene.scale.z = scales.z;}
// console.log(gltf)q
				if(typeof this.allModels[category] === 'undefined') {
					this.allModels[category] = {}
				}
				this.allModels[category][confdatas.name] = {
					mesh:gltf.scene,
					confdatas:confdatas
				}
				if(this.conslog === true) console.log('new ' +confdatas.fullName+ ' model loaded.' ,this.allModels[category][confdatas.name])
				this._scene.add(this.allModels[category][confdatas.name].mesh)
			});
		}
	}
	get_List(){
		return {
			Casual_Female:{
				name:'Casual_Female',
				fullName:'Alice',
				category:'decor',
				// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
				path:'./gameCore/3dObjects/characters/base/Casual_Female.gltf',
				positions:{x:-3,y:-57,z:0,theta:0},
				rotations:{x:Math.PI/2,y:Math.PI/4,z:false},
				scales:false,
				anime:'idle'
			},
			Casual_Male:{
				name:'Casual_Male',
				fullName:'Bob',
				category:'decor',
				path:'./gameCore/3dObjects/characters/base/Casual_Male.gltf',
				positions:{x:-3,y:-59,z:0,theta:0},
				rotations:{x:Math.PI/2,y:Math.PI/4,z:false},
				scales:false,
				anime:'idle'
			},
			LunarShip:{
				name:'LunarShip',
				fullName:'LunarShip',
				category:'decor',
				path:'./gameCore/3dObjects/rocket/Rocket_Ship_01.gltf',
				positions:{x:0,y:60,z:0,theta:80},
				rotations:{x:Math.PI/2,y:false,z:false},
				scales:false,
				anime:'idle'
			},
			fire:{
				name:'fire',
				fullName:'Basic fire',
				category:'elements',
				path:'./gameCore/3dObjects/fire/scene.gltf',
				positions:{x:0,y:-62,z:0},
				rotations:{x:Math.PI/2,y:Math.PI/7,z:false},
				scales:false,
				anime:'idle'
			}

		}
	}
}
export {ModelsManager}