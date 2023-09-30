import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { Formula } from '../mecanics/Formula.js';
class SceneManager {
	backgroundsRootPath = './gameCore/3dAssets/backgrounds/'
	conslog = true;
	order = 0;
	_GameConfig;
	// ext
	_WebGLRenderer;
	_Scene;
	_Formula=null;
	constructor(GameConfig) {
		this.CubeTextureLoader = new THREE.CubeTextureLoader();
		this._GameConfig = GameConfig;
		if (this._GameConfig.conslog) console.info('SceneManager start !')
		this._Formula = new Formula()
	}
	init() {
		if (this._GameConfig.conslog) console.info('SceneManager initiated !')
	}
	set_AndGetScene(camera,lights,floor,plan,sun) {
		this.camera = camera;
		this.lights = lights;
		this.floor = floor;
		this.plan = plan;
		this.sun = sun;
		// Scene
		this._Scene = new THREE.Scene();


		this.set_SceneBackground(
			this.backgroundsRootPath,
			['posx.jpg','negx.jpg','posy.jpg','negy.jpg','posz.jpg','negz.jpg',]
		)
		// this._Scene.background.rotation = 2
		// this._Scene.flipY = true
		// console.log(this._Scene.background)
		
		this.lights.forEach(light => {
			if(typeof light != 'undefined') {
				if(typeof light.castShadow != 'undefined') {
					light.castShadow = true;
				} 
				this._Scene.add(light);
			}
		});

		this._Scene.add(this.sun);
		// this.faireTournerAutourCentreAxeY(this.sun,1);
		
		this._Scene.add(this.floor);
		// if(this.floor.castShadow) this.floor.castShadow = true;
		// if(this.floor.receiveShadow) this.floor.receiveShadow = true;

		// this._Scene.add(this.plan);

		return this._Scene
	}
	rotateSun=(objet = this.sun)=>{
		const vitesseRotation = 1//Math.PI/180
		const angleRotation = vitesseRotation * ((1 / (60*60*.25)));
		objet.position.sub(this._Scene.position)
		objet.position.applyAxisAngle(objet.direction, angleRotation)
		objet.position.add(this._Scene.position)
	}
	faireTournerAutourCentreAxeY = (objet, vitesseRotation)=> {
		// Obtenez le centre de la scène en supposant que votre scène est nommée "scene".
		const centreScene = new THREE.Vector3(0, 0, 0);
	
		// Fonction de mise à jour pour faire tourner l'objet autour de l'axe Y.
		function miseAJour() {
			// Calculez la nouvelle position de l'objet en utilisant la formule de rotation.
			const angleRotation = vitesseRotation * (1 / 60); // 1/60 car une minute a 60 secondes
			objet.position.sub(centreScene); // Translatez l'objet au centre de la scène.
			objet.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleRotation); // Appliquez la rotation autour de l'axe Y.
			objet.position.add(centreScene); // Ramenez l'objet à sa position d'origine par rapport au centre.
	
			// Appelez cette fonction de mise à jour à chaque trame d'animation.
			requestAnimationFrame(miseAJour);
		}
	
		// Lancez la mise à jour.
		miseAJour();
	}
	set_SceneBackground(path,images){
		this.CubeTextureLoader.setPath(path);
		const texture = this.CubeTextureLoader.load(images);
		this._Scene.background = texture;
		this._Scene.fog = new THREE.Fog( 0x333333, 30, 55 );
	}
	setAndGet_WebGLRenderer() {
		// WebGLRENDER
		this._WebGLRenderer = new THREE.WebGLRenderer({antialias: true,});

		this._WebGLRenderer.shadowMap.enabled = true;
		this._WebGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this._WebGLRenderer.setPixelRatio(window.devicePixelRatio );
		this._WebGLRenderer.setSize(window.innerWidth, window.innerHeight);
		// this._WebGLRenderer.gammaFactor = 2.2;
		this._WebGLRenderer.domElement.id = 'game'
		//document.body.appendChild(this._WebGLRenderer.domElement);
		return this._WebGLRenderer
	}
	setAndGet_OrbitControls(camera){
		if (this._GameConfig.conslog) console.info('test OrbitControls')
			
		if (typeof OrbitControls === 'function') {
			this.controls = new OrbitControls(
				camera,
				this._WebGLRenderer.domElement
			);
			if (typeof this.controls === 'object') {
				
				this.controls.enableDamping = true;
				this.controls.enableZoom = false;
				this.controls.enablePan = false;	

				this.controls.target.set(0, 0, 0);
				this.controls.update();
				if (this._GameConfig.conslog) console.info('OrbitControls ok ! ')
			}
			else {console.info('OrbitControls refused ! ')}
		}
		return this.controls
	}
	removeFromSceneAndDispose(sceneObject) {
		const object = this._Scene.getObjectByProperty('uuid', sceneObject.uuid);
		// if (this._GameConfig.conslog) console.log('removeFromSceneAndDispose',object)
		if (object.geometry) object.geometry.dispose();
		if (object.material) object.material.dispose();
		this._Scene.remove(object);
	}
	// TEST -------------------
	//      -------------------
	// addcubees(){
	// 	const textureLoader = new THREE.TextureLoader();
	// 	textureLoader.setPath(this.backgroundsRootPath);
	// 	const texture = textureLoader.load('posx.jpg');
	// 	const material = new THREE.MeshBasicMaterial({map:texture});
	// 	// Ou utilisez un matériau plus complexe comme MeshStandardMaterial :
	// 	// const material = new THREE.MeshStandardMaterial({
	// 	// 	 map: texture, 
	// 	// 	 roughness: 0, 
	// 	// 	 metalness: 0 
	// 	// });
		
	// 	const geometry = new THREE.BoxGeometry(1, 1, 1); // Par exemple, une boîte
	// 	const mesh = new THREE.Mesh(geometry, material);
	// 	mesh.position.set(3, 3, 3);
	// 	this._Scene.add(mesh); // Ajoutez le maillage à votre scène
	// 	console.log(this._Scene)

	// }
	// addcubee(){
	// 	this.CubeTextureLoader.setPath(this.backgroundsRootPath);
	// 	const textureCube = this.CubeTextureLoader.load([
	// 		'posx.jpg', 'posx.jpg','posx.jpg', 'posx.jpg','posx.jpg', 'posx.jpg'
	// 	]);
	// 	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

	// 	const geometry = new THREE.BoxGeometry(1, 1, 1); // Par exemple, une boîte
	// 	const mesh = new THREE.Mesh(geometry, material);
	// 	mesh.position.set(2, 2, 2);
	// 	this._Scene.add(mesh); // Ajoutez le maillage à votre scène
		

	// }
	addAxes(){				
		const xbox = new THREE.Mesh(
			new THREE.BoxGeometry(1000, 1, 1),
			new THREE.MeshStandardMaterial({color: 0xFF0000,})
		);
		xbox.position.set(.5, .5, .5);
		// xbox.castShadow = true;
		// xbox.receiveShadow = true;

		const ybox = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1000, 1),
			new THREE.MeshStandardMaterial({color: 0x00FF00,})
		);
		ybox.position.set(.5, .5, .5);
		const zbox = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1000),
			new THREE.MeshStandardMaterial({color: 0x0000FF,})
		);
		zbox.position.set(.5, .5, .5);
		this._Scene.add(xbox,ybox,zbox);
	}
}
export {SceneManager}