class PlayerConfig {
	config
	constructor() {
		this.config = {
			playerMeshName: 'Alice',
			playerColor: 'red',
			stats: {
				hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
				energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
				def: { name: 'defense', current: 1, max: 100, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' },
				velocity: { x: 0, y: 0, z: 0 }
			},
			// hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
			// energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
			// def: { name: 'defense', current: 1, max: 100, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' },
			jumping: false,
			fawling: false,
			size: { x: 1, y: 1, z: 1 },
			//velocity: { x: 0, y: 0, z: 0 },
			status: {},
			futurPositions: { x: 0, y: 0, z: 0 },
			oldPosition: { x: 0, y: 0, z: 0 },
			futurRotation: { x: 0, y: 0, z: 0 },
			wireframe: false,
			castShadow: true,
			receiveShadow: true,
			matrixAutoUpdate: true,
			transparent: false,
			orbiter: {
				position: { x: 0, y: .1, z: .6 },
				size: { x: .25, y: .25, z: .1 },
				color: 'green',
				wireframe: false
			},
			canon: {
				meshName: 'Cannon',
				position: { x: .25, y: .5, z: .25 },
				size: { x: .25, y: .25, z: .25 },
				color: 'green',
				wireframe: false
			}
		}
	}
	get_value(parent, value) {
		if (this.config[parent]) {
			if (this.config[parent][value]) {
				return this.config[parent][value]
			}
			else {
				return this.config[parent]
			}
		}
		else {
			if (this.conslog) console.log('PlayerConfig.' + parent + ' n\'existe pas !')
		}
		return false
	}

}
export { PlayerConfig }
