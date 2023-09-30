import { Formula } from '../mecanics/Formula.js';
import { MobsIa } from './MobsIa.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class Mob {
	conslog = true
	_Scene
	_AllMobs
	_Formula
	constructor(conf, Scene, AllMobs, handleMobCallback) {
		this._Formula = new Formula()
		this._AllMobs = AllMobs
		this._Scene = Scene
		this.config = conf
		this.handleMobCallback = handleMobCallback
		this._init()
	}
	_init() {
		this.ia = new MobsIa(this.config);
		this._set_Mesh();
		return this;
	}
	// applyGravity(grav) {
	// 	let gravity = grav
	// 	if (this.tics === 'undefined' || !this.tics) this.tics = 0;
	// 	this.tics++;
	// 	if (this.tics >= 2) {
	// 		let altitude = this.config.position.z - this.config.mesh.size.z / 2
	// 		let minAltitude = this.config.mesh.size.z / 2
	// 		if (altitude > gravity) {
	// 			// this.config.position.z = (zdthis.config.position.z - (this.config.mesh.size.z / 2)) - gravity
	// 			this.config.position.z -= gravity
	// 		}
	// 		this.tics = 0
	// 	}
	// }
	applyGravity(gravity = 0) {
		if ((this.config.position.z >= gravity)) this.config.position.z -= gravity
	}
	_isdead() {
		if (
			this.config.stats.hp.current <= 0
			&& this.config.status.immortal.current <= 0
		) {
			// if not immortal and hp lower than zero you die
			this.config.states.dead = true
			let datas = {
				dead: true,
				uuid: this.mesh.uuid
			}
			this.handleMobCallback(datas)
			// this._trigger_Front()
			this._removeFromSceneAndDispose()
			return true
		}
		return false
	}
	_removeFromSceneAndDispose() {
		const object = this._Scene.getObjectByProperty('uuid', this.mesh.uuid);
		// if (this.conslog) console.log('removeFromSceneAndDispose',object)
		// if (!object.geometry === 'undefined') object.geometry.dispose();
		// if (!object.material === 'undefined') object.material.dispose();
		this._Scene.remove(object);
	}
	areGroupsColliding(mob) {
		// Obtenez les boîtes englobantes des deux groupes
		let boundingBox1 = new THREE.Box3().setFromObject(mob.bbox);
		let boundingBox2 = new THREE.Box3().setFromObject(this.PlayerMesh);

		// Vérifiez s'il y a une collision entre les boîtes englobantes
		let intersec = boundingBox1.intersectsBox(boundingBox2);
		return intersec
	}
	_keepMoving() {

		this.config.position.x = this.config.position.x - Math.sin(this.config.theta.cur) * this.config.speed
		this.config.position.y = this.config.position.y + Math.cos(this.config.theta.cur) * this.config.speed

		// limits
		if (this.config.position.x < -(this.config.floor.size.x / 2)) this.config.position.x = this.config.floor.size.x / 2
		if (this.config.position.x > (this.config.floor.size.x / 2)) this.config.position.x = -(this.config.floor.size.x / 2)
		if (this.config.position.y < -(this.config.floor.size.y / 2)) this.config.position.y = this.config.floor.size.y / 2
		if (this.config.position.y > (this.config.floor.size.y / 2)) this.config.position.y = -(this.config.floor.size.y / 2)

	}
	// checkstatus(statusName){
	// 	this.on(statusName)
	// }
	checkstatus(statusName,statuCallback){
		let statu = this.config.status[statusName];
		switch(statusName){
			case 'mouseover':
				if(statu.active === true ){

					if(statu.current > 0 < statu.max) 
						{statu.current++}
						
					if(statu.current > statu.max) {
						statu.current = 0; 
						statu.active = false;
						// this._trigger_Front();

						// statuCallback('target free:'+this.config.nickname)
						
						this.config.states.collide.color.current = this.config.states.collide.color.saved
						this.mobMesh.material.color = this.config.states.collide.color.saved
						this.mobMesh.material.opacity = 1
						this.mobMesh.material.transparent = false
					}
					if(statu.current === 1) { 
						// this._trigger_Front();
						// console.log('nickname:',this.config.nickname,'lv:'+this.config.lv,'hp:',this.config.stats.hp.current)
						
						statuCallback('target:'+this.config.nickname)

						this.config.states.collide.color.saved = this.mobMesh.material.color
						this.config.states.collide.color.current = new THREE.Color( 0x000000 )
						this.mobMesh.material.color = new THREE.Color( 0x000000 )
						this.mobMesh.material.transparent = true
						this.mobMesh.material.opacity = 0.5
					}


					

				}
				break;
			default:
				break;
		}
	}
	_set_Mesh() {
		// console.log('defaultAnimationName:',this.config.mesh.defaultAnimationName)
		// console.log('modelName:',this.config.mesh.modelName)
		// console.log('category:',this.config.mesh.category)
		// console.log('category:',this.config.mesh.model)
		// console.log('category:',this._allModels[mobConf.mesh.category][mobConf.mesh.modelName])


		// if (this.conslog) console.log(this.conf)
		// GROUP MESH
		this.mesh = new THREE.Group();
		this.mesh.config = this.config

		// this.mesh.feun = {mob:true}
		this.mesh.position.set(
			this.config.position.x,
			this.config.position.y,
			this.config.position.z + this.config.mesh.z / 2
		);
		// altitude
		// if (this.config.mesh.altitude) { this.mesh.position.z += this.config.mesh.altitude }

		this.mesh.name = this.config.nickname + '_Group';

		// BODY MESH
		this.mobMesh = new THREE.Mesh(
			new THREE.BoxGeometry(
				this.config.mesh.size.x,
				this.config.mesh.size.y,
				this.config.mesh.size.z
			),
			new THREE.MeshPhongMaterial({ color: this.config.mesh.color, wireframe: this.config.mesh.wireframe })
		);
		// console.log(this.config.mesh.model)
		// this.mobMesh = this.config.mesh.model.mesh.clone()

		this.mobMesh.name = this.config.nickname;
		this.mobMesh.castShadow = true;
		this.mobMesh.receiveShadow = true;

		// if (this.config.mesh.opacity && this.mobMesh.material.transparent) {
		// 	this.mobMesh.material.transparent = true
		// 	this.mobMesh.material.opacity = this.config.mesh.opacity
		// }
		this.mesh.add(this.mobMesh)

		// FRONT
		if (typeof this.config.mesh.childs.front === 'object' && this.config.mesh.childs.front) {
			this._add_Front()
		}
		this._add_VisualHp()

		this.bbox = new THREE.Box3().setFromObject(this.mobMesh);
		// this.bbhelper = new THREE.Box3Helper(this.bbox, 0x00ff00);


	}
	_trigger_Front() {
		if (this.mobFront.on === true) {
			this.mobFront.on = false
			this.mesh.remove(this.mobFront)
		}
		else {
			this.mobFront.on = true
			this.mesh.add(this.mobFront)
		}
	}
	_add_Front() {
		this.mobFront = new THREE.Mesh(
			new THREE.BoxGeometry(
				this.config.mesh.childs.front.size.x,
				this.config.mesh.childs.front.size.y,
				this.config.mesh.childs.front.size.z
			),
			new THREE.MeshPhongMaterial({
				color: this.config.mesh.childs.front.color ?? this.config.mesh.color,
				wireframe: this.config.mesh.childs.front.wireframe ?? false
			})
		);
		this.mobFront.position.set(
			this.mobMesh.position.x + this.config.mesh.childs.front.position.x,
			this.mobMesh.position.y + this.config.mesh.childs.front.position.y,
			this.mobMesh.position.z + this.config.mesh.childs.front.position.z
		);
		this.mobFront.name = this.config.nickname + '_Front';
		this.mobFront.on = true;
		this.mesh.add(this.mobFront)
	}
	_update_VisualHp(playerGroupe) {
		// const angleRadians = this.mesh.angleTo(playerGroupe);
		let theta = this._Formula.get_DegreeWithTwoPos(this.mesh.position.x, this.mesh.position.y, playerGroupe.position.x, playerGroupe.position.y)
		// let theta = THREE.MathUtils.radToDeg(this._Formula.get_DegreeWithTwoPos(this.mesh.position.x,this.mesh.position.y,playerGroupe.position.x,playerGroupe.position.y))
		// console.log(playerGroupe)
		// console.log(theta)
		// this.VisualHp.rotation.z =  theta
		this.VisualHp.rotation.z = .5
	}
	_add_VisualHp() {
		this.VisualHp = new THREE.Mesh(
			new THREE.BoxGeometry(
				1,
				0.02,
				0.2
			),
			new THREE.MeshPhongMaterial({
				color: 'red',
				wireframe: false
			})
		);
		this.VisualHp.position.set(
			0,
			0,//this.mobMesh.position.y - this.config.mesh.size.y/2,
			this.mobMesh.position.z + this.config.mesh.size.z / 2 + .4
		);
		this.mesh.add(this.VisualHp)
	}
	_update_BBox() {
		this.bbox = new THREE.Box3().setFromObject(this.mobMesh);
		// this.bbox.copy(this.mobMesh.geometry.boundingBox).applyMatrix4(this.mobMesh.matrixWorld)
	}
	// ------------------------------------------------------------------------------------
	// this must go to AnimateDom class ???
	// _set_divAttrib(target, value = false, attribute = false, attribute2 = false) {
	// 	if (this.divs[target] && value) {
	// 		if (attribute && attribute2) {
	// 			this.divs[target][attribute][attribute2] = value
	// 		}
	// 		else if (attribute && !attribute2) {
	// 			this.divs[target][attribute] = value
	// 		}
	// 	}
	// }
}
export { Mob }
