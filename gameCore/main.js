
// import defaultExport from '/Alone/node_modules/stats.js/src/stats.js';
// import {Stats} from '/Alone/node_modules/stats.js/src/stats.js';

import {ModelsManager} from './scene/ModelsManager.js';
import {WindowActive} from './front/WindowActive.js';
import {FullScreenManager} from './features/FullScreenManager.js';
import {Formula}  from './mecanics/Formula.js';
import {GameConfig} from './scene/GameConfig.js';
import {SceneManager} from './scene/SceneManager.js';
import {FloorsManager} from './scene/FloorsManager.js';
import {LightsManager} from './scene/LightsManager.js';
import {CamerasManager} from './scene/CamerasManager.js';
import {DomManager} from './front/DomManager.js';
import {FrontboardManager} from './front/FrontboardManager.js';
import {PlayerManager} from './players/PlayerManager.js';
import {MobsManager} from './mobs/MobsManager.js';
import {TouchMe} from './mecanics/TouchMe.js';
class gameCore {
	v= "0.0.1"
	stats = null
	_conslog = false
	_Formula = null
	_GameConfig = null
	_SceneManager = null
    _FloorsManager = null;
		floor = null;
    _LightsManager = null;
		lights = []
    _CamerasManager = null;
        camera = null;
	_FrontboardManager = null
	_FullScreenManager = null
	_PlayerManager = null
	_PlayerConfig = null

	_WindowActive = null
	_MobsManager = null
	_ModelsManager  = null
	defaultMobsNumber = 21
	// _TouchMe = null
    // --------------------------------------
	_previousREFRESH = null
	// _pause = false;
	// _pauseModalText;


	// _domEvents // threex event
	// _clikableThings = false;
	// _loadingmanager = Object;
	// _ImagesManager = Object;
	constructor(datas={HowManyMobs:this.defaultMobsNumber}) {
		this.HowManyMobs = datas && datas.HowManyMobs 
			? datas.HowManyMobs 
			: this.defaultMobsNumber;
		this._Init()
	}
	_Init() {
		if(typeof Stats === 'function') this.stats = new Stats();
		if (this.stats != null){
			this.stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
			document.body.appendChild( this.stats.dom );
		}

        this._Formula = new Formula()
		this._GameConfig = new GameConfig(this._conslog)
		// ----------------------------------------------------
		this._SceneManager = new SceneManager(this._GameConfig)
        this._LightsManager = new LightsManager(this._GameConfig)	
		this._CameraManager = new CamerasManager(this._conslog)
		this._DomManager = new DomManager(this._conslog)
		this._FrontboardManager = new FrontboardManager(this._DomManager,this._conslog)
		// ----------------------------------------------------
		this._threejs = this._SceneManager.setAndGet_WebGLRenderer()
		this._GameConfig.set_value('MaxAnisotropy',this._threejs.capabilities.getMaxAnisotropy())

		this._FloorsManager = new FloorsManager(this._GameConfig)

		this._FullScreenManager = new FullScreenManager()
		// this._WindowActive = new WindowActive(this._GameConfig);
		// this._TouchMe = new TouchMe()
		// ----------------------------------------------------
        this.camera = this._CameraManager.cameras[0]
        this.floor = this._FloorsManager.floor
		this.plan = this._FloorsManager.get_plan()
		
		// ----------------------------
		this._DomManager.init(this._threejs,this.camera)
		this.scene = this._SceneManager.set_AndGetScene(
			this.camera,
			this._LightsManager.lights,
			this.floor,
			this.plan,
			this._conslog
		)
		this._ModelsManager = new ModelsManager(this._GameConfig,this.scene)

		// ADD MOBS
		this._MobsManager = new MobsManager({
			GameConfig: this._GameConfig,
			scene: this.scene,
			FrontboardManager: this._FrontboardManager
		});
		this.allmob = this._MobsManager.addMobs(this.HowManyMobs, 'mobs')

		

		// ----------------------------
		// ----------------------------
		// ----------------------------
		// LOAD MODELS 

		this._PlayerManager = new PlayerManager(
			false,//{x:0, y:-64, z:15},
			this._GameConfig,
			this._FrontboardManager,
			this._CameraManager,
			this.scene
		)
		this._MobsManager.set_PlayerDatas(this._PlayerManager.playerGroupe)
		// ------------------------
		// OrbitControls --------
		// --------------------		
		// this.controls = this._SceneManager.setAndGet_OrbitControls(
		// 	this.camera
		// )
		// --------------------	
		// ----------------------	
		// ------------------------
		

		// ADD MOBS

		// this._clock = this._SceneManager.get_Clock()

		// // un loader d'images pour les texures des futures object 3d
		// // il faut charger GLTFLoader.js dans la page html
		// // this._ImagesManager = new ImagesManager();
		// this._domEvents = new THREEx.DomEvents(this._PCamera, this._Renderer.domElement)
			// // test objects (viré par ce que ca gene)
		// // this._clikableThings = new Things(this._domEvents, this.scene);





		this._FrontboardManager.setPlayersAndMobs([this._PlayerManager], this.allMobs)
		this.scene.add(this._PlayerManager.playerGroupe)

		this._FullScreenManager.init()
		console.log("_WindowActive")
		console.log(this._WindowActive)
		console.log(typeof this._WindowActive)

		if (this._WindowActive != null) {
			this._WindowActive.init()
		} else {
			console.log(' no WindowActive')
		}


		// this.MobsManager = new MobsManager({
		// 	SConfig: this._GameConfig,
		// 	Scene: this.scene,
		// 	FrontM: this._FrontM
		// });

		// // ADD MOBS
		// this.allMobs = this.MobsManager.addMobs(this.HowManyMobs, 'mobs')

		
		// GO RENDER
		// console.log('------')
		// console.log('SCENE:',this.scene)
		// console.log('all mount done')

		this._ModelsManager.LoadAnimatedModel()
		// START
		this.START();
	}
	START (){
		this._REFRESH();
	}
	// _REFRESH() {
	//   requestAnimationFrame((t) => {
  
	// 	this._REFRESH();
  
	// 	this._threejs.render(this._scene, this._camera);
	// 	this._Step(t - this._previousREFRESH);
	// 	this._previousREFRESH = t;
	//   });
	// }
  
	_Step(timeElapsed) {
		const timeElapsedS = timeElapsed * 0.001;
		if (this._ModelsManager.mixers) {
			this._ModelsManager.mixers.map(m => m.update(timeElapsedS));
		}
	
		if (this._controls) {
		  this._controls.Update(timeElapsedS);
		}
	  }
	_REFRESH() {
	  requestAnimationFrame((t) => {
		if (this.stats != null) this.stats.begin();
		if (this._previousREFRESH === null) this._previousREFRESH = t;

		if (
			!this._pause &&	((this._WindowActive != null 
			&& this._WindowActive.get_isWindowActive()) || (this._WindowActive === null))
		) {
			this._LightsManager.upadteSun()
			this._threejs.render(this.scene, this.camera);
			this._PlayerManager.checkMoves();
			this._PlayerManager.checkSkills(this.allMobs);
			// this._PlayerManager.checkZooming();

			this._PlayerManager.check_playerOrbiter();
			this.applyGravityToPlayerGroupe()
			this._PlayerManager.playerUpdateIfMove();

			this._CameraManager.FollowPlayer(this._PlayerManager.position,this._PlayerManager.oldPosition,0)
			// REGENS AND BUFF
			this._PlayerManager.regen();
			// if (this.allMobs) {
				this._MobsManager.updateAllMobsPhaseB()
				this._MobsManager.updateAllMobsPhaseA()
				this.allMobs = this._MobsManager.getOnlyLivings()[0]
			// }

		  // 	if (this._clikableThings) this._clikableThings.update(this._pause, this._WindowActive.get_isWindowActive());
		  // }
		}
		this._REFRESH();	
		this._Step(t - this._previousREFRESH);
		this._previousREFRESH = t;

		if (this.stats != null)this.stats.end();
	  });
	}	
	applyGravityToPlayerGroupe() {
		let gravity = 0.1 
		let halfHeight = this._PlayerManager._PlayerConfig.get_value('size','x')/2
		this._PlayerManager.saveOldPos()
		this._PlayerManager.position.z = (this._PlayerManager.position.z - halfHeight > gravity) ? (this._PlayerManager.position.z - halfHeight) - gravity : halfHeight
		this._PlayerManager.playerGroupe.position.z = this._PlayerManager.position.z
	}
	get_pause() {
		return this._pause
	}
}


let _JEU = null;

window.addEventListener('DOMContentLoaded', () => {
  _JEU = new gameCore();
});