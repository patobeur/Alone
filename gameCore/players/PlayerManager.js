import {Formula}  from '../mecanics/Formula.js';
import {PlayerConfig} from './PlayerConfig.js';
import {ControlsManager} from './ControlsManager.js';
import {SkillsManager} from '../skills/SkillsManager.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

class PlayerManager {
	conslog=true
	order=2;	
	_FrontboardManager
	_CameraManager
	_PlayerConfig = null
	_GameConfig;
	_Formula;
	immat = 0
	constructor(startPos=false, GameConfig, FrontboardManager, CameraManager, scene) {
		this.conslog = GameConfig.conslog
		this.type = 'player';
		this.scene = scene
		this._CameraManager = CameraManager
		this.CameraNum  = new Number(0)

		this._GameConfig = GameConfig;
		this._PlayerConfig = new PlayerConfig();
		this.stats = {
			hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
			energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
			def: { name: 'defense', current: 1, max: 100, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' },
			velocity:this._PlayerConfig.get_value('velocity')
		}
		this._ControlsManager = new ControlsManager(this.type, this._GameConfig);

		this._FrontboardManager = FrontboardManager;
		this._Formula = new Formula();
		
		if (startPos) {
			this.position = {
				x: startPos.x ? startPos.x : 0,
				y: startPos.y ? startPos.y : 0,
				z: startPos.z ? startPos.z : 0,
				thetaDeg: startPos.thetaDeg ? startPos.thetaDeg : 0,
			};
		}
		else if (this._GameConfig.floors.spawns){
			let defaultSpawnNum = 0
			// console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
			if (this._GameConfig.conslog) console.log('Spawning Num:'+defaultSpawnNum+' on floor "' + this._GameConfig.floors.name +'"' )
			
			let newpos = {
				x:this._GameConfig.floors.spawns[defaultSpawnNum].x,
				y:this._GameConfig.floors.spawns[defaultSpawnNum].y,
				z:this._GameConfig.floors.spawns[defaultSpawnNum].z,
				theta: this._GameConfig.floors.spawns[defaultSpawnNum].theta,
			};
			if (this._GameConfig.conslog) console.log(newpos)
			this.position = newpos
		}
		else {
			this.position = {
				x: 0,
				y: 0,
				z: 0,
				thetaDeg:  0,
			};
		}

		this.oldPosition = {
			x: this.position.x,
			y: this.position.y,
			z: this.position.z,
			thetaDeg: this.position.thetaDeg
		};

		this.playerGroupe = new THREE.Group();
		this.playerOpacity = 0
		// this.canonPosition.set(0, .5, 0);
		this.playerMeshName = "Noob";
		this.regenTimer = { current: 0, max: 10 };
		this.damaged = false;
		this.speed = 0;
		this.maxSpeed = .1
		this.maxRevSpeed = this.maxSpeed
		this.friction = this.maxSpeed / 20;
		this.acceleration = .01;

		this.largeur = this._PlayerConfig.get_value('size','x');
		this.longueur = this._PlayerConfig.get_value('size','y');;
		this.hauteur = this._PlayerConfig.get_value('size','z');;

		this.playerGroupe.name = this.playerMeshName;
		// this.rotatioYAngle = THREE.MathUtils.degToRad(1); // 1deg

		this.receiveShadow = true;
		this.castShadow = true;
		this.rotatioYAngle = 0;

		this.playerColor = this._PlayerConfig.get_value('playerColor');

		this.torche = this.getTorchlightConfig();
		this.#init();
	}
	#init() {
		this.#addMeshToModel();
		this.#addModelToGroupe();
		this.#addPlayerOrbiter(
			{ x: 0, y: 0, z: .6 },
			{ x: .25, y: .25, z: .1 }
		);
		// SkillsManager
		this.missiles = [];
		this.skillsInUse = []
		this.SkillsImmat = this.skillsInUse.length - 1;
		if (this.conslog) console.log('PlayerManager Mounted !')
		// console.log()
	}
	// get_GridCoords=(position)=>{
	// 	console.log('grid',this._GameConfig.floor)
	// }
	checkZooming(){
		if (this._ControlsManager) {
			if (!this._ControlsManager.zooming === false) {
				this._CameraManager.handleZoom(this._ControlsManager.zooming,this.CameraNum)
				// this._CameraManager.FollowPlayer(this.position,this.oldPosition,this.CameraNum)
				this._ControlsManager.zooming = false
			}
		}
	}
	saveOldPos(){		
		this.oldPosition.z = this.position.z
		this.oldPosition.y = this.position.y
		this.oldPosition.x = this.position.x
	}
	areGroupsColliding(mob) {
		let group = this.PlayerMesh
		let boundingBox = new THREE.Box3().setFromObject(group);
		let intersec = mob.bbox.intersectsBox(boundingBox);
		return intersec
	}
	// updatePlayerPositionFromSocket(player,allmobs) {
	// 	if (this.conslog) console.log('player updatePosition --> From Socket')
	// 	if (this.conslog) console.log(player,allmobs)
	// 	this.otherPlayerCheckIfMoveOrSkillsActions(allmobs,player);
	// }
	check_playerOrbiter() {
		// console.log('player check1 -->')
		if (this.playerOrbiter) {
			this._Formula.get_NextOrbitPosXYZ2(
				this.playerOrbiter,
				this.playerGroupe
			);
		}
	}
	#addPlayerOrbiter(pos, size) {
		let color = "green";//this.playerColor
		let material = new THREE.MeshPhongMaterial({ color: color, wireframe: false });
		this.playerOrbiter = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z),material);
		this.playerOrbiter.castShadow = true;
		this.playerOrbiter.receiveShadow = true;
		this.playerOrbiter.matrixAutoUpdate = true;
		this.playerOrbiter.material.transparent = false
		// this.playerOrbiter.material.opacity = .8
		this.playerOrbiter.name = "playerOrbiter";
		this.playerOrbiter.position.set(
			this.playerGroupe.position.x + pos.x - (size.x / 2),
			this.playerGroupe.position.y + pos.y - (size.y / 2),
			this.playerGroupe.position.z + pos.z - (size.z / 2)
		);
		this.playerOrbiter.centerDistance = this._Formula.getDistanceXY(this.playerGroupe, this.playerOrbiter);
		this.step = 1 / 10
		this.playerOrbiter.theta = { x: [0, 360, this.step], y: [0, 360, this.step], z: [0, 360, 0], delay: { current: 0, max: 1000 } };
		this.playerGroupe.add(this.playerOrbiter);
	}

	regen() {
		// this.stats.energy.current += this.stats.energy.regen
		if (this.regenTimer.current === this.regenTimer.max) {
			this.regenTimer.current = 0;
			for (var key in this.stats) {
				if (this.stats[key].regen) {
					
					if (this.stats[key].current <= this.stats[key].max - this.stats[key].regen) {
						this.stats[key].current += this.stats[key].regen
						// if (this.type === "PLAYER") {
						//console.log("PLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYER")
						if (this._FrontboardManager) {
							//if (this.conslog) console.log('regen ',key,this.stats[key].current)
							this._FrontboardManager.refresh(key, this.stats[key].current)
						}
						else { if (this._GameConfig.info) console.log('no _FrontboardManager !') }
						// }
					}
				}
			}
		}
		this.regenTimer.current++
	}
	getTorchlightConfig() {
		let torchlight = {
			x: 1, y: 1, z: .5,
			delta: 0,
			PointLight: [0xffEEEE, .6, 20]
		}
		return torchlight;
	}
	#addMeshToModel() {
		// cube player object
		let playerMesh = new THREE.Mesh(
			new THREE.BoxGeometry(this.largeur, this.longueur, this.hauteur),
			new THREE.MeshPhongMaterial({ color: this.playerColor, wireframe: false })
		);
		playerMesh.name = this.playerMeshName;
		playerMesh.castShadow = true;
		playerMesh.receiveShadow = true;
		playerMesh.matrixAutoUpdate = true;
		playerMesh.material.transparent = false

		// playerMesh.traverse(n => {
		// 	if (n.isMesh) {
		// 		n.castShadow = true;
		// 		n.receiveShadow = true;
		// 		if (n.material.map) n.material.map.anisotropy = 16;
		// 	}
		// });
		this.PlayerMesh = playerMesh
	}
	#addModelToGroupe() {
		// if (this.torche) this.playerGroupe.add(this.torche);
		this.playerGroupe.add(this.PlayerMesh)

		this.canonPart = new THREE.Mesh(
			new THREE.BoxGeometry(.25, .4, .25),
			new THREE.MeshPhongMaterial({ 
				color: 'green',//this.playerColor, 
				wireframe: false
			})
		);
		this.canonPart.name = "Cannon";
		this.canonPart.material.transparent = false
		// this.canonPart.material.opacity = 0
		this.canonPart.position.set(.20, .5, .25);
		this.canonPart.receiveShadow = true//this.receiveShadow;
		this.canonPart.castShadow = true//this.castShadow;
		this.playerGroupe.add(this.canonPart);
		this.playerGroupe.position.set(this.position.x, this.position.y, this.position.z);
	}
	playerUpdateIfMove() {
		if (this._ControlsManager) {
			// update pos
			if (this._ControlsManager.forward || this._ControlsManager.reverse)  this.playerGroupe.position.y = this.position.y //; direction.angle = 0 || 180 }
			if (this._ControlsManager.left || this._ControlsManager.right)  this.playerGroupe.position.x = this.position.x //; direction.angle = 90 || 270 }

		}
	}
	checkMoves() {
		// 
		if (this._ControlsManager) {
			let speed = this.maxSpeed;
			this.position.thetaDeg = this._ControlsManager.thetaDeg
			// console.log('rot deg:', this._ControlsManager.thetaDeg)

			if (this._ControlsManager.forward || this._ControlsManager.reverse || this._ControlsManager.left || this._ControlsManager.right) {
				if (this._ControlsManager.forward) { this.position.y += speed }//; direction.angle = 0 }
				if (this._ControlsManager.reverse) { this.position.y -= speed }//; direction.angle = 180 }
				if (this._ControlsManager.left) { this.position.x -= speed }//; direction.angle = 90 }
				if (this._ControlsManager.right) { this.position.x += speed }//; direction.angle = 270 }
			}
			if (this._ControlsManager.space)  { this.jump() }

		}
		this.playerGroupe.rotation.z = THREE.MathUtils.degToRad(this.position.thetaDeg);
	}
	jump(){
		if (this.position.z <= this._PlayerConfig.get_value('size','z')/2 ) {
			console.log('JUMPINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')
			this.position.z += 5.0
			this.stats.velocity.z = 1
		}
		this.stats.velocity.z = 0
		// if (this.jumpTime >= 10 ) this.jumpTime = 0;
	}
	checkSkills(allmobs) {
		if (this._ControlsManager) {
			if (this._ControlsManager.shoot1) {
				// this._ControlsManager.shoot1 = false;
				this.#shoot('fireball',allmobs);
			}
			if (this._ControlsManager.shoot2) {
				// this._ControlsManager.shoot2 = false;
				this.#shoot('WeedWallLv1',allmobs);
			}
			if (this._ControlsManager.shoot3) {
				// this._ControlsManager.shoot3 = false;
				this.#shoot('cube',allmobs);
			}
			if (this._ControlsManager.shoot4) {
				// this._ControlsManager.shoot4 = false;
				this.#shoot('doomdoom',allmobs);
			}
			if (this._ControlsManager.shoot5) {
				// this._ControlsManager.shoot5 = false;
				this.#shoot('doomdoom2',allmobs);
			}
			this._ControlsManager.shoot1 = false;
			this._ControlsManager.shoot2 = false;
			this._ControlsManager.shoot3 = false;
			this._ControlsManager.shoot4 = false;
			this._ControlsManager.shoot5 = false;
		}
	}
	// 
	// addPlayers() {
	// 	this.#addPlayerGroupeToScene();
	// }
	// #addPlayerGroupeToScene() {
	// 	this.scene.add(this.playerGroupe);
	// }

	// ----------------------------------------------------------------------------------
	// Shoot manager
	// ----------------------------------------------------------------------------------
	#shoot(skillname,allmobs) {
		if (this._ControlsManager) {
			if (this.missiles.length < 5) {
				// constructor(skillname, position, rotation, fromfloor = 1, Scene, faction, experienceF)
				let skill = new SkillsManager(
					skillname,
					this.playerGroupe,
					this.canonPart,
					this.hauteur,
					this.scene,
					'good',
					(koi) => {
						console.log('----------------------------------------------koi')
						console.log('test koi :',koi)
						console.log('----------------------------------------------koi')
					}
				);

				// console.log('--------------------------------')
				// console.log(skill.skillDatas.recastTimer)
				// console.log(skill.birthDay - new Date())
				// console.log(new Date())
				// console.log(skill)
				if (skill.skillDatas.energyCost < this.stats.energy.current) {
					this.stats.energy.current -= skill.skillDatas.energyCost;
					if (this._FrontboardManager) {
						this._FrontboardManager.refresh('energy', this.stats.energy.current)
					}
					skill.init(allmobs);
				}

			}
		}
	}
}
export {PlayerManager}