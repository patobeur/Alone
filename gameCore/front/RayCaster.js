import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

class RayCaster {
	constructor(datas) {

		this.camera = datas.camera
		this._MobsManager = datas.MobsManager
		this._FrontboardManager = datas.FrontboardManager
		this._PlayerManager = datas.PlayerManager
		
		this.mouse = this._PlayerManager.ControlsManager.pMouse
		this.mobs = this._MobsManager.onlyMobs

		this.raycaster = new THREE.Raycaster();
		this.lastRayTarget = 0
	}
	init() {
	}
	checkMouseRayCaster(){
		this.raycaster.setFromCamera( this.mouse, this.camera );

		const intersects = this.raycaster.intersectObjects( this.mobs );

		if(intersects.length>0) {
			let rayMobConfig = false
			for ( let i = 0; i < intersects.length; i ++ ) {
				// if(this.lastRayTarget !== intersects[ i ].object.uuid) { 
					rayMobConfig = intersects[ i ].object.parent.config
					if(rayMobConfig.status.mouseover.active === false ) rayMobConfig.status.mouseover.active = true;
					this.lastRayTarget = intersects[ i ].object.uuid
				// }						
			}
			this._FrontboardManager.TriggerFrontBloc('Targets', true)
			this._FrontboardManager.setFrontDatas('Targets', intersects[ 0 ].object.parent.config)
		}
		else {
			this.lastRayTarget = 0
			this._FrontboardManager.TriggerFrontBloc('Targets', false)
		}
		
	}
}
export { RayCaster }
