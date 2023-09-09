import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {Formula}  from '/ALone/gameCore/mecanics/Formula.js';
import {MobConfig} from './MobConfig.js';
import {Mob} from './Mob.js';
class MobsManager {
	conslog = true;
	_GameConfig;
	_CurrentMobImmat
	_Formula
	_maxMobLimiteLv
	_AllMobs
	_scene
	_FrontboardManager
	_playerGroupe = null
	constructor(datas) {
		this._scene = datas.scene
		this._FrontboardManager = datas.FrontboardManager
		this._GameConfig = datas.GameConfig
		this.conslog = this._GameConfig.conslog
		this._maxMobLimiteLv = 3
		this._AllMobs = []
		this._CurrentMobImmat = 0
		this._Formula = new Formula()
	}
	addMobs(howmanyMobs, mobType = false) {
		for (let i = 0; i < howmanyMobs; i++) {
			// let name = this.rangers[this._Formula.rand(0, this.rangers.length - 1)]
			let name = this.get_AName(8)
			let mob = this.addOne(
				name,
				mobType ?? 'mobs'
			)	
		}
		return this.get_allMobs()
	}	
	applyGravityToMob(mob) {
		// console.log('-------',mob.mesh)
		let gravity = 0.1
		// let measure = mob.mesh.geometry.parameters.depth/2
		// console.log( measure );
		// let halfHeight = mob.mesh.size.z/2
		// this._PlayerManager.saveOldPos()
		// this._PlayerManager.position.z = (this._PlayerManager.position.z - halfHeight > gravity) ? (this._PlayerManager.position.z - halfHeight) - gravity : halfHeight
		// this._PlayerManager.playerGroupe.position.z = this._PlayerManager.position.z
	}
	updateAllMobsPhaseB() {
		this._AllMobs.forEach(mob => {
			this.applyGravityToMob(mob)
			if(typeof this._playerGroupe === 'object'){
				mob._update_VisualHp(this._playerGroupe);
			}
			else {
				console.log('not yet')
			}
		});
	}
	updateAllMobsPhaseA() {
		this._AllMobs.forEach(mob => {
			if (mob.conf.states.dead !== true ) {//&& !_JEU.get_pause()) {
				if (mob._isdead()) {
					mob.conf.states.dead = true;
					mob._removeFromSceneAndDispose();
					return
				}

				if (mob.conf.ia.changeAction.cur === 0) {
					mob.ia.iaAction();
				}
				
				if (mob.conf.states.isGoingToCollide.current < 1) {
					this._isGoingToCollide(mob);
				}
				if (mob.conf.states.isGoingToCollide.current < 1) {
					mob._keepMoving();
				}
				mob.conf.ia.changeAction.cur =
					mob.conf.ia.changeAction.cur > mob.conf.ia.changeAction.max
						? 0
						: mob.conf.ia.changeAction.cur + 1;


				if(mob.conf.states.isGoingToCollide.current < 1){
					mob.mesh.position.set(
						mob.conf.position.x,
						mob.conf.position.y,
						mob.conf.position.z + mob.conf.mesh.size.z/2
					);
					mob.mesh.rotation.z = mob.conf.theta.cur;
					mob._update_BBox();
				}
			}
		});
    }
	set_PlayerDatas(playerGroupe){
		this._playerGroupe = playerGroupe
	}
	_handleCollisionWith(mob,autreMob) {
        let nouvelleDirectionAutreMob = autreMob.conf.theta.cur + (Math.PI/2);
        let nouvelleDirectionThis = mob.conf.theta.cur + (Math.PI/2);
        mob.conf.theta.cur = nouvelleDirectionThis		
		autreMob.conf.theta.cur = nouvelleDirectionAutreMob
        mob.conf.states.isGoingToCollide.current = 1 
		// this.conf.states.dead = true;
		// this.conf.stats.hp.current = 0
		// this.conf.stats.hp.current -= 2
    }
	_isGoingToCollide(mob) {
        // let childrenWithAttribute = this.getChildrenWithAttribute('feun.mob');
        for (let autreMob of this._AllMobs) {
            if (
				mob.mesh.uuid !== autreMob.mesh.uuid
				&& autreMob.conf.stats.hp.current>0
				// si c'est la meme zone du grid
				// && mob.conf.grid[0] === this.conf.grid[0]
			) {
                if (this._detecterCollisionPrediction(mob,autreMob)) {
					// ca se touche
					mob.conf.stats.isGoingToCollide = true
					// console.log('ca se touche !?!')
                    this._handleCollisionWith(mob,autreMob);
                }
				else {
					if(mob.conf.states.isGoingToCollide.current > 0){
						mob.conf.states.isGoingToCollide.current = 0
					}
				}
            }
        }
    }
	_detecterCollisionPrediction(mob,autreMob) {
        // let bbox1 = new THREE.Box3().setFromObject(mob.mesh);
        // Créer une boîte englobante pour la nouvelle position prédite
        let mobSize = mob.conf.mesh.size;
		let predictedPosition = {
			x: mob.conf.position.x - Math.sin(mob.conf.theta.cur) * mob.conf.speed,
			y: mob.conf.position.y + Math.cos(mob.conf.theta.cur) * mob.conf.speed,
			z: mob.conf.position.z
		}
        let mobSizeB = autreMob.conf.mesh.size;
		let predictedPositionB = {
			x: autreMob.conf.position.x - Math.sin(autreMob.conf.theta.cur) * autreMob.conf.speed,
			y: autreMob.conf.position.y + Math.cos(autreMob.conf.theta.cur) * autreMob.conf.speed,
			z: autreMob.conf.position.z
		}

        let predictedBbox = new THREE.Box3().setFromCenterAndSize(
            predictedPosition,
            // new THREE.Vector3(mobSize.x / 2, mobSize.y / 2, mobSize.z / 2)
            new THREE.Vector3(mobSize.x , mobSize.y , mobSize.z )
        );
        let predictedBboxB = new THREE.Box3().setFromCenterAndSize(
            predictedPositionB,
            // new THREE.Vector3(mobSize.x / 2, mobSize.y / 2, mobSize.z / 2)
            new THREE.Vector3(mobSizeB.x , mobSizeB.y , mobSizeB.z )
        );

        // Vérifier si les boîtes englobantes se chevauchent
		let intersect = predictedBboxB.intersectsBox(predictedBbox)
        return intersect;
    }
	getOnlyLivings() {
		let onlyLivings = Object.keys(this._AllMobs)
			.filter(key => !this._AllMobs[key].conf.states.dead)
			.map(key => this._AllMobs[key]);
		let onlyDeads = Object.keys(this._AllMobs)
			.filter(key => !this._AllMobs[key].conf.states.dead)
			.map(key => this._AllMobs[key]);
		return [onlyLivings, onlyDeads];
	}
	addOne(nickname = false, mobType = 'mobs') {

		let RandomMob = this._Formula.rand(1, this._maxMobLimiteLv)
		this.mobsConfig = new MobConfig(RandomMob)

		//if (this.conslog) console.log('adding mob nickname:'+nickname,this.mobsConfig)
		// i get a clone with the default config
		let mobConf = this.mobsConfig.get_confData(mobType)

		// adding basics to feet the needs
		mobConf.immat = this._CurrentMobImmat
		mobConf.id = 'M_' + mobConf.immat
		mobConf.speed = mobConf.speed / 50
		//mobConf.divs.prima.size

		mobConf.position = this._Formula.get_aleaPosOnFloor(this._GameConfig.floors.size)
		mobConf.floor = this._GameConfig.floors
		// mobConf.position.z = mobConf.mesh.altitude
		// if (this.conslog) console.log(mobConf.position)

		mobConf.nickname = (!nickname === false) ? nickname : new String('UnNamed_') + mobConf.immat;
		mobConf.theta.cur = this._Formula.rand(0, 360)
		// add floor conf to mob

		// push a fresh mob with fresh conf to allMob arrray
		let newmob = new Mob(mobConf, this._scene,this._AllMobs)
		

		this._AllMobs.push(newmob)
		this._scene.add(newmob.mesh)

		// set the new immat
		this._CurrentMobImmat = this._AllMobs.length
		this._FrontboardManager.addMobCounter(this._AllMobs.length)
		return this._AllMobs[this._CurrentMobImmat - 1]
	}
	get_allMobs() {
		return this._AllMobs.length > 0 ? this._AllMobs : false;
	}
	get_distanceFromPlayer(playerPosition, mob) {
		let dist = mob.bbox.distanceToPoint(othermob.mesh.position)
	}
	get_AName(length) {
		let lettreMIN = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
		let name = ''

		for (let i = 0; i < 3; i++) {
			let lettre = lettreMIN[this._Formula.rand(0, lettreMIN.length - 1)]
			name += lettre.toUpperCase()
		}

		name += '-'
		name += this._Formula.rand(666, 999)

		// name += '-'
		// for (let i = 0; i < 5; i++) {
		// 	let lettre = lettreMIN[this._Formula.rand(0, lettreMIN.length - 1)]
		// 	name += lettre.toUpperCase()
		// }

		return name
	}
	get_rangersName() {
		return ['Guillaume', 'Pyl', 'Charlotte', 'Frédéric', 'Rémi', 'Eslam', 'Charles-L', 'Audrey', 'Cédric', 'Antho', 'Renaud', 'Feun', 'Guillaume', 'Pyl', 'Charlotte', 'Frédéric', 'Rémi', 'Eslam', 'Charles-L', 'Audrey', 'Cédric', 'Antho', 'Renaud', 'Feun']
	}
}
export {MobsManager}