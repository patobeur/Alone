import { Formula } from "../mecanics/Formula.js";
import { MobConfig } from "./MobConfig.js";
import { Mob } from "./Mob.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
// import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/renderers/CSS2DRenderer';

// import * as SkeletonUtils from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/utils/SkeletonUtils.js';

class MobsManager {
	conslog = true;
	_GameConfig;
	_CurrentMobImmat;
	_Formula;
	_maxMobLimiteLv;
	_allModels;
	_AllMobs;
	_mobsIndexToDelete;
	_scene;
	_FrontboardManager;
	_playerGroupe = null;
	_SkeletonUtils;
	camera;
	constructor(datas) {
		this._scene = datas.scene;
		this._FrontboardManager = datas.FrontboardManager;
		this._GameConfig = datas.GameConfig;
		this._CameraManager = datas.CameraManager;
		// ---------------
		this.conslog = this._GameConfig.conslog;
		this._maxMobLimiteLv = 5;
		this._AllMobs = [];
		this.onlyMobs = [];
		this._mobsIndexToDelete = [];
		this._CurrentMobImmat = 0;
		this._Formula = new Formula();
		this.MobmouseOverCallback = 0;
	}
	addMobs(MapNum, mobType = false) {
		let howmanyMobs = this._GameConfig.Floors.config[MapNum].mobs.number;

		for (let i = 0; i < howmanyMobs; i++) {
			mobType = mobType ?? "mobs";
			// let name = this.rangers[this._Formula.rand(0, this.rangers.length - 1)]
			let name = this.get_AName(8);
			// console.log(
			// 	" 1 creating {" + mobType + "} ref:" + name + " on map",
			// 	MapNum
			// );
			this.addOne(name, mobType, MapNum);
		}
	}

	A_InitAllMobsDatas() {
		// empty
		this.colliders = [];
	}
	B_GetAllMobsDatas() {
		// boucle sur LES MOBS
		this._AllMobs.forEach((mob) => {
			mob.update_VisualHp(this.camera);
			mob.checkstatus("mouseover", (data) => {
				this.MobmouseOverCallback++;
				// console.log("retour " + this.MobmouseOverCallback, data);
				// this._FrontboardManager.setMouseOverMob('Targets', data.active)
			});

			if (mob.config.states.dead !== true) {
				if (mob._isdead()) {
					mob.config.states.dead = true;
					mob._removeFromSceneAndDispose();
					return;
				} else {
					if (mob.config.ia.changeAction.cur === 0) {
						mob.ia.iaAction();
					}
					// console.log(this.PlayerManager.obstacles)
					if (mob.config.states.isGoingToCollide.current < 1) {
						this._isGoingToCollide(mob);
					}
					if (mob.config.states.isGoingToCollide.current < 1) {
						mob._keepMoving();
					}

					mob.config.ia.changeAction.cur =
						mob.config.ia.changeAction.cur > mob.config.ia.changeAction.max
							? 0
							: mob.config.ia.changeAction.cur + 1;

					if (mob.config.states.isGoingToCollide.current < 1) {
						mob.mesh.position.set(
							mob.config.position.x,
							mob.config.position.y,
							mob.config.position.z + mob.config.mesh.size.z / 2
						);
						// console.log('donc',mob.mesh.position.z)
						mob.config.oldRotation = mob.mesh.rotation.z;
						mob.mesh.rotation.z = mob.config.theta.cur;
						mob._update_BBox();
					}
				}
				// reset collider if mob
				if (mob) mob.config.states.isGoingToCollide.current = 0;
				// Gravity if mob
				if (mob) mob.applyGravity(this._GameConfig.gravity);

				// colliding with player
				// console.log((this._detecterCollisionPredictionPlayer(mob) === true) ? ('mob',mob.mesh.position) : ('no',mob.mesh.position));
				if (this._detecterCollisionPredictionPlayer(mob) === true) {
					this.colliders.push(mob);
				}
			}
		});
		let returnedDatas = {
			colliders: this.colliders,
		};
		return returnedDatas;
	}
	C_CleanAllMobsDatas() {
		this._mobsIndexToDelete.forEach((index) => {
			this._AllMobs.splice(index, 1);
		});
		this._mobsIndexToDelete = [];
		if (this._FrontboardManager.FrontMobsCounter) {
			this._FrontboardManager.updateCounter(
				"FrontMobsCounter",
				this._AllMobs.length
			);
		}
	}
	update_VisualHp(mob) {
		console.log(mob.config.status.mouseover.active);
		console.log(mob.mesh.uuid);
		// if (typeof this.PlayerManager.playerGroupe === 'object') {
		// 	// const angleRadians = this.mesh.angleTo(playerGroupe);
		// 	let theta = this._Formula.get_DegreeWithTwoPos(
		// 		mob.mesh.position.x,
		// 		mob.mesh.position.y,
		// 		this.camera.position.x,
		// 		this.camera.position.y
		// 	)
		// 	const angleRadians = mob.mesh.position.angleTo(this.camera.position)
		// 	mob.VisualHp.rotation.z = mob.mesh.rotation.z - THREE.MathUtils.degToRad(theta)
		// }
	}
	set_Models(allModels) {
		this._allModels = allModels;
	}
	set_Camera(camera) {
		this.camera = camera;
	}
	set_PlayerDatas(PlayerManager) {
		this.PlayerManager = PlayerManager;
	}
	_handleCollisionWith(mob, autreMob) {
		let nouvelleDirectionAutreMob = autreMob.config.theta.cur + Math.PI / 2;
		let nouvelleDirectionThis = mob.config.theta.cur + Math.PI / 2;
		mob.config.theta.cur = nouvelleDirectionThis;
		// console.log(mob.conf)
		autreMob.config.theta.cur = nouvelleDirectionAutreMob;
		mob.config.states.isGoingToCollide.current = 1;
		// this.config.states.dead = true;
		// this.config.stats.hp.current = 0
		// this.config.stats.hp.current -= 2
	}
	_isGoingToCollide(mob) {
		// let childrenWithAttribute = this.getChildrenWithAttribute('feun.mob');
		for (let autreMob of this._AllMobs) {
			if (
				mob.mesh.uuid !== autreMob.mesh.uuid &&
				autreMob.config.stats.hp.current > 0
				// si c'est la meme zone du grid
				// && autreMob.config.grid[0] === this.config.grid[0]
			) {
				if (this._detecterCollisionPrediction(mob, autreMob)) {
					// ca se touche
					// ca se touche
					mob.config.position.z += mob.config.mesh.size.z * 20;
					mob.config.stats.isGoingToCollide = 1;
					// console.log('ca se touche !?!')
					this._handleCollisionWith(mob, autreMob);
				} else {
					if (mob.config.states.isGoingToCollide.current > 0) {
						mob.config.states.isGoingToCollide.current = 0;
					}
				}
			}
		}
	}
	_detecterCollisionPredictionPlayer(mob) {
		let group = this.PlayerManager.PlayerMesh;
		let boundingBox = new THREE.Box3().setFromObject(group);
		let intersec = mob.bbox.intersectsBox(boundingBox);
		return intersec;
		// console.log(this.PlayerManager.PlayerMesh)

		// let playerPos = this.PlayerManager.PlayerConfig.config.futurPositions
		// let bbox1 = new THREE.Box3().setFromObject(mob.mesh);
		// // Créer une boîte englobante pour la nouvelle position prédite
		// let mobSize = mob.config.mesh.size;
		// let predictedPosition = {
		// 	x: mob.config.position.x - Math.sin(mob.config.theta.cur) * mob.config.speed,
		// 	y: mob.config.position.y + Math.cos(mob.config.theta.cur) * mob.config.speed,
		// 	z: mob.config.position.z
		// }
		// let mobSizeB = this.PlayerManager.PlayerConfig.config.size;
		// let predictedPositionB = {
		// 	x: playerPos.x,
		// 	y: playerPos.y,
		// 	z: playerPos.z
		// }

		// let predictedBbox = new THREE.Box3().setFromCenterAndSize(
		// 	predictedPosition,
		// 	new THREE.Vector3(mobSize.x, mobSize.y, mobSize.z)
		// );
		// let predictedBboxB = new THREE.Box3().setFromCenterAndSize(
		// 	predictedPositionB,
		// 	// new THREE.Vector3(mobSize.x / 2, mobSize.y / 2, mobSize.z / 2)
		// 	new THREE.Vector3(mobSizeB.x, mobSizeB.y, mobSizeB.z)
		// );

		// // Vérifier si les boîtes englobantes se chevauchent
		// let intersect = predictedBboxB.intersectsBox(predictedBbox)
		// return intersect;
	}
	_detecterCollisionPrediction(mob, autreMob) {
		// let bbox1 = new THREE.Box3().setFromObject(mob.mesh);
		// Créer une boîte englobante pour la nouvelle position prédite
		let mobSize = mob.config.mesh.size;
		let predictedPosition = {
			x:
				mob.config.position.x -
				Math.sin(mob.config.theta.cur) * mob.config.speed,
			y:
				mob.config.position.y +
				Math.cos(mob.config.theta.cur) * mob.config.speed,
			z: mob.config.position.z,
		};
		let mobSizeB = autreMob.config.mesh.size;
		let predictedPositionB = {
			x:
				autreMob.config.position.x -
				Math.sin(autreMob.config.theta.cur) * autreMob.config.speed,
			y:
				autreMob.config.position.y +
				Math.cos(autreMob.config.theta.cur) * autreMob.config.speed,
			z: autreMob.config.position.z,
		};

		let predictedBbox = new THREE.Box3().setFromCenterAndSize(
			predictedPosition,
			// new THREE.Vector3(mobSize.x / 2, mobSize.y / 2, mobSize.z / 2)
			new THREE.Vector3(mobSize.x, mobSize.y, mobSize.z)
		);
		let predictedBboxB = new THREE.Box3().setFromCenterAndSize(
			predictedPositionB,
			// new THREE.Vector3(mobSize.x / 2, mobSize.y / 2, mobSize.z / 2)
			new THREE.Vector3(mobSizeB.x, mobSizeB.y, mobSizeB.z)
		);

		// Vérifier si les boîtes englobantes se chevauchent
		let intersect = predictedBboxB.intersectsBox(predictedBbox);
		return intersect;
	}
	getOnlyLivings() {
		let onlyLivings = Object.keys(this._AllMobs)
			.filter((key) => !this._AllMobs[key].config.states.dead)
			.map((key) => this._AllMobs[key]);
		let onlyDeads = Object.keys(this._AllMobs)
			.filter((key) => !this._AllMobs[key].config.states.dead)
			.map((key) => this._AllMobs[key]);
		return [onlyLivings, onlyDeads];
	}
	addOne(nickname = false, mobType = "mobs", mapNum) {
		let RandomMob = this._Formula.rand(1, this._maxMobLimiteLv);

		this.mobsConfig = new MobConfig(RandomMob);
		// i get a clone with the default config
		let mobConf = this.mobsConfig.get_confData(mobType);

		// adding basics to feet the needs
		mobConf.immat = this._CurrentMobImmat;
		mobConf.id = "M_" + mobConf.immat;
		mobConf.speed = mobConf.speed / 50;
		//mobConf.divs.prima.size

		let FloorConfig = this._GameConfig.Floors.config[mapNum];

		// console.log("**############********************");
		// console.log(FloorConfig.position);
		// console.log(FloorConfig.size);
		mobConf.set = {
			// floor: FloorConfig,
			// size:FloorConfig.size,
			// position:FloorConfig.position,
			min: {
				x: FloorConfig.position.x - (FloorConfig.size.x / 2),
				y: FloorConfig.position.y - (FloorConfig.size.y / 2),
				z: FloorConfig.position.z - (FloorConfig.size.z / 2)
			},
			max: {
				x: FloorConfig.position.x + (FloorConfig.size.x / 2),
				y: FloorConfig.position.y + (FloorConfig.size.y / 2),
				z: FloorConfig.position.z + (FloorConfig.size.z / 2)
			},
		};

		mobConf.position = {
			x: this._Formula.rand(mobConf.set.min.x,mobConf.set.max.x),
			y:this._Formula.rand(mobConf.set.min.y,mobConf.set.max.y),
			z: this._Formula.rand(mobConf.set.min.z,mobConf.set.max.z),
		};

		mobConf.nickname = !nickname === false ? nickname : new String("UnNamed_") + mobConf.immat;
			
		mobConf.floor = FloorConfig;
		mobConf.theta.cur = this._Formula.rand(0, 360);

		// add model
		if (this._allModels)
			mobConf.mesh.model =
				this._allModels[mobConf.mesh.category][mobConf.mesh.modelName];

		let newmob = new Mob(
			mobConf,
			this._scene,
			this._AllMobs,
			this.handleMobCallback
		);
		// push a fresh mob with fresh conf to allMob arrray
		this._AllMobs.push(newmob);
		this.onlyMobs.push(newmob.mesh.children[0]);

		// set the new immat
		this._CurrentMobImmat = this._AllMobs[this._AllMobs.length - 1].immat + 1;

		if (this._FrontboardManager && this._FrontboardManager.FrontMobsCounter)
			this._FrontboardManager.updateCounter(
				"FrontMobsCounter",
				this._AllMobs.length
			);

		this._scene.add(newmob.mesh);
	}
	handleMobCallback = (datas) => {
		if (datas.dead === true) {
			const mobIndex = this._AllMobs.findIndex(
				(mob) => mob.mesh.uuid == datas.uuid
			);
			this._mobsIndexToDelete.push(mobIndex);
		}
	};
	get_allMobs() {
		let request = this._AllMobs.length > 0 ? this._AllMobs : false;
		return request;
	}
	// get_distanceFromPlayer(playerPosition, mob) {
	// 	let dist = mob.bbox.distanceToPoint(othermob.mesh.position)
	// }
	get_AName(length) {
		let lettreMIN = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		];
		let name = "";
		for (let i = 0; i < 3; i++) {
			let lettre = lettreMIN[this._Formula.rand(0, lettreMIN.length - 1)];
			name += lettre.toUpperCase();
		}
		name += "-";
		name += this._Formula.rand(666, 999);
		// name += '-'
		// for (let i = 0; i < 5; i++) {
		// 	let lettre = lettreMIN[this._Formula.rand(0, lettreMIN.length - 1)]
		// 	name += lettre.toUpperCase()
		// }
		return name;
	}
}
export { MobsManager };
