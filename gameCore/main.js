import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
// import * as THREE from './node_modules/three/build/three.module.js';

import { ModelsManager } from "./scene/ModelsManager.js";
import { RayCaster } from "./front/RayCaster.js";

import { WindowActive } from "./front/WindowActive.js";
import { FullScreenManager } from "./front/FullScreenManager.js";
import { Formula } from "./mecanics/Formula.js";
import { GameConfig } from "./scene/GameConfig.js";
import { SceneManager } from "./scene/SceneManager.js";
import { FloorsManager } from "./scene/FloorsManager.js";
import { LightsManager } from "./scene/LightsManager.js";
import { CamerasManager } from "./scene/CamerasManager.js";
import { DomManager } from "./front/DomManager.js";
import { FrontboardManager } from "./front/FrontboardManager.js";
import { PlayerManager } from "./players/PlayerManager.js";
import { MobsManager } from "./mobs/MobsManager.js";
import { TouchMe } from "./mecanics/TouchMe.js";

// import { Stats } from './node_modules/stats.js/src/Stats.js';
class gameCore {
	v = "0.0.5";
	// ------------------------------
	defaultMobsNumber = 20;
	_conslog = false;
	stats = null;
	// ------------------------------
	_Formula = null;
	_GameConfig = null;
	_SceneManager = null;
	_FloorsManager = null;
	floor = null;
	_LightsManager = null;
	lights = [];
	sun = null;
	_CamerasManager = null;
	camera = null;
	_FrontboardManager = null;
	_FullScreenManager = null;
	_PlayerManager = null;
	_PlayerConfig = null;

	_MobsManager = null;
	_ModelsManager = null;
	_WindowActive = null;
	// _TouchMe = null
	// --------------------------------------
	_previousREFRESH = null;
	// _pause = false;
	// _pauseModalText;

	// _domEvents // threex event
	// _clikableThings = false;
	// _loadingmanager = null;
	// _ImagesManager = null;
	constructor(datas = { HowManyMobs: this.defaultMobsNumber }) {
		this._GameConfig = new GameConfig(this._conslog);
		this.HowManyMobs =
			datas && datas.HowManyMobs ? datas.HowManyMobs : this.defaultMobsNumber;

		this._InitA();
	}
	_InitA() {
		if (typeof Stats === "function") this.stats = new Stats();
		if (this.stats != null) {
			this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
			document.body.appendChild(this.stats.dom);
		}

		this._Formula = new Formula();

		this._DomManager = new DomManager(this._conslog);
		// ----------------------------------------------------
		this._SceneManager = new SceneManager(this._GameConfig);
		this._LightsManager = new LightsManager(this._GameConfig);
		this._CameraManager = new CamerasManager(this._conslog);

		this._FrontboardManager = new FrontboardManager(this._DomManager);
		this._FullScreenManager = new FullScreenManager();
		// ----------------------------------------------------

		this._threejs = this._SceneManager.setAndGet_WebGLRenderer();

		this._GameConfig.set_value(
			"MaxAnisotropy",
			this._threejs.capabilities.getMaxAnisotropy()
		);

		this._FloorsManager = new FloorsManager(this._GameConfig);

		// this._WindowActive = new WindowActive(this._GameConfig);

		// MODEL MANAGER
		this._ModelsManager = new ModelsManager({
			// scene: this.scene,
			fonctionretour: (allModelsAndAnimations) => {
				this.allModels = allModelsAndAnimations;
				this._InitAtoB();
			},
		});
	}
	_InitAtoB() {
		// un loader d'images pour les texures des futures object 3d
		if (this._ImagesManager != null) this._ImagesManager = new ImagesManager();

		this._InitB();
	}
	_InitB() {
		this._InitC();
	}
	_InitC() {
		this.charGltf = this.allModels["character"]["Kimono_Female"].gltf;
		this.MegaMixer = new THREE.AnimationMixer(this.charGltf.scene);
		this.MegaClip = THREE.AnimationClip.findByName(
			this.charGltf.animations,
			"Idle"
		);
		this.MegaAction = this.MegaMixer.clipAction(this.MegaClip);
		this.MegaAction.play(); // Joue l'animation par défaut
		this._GameConfig.playerChar = {
			charGltf: this.charGltf,
			MegaMixer: this.MegaMixer,
			MegaClip: this.MegaClip,
			MegaAction: this.MegaAction,
		};

		// this._TouchMe = new TouchMe()
		// ----------------------------------------------------
		this.camera = this._CameraManager.cameras[0];
		this.floor = this._FloorsManager.floor;
		this.lights = this._LightsManager.lights;
		this.sun = this._LightsManager.Sun;
		// this.plan = this._FloorsManager.get_plan()

		// ----------------------------
		this._DomManager.init(this._threejs, this.camera);

		// SCENE
		this.scene = this._SceneManager.set_AndGetScene(
			this.camera,
			this.lights,
			this.floor,
			this.plan,
			this.sun
		);
		// ----------------------------
		// PLAYER ----------------
		this._PlayerManager = new PlayerManager(
			false, //{x:0, y:-64, z:15}, // force start pos
			this._GameConfig,
			this._FrontboardManager,
			this._CameraManager,
			this.scene
		);

		this._MobsManager = new MobsManager({
			GameConfig: this._GameConfig,
			FrontboardManager: this._FrontboardManager,
			CameraManager: this._CameraManager,
			scene: this.scene,
		});

		// Set player data in _MobsManager Class
		this._MobsManager.set_Camera(this.camera);
		this._MobsManager.set_PlayerDatas(this._PlayerManager);
		this._MobsManager.set_Models(this.allModels);

		this.allMobs = this._MobsManager.addMobs(this.HowManyMobs, "mobs");

		// ADD OrbitControls --------
		// this.controls = this._SceneManager.setAndGet_OrbitControls(
		// 	this.camera
		// )

		// test objects (viré par ce que ca gene)
		// this._domEvents = new THREEx.DomEvents(this.camera, this._threejs.domElement)
		// this._clikableThings = new Things(this._domEvents, this.scene);

		let FrontboardManagerDatas = {
			PlayerIndex: 0,
			Players: [this._PlayerManager], // array pour tous les joueurs/joueuses conectées ???
			Mobs: this.allMobs,
		};
		this._FrontboardManager.init(FrontboardManagerDatas);

		this.scene.add(this._PlayerManager.playerGroupe);

		if (this._FullScreenManager != null) this._FullScreenManager.init();

		if (this._WindowActive != null) this._WindowActive.init();

		// onmouseover mobs
		this.RayCaster = new RayCaster({
			camera: this.camera,
			MobsManager: this._MobsManager,
			FrontboardManager: this._FrontboardManager,
			PlayerManager: this._PlayerManager,
		});

		// START
		this.START();
	}
	START() {
		this._REFRESH();
	}

	_Step(timeElapsed) {
		timeElapsed = timeElapsed * 0.001;
		if (
			!this._pause &&
			((this._WindowActive != null &&
				this._WindowActive.get_isWindowActive()) ||
				this._WindowActive === null)
		) {
			// this._LightsManager.upadteSun()
			this._SceneManager.rotateSun();

			this.RayCaster.checkMouseRayCaster();

			this._PlayerManager.saveOldPos();
			this._PlayerManager.checkRotation();
			this._PlayerManager.checkMoves();

			this._PlayerManager.checkActions();
			this._PlayerManager.checkSkills(this.allMobs);
			this._PlayerManager.checkZooming();

			// this._PlayerManager.updatePlayerOrbiter();

			// REGENS AND BUFF
			this._PlayerManager.regen();

			// MOBS
			if (typeof this.allMobs === "object" && this.allMobs.length > 0) {
				this._MobsManager.A_InitAllMobsDatas();

				let datasPhaseB = this._MobsManager.B_CheckAllMobsDatas(); // all mob cycle

				if (datasPhaseB.colliders)
					this._FrontboardManager.TriggerFrontBloc(
						"ColliderSignal",
						datasPhaseB.colliders.length > 0
					);

				this._MobsManager.C_CleanAllMobsDatas();

				this.allMobs = this._MobsManager.getOnlyLivings()[0];
			}

			// if (this._clikableThings) this._clikableThings.update(this._pause, this._WindowActive.get_isWindowActive());

			// Update MOBS animations
			if (this.MegaMixer) this.MegaMixer.update(timeElapsed);
			if (this.MegaMixer2) this.MegaMixer2.update(timeElapsed);

			// Check if floored
			let floorcolide = this._PlayerManager.detecteCollisionWithFloor(
				this.floor
			);

			this._FrontboardManager.TriggerFrontBloc("FlooredSignal", floorcolide);
			// GRAVITY
			this._PlayerManager.applyGravity(floorcolide);

			// apply definitive position after alll stuff done
			this._PlayerManager.applyFuturPositionsToPlayerGroupePosition();

			// Camera folow
			this._CameraManager.FollowPlayer(
				this._PlayerManager.playerGroupe.position,
				0
			);

			// RENDER ((((()))))
			this._threejs.render(this.scene, this.camera);
		}
	}
	_REFRESH() {
		requestAnimationFrame((t) => {
			if (this.stats != null) this.stats.begin(); // affichage des stats begin
			if (this._previousREFRESH === null) this._previousREFRESH = t;
			this._REFRESH();
			this._Step(t - this._previousREFRESH);
			this._previousREFRESH = t;
			if (this.stats != null) this.stats.end(); // affichage des stats end
		});
	}
	get_pause() {
		return this._pause;
	}
}

let _JEU = null;
window.addEventListener("DOMContentLoaded", () => {
	_JEU = new gameCore();
});
