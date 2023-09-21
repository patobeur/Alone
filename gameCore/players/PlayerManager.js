import { Formula } from '../mecanics/Formula.js';
import { PlayerConfig } from './PlayerConfig.js';
import { ControlsManager } from './ControlsManager.js';
import { SkillsManager } from '../skills/SkillsManager.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

class PlayerManager {
	_FrontboardManager = null
	_CameraManager = null
	PlayerConfig = null
	_GameConfig = null
	_Formula = null
	immat = 0
	conslog = false
	order = 2;
	constructor(startPos = false, GameConfig, FrontboardManager, CameraManager, scene) {
		this.scene = scene
		this._GameConfig = GameConfig;
		this.conslog = GameConfig.conslog
		this.PlayerConfig = new PlayerConfig();
		this._CameraManager = CameraManager
		this.CameraNum = new Number(0)

		this.type = 'player';
		this.stats = {
			hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
			energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
			def: { name: 'defense', current: 1, max: 100, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' },
		}
		// this.futurPositions = { x: 0, y: 0, z: 0 };
		// this.oldPosition = { x: 0, y: 0, z: 0 };
		// this.futurRotation = { x: 0, y: 0, z: 0 };



		this._ControlsManager = new ControlsManager(this.type, this._GameConfig);

		this._FrontboardManager = FrontboardManager;
		this._Formula = new Formula();

		this.playerGroupe = new THREE.Group();
		this.playerOpacity = 0
		// this.canonPosition.set(0, .5, 0);
		this.regenTimer = { current: 0, max: 10 };
		this.damaged = false;
		this.speed = 0;
		this.maxSpeed = .1
		this.maxRevSpeed = this.maxSpeed
		// this.friction = this.maxSpeed / 20;
		// this.acceleration = .01;

		this.largeur = this.PlayerConfig.config.size.x
		this.longueur = this.PlayerConfig.config.size.y
		this.hauteur = this.PlayerConfig.config.size.z

		this.playerGroupe.name = 'G' + this.PlayerConfig.config.playerMeshName;
		// this.rotatioYAngle = THREE.MathUtils.degToRad(1); // 1deg

		this.receiveShadow = true;
		this.castShadow = true;
		this.rotatioYAngle = 0;

		this.playerColor = this.PlayerConfig.config.playerColor

		// this.torche = this.getTorchlightConfig();

		this.#init(startPos);
	}
	#init(startPos) {
		// START POSITION
		if (startPos) {
			this.futurPositions = {
				x: startPos.x ? startPos.x : 0,
				y: startPos.y ? startPos.y : 0,
				z: startPos.z ? startPos.z : 0 + (this.PlayerConfig.config.size.z / 2),
				// thetaDeg: startPos.thetaDeg ? startPos.thetaDeg : 0,
			};
		}
		else if (this._GameConfig.floors.spawns) {
			let defaultSpawnNum = 0
			if (this._GameConfig.conslog) console.log('Spawning Num:' + defaultSpawnNum + ' on floor "' + this._GameConfig.floors.name + '"')
			let newpos = {
				x: this._GameConfig.floors.spawns[defaultSpawnNum].x,
				y: this._GameConfig.floors.spawns[defaultSpawnNum].y,
				z: this._GameConfig.floors.spawns[defaultSpawnNum].z + (this.PlayerConfig.config.size.z / 2),
			};
			this.PlayerConfig.config.futurPositions = newpos

		}
		this.#addMeshToModel();
		this.#addModelToGroupe();
		this.#addPlayerOrbiter();
		// SkillsManager
		this.missiles = [];
		this.skillsInUse = []
		this.SkillsImmat = this.skillsInUse.length - 1;
		if (this.conslog) console.log('PlayerManager Mounted !')
		// console.log()
	}
	applyGravity() {
		if (this.tics === 'undefined' || !this.tics) this.tics = 0;
		this.tics++;
		if (this.tics >= 0) {
			let halfHeight = this.PlayerConfig.config.size.x / 2
			let currentAltitude = this.PlayerConfig.config.futurPositions.z - halfHeight
			this.PlayerConfig.config.currentAltitude = this.PlayerConfig.config.futurPositions.z - halfHeight
			// let fall = 0 - this._GameConfig.gravity - this.PlayerConfig.config.velocity.z
			let fall = 0 + this._GameConfig.gravity - this.PlayerConfig.config.velocity.z
			// let fall = 1
			// console.log(currentAltitude)

			if ((currentAltitude >= fall)) {//this._GameConfig.gravity

				this.PlayerConfig.config.futurPositions.z -= fall
				// console.log(
				// 	'j:', this.PlayerConfig.config.status.jumping,
				// 	'cur:', this.PlayerConfig.config.actions.jumping.current,
				// 	'alt:', currentAltitude,
				// 	'>=',
				// 	'v_z:', this.PlayerConfig.config.velocity.z,
				// 	'g:', this._GameConfig.gravity,
				// 	'f:', fall,
				// )
				this.playerGroupe.position.set(
					this.PlayerConfig.config.futurPositions.x,
					this.PlayerConfig.config.futurPositions.y,
					this.PlayerConfig.config.futurPositions.z
				);
			}


			// this.PlayerConfig.config.futurPositions.z =
			// 	(currentAltitude >= this._GameConfig.gravity)
			// 		? this.PlayerConfig.config.futurPositions.z - fall
			// 		: halfHeight


			this.tics = 0
		}
	}
	checkActions() {
		// is jumping
		if (this._ControlsManager.space === true && this.PlayerConfig.config.status.jumping === false) this.PlayerConfig.config.status.jumping = true; this.jump();



		// this.PlayerConfig.config.status.jumping = false

		// others
	}
	jump() {
		// if (this.PlayerConfig.config.status.jumping === true && this.PlayerConfig.config.actions.jumping.current > 0) 
		// IF JUMPING STARTED
		if (this.PlayerConfig.config.status.jumping === true) {
			if (this.PlayerConfig.config.actions.jumping.current === 0) {
				console.log('start jumping', this.PlayerConfig.config.actions.jumping.current)
				this.PlayerConfig.config.velocity.z = 1
			}
			if (this.PlayerConfig.config.actions.jumping.current >= this.PlayerConfig.config.actions.jumping.max) {
				console.log('end jumping', this.PlayerConfig.config.actions.jumping.current)
				this.PlayerConfig.config.actions.jumping.current = 0
				this.PlayerConfig.config.status.jumping = false
				this.PlayerConfig.config.velocity.z = 0
				this._ControlsManager.space = false
			}
			if (this.PlayerConfig.config.status.jumping === true && this.PlayerConfig.config.actions.jumping.current < this.PlayerConfig.config.actions.jumping.max) {
				console.log('current ++')
				this.PlayerConfig.config.actions.jumping.current++
			}
		}
	}
	// get_GridCoords=(position)=>{
	// 	console.log('grid',this._GameConfig.floor)
	// }
	checkZooming() {
		if (this._ControlsManager) {
			if (!this._ControlsManager.zooming === false) {
				this._CameraManager.handleZoom(this._ControlsManager.zooming, this.CameraNum)
				// this._CameraManager.FollowPlayer(this.futurPositions,this.oldPosition,this.CameraNum)
				this._ControlsManager.zooming = false
			}
		}
	}
	saveOldPos() {
		// this.PlayerConfig.oldPosition.x = this.PlayerConfig.position.x
		// this.PlayerConfig.oldPosition.y = this.PlayerConfig.position.y
		// this.PlayerConfig.oldPosition.z = this.PlayerConfig.position.z
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
	#addPlayerOrbiter(conf) {
		let pos = this.PlayerConfig.config.orbiter.position
		let size = this.PlayerConfig.config.orbiter.size
		let color = this.PlayerConfig.config.orbiter.color;

		let material = new THREE.MeshPhongMaterial({ color: this.PlayerConfig.config.orbiter.color, wireframe: this.PlayerConfig.config.orbiter.wireframe });
		this.playerOrbiter = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
		this.playerOrbiter.name = "playerOrbiter";
		this.playerOrbiter.castShadow = true;
		this.playerOrbiter.receiveShadow = true;
		this.playerOrbiter.matrixAutoUpdate = true;
		this.playerOrbiter.material.transparent = false
		// this.playerOrbiter.material.opacity = .8


		this.playerOrbiter.position.set(
			this.PlayerConfig.config.futurPositions.x + pos.x - (size.x / 2),
			this.PlayerConfig.config.futurPositions.y + pos.y - (size.y / 2),
			this.PlayerConfig.config.futurPositions.z + pos.z - (size.z / 2)
		);
		// this.updateMyPos()
		this.playerOrbiter.centerDistance = this._Formula.getDistanceXY(this.playerGroupe, this.playerOrbiter);
		this.step = 1 / 10
		this.playerOrbiter.theta = {
			x: [0, 360, this.step],
			y: [0, 360, this.step],
			z: [0, 360, 0],
			delay: { current: 0, max: 1000 }
		};
		this.playerGroupe.add(this.playerOrbiter);
	}
	updatePlayerOrbiter() {
		if (this.playerOrbiter) {
			this._Formula.get_NextOrbitPosXYZ2(
				this.playerOrbiter,
				this.playerGroupe
			);
		}
	}
	regen() {
		// this.stats.energy.current += this.stats.energy.regen
		if (this.regenTimer.current === this.regenTimer.max) {
			this.regenTimer.current = 0;
			for (var key in this.PlayerConfig.config.stats) {
				if (this.PlayerConfig.config.stats[key].regen) {

					if (this.PlayerConfig.config.stats[key].current <= this.PlayerConfig.config.stats[key].max - this.PlayerConfig.config.stats[key].regen) {
						this.PlayerConfig.config.stats[key].current += this.PlayerConfig.config.stats[key].regen
						// if (this.type === "PLAYER") {
						//console.log("PLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYER")
						if (this._FrontboardManager) {
							//if (this.conslog) console.log('regen ',key,this.stats[key].current)
							this._FrontboardManager.refresh(key, this.PlayerConfig.config.stats[key].current)
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
			new THREE.BoxGeometry(
				this.PlayerConfig.config.size.x,
				this.PlayerConfig.config.size.y,
				this.PlayerConfig.config.size.z
			),
			new THREE.MeshPhongMaterial({
				color: this.PlayerConfig.config.playerColor,
				wireframe: this.PlayerConfig.config.wireframe
			})
		);
		playerMesh.name = this.PlayerConfig.config.playerMeshName;
		playerMesh.castShadow = this.PlayerConfig.config.castShadow;
		playerMesh.receiveShadow = this.PlayerConfig.config.receiveShadow;
		playerMesh.matrixAutoUpdate = this.PlayerConfig.config.matrixAutoUpdate;
		playerMesh.material.transparent = this.PlayerConfig.config.transparent;

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
			new THREE.BoxGeometry(
				this.PlayerConfig.config.canon.size.x,
				this.PlayerConfig.config.canon.size.y,
				this.PlayerConfig.config.canon.size.z
			),
			new THREE.MeshPhongMaterial({
				color: 'green',//this.playerColor, 
				wireframe: false
			})
		);
		this.canonPart.name = this.PlayerConfig.config.canon.meshName;
		this.canonPart.material.transparent = false
		// this.canonPart.material.opacity = 0
		this.canonPart.position.set(
			this.PlayerConfig.config.canon.position.x,
			this.PlayerConfig.config.canon.position.y,
			this.PlayerConfig.config.canon.position.z
		)
		this.canonPart.receiveShadow = true//this.receiveShadow;
		this.canonPart.castShadow = true//this.castShadow;
		this.playerGroupe.add(this.canonPart);
		this.playerGroupe.position.set(this.PlayerConfig.config.futurPositions.x, this.PlayerConfig.config.futurPositions.y, this.PlayerConfig.config.futurPositions.z);
	}
	checkRotation() {
		this.PlayerConfig.config.futurRotation.z = this._ControlsManager.thetaDeg
		this.playerGroupe.rotation.z = THREE.MathUtils.degToRad(this.PlayerConfig.config.futurRotation.z);
	}
	checkMoves() {
		if (typeof this._ControlsManager === 'object') {
			let speed = this.maxSpeed;
			if (this._ControlsManager.forward || this._ControlsManager.reverse || this._ControlsManager.left || this._ControlsManager.right) {
				if (this._ControlsManager.forward) { this.PlayerConfig.config.futurPositions.y += speed }//; direction.angle = 0 }
				if (this._ControlsManager.reverse) { this.PlayerConfig.config.futurPositions.y -= speed }//; direction.angle = 180 }
				if (this._ControlsManager.left) { this.PlayerConfig.config.futurPositions.x -= speed }//; direction.angle = 90 }
				if (this._ControlsManager.right) { this.PlayerConfig.config.futurPositions.x += speed }//; direction.angle = 270 }
			}
		}
	}
	applyFuturPositionsToPlayerGroupePosition() {
		this.playerGroupe.position.set(
			this.PlayerConfig.config.futurPositions.x,
			this.PlayerConfig.config.futurPositions.y,
			this.PlayerConfig.config.futurPositions.z
		);
	}
	checkSkills(allmobs) {
		if (this._ControlsManager) {
			if (this._ControlsManager.shoot1) {
				// this._ControlsManager.shoot1 = false;
				this.#shoot('fireball', allmobs);
			}
			if (this._ControlsManager.shoot2) {
				// this._ControlsManager.shoot2 = false;
				this.#shoot('WeedWallLv1', allmobs);
			}
			if (this._ControlsManager.shoot3) {
				// this._ControlsManager.shoot3 = false;
				this.#shoot('cube', allmobs);
			}
			if (this._ControlsManager.shoot4) {
				// this._ControlsManager.shoot4 = false;
				this.#shoot('doomdoom', allmobs);
			}
			if (this._ControlsManager.shoot5) {
				// this._ControlsManager.shoot5 = false;
				this.#shoot('doomdoom2', allmobs);
			}
			this._ControlsManager.shoot1 = false;
			this._ControlsManager.shoot2 = false;
			this._ControlsManager.shoot3 = false;
			this._ControlsManager.shoot4 = false;
			this._ControlsManager.shoot5 = false;
		}
	}

	// applyGravity2() {
	// 	if (this.tics === 'undefined' || !this.tics) this.tics = 0;
	// 	this.tics++;
	// 	if (this.tics >= 0) {
	// 		let halfHeight = this.PlayerConfig.config.size.x / 2
	// 		let currentAltitude = this.PlayerConfig.config.futurPositions.z - halfHeight
	// 		let fall = this._GameConfig.gravity + this.PlayerConfig.config.velocity.z

	// 		console.log(
	// 			currentAltitude,
	// 			'>=',
	// 			this._GameConfig.gravity,
	// 			'fall', fall)

	// 		this.PlayerConfig.config.futurPositions.z =
	// 			(currentAltitude >= this._GameConfig.gravity)
	// 				? (currentAltitude) - fall
	// 				: halfHeight
	// 		this.tics = 0
	// 	}
	// }
	// ----------------------------------------------------------------------------------
	// Shoot manager
	// ----------------------------------------------------------------------------------
	#shoot(skillname, allmobs) {
		if (this._ControlsManager) {
			if (this.missiles.length < 5) {
				// constructor(skillname, position, rotation, fromfloor = 1, Scene, faction, experienceF)
				let skill = new SkillsManager(
					skillname,
					this.playerGroupe,
					this.canonPart,
					this.PlayerConfig.config.size.z,
					this.scene,
					'good',
					(koi) => {
						console.log('----------------------------------------------koi')
						console.log('test koi :', koi)
						console.log('----------------------------------------------koi')
					}
				);
				if (skill.skillDatas.energyCost < this.PlayerConfig.config.stats.energy.current) {
					// remove cost point
					this.PlayerConfig.config.stats.energy.current -= skill.skillDatas.energyCost;
					// frontboard update
					if (this._FrontboardManager) this._FrontboardManager.refresh('energy', this.PlayerConfig.config.stats.energy.current)
					// sendin autonome skill
					skill.init(allmobs);
				}

			}
		}
	}
}
export { PlayerManager }
