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
				lv: 0,
				speed: 1,
				theta: {
					cur: 0,
					min: 0,
					max: 360,
					nextCur:0,
				},
				faction: 'rangers',
				ia: {
					// can change mind every x milisec
					changeAction: {
						cur: 0,
						min: 0,
						max: 30,
						choice: 0,
						lastAction: 0
					},
					dirAmplitude: 360 / 8
				},
				mesh: {
					size: { x: 1, y: 1, z: 1 },
					altitude: 0,
					color: 'black',
					wireframe: false,
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
				states: {
					dead: false,
					collide: {
						changed: false,
						color: {
							saved: false,
							current: false
						}
					},
					isGoingToCollide:  {
						changed: false,
						current: 0,
						objs:[]
					}
				},
				status: {
					immortal:  {
						name: 'immortal', current: 0, max: 1000, step: .1
					}
				},
				stats:  {
					hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
					energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
					def: { name: 'defense', current: 1, max: 3, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
				}
			}
		}

		if (this.typeNum === 0) { // BIG WHITE
			config.mobs.mesh.color = 'white'
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 2, y: 2, z: 2 }
			config.mobs.ia.dirAmplitude = 0

			config.mobs.stats.def.current= 0
			config.mobs.stats.def.max= 2
			config.mobs.stats.def.regen= .5
		}
		if (this.typeNum === 1) { // BIG BLUE FALSE PLAYER
			config.mobs.mesh.color = 'blue'
			config.mobs.speed = 3
			config.mobs.mesh.size = { x: 1.5, y: 1.5, z: 1.5 }
			config.mobs.ia.changeAction.max = 30
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
			config.mobs.stats.def.current= 3
			config.mobs.stats.def.max= 4
			config.mobs.stats.def.regen= 2
		}

		if (this.typeNum === 2) { // BIG GREEN FALSE PLAYER
			config.mobs.mesh.color = 'green'
			config.mobs.speed = 3
			config.mobs.mesh.size = { x: 1.5, y: 1.5, z: 1.5 }
			config.mobs.ia.changeAction.max = 30
			config.mobs.mesh.childs = {
				front: {
					color: 'red',
					wireframe: false,
					size: { x: .5, y: 1, z: .5 },
					position: { x: 0, y: 1, z: 0 }, // from parent center
				}
			}
			config.mobs.stats.def.current= 0
			config.mobs.stats.def.max= 2
			config.mobs.stats.def.regen= .5
		}

		if (this.typeNum === 3 ) {  // BLACK SPEEDER
			config.mobs.mesh.color = 'black'
			config.mobs.speed = 8
			config.mobs.mesh.size = { x: .5, y: 1, z: .5 }
			config.mobs.ia.changeAction.max = 10
			config.mobs.ia.dirAmplitude = 1
			config.mobs.mesh.childs = {
				front: {
					color: 'white',
					wireframe: false,
					size: { x: .25, y: .5, z: .25 },
					position: { x: 0, y: .5, z: 0 }, // from parent center
				}
			}
			
			config.mobs.stats=  {
				hp: { name: 'Hit Point', current: 10, max: 10, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
				energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
				def: { name: 'defense', current: 0, max: 0, regen: 0, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
			}

		}
		if (this.typeNum === 4) { // REGULAR MANTA
			config.mobs.mesh.color = 0x00ff20
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 4, y: 4, z: .3 }
			config.mobs.ia.changeAction.max = 50
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
		if (this.typeNum === 5 || this.typeNum > 5) {// BIG MANTA
			config.mobs.mesh.color = 0xff0020
			config.mobs.speed = 1
			config.mobs.mesh.size = { x: 8, y: 8, z: .2 }
			config.mobs.mesh.altitude = 10
			config.mobs.ia.changeAction.max = 50
			config.mobs.ia.dirAmplitude = 0
			config.mobs.mesh.opacity = .6
			config.mobs.mesh.childs = {
				front: {
					color: 'white',
					wireframe: false,
					size: { x: .25, y: .5, z: .25 },
					position: { x: 0, y: .5, z: 0 }, // from parent center
				}
			}
		}
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
export {MobConfig}