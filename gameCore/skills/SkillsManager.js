import { Formula } from '../mecanics/Formula.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class SkillsManager {
	conslog = false
	order = 0
	constructor(datas) {
//skillname, playerGroupe, canonpart, fromfloor = 1, Scene, faction

		
		let skillname = datas.skillname
		this._playerGroupe = datas.playerGroupe
		this.sourceCanon = datas.canonpart
		let fromfloor = datas.fromfloor
		this.scene = datas.scene
		let faction = datas.faction
		this.skillCallBack = datas.skillCallBack


		this.formula = new Formula()



		// var playerPosition = canonpart.position
		var rotation = this._playerGroupe.rotation
		// this.fromfloor = fromfloor / 2;

		this.skillDatas = this._getSkill(skillname, this._playerGroupe.position, rotation, faction);

		this.receiveShadow = true;
		this.castShadow = true;
		this.wireFrame = false;
		this.distance = 0;
		this.distanceMax = this.skillDatas.distanceMax ?? 50;

		this.end = false;
		this.durationEnds = false;
		this.isColliding = false;
		this.mesh;
		this.ALLMOBSTEST;
		this.touchedMobs = []
		if (this.conslog) console.info('SkillsManager Mounted !', 'conslog:', this.conslog)
	}
	_getSkill(skillname, sourceCanon, rotation, faction) {
		skillname = JSON.parse(JSON.stringify(skillname));
		sourceCanon = JSON.parse(JSON.stringify(sourceCanon));
		rotation = JSON.parse(JSON.stringify(rotation._z));

		let skill = this._setSkills(skillname);

		skill.x = sourceCanon.x;
		skill.y = sourceCanon.y;
		skill.z = sourceCanon.z + (skill.fromfloor ? skill.fromfloor : 0);
		skill.rotation = rotation;

		return skill
	}
	init(allmobs) {
		this.ALLMOBSTEST = allmobs;
		this.birthDay = new Date();
		this.creatMesh();
		// mob devient autonome
		this.render = setInterval(this._update, 20, ['attribs empty']);
	}
	creatMesh() {
		switch (this.skillDatas.meshType) {
			case "sphere":
				this.mesh = new THREE.Mesh(
					new THREE.SphereGeometry(this.skillDatas.w, this.skillDatas.l, this.skillDatas.h),
					new THREE.MeshPhongMaterial({ color: this.skillDatas.color, wireframe: this.wireFrame })
				);
				break;
			case 'cube':
				this.mesh = new THREE.Mesh(
					new THREE.BoxGeometry(this.skillDatas.w, this.skillDatas.l, this.skillDatas.h),
					new THREE.MeshPhongMaterial({ color: this.skillDatas.color, wireframe: this.wireFrame })
				);
				break;
		}
		this.mesh.name = this.skillDatas.name
		this.mesh.receiveShadow = this.receiveShadow
		this.mesh.castShadow = this.castShadow

		if (this.skillDatas.mesh && this.skillDatas.material) {
			if (this.skillDatas.mesh.opacity && this.skillDatas.material.transparent) {
				this.mesh.material.transparent = this.skillDatas.material.transparent
				this.mesh.material.opacity = this.skillDatas.mesh.opacity
			}
		}
		// this.mesh.material.transparent = true
		// this.mesh.material.opacity = .6

		this.mesh.scale.set(1, 1, 1)
		// ????????????????
		this._applyDatasOnMesh()
		this._applyRotationOnMesh()
		this.scene.add(this.mesh)
	}
	_update = () => {
		if (!this.isColliding) {
			if (!this.durationEnds) {
				this._setNextPosition();
				this._setNextTransform();
				this._applyDatasOnMesh();
				this._applyOpacity();
				this._checkDestinationReached()
			}
			else if (this.durationEnds) {
				if (this.skillDatas.duration) { this._checkDuration() }
				else { this._endThis(); }
			}
			// if (this.conslog && this.isColliding) console.log('isColliding ???',this.isColliding);
			// this.isColliding = false

			// todo  long cycle 
			this._setTouchedMobs() // cycle thrue allmobs

			// if (this.isColliding === true && typeof this.touchedMobs === 'object'){
			if (typeof this.touchedMobs === 'object' && this.touchedMobs.length > 0) {
				// console.log(this.touchedMobs);
				// Mob dead
				// this.touchedMobs[0].config.states.dead = true
				if (this.touchedMobs[0].config.stats.hp.current > 0 && 
					this.touchedMobs[0].config.states.dead === false) {
				
					let damage = new Number(this.skillDatas.getDamage(this.touchedMobs[0]));

					// if (this.conslog) console.log(this.skillDatas);
					// if (this.conslog) console.log('getDamage = ' + this.skillDatas.getDamage(this.touchedMobs[0]));

					let def = this.touchedMobs[0].config.stats.def.current;
					let finalDamage = damage - def;
					// if (this.conslog) console.log('finalDamage = ' + damage + ' - ' + def + '(def) = ' + finalDamage);

					this.touchedMobs[0].config.stats.hp.current -= finalDamage
					// if (this.conslog) console.log('mob = ', this.touchedMobs[0].config.stats);
					if (this.touchedMobs[0].config.stats.hp.current <= 0) this.skillCallBack(this.touchedMobs[0])
				}

				// this.isColliding = true
				// delete missile

				if (this.skillDatas.perforante != true) {
					// this.durationEnds = true;
					this._endThis();
				}
				else {
					if (this.conslog) console.log('Balles perforantes Mouhahahahaha !!!!', this.touchedMobs[0].config.stats.hp.current, this.touchedMobs[0].mesh.uuid)
					this.isColliding = false
					this.touchedMobs = []
				}
				this.touchedMobs = []


			}
			// this.MobsManager.updateAllMobs()
		}

	}
	// _getFirstCollidingMob() {
	// 	if (this.ALLMOBSTEST) {
	// 		let i = 0
	// 		this.ALLMOBSTEST.forEach(mob => {
	// 			let dist = mob.bbox.distanceToPoint(this.mesh.position)
	// 			if (dist < .5) {
	// 				this.isColliding = true; // BOOOOOOM

	// 				return mob;
	// 			}
	// 			i++
	// 		});
	// 		if (this.isColliding === true){
	// 			if (this.conslog) console.log('-------------------------------------')
	// 			if (this.conslog) console.log('on ne devrait pas lire ces lignes ???')
	// 			if (this.conslog) console.log('------this.isColliding === true------')
	// 		}
	// 	}
	// 	// if (this.conslog) console.log('-------------------------')
	// 	// if (this.conslog) console.log('getFirstCollidingMob End !')
	// 	return false;
	// }
	_setTouchedMobs() {
		if (this.ALLMOBSTEST) {
			let i = 0
			this.ALLMOBSTEST.forEach(mob => {
				// Vérifier si les boîtes englobantes se chevauchent
				let intersect = this.bbox.intersectsBox(mob.bbox)
				if (intersect) this.touchedMobs.push(mob);
				i++
			});
		}
		// if(this.touchedMobs.length>0) console.log(this.touchedMobs)
		return this.touchedMobs;
	}
	_applyDatasOnMesh() {
		// set mesh position 
		this.mesh.position.set(this.skillDatas.x, this.skillDatas.y, this.skillDatas.z);
		// if SCALE found
		if (this.skillDatas.scale) this.mesh.scale.set(
			this.skillDatas.scale.current,
			this.skillDatas.scale.current,
			this.skillDatas.scale.current
		)
	}
	_applyOpacity() {
	}
	_checkDuration() {
		let duration = new Date().getTime() - this.birthDay.getTime();
		if (duration >= this.skillDatas.duration) {
			this.skillDatas.durationOff = true
			this._endThis();
		}
	}
	_endThis() {
		if (
			this.skillDatas.durationOff === true
			&& !(
				(this.skillDatas.durationOff === 'undefined' || !this.skillDatas.durationOff)
				&& (
					(!this.skillDatas.perforante === 'undefined' || !this.skillDatas.perforante)
				)
			)
		) this.end = true;

		clearInterval(this.render);
		if (this.skillDatas.explosion) {
			this._explode();
		}
		else {
			this._removeFromSceneAndDispose()
		}
	}
	_checkDestinationReached() {
		this.distance += this.skillDatas.speed;
		if (this.distance >= this.distanceMax) {
			this.durationEnds = true;
		}
	}
	_setNextTransform() {
		if (this.skillDatas.scale) {
			let start = this.skillDatas.scale.start < 0 ? 0 : this.skillDatas.scale.start;
			let end = this.skillDatas.scale.end > 20 ? 20 : this.skillDatas.scale.end;
			let distancedone = this.skillDatas.distanceMax - this.distance;
			this.skillDatas.scale.current = start + (((end - start) / (distancedone) - 1))
		}
	}
	_setNextPosition() {
		let nextPos = this.formula.get_NextThreePos(this.skillDatas.x, this.skillDatas.y, this.skillDatas.rotation, this.skillDatas.speed)
		this.skillDatas.x = nextPos.x
		this.skillDatas.y = nextPos.y
		this.bbox = new THREE.Box3().setFromObject(this.mesh);
	}
	_applyRotationOnMesh() {
		// if (this.skillDatas.rotation) this.mesh.rotation.z = this.skillDatas.rotation;
		if (this.skillDatas.rotation) this.mesh.rotation.z = this.skillDatas.rotation;
	}
	_setSkills(skillname) {
		let skill = {
			fireball: {
				name: 'basic Laser',
				meshType: 'cube',
				w: .2,
				h: .2,
				l: .3,
				distanceMax: 30,
				color: 'white',
				speed: .5,
				rotation: 0,
				addTheta: (Math.PI / 4),
				fromfloor: 0, // (w /2)
				energyCost: 5,
				recastTimer: 1000,
				explosion: {
					radius: 1, // radius of explosion
					duration: 300, // duration of explosion
					color: 'red' // color of explosion
				},
				lv: 1,
				faction: 'neutral',
				baseDamage: new Number(10),
			},
			cube: {
				name: 'cube',
				meshType: 'sphere',
				w: .5, //radius
				h: 10,
				l: 10,
				distanceMax: 15,
				color: 'red',
				speed: .6,
				scale: { start: 0, end: 5, current: 1 },//min zero,
				rotation: 0,
				addTheta: 0,
				fromfloor: 0, // (w /2)
				duration: 1000,
				energyCost: 10,
				recastTimer: 1000,
				lv: 1,
				faction: 'neutral',
				baseDamage: new Number(15),
			},
			WeedWallLv1: {
				name: 'Weed Wall',
				meshType: 'cube',
				w: 5,
				h: 2.5,
				l: .3,
				fromfloor: 1, // (w /2)
				distanceMax: 8,
				duration: 10000,
				color: 'blue',
				speed: .5,
				x: 0,
				y: 0,
				rotation: 0,
				addTheta: 0,
				energyCost: 10,
				recastTimer: 5000,
				lv: 1,
				faction: 'neutral',
				baseDamage: new Number(0),
				mesh: { opacity: 0.7 },
				material: { transparent: true },
				immortaluntilduration: true
			},
			doomdoom: {
				name: 'Balle DoomDoom',
				meshType: 'sphere',
				w: .5, //radius
				h: 10,
				l: 10,
				distanceMax: 50,
				color: 'white',
				speed: .1,
				rotation: 0,
				addTheta: (Math.PI / 4),
				fromfloor: 0,
				energyCost: 1,
				recastTimer: 3000,
				lv: 1,
				faction: 'neutral',
				perforante: true,
				baseDamage: new Number(10000),
				scale: { start: 5, end: 1, current: 3 },//min zero,
				mesh: { opacity: 0.5 },
				material: { transparent: true },
			},
			doomdoom2: {
				name: 'CleanWall',
				meshType: 'cube',
				w: 2,
				h: 2,
				l: 2,
				fromfloor: 1, // (w /2)
				distanceMax: 3,
				duration: 100000,
				color: 'white',
				speed: 5,
				x: 0,
				y: 0,
				rotation: 0,
				addTheta: 0,
				energyCost: 10,
				recastTimer: 5000,
				lv: 1,
				faction: 'neutral',
				baseDamage: new Number(0),
				// mesh: {opacity: 1},
				// material: {transparent: true},
				immortaluntilduration: true
			},
		}
		skill[skillname].getDamage = (mob) => {
			// if (mob.stats.def.current)
			// this.lv * this.baseDamage
			let damage = new Number(0)
			if (typeof mob.config.stats.def.current === 'number') {
				damage = new Number(this.skillDatas.lv * this.skillDatas.baseDamage)
			}
			return damage > 0 ? damage : false
		}
		return skill[skillname]
	}
	_removeFromSceneAndDispose() {
		const object = this.scene.getObjectByProperty('uuid', this.mesh.uuid);
		if (typeof object != 'undefined') {
			object.geometry.dispose();
			object.material.dispose();
			this.scene.remove(object);
		}
		else {
			console.log('. . . . . . . . . . . . . . . . .')
			console.info('Erreur this.scene.remove object')
			console.log('. . . . . . . . . . . . . . . . .')
		}
	}
	_createExplosion() {
		const explosionDuration = this.skillDatas.explosion.duration;
		const particleCount = 16; // nombre de particules
		const particleSpeed = 1; // vitesse des particules
		const particleSize = 0.5; // taille des particules augmentée
		const particleColor = this.skillDatas.explosion.color; // couleur des particules

		const particleGeometry = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);
		const velocities = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3); // un nouveau tableau pour les couleurs

		for (let i = 0; i < particleCount * 3; i += 3) {
			// créer une direction aléatoire en coordonnées polaires
			const direction = new THREE.Vector2(Math.random() * Math.PI * 2, Math.acos(2 * Math.random() - 1));

			// convertir les coordonnées polaires en coordonnées cartésiennes
			const velocity = new THREE.Vector3();
			velocity.setFromSphericalCoords(particleSpeed, direction.x, direction.y);

			// position initiale aléatoire en forme de cercle
			positions[i] = velocity.x;
			positions[i + 1] = velocity.y;
			positions[i + 2] = velocity.z;

			// vitesse initiale aléatoire en direction de l'extérieur du cercle
			velocities[i] = velocity.x;
			velocities[i + 1] = velocity.y;
			velocities[i + 2] = velocity.z;

			// des couleurs aléatoires pour chaque particule
			colors[i] = Math.random();
			colors[i + 1] = Math.random();
			colors[i + 2] = Math.random();
		}

		particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
		particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // définition de l'attribut color

		const particleMaterial = new THREE.PointsMaterial({
			size: particleSize,
			vertexColors: true // indiquer que nous utilisons des couleurs de sommets
		});

		const particles = new THREE.Points(particleGeometry, particleMaterial);
		particles.frustumCulled = false; // pour empêcher le système de particules d'être caché

		particles.tick = (delta) => {
			const positions = particles.geometry.attributes.position.array;
			const velocities = particles.geometry.attributes.velocity.array;

			for (let i = 0; i < positions.length; i++) {
				positions[i] += velocities[i] * delta;

				// ralentir progressivement les particules
				velocities[i] *= 0.99;
			}

			particles.geometry.attributes.position.needsUpdate = true;
		};

		return particles;
	}
	_explode() {
		const explosion = this._createExplosion();
		explosion.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
		this.scene.add(explosion);

		const animate = () => {
			if (!this.scene) return;
			requestAnimationFrame(animate);
			const delta = clock.getDelta();
			explosion.tick(delta);
		};

		const clock = new THREE.Clock();
		animate();

		setTimeout(
			() => {
				this.scene.remove(explosion);
				this._removeFromSceneAndDispose();
			},
			this.skillDatas.explosion.duration
		);
	}
	// getSinValue(val) {
	// 	let x = 0;//h
	// 	let y = 0;//k

	// 	let p = 5;
	// 	let a = 5;
	// 	let aMax = y + a;
	// 	let aMin = y - a;

	// 	for (let b = x; b < p + x; b++) {

	// 		let h = h + p;
	// 		let k = y;
	// 	}
	// 	// let b = (2 * Math.PI) / periode;

	// }
}
export { SkillsManager }
