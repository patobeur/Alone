import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
class CamerasManager {
	conslog = true
	cameras
	_CamerasConfig
	_GameConfig
	order = 1
	constructor(conslog) {
		this.conslog = conslog
		this.cameras = []
		this._CamerasConfig = this.get_config()
		this.Init()
	}
	Init() {
		if (this.conslog) console.info('CamerasManager Mounted !')

		this.init_Cameras()// -- CAMERA

	}
	get_config(){
		let cams = [
			{
				name: 'PlayerCamera',
				fov: 60,
				aspect: window.innerWidth / window.innerHeight,
				near: 1.0,
				far: 1000.0,
				position: new THREE.Vector3(0, 0, 2),
				// others
				zoom: { step: 5, zmin: 5, zmax:25 },
				lookat: new THREE.Vector3(0, 0, 0),
				rotation: new THREE.Vector3(0, 0, 0),
				followDecalage: new THREE.Vector3(0, -15, 10),
				lookatDecalage: new THREE.Vector3(0, 2, 2),
				zooming:false,
				active:true
			},
			{
				name: 'TopDown',
				fov: 60,
				aspect: window.innerWidth / window.innerHeight,
				near: 1.0,
				far: 1000.0,
				position: new THREE.Vector3(0, 0, 15),
				// others
				zoom: { step: 5, zmin: 5, zmax:25 },
				followDecalage: new THREE.Vector3(0, 0, 0),
				lookat: new THREE.Vector3(0, 0, 0),
				rotation: new THREE.Vector3(0, 0, 0),
				lookatDecalage: new THREE.Vector3(0, 0, 0),
				zooming:false,
				active:true
			}
		]
		return cams
	}
	get_Camera(config) {
		let camera = new THREE.PerspectiveCamera(
			config.fov,
			config.aspect,
			config.near,
			config.far,
		)
		camera.position.set(
			config.position.x + config.followDecalage.x,
			config.position.y + config.followDecalage.y,
			config.position.z + config.followDecalage.z,
		)
		// this.cameras[CameraNum].lookAt(targetPos);
		
		// this.cameras[CameraNum].lookAt(targetPos);
		// camera.lookAt(
		// 	camera.lookAt.x + config.lookatDecalage.x,
		// 	camera.lookAt.y + config.lookatDecalage.y,
		// 	camera.lookAt.z + config.lookatDecalage.z,
		// )
		camera.name = config.name
		camera.updateProjectionMatrix();
		return camera
	}
	handleZoom(zooming,CameraNum){
		let apresZoom = zooming === 'out' 
			? this._CamerasConfig[CameraNum].zoom.step 
			: -this._CamerasConfig[CameraNum].zoom.step

		// this.cameras[CameraNum].position.z = Math.min(
		// 	Math.max(
		// 		this._CamerasConfig[CameraNum].zoom.zmin,
		// 		this.cameras[CameraNum].position.z + (
		// 			apresZoom
		// 			)
		// 	),
		// 	this._CamerasConfig[CameraNum].zoom.zmax
		// 	);
	}
	handleZoom2(zooming,CameraNum){
		const MINZOOM = 7
		let zoom = (zooming === 'out')
			? this._CamerasConfig[CameraNum].zoom.step 
			: -this._CamerasConfig[CameraNum].zoom.step;

		this.cameras[CameraNum].position.z = Math.min(
			Math.max(
				MINZOOM,
				this.cameras[CameraNum].position.z + zoom
			),
			this._CamerasConfig[CameraNum].zoom.zmax
			);
	}
	init_Cameras() {
		this._CamerasConfig.forEach(config => {
			if (config.active) {
				let newcamera = this.get_Camera(config)
				this.cameras.push(newcamera)
				// if (this.conslog) console.info('newcamera', newcamera)
				// if (this.conslog) console.info('newcamera.position', newcamera.position)
			}
		});
	}
	FollowPlayer(position,oldPosition,CameraNum){
		this.cameras[CameraNum].position.x = position.x + this._CamerasConfig[CameraNum].followDecalage.x
		this.cameras[CameraNum].position.y = position.y + this._CamerasConfig[CameraNum].followDecalage.y
		this.cameras[CameraNum].position.z = position.z + this._CamerasConfig[CameraNum].followDecalage.z

		// this.cameras[CameraNum].lookAt(position.x,position.y,position.z)
		let vec = new THREE.Vector3(
			position.x+this._CamerasConfig[CameraNum].lookatDecalage.x,
			position.y+this._CamerasConfig[CameraNum].lookatDecalage.y,
			position.z+this._CamerasConfig[CameraNum].lookatDecalage.z
		)
		this.cameras[CameraNum].lookAt(vec);
	}
	set_CameraLookAt(targetPos,CameraNum) {
		this.cameras[CameraNum].lookAt(targetPos);
	}
}
export {CamerasManager}