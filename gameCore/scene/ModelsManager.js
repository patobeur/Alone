import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
// import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
class ModelsManager {
  conslog = true;
  _LOADER;
  _scene;
  _MeshDatasList;
  allMeshsAndDatas = {};
  mixers = [];
  allFbx = [];
  constructor(gameConfig, scene, fonctionretour) {
    this.fonctionretour = fonctionretour;
    this._scene = scene;
    this._LOADER = new GLTFLoader();
    this._Init();
  }

  async _Init() {
    this._MeshDatasList = this.get_MeshDatasList();
    await this.LoadModelsFrom_list();
    const allModelsAndAnimations = this.AddModelsToSceneWithDefaultAnimation();
    this.fonctionretour(allModelsAndAnimations); // Call your callback function with loaded data
  }

  async LoadModelsFrom_list() {
    const promises = [];
    for (const key in this._MeshDatasList) {
      if (this._MeshDatasList.hasOwnProperty.call(this._MeshDatasList, key)) {
        const meshAndDatas = this._MeshDatasList[key];
        promises.push(this._LoadModel(meshAndDatas));
      }
    }
    await Promise.all(promises);
  }

  async _LoadModel(meshAndDatas) {
    let positions = meshAndDatas.positions;
    let rotations = meshAndDatas.rotations;
    let scales = meshAndDatas.scales;
    let category = meshAndDatas.category;
    if (typeof meshAndDatas.path === 'string') {
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

          if (typeof this.allMeshsAndDatas[category] === 'undefined') {
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
            this._scene.add(model.mesh);
          }
        }
      }
    }
    return this.allMeshsAndDatas;
  }

  get_MeshDatasList() {
    return {
		Casual_Female:{
			category:'character',
			name:'Casual_Female',
			fullName:'Alice',
			// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
			path:'./gameCore/3dObjects/characters/base/Casual_Female.gltf',
			// path:'./gameCore/3dObjects/characters/base/X Bot.fbx',
			positions:{x:0,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		},
		Casual_Male:{
			category:'character',
			name:'Casual_Male',
			fullName:'Alice',
			// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
			path:'./gameCore/3dObjects/characters/base/Casual_Male.gltf',
			positions:{x:1,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		},
		Kimono_Female:{
			name:'Kimono_Female',
			fullName:'Bob',
			category:'character',
			path:'./gameCore/3dObjects/characters/base/Kimono_Female.gltf',
			positions:{x:2,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		},
		Kimono_Male:{
			name:'Kimono_Male',
			fullName:'Bob',
			category:'character',
			path:'./gameCore/3dObjects/characters/base/Kimono_Male.gltf',
			positions:{x:3,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		},
		Knight_Golden_Female:{
			name:'Knight_Golden_Female',
			fullName:'Audrey',
			category:'character',
			path:'./gameCore/3dObjects/characters/base/Knight_Golden_Female.gltf',
			positions:{x:4,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'Idle'
		},
		Knight_Golden_Male:{
			name:'Knight_Golden_Male',
			fullName:'Bob',
			category:'character',
			path:'./gameCore/3dObjects/characters/base/Knight_Golden_Male.gltf',
			positions:{x:-2,y:0,z:0,theta:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'Idle'
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
			category:'decor',
			path:'./gameCore/3dObjects/fire/scene.gltf',
			positions:{x:5,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		},
		Pug:{
			name:'Pug',
			fullName:'Pug',
			category:'decor',
			path:'./gameCore/3dObjects/characters/base/Pug.gltf',
			positions:{x:6,y:0,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		},
		BaseCharacter:{
			name:'BaseCharacter',
			fullName:'BaseCharacter',
			category:'character',
			path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
			positions:{x:7,y:-1,z:0},
			rotations:{x:Math.PI/2,y:false,z:false},
			scales:false,
			anime:'idle'
		}
	}
  }
}

export { ModelsManager };

// class ModelsManager3 {
//   conslog = true;
//   order = 1;
//   _LOADER;
//   _FBXLOADER;
//   _GameConfig;
//   _scene;
//   _MeshDatasList;
//   allMeshsAndDatas = {};
//   mixers = [];
//   allFbx = [];

//   constructor(gameConfig, scene, fonctionretour) {
//     this.fonctionretour = fonctionretour;
//     this._GameConfig = gameConfig;
//     this.conslog = this._GameConfig.conslog;
//     this._scene = scene;
//     this._LOADER = new GLTFLoader();
//     this._Init();
//   }

//   async _Init() {
//     this._FBXLOADER = new FBXLoader();
//     this._MeshDatasList = this.get_MeshDatasList();
//     await this.LoadModelsFrom_list();
//     await this.LoadAnimations();
//     const allModelsAndAnimations = this.AddModelsToSceneWithDefaultAnimation();
//     this.fonctionretour(allModelsAndAnimations); // Call your callback function with loaded data
//   }

//   async LoadModelsFrom_list() {
//     const promises = [];
//     for (const key in this._MeshDatasList) {
//       if (this._MeshDatasList.hasOwnProperty.call(this._MeshDatasList, key)) {
//         const meshAndDatas = this._MeshDatasList[key];
// 		console.log('meshAndDatas',meshAndDatas)
//         promises.push(this._LoadModel(meshAndDatas));
//       }
//     }
//     await Promise.all(promises);
//   }

//   async _LoadModel(meshAndDatas) {
//     let positions = meshAndDatas.positions;
//     let rotations = meshAndDatas.rotations;
//     let scales = meshAndDatas.scales;
//     let category = meshAndDatas.category;
//     let parentModelName = meshAndDatas.parentModelName;
//     if (typeof meshAndDatas.path === 'string') {
//       await new Promise((resolve) => {
//         this._LOADER.load(meshAndDatas.path, (gltf) => {
//           gltf.scene.traverse((c) => (c.castShadow = true));
//           if (positions) {
//             gltf.scene.position.set(positions.x, positions.y, positions.z);
//           }
//           if (rotations) {
//             if (rotations.x) gltf.scene.rotation.x = rotations.x;
//             if (rotations.y) gltf.scene.rotation.y = rotations.y;
//             if (rotations.z) gltf.scene.rotation.z = rotations.z;
//           }
//           if (scales) {
//             if (scales.x) gltf.scene.scale.x = scales.x;
//             if (scales.y) gltf.scene.scale.y = scales.y;
//             if (scales.z) gltf.scene.scale.z = scales.z;
//           }

//           if (typeof this.allMeshsAndDatas[category] === 'undefined') {
//             this.allMeshsAndDatas[category] = {};
//           }
//           this.allMeshsAndDatas[category][meshAndDatas.name] = {
//             mesh: gltf.scene,
//             conf: meshAndDatas,
//           };
//           if (this.conslog === true)
//             console.log(
//               'new ' + meshAndDatas.fullName + ' model loaded.',
//               this.allMeshsAndDatas[category][meshAndDatas.name]
//             );
//           resolve();
//         });
//       });
//     }
//   }

//   async LoadAnimations() {
//     // const loader = this._FBXLOADER;
//     const animationPromises = [];
//     for (const key in this.allFbx) {
//       if (this.allFbx.hasOwnProperty(key)) {
//         const fbxModel = this.allFbx[key];
// 		console.log('PROMMESS ajouté');
//         animationPromises.push(this.LoadAnimationForModel(fbxModel));
//       }
//     }
//     await Promise.all(animationPromises);
//   }

//   LoadAnimationForModel(fbxModel) {
//     return new Promise((resolve) => {
//       loader.load(
//         'animation_filename.fbx', // Replace with the actual animation file path
//         (anim) => {
//           const m = new THREE.AnimationMixer(fbxModel);
//           this.mixers.push(m);
//           const defaultAnimation = m.clipAction(anim.animations[0]); // Change the index to the appropriate animation
//           defaultAnimation.play();
//           resolve();
//         }
//       );
//     });
//   }

//   AddModelsToSceneWithDefaultAnimation() {
// 	console.log('##########################',this.allFbx)
//     for (const key in this.allFbx) {
//       if (this.allFbx.hasOwnProperty(key)) {
//         const fbxModel = this.allFbx[key];
// 		console.log('add SCENE++++++++')
//         this._scene.add(fbxModel);
//       }
//     }
//     return this.allMeshsAndDatas;
//   }


//   get_MeshDatasList(){
// 	return {
// 		Casual_Female:{
// 			name:'Casual_Female',
// 			fullName:'Alice',
// 			category:'character',
// 			// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
// 			path:'./gameCore/3dObjects/characters/base/Casual_Female.gltf',
// 			positions:{x:-3,y:7,z:0,theta:0},
// 			rotations:{x:Math.PI/2,y:false,z:false},
// 			scales:false,
// 			anime:'idle'
// 		},
// 		Kimono_Female:{
// 			name:'Kimono_Female',
// 			fullName:'Bob',
// 			category:'character',
// 			path:'./gameCore/3dObjects/characters/base/Kimono_Female.gltf',
// 			positions:{x:-5,y:7,z:0,theta:0},
// 			rotations:{x:Math.PI/2,y:false,z:false},
// 			scales:false,
// 			anime:'idle'
// 		},
// 		Casual_Male:{
// 			name:'Casual_Male',
// 			fullName:'Bob',
// 			category:'character',
// 			path:'./gameCore/3dObjects/characters/base/Casual_Male.gltf',
// 			positions:{x:-5,y:7,z:0,theta:0},
// 			rotations:{x:Math.PI/2,y:false,z:false},
// 			scales:false,
// 			anime:'idle'
// 		},
// 		LunarShip:{
// 			name:'LunarShip',
// 			fullName:'LunarShip',
// 			category:'decor',
// 			path:'./gameCore/3dObjects/rocket/Rocket_Ship_01.gltf',
// 			positions:{x:0,y:30,z:0,theta:80},
// 			rotations:{x:Math.PI/2,y:false,z:false},
// 			scales:false,
// 			anime:'idle'
// 		},
// 		fire:{
// 			name:'fire',
// 			fullName:'Basic fire',
// 			category:'decor',
// 			path:'./gameCore/3dObjects/fire/scene.gltf',
// 			positions:{x:3,y:8,z:0},
// 			rotations:{x:Math.PI/2,y:Math.PI/2,z:false},
// 			scales:false,
// 			anime:'idle'
// 		}
// 	}
// }
// }

// export { ModelsManager };


// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
// import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
// import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

// // Why not this ?
// // import * as THREE from '/vendor/three.module.js';
// // import {FBXLoader} from '/vendor/FBXLoader.js';
// // import {GLTFLoader} from '/vendor/GLTFLoader.js';

// class ModelsManager {
// 	conslog = true
// 	order=1
// 	_LOADER
// 	_FBXLOADER
// 	_GameConfig;
// 	_GameConfig
// 	_scene
// 	_MeshDatasList
// 	comptabiliseCount = 0
	
//     allMeshsAndDatas = {}
// 	mixers = []
// 	allFbx = []
// 	constructor(gameConfig,scene,fonctionretour) {
// 		this.fonctionretour = fonctionretour
// 		this._GameConfig = gameConfig
// 		this.conslog = this._GameConfig.conslog
// 		this._scene = scene
// 		this._LOADER = new GLTFLoader();
// 		this._Init()
// 	}
// 	_Init() {
// 		this._FBXLOADER = new FBXLoader();
// 		this._MeshDatasList = this.get_MeshDatasList()
// 		this.LoadModelsFrom_list()
// 	}
// 	LoadAnimatedModelFromMain() {
// 		const loader = this._FBXLOADER
// 		loader.setPath('./gameCore/3dObjects/characters/base/');
// 		loader.load(
// 			'Casual_Female.fbx',
// 			(fbx) => {
// 				fbx.scale.setScalar(0.01);
// 				fbx.position.y = 4
// 				fbx.rotation.x = Math.PI/2
// 				fbx.traverse(c => {c.castShadow = true;});
// 				loader.load(
// 					'Casual_Female.fbx',
// 					(anim) => {
// 						const m = new THREE.AnimationMixer(fbx);
// 						this.mixers.push(m);
// 						const idle = m.clipAction(anim.animations[16]);
// 						idle.play();
// 					}
// 				);

// 				this.allFbx.push(fbx)
// 				this._scene.add(fbx);
// 				this.comptabilise()
// 			},
// 			this.comptabilise('finish loading fbx')
// 		);
// 	}
// 	comptabilise(data='vide'){
// 		this.comptabiliseCount++
// 		console.log('comptabilise:',data,this.comptabiliseCount++)
// 	}
// 	LoadModelsFrom_list() {
// 		this.counter = 0
// 		for (const key in this._MeshDatasList) {
// 			if (this._MeshDatasList.hasOwnProperty.call(this._MeshDatasList, key)) {
// 				const meshAndDatas = this._MeshDatasList[key];
// 				this._LoadModel(meshAndDatas)
// 				this.counter++
// 			}
// 		}
// 	}
// 	_LoadModel(meshAndDatas) {
// 		let positions = meshAndDatas.positions
// 		let rotations = meshAndDatas.rotations
// 		let scales = meshAndDatas.scales
// 		let category = meshAndDatas.category
// 		let parentModelName = meshAndDatas.parentModelName
// 		if (typeof meshAndDatas.path === 'string' )  {
// 			this._LOADER.load(meshAndDatas.path, (gltf) => {
// 				gltf.scene.traverse(c => c.castShadow = true);
// 				if(positions){gltf.scene.position.set(positions.x,positions.y,positions.z,)}
// 				if(rotations){if(rotations.x) gltf.scene.rotation.x = rotations.x;if(rotations.y) gltf.scene.rotation.y = rotations.y;if(rotations.z) gltf.scene.rotation.z = rotations.z;}
// 				if(scales){if(scales.x) gltf.scene.scale.x = scales.x;if(scales.y) gltf.scene.scale.y = scales.y;if(scales.z) gltf.scene.scale.z = scales.z;}

// 				// console.log(gltf)
// 				if(typeof this.allMeshsAndDatas[category] === 'undefined') {
// 					this.allMeshsAndDatas[category] = {}
// 				}
// 				this.allMeshsAndDatas[category][meshAndDatas.name] = {
// 					mesh:gltf.scene,
// 					conf:meshAndDatas
// 				}
// 				if(this.conslog === true) console.log('new ' +meshAndDatas.fullName+ ' model loaded.' ,this.allMeshsAndDatas[category][meshAndDatas.name])
// 				// this._scene.add(this.allMeshsAndDatas[category][meshAndDatas.name].mesh)
			
				
// 			this.comptabilise('_LoadModel par model----------------------------------------------------------------')
// 			},
// 			this.comptabilise('_LoadModel par model fini',this.allMeshsAndDatas)
// 			);
// 		}
// 	}
// 	get_MeshDatasList(){
// 		return {
// 			Casual_Female:{
// 				name:'Casual_Female',
// 				fullName:'Alice',
// 				category:'decor',
// 				// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
// 				path:'./gameCore/3dObjects/characters/base/Casual_Female.gltf',
// 				positions:{x:-3,y:7,z:0,theta:0},
// 				rotations:{x:Math.PI/2,y:false,z:false},
// 				scales:false,
// 				anime:'idle'
// 			},
// 			Kimono_Female:{
// 				name:'Kimono_Female',
// 				fullName:'Bob',
// 				category:'decor',
// 				path:'./gameCore/3dObjects/characters/base/Kimono_Female.gltf',
// 				positions:{x:-5,y:7,z:0,theta:0},
// 				rotations:{x:Math.PI/2,y:false,z:false},
// 				scales:false,
// 				anime:'idle'
// 			},
// 			Casual_Male:{
// 				name:'Casual_Male',
// 				fullName:'Bob',
// 				category:'decor',
// 				path:'./gameCore/3dObjects/characters/base/Casual_Male.gltf',
// 				positions:{x:-5,y:7,z:0,theta:0},
// 				rotations:{x:Math.PI/2,y:false,z:false},
// 				scales:false,
// 				anime:'idle'
// 			},
// 			LunarShip:{
// 				name:'LunarShip',
// 				fullName:'LunarShip',
// 				category:'decor',
// 				path:'./gameCore/3dObjects/rocket/Rocket_Ship_01.gltf',
// 				positions:{x:0,y:30,z:0,theta:80},
// 				rotations:{x:Math.PI/2,y:false,z:false},
// 				scales:false,
// 				anime:'idle'
// 			},
// 			fire:{
// 				name:'fire',
// 				fullName:'Basic fire',
// 				category:'elements',
// 				path:'./gameCore/3dObjects/fire/scene.gltf',
// 				positions:{x:3,y:8,z:0},
// 				rotations:{x:Math.PI/2,y:Math.PI/2,z:false},
// 				scales:false,
// 				anime:'idle'
// 			}

// 		}
// 	}
// }
// export {ModelsManager}
