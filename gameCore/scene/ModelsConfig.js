class ModelsConfig {
	constructor() {
		this._init();
	}
	_init() {
		this.config = this.get_config();
	}
	get_config() {
		let config = {
			// Casual_Female:{
			// 	category:'character',
			// 	name:'Casual_Female',
			// 	fullName:'Alice',
			// 	// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
			// 	path:'./gameCore/3dObjects/characters/base/Casual_Female.gltf',
			// 	// path:'./gameCore/3dObjects/characters/base/X Bot.fbx',
			// 	positions:{x:0,y:0,z:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'idle'
			// },
			// Casual_Male:{
			// 	category:'character',
			// 	name:'Casual_Male',
			// 	fullName:'Alice',
			// 	// path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
			// 	path:'./gameCore/3dObjects/characters/base/Casual_Male.gltf',
			// 	positions:{x:1,y:0,z:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'idle'
			// },
			Kimono_Female:{
				name:'Kimono_Female',
				fullName:'Bob',
				category:'character',
				path:'./gameCore/3dObjects/characters/base/Kimono_Female.gltf',
				positions:{x:0,y:0,z:0},
				rotations:{x:Math.PI/2,y:Math.PI/1,z:false},
				scales:false,
				anime:'idle'
			},
			Kimono_Male:{
				name:'Kimono_Male',
				fullName:'Bob',
				category:'character',
				path:'./gameCore/3dObjects/characters/base/Kimono_Male.gltf',
				positions:{x:0,y:0,z:0},
				rotations:{x:false,y:Math.PI/2,z:false},
				scales:false,
				anime:'idle'
			},
			// Knight_Golden_Female:{
			// 	name:'Knight_Golden_Female',
			// 	fullName:'Audrey',
			// 	category:'character',
			// 	path:'./gameCore/3dObjects/characters/base/Knight_Golden_Female.gltf',
			// 	positions:{x:4,y:0,z:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'Idle'
			// },
			// Knight_Golden_Male:{
			// 	name:'Knight_Golden_Male',
			// 	fullName:'Bob',
			// 	category:'character',
			// 	path:'./gameCore/3dObjects/characters/base/Knight_Golden_Male.gltf',
			// 	positions:{x:-2,y:0,z:0,theta:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'Idle'
			// },
			LunarShip:{
				name:'LunarShip',
				fullName:'LunarShip',
				category:'decor',
				path:'./gameCore/3dObjects/rocket/Rocket_Ship_01.gltf',
				positions:{x:0,y:0,z:0},
				rotations:{x:Math.PI/2,y:false,z:false},
				scales:false,
				anime:'idle'
			},
			fire:{
				name:'fire',
				fullName:'Basic fire',
				category:'decor',
				path:'./gameCore/3dObjects/fire/scene.gltf',
				positions:{x:0,y:0,z:0},
				rotations:{x:Math.PI/2,y:false,z:false},
				scales:false,
				anime:'idle'
			},
			// Pug:{
			// 	name:'Pug',
			// 	fullName:'Pug',
			// 	category:'decor',
			// 	path:'./gameCore/3dObjects/characters/base/Pug.gltf',
			// 	positions:{x:6,y:0,z:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'idle'
			// },
			// BaseCharacter:{
			// 	name:'BaseCharacter',
			// 	fullName:'BaseCharacter',
			// 	category:'character',
			// 	path:'./gameCore/3dObjects/characters/base/BaseCharacter.gltf',
			// 	positions:{x:7,y:-1,z:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'idle'
			// },
			// Ninja_Female:{
			// 	name:'Ninja_Female',
			// 	fullName:'Ninja_Female',
			// 	category:'character',
			// 	path:'./gameCore/3dObjects/characters/base/Ninja_Female.gltf',
			// 	positions:{x:7,y:-8,z:0},
			// 	rotations:{x:Math.PI/2,y:false,z:false},
			// 	scales:false,
			// 	anime:'idle'
			// }
		}
		return config
	}
}
export { ModelsConfig };
