import { Formula } from '../mecanics/Formula.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class MobsIa {
	constructor(mobConfig) {
		this.mobConfig = mobConfig
		this.Formula = new Formula()
	}
	iaAction() {
		if (this.mobConfig.ia.changeAction.cur === 0) {
			// 	// save old action
			// 	// this.mobConfig.ia.changeAction.lastAction = this.mobConfig.ia.changeAction.currentAction

			// 	// new random action
			let randDir = this.Formula.rand(0, 2)
			let _actionName = false
			// console.log(this.mobConfig.ia.changeAction.currentAction)
			switch (randDir) {
				case 1:
				case 2:
					_actionName = '_chooseDir'
					break;
				default:
					break;
			}
			if (!_actionName === false) this._do_Action(_actionName)

		}
	}
	_do_Action(_actionName) {
		try {
			this[_actionName]()
		} catch (err) {
			if (err instanceof ReferenceError) {
				console.error("La fonction " + _actionName + " n'existe pas");
			}
		}

	}
	// _doNothing() {
	// 	// do nothing
	// }
	_chooseDir() {
		let dir = this.Formula.rand(0, 1) > .5 ? 1 : -1;
		this.mobConfig.theta.cur += Math.floor(dir * this.mobConfig.ia.dirAmplitude)
	}
}
export { MobsIa }
