class MobConfig {
	config
	typeNum
	constructor(typeNum = 1) {
		this.typeNum = typeNum
		this.config = this.#get_config()
	}
	#get_config() {
		const config = {
			mobs: {
				faction: 'rangers',
				baseXp:10,
				lv: 1,
				speed: 1,
				futurPositions: { x: 0, y: 0, z: 0 },
				oldPosition: { x: 0, y: 0, z: 0 },
				futurRotation: { x: 0, y: 0, z: 0 },
				velocity: { x: 0, y: 0, z: 0 },
				// ------------------------------------
				stats: {
					hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
					energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
					def: { name: 'defense', current: 1, max: 3, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
				},
				states: {
					dead: false,
					collide: {
						changed: false,
						color: {
							saved: false,
							current: false
						}
					},
					isGoingToCollide: {
						changed: false,
						current: 0,
						objs: []
					}
				},
				status: {
					mouseover: { current: 0, max: 100, step: 2, active: false, name: 'mouseover' },
					immortal: { current: 0, max: 1000, step: .1, active: false, name: 'immortal' }
				},
				theta: {
					cur: 0,
					min: 0,
					max: 400,
					nextCur: 0,
				},
				ia: {
					// can change mind every x frame
					changeAction: {
						cur: 0,
						min: 0,
						max: 50,
						choice: 0,
						lastAction: 0
					},
					dirAmplitude: 100
				},
				mesh: {
					size: { x: 1, y: 1, z: 1 },
					altitude: 0,
					color: 'black',
					wireframe: false,
					defaultAnimationName: 'Idle',
					category: 'character',
					modelName: 'Casual_Female',
					childs: {
						front: {
							color: 'white',
							wireframe: false,
							size: { x: 1, y: 1, z: 1 },
							position: { x: 0, y: 0.5, z: 0 }, // from parent center
						},
						hp: {
							color: 'red',
							wireframe: false,
							size: { x: .25, y: .25, z: .25 },
							position: { x: 0, y: 0, z: 0 }, // from parent center
						}
					}
				},
			}
		}

		if (this.typeNum === 0) { // BIG WHITE
			config.mobs.mesh.color = 'white'
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 2, y: 2, z: 2 }
			config.mobs.ia.dirAmplitude = 100

			config.mobs.stats.def.current = 0
			config.mobs.stats.def.max = 2
			config.mobs.stats.def.regen = .5
		}
		if (this.typeNum === 1) { // BIG BLUE FALSE PLAYER
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'BaseCharacter',
				config.mobs.mesh.color = 'blue'
			config.mobs.speed = 3
			config.mobs.mesh.size = { x: 1.5, y: 1.5, z: 1.5 }
			config.mobs.ia.changeAction.max = 25
			config.mobs.mesh.childs = {
				front: {
					color: 'red',
					wireframe: false,
					size: { x: .40, y: 1.5, z: .5 },
					position: { x: 0, y: .75, z: .65 }, // from parent center
				},
				hp: {
					color: 'red',
					wireframe: false,
					size: { x: .5, y: 1, z: .5 },
					position: { x: 0, y: .5, z: 0 }, // from parent center
				}
			}
			config.mobs.stats.def.current = 3
			config.mobs.stats.def.max = 4
			config.mobs.stats.def.regen = 2
		}

		if (this.typeNum === 2) { // BIG GREEN FALSE PLAYER
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'Casual_Female',
				config.mobs.mesh.color = 'green'
			config.mobs.speed = 3
			config.mobs.mesh.size = { x: 1.5, y: 1.5, z: 1.5 }
			config.mobs.ia.changeAction.max = 25
			config.mobs.mesh.childs = {
				front: {
					color: 'red',
					wireframe: false,
					size: { x: .5, y: 1, z: .5 },
					position: { x: 0, y: 1, z: 0 }, // from parent center
				}
			}
			config.mobs.stats.def.current = 0
			config.mobs.stats.def.max = 2
			config.mobs.stats.def.regen = .5
		}

		if (this.typeNum === 3) {  // BLACK SPEEDER
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'Casual_Male',
				config.mobs.mesh.color = 'black'
			config.mobs.speed = 8
			config.mobs.mesh.size = { x: .5, y: 1, z: .5 }
			config.mobs.ia.changeAction.max = 25
			config.mobs.ia.dirAmplitude = 100
			config.mobs.mesh.childs = {
				front: {
					color: 'white',
					wireframe: false,
					size: { x: .25, y: .5, z: .25 },
					position: { x: 0, y: .5, z: 0 }, // from parent center
				}
			}

			config.mobs.stats = {
				hp: { name: 'Hit Point', current: 10, max: 10, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
				energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
				def: { name: 'defense', current: 0, max: 0, regen: 0, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
			}

		}
		if (this.typeNum === 4) { // REGULAR MANTA
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'Kimono_Female',
				config.mobs.mesh.color = 0x00ff20
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 4, y: 4, z: .3 }
			config.mobs.ia.changeAction.max = 25
			config.mobs.mesh.altitude = 10
			config.mobs.mesh.opacity = .8
			config.mobs.mesh.childs = {
				front: {
					color: 'white',
					wireframe: false,
					size: { x: .25, y: 1, z: .5 },
					position: { x: 0, y: 1, z: 0 }, // from parent center
				}
			}

		}
		if (this.typeNum === 5) {// BIG MANTA
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'Kimono_Male',
				config.mobs.mesh.color = 0x0000FF
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 8, y: 8, z: .2 }
			config.mobs.mesh.altitude = 10
			config.mobs.ia.changeAction.max = 25
			config.mobs.ia.dirAmplitude = 100
			config.mobs.mesh.opacity = .5
			config.mobs.mesh.childs = {
				front: {
					color: 'white',
					wireframe: false,
					size: { x: .25, y: .5, z: .25 },
					position: { x: 0, y: .5, z: 0 }, // from parent center
				}
			}
		}
		if (this.typeNum === 6) {// BIG poto
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'Knight_Golden_Female',
				config.mobs.mesh.color = 0xFFFFFF
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: .5, y: .5, z: 3 }
			config.mobs.mesh.altitude = 0
			config.mobs.ia.changeAction.max = 25
			config.mobs.ia.dirAmplitude = 100
			// config.mobs.mesh.opacity = .6
			config.mobs.mesh.childs = {
				front: {
					color: 'red',
					wireframe: false,
					size: { x: .25, y: .5, z: .25 },
					position: { x: 0, y: 0, z: 3 }, // from parent center
				}
			}
		}
		if (this.typeNum === 7 || this.typeNum > 6) {// tanky
			config.mobs.mesh.category = 'character',
				config.mobs.mesh.modelName = 'Knight_Golden_Male',
				config.mobs.mesh.color = 0xcccccc
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 1, y: 3, z: 1 }
			config.mobs.mesh.altitude = 0
			config.mobs.ia.changeAction.max = 25
			config.mobs.ia.dirAmplitude = 100
			// config.mobs.mesh.opacity = .6
			config.mobs.mesh.childs = {
				front: {
					color: 'blue',
					wireframe: false,
					size: { x: .5, y: 1, z: .5 },
					position: { x: 0, y: 1.2, z: .5 }, // from parent center
				}
			}
		}

		// Jouez l'animation par défaut ici
		// config.mobs.mesh.charGltf = this.allModels['character']['Kimono_Female'].gltf 
		// config.mobs.mesh.MegaMixer = new THREE.AnimationMixer(config.mobs.mesh.charGltf.scene);
		// config.mobs.mesh.MegaClip = THREE.AnimationClip.findByName(config.mobs.mesh.charGltf.animations, config.mobs.mesh.defaultAnimation);
		// config.mobs.mesh.MegaAction = config.mobs.mesh.MegaMixer.clipAction(config.mobs.mesh.MegaClip);
		// config.mobs.mesh.MegaAction.play(); // Joue l'animation par défaut
		return { ...config }
	}
	get_confData(parent, value = false) {
		let confParent = this.config[parent] ?? false;
		let confValue = confParent[value]
			? confParent[value]
			: confParent
				? confParent
				: false;
		return { ...confValue }
	}
}
export { MobConfig }
