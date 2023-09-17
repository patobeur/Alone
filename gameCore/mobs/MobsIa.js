import { Formula } from '../mecanics/Formula.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class MobsIa {
	constructor(mobConf) {
		this.mobConf = mobConf
		this.Formula = new Formula()
	}
	iaAction() {
		if (this.mobConf.ia.changeAction.cur === 0) {
			// 	// save old action
			// 	// this.mobConf.ia.changeAction.lastAction = this.mobConf.ia.changeAction.currentAction

			// 	// new random action
			let randDir = this.Formula.rand(0, 10)
			let _actionName = false
			// console.log(this.mobConf.ia.changeAction.currentAction)
			switch (randDir) {
				case 10:
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
	_doNothing() {
		// do nothing
	}
	_chooseDir() {
		let dir = this.Formula.rand(0, 1) > .5 ? 1 : -1;
		this.mobConf.theta.cur += Math.floor(dir * this.mobConf.ia.dirAmplitude)
		this.mobConf.theta.cur += Math.floor(dir * this.mobConf.ia.dirAmplitude)
		// console.log(this.mobConf.ia.dirAmplitude, this.mobConf.theta.cur)
	}
	// _changeDir() {
	// 	this.mobConf.theta.cur = this.Formula.rand(
	// 		this.mobConf.theta.min,
	// 		this.mobConf.theta.max
	// 	)
	// }
}
export { MobsIa }
