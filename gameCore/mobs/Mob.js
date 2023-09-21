import { Formula } from '../mecanics/Formula.js';
import { MobsIa } from './MobsIa.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class Mob {
	conslog = true
	_Scene
	_AllMobs
	_Formula
	constructor(conf, Scene, AllMobs) {
		this._Formula = new Formula()
		this._AllMobs = AllMobs
		this._Scene = Scene
		this.conf = conf
		this._init()
	}
	_init() {
		this.ia = new MobsIa(this.conf);
		this._set_Mesh();
		return this;
	}
	applyGravity(grav) {
		let gravity = grav
		if (this.tics === 'undefined' || !this.tics) this.tics = 0;
		this.tics++;
		if (this.tics >= 2) {
			let altitude = this.conf.position.z - this.conf.mesh.size.z / 2
			let minAltitude = this.conf.mesh.size.z / 2
			if (altitude > minAltitude) {
				this.conf.position.z = (this.conf.position.z - this.conf.mesh.size.z / 2) - gravity
			}
			this.tics = 0
		}
	}
	_isdead() {
		if (
			this.conf.stats.hp.current <= 0
			&& this.conf.status.immortal.current <= 0
		) {
			// if not immortal and hp lower than zero you die
			this.conf.states.dead = true
			// this._trigger_Front()
			this._removeFromSceneAndDispose()
			return true
		}
		return false
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

		this.conf.position.x = this.conf.position.x - Math.sin(this.conf.theta.cur) * this.conf.speed
		this.conf.position.y = this.conf.position.y + Math.cos(this.conf.theta.cur) * this.conf.speed

		// limits
		if (this.conf.position.x < -(this.conf.floor.size.x / 2)) this.conf.position.x = this.conf.floor.size.x / 2
		if (this.conf.position.x > (this.conf.floor.size.x / 2)) this.conf.position.x = -(this.conf.floor.size.x / 2)
		if (this.conf.position.y < -(this.conf.floor.size.y / 2)) this.conf.position.y = this.conf.floor.size.y / 2
		if (this.conf.position.y > (this.conf.floor.size.y / 2)) this.conf.position.y = -(this.conf.floor.size.y / 2)

	}
	_set_Mesh() {


		// console.log('defaultAnimationName:',this.conf.mesh.defaultAnimationName)
		// console.log('modelName:',this.conf.mesh.modelName)
		// console.log('category:',this.conf.mesh.category)
		// console.log('category:',this.conf.mesh.model)
		// console.log('category:',this._allModels[mobConf.mesh.category][mobConf.mesh.modelName])


		// if (this.conslog) console.log(this.conf)
		// GROUP MESH
		this.mesh = new THREE.Group();

		// this.mesh.feun = {mob:true}
		this.mesh.position.set(
			this.conf.position.x,
			this.conf.position.y,
			this.conf.position.z + this.conf.mesh.z / 2
		);
		// altitude
		// if (this.conf.mesh.altitude) { this.mesh.position.z += this.conf.mesh.altitude }

		this.mesh.name = this.conf.nickname + '_Group';

		// BODY MESH
		this.mobMesh = new THREE.Mesh(
			new THREE.BoxGeometry(
				this.conf.mesh.size.x,
				this.conf.mesh.size.y,
				this.conf.mesh.size.z
			),
			new THREE.MeshPhongMaterial({ color: this.conf.mesh.color, wireframe: this.conf.mesh.wireframe })
		);
		// console.log(this.conf.mesh.model)
		// this.mobMesh = this.conf.mesh.model.mesh.clone()

		this.mobMesh.name = this.conf.nickname;
		this.mobMesh.castShadow = true;
		this.mobMesh.receiveShadow = true;

		// if (this.conf.mesh.opacity && this.mobMesh.material.transparent) {
		// 	this.mobMesh.material.transparent = true
		// 	this.mobMesh.material.opacity = this.conf.mesh.opacity
		// }
		this.mesh.add(this.mobMesh)

		// FRONT
		if (typeof this.conf.mesh.childs.front === 'object' && this.conf.mesh.childs.front) {
			this._add_Front()
		}
		this._add_VisualHp()

		this.bbox = new THREE.Box3().setFromObject(this.mobMesh);
		// this.bbhelper = new THREE.Box3Helper(this.bbox, 0x00ff00);


	}
	_removeFromSceneAndDispose() {
		const object = this._Scene.getObjectByProperty('uuid', this.mesh.uuid);
		// if (this.conslog) console.log('removeFromSceneAndDispose',object)
		// object.geometry.dispose();
		// object.material.dispose();
		this._Scene.remove(object);
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
				this.conf.mesh.childs.front.size.x,
				this.conf.mesh.childs.front.size.y,
				this.conf.mesh.childs.front.size.z
			),
			new THREE.MeshPhongMaterial({
				color: this.conf.mesh.childs.front.color ?? this.conf.mesh.color,
				wireframe: this.conf.mesh.childs.front.wireframe ?? false
			})
		);
		this.mobFront.position.set(
			this.mobMesh.position.x + this.conf.mesh.childs.front.position.x,
			this.mobMesh.position.y + this.conf.mesh.childs.front.position.y,
			this.mobMesh.position.z + this.conf.mesh.childs.front.position.z
		);
		this.mobFront.name = this.conf.nickname + '_Front';
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
			0,//this.mobMesh.position.y - this.conf.mesh.size.y/2,
			this.mobMesh.position.z + this.conf.mesh.size.z / 2 + .4
		);
		this.mesh.add(this.VisualHp)
	}
	_update_BBox() {
		// this.bbox = new THREE.Box3().setFromObject(this.mobMesh);
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
