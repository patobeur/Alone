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
    allMeshsAndDatas
	_MeshDatasList
	mixers = []
	allFbx = []
	comptabiliseCount = 0
	constructor(gameConfig,scene) {
		this._GameConfig = gameConfig
		this.conslog = this._GameConfig.conslog
		this._scene = scene
		this._LOADER = new GLTFLoader();
        this.allMeshsAndDatas = {}
		this._Init()
	}
	_Init() {
		// this._LOADER = new THREE.GLTFLoader();
		this._FBXLOADER = new FBXLoader();
		// this.LoadAnimatedModel()
		this._MeshDatasList = this.get_MeshDatasList()
		this.LoadModelsFrom_list()
	}
	LoadAnimatedModel() {
		const loader = this._FBXLOADER
		loader.setPath('./gameCore/3dObjects/characters/base/');
		loader.load(
			'Casual_Female.fbx',
			(fbx) => {
				fbx.scale.setScalar(0.01);
				fbx.position.y = 4
				fbx.rotation.x = Math.PI/2
				fbx.traverse(c => {c.castShadow = true;});
				loader.load(
					'Casual_Female.fbx',
					(anim) => {
						const m = new THREE.AnimationMixer(fbx);
						this.mixers.push(m);
						const idle = m.clipAction(anim.animations[16]);
						idle.play();
					}
				);

				this.allFbx.push(fbx)
				this._scene.add(fbx);
				this.comptabilise()
			},
			this.comptabilise('finish loading fbx')
		);
	}
	comptabilise(data='+1'){
		this.comptabiliseCount++
		console.log('comptabilise:',data,this.comptabiliseCount++)
	}
	LoadModelsFrom_list() {
		this.counter = 0
		for (const key in this._MeshDatasList) {
			if (this._MeshDatasList.hasOwnProperty.call(this._MeshDatasList, key)) {
				const meshAndDatas = this._MeshDatasList[key];
				this._LoadModel(meshAndDatas)
				this.counter++
			}
		}
	}
	_LoadModel(meshAndDatas) {
		let positions = meshAndDatas.positions
		let rotations = meshAndDatas.rotations
		let scales = meshAndDatas.scales
		let category = meshAndDatas.category
		let parentModelName = meshAndDatas.parentModelName
		if (typeof meshAndDatas.path === 'string' )  {
			this._LOADER.load(meshAndDatas.path, (gltf) => {
				gltf.scene.traverse(c => c.castShadow = true);
				if(positions){gltf.scene.position.set(positions.x,positions.y,positions.z,)}
				if(rotations){if(rotations.x) gltf.scene.rotation.x = rotations.x;if(rotations.y) gltf.scene.rotation.y = rotations.y;if(rotations.z) gltf.scene.rotation.z = rotations.z;}
				if(scales){if(scales.x) gltf.scene.scale.x = scales.x;if(scales.y) gltf.scene.scale.y = scales.y;if(scales.z) gltf.scene.scale.z = scales.z;}
// console.log(gltf)
				if(typeof this.allMeshsAndDatas[category] === 'undefined') {
					this.allMeshsAndDatas[category] = {}
				}
				this.allMeshsAndDatas[category][meshAndDatas.name] = {
					mesh:gltf.scene,
					conf:meshAndDatas
				}
				if(this.conslog === true) console.log('new ' +meshAndDatas.fullName+ ' model loaded.' ,this.allMeshsAndDatas[category][meshAndDatas.name])
				this._scene.add(this.allMeshsAndDatas[category][meshAndDatas.name].mesh)
			
				
			this.comptabilise('_LoadModel par model')
			},
			this.comptabilise('_LoadModel par model fini',this.allMeshsAndDatas)
			);
		}
	}
	get_MeshDatasList(){
		return {
			Casual_Female:{
				name:'Casual_Female',
				fullName:'Alice',
				category:'decor',
				// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
				path:'./gameCore/3dObjects/characters/base/Casual_Female.gltf',
				positions:{x:-3,y:7,z:0,theta:0},
				rotations:{x:Math.PI/2,y:false,z:false},
				scales:false,
				anime:'idle'
			},
			Casual_Male:{
				name:'Casual_Male',
				fullName:'Bob',
				category:'decor',
				path:'./gameCore/3dObjects/characters/base/Casual_Male.gltf',
				positions:{x:-5,y:7,z:0,theta:0},
				rotations:{x:Math.PI/2,y:false,z:false},
				scales:false,
				anime:'idle'
			},
			LunarShip:{
				name:'LunarShip',
				fullName:'LunarShip',
				category:'decor',
				path:'./gameCore/3dObjects/rocket/Rocket_Ship_01.gltf',
				positions:{x:0,y:30,z:0,theta:80},
				rotations:{x:Math.PI/2,y:false,z:false},
				scales:false,
				anime:'idle'
			},
			fire:{
				name:'fire',
				fullName:'Basic fire',
				category:'elements',
				path:'./gameCore/3dObjects/fire/scene.gltf',
				positions:{x:3,y:8,z:0},
				rotations:{x:Math.PI/2,y:Math.PI/2,z:false},
				scales:false,
				anime:'idle'
			}

		}
	}
}
export {ModelsManager}