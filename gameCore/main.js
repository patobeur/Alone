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
	floorFinished = false
	// --------------------------------------
	_previousREFRESH = null;
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

		this._WindowActive = new WindowActive(this._GameConfig);

		// MODEL MANAGER
		this._ModelsManager = new ModelsManager({
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
		let characterChoice = {
			0: {
				type: "character",
				name: "Kimono_Female",
				animName: "Idle",
			},
			1: {
				type: "character",
				name: "Kimono_Male",
				animName: "Idle",
			},
		};
		let choice = 1;
		this._ModelsManager.setMeshModel(
			characterChoice[choice].type,
			characterChoice[choice].name,
			characterChoice[choice].animName
		);
		// add playerChar to gameconfig
		this._GameConfig.playerChar = {
			meshModel:
				this.allModels[characterChoice[choice].type][
					characterChoice[choice].name
				],
		};

		// this._TouchMe = new TouchMe()
		this.camera = this._CameraManager.cameras[0];

		// DEFINE FLOORS
		this.allFloors = this._FloorsManager.allFloors;
		// ADD FLOORS
		this._FloorsManager.addFirstFloor();
		// this.activatedNumFloors = this._FloorsManager.allFloors;

		this.lights = this._LightsManager.lights;
		this.sun = this._LightsManager.Sun;
		// this.plan = this._FloorsManager.get_plan()

		// ----------------------------
		this._DomManager.init(this._threejs, this.camera);

		this.scene = this._SceneManager.set_AndGetScene({
			camera: this.camera,
			lights: this.lights,
			allFloors: this.allFloors,
			plan: this.plan,
			sun: this.sun,
		});
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

		this._MobsManager.addMobs(this._GameConfig.defaultMapNum, "mobs");
		this.allMobs = this._MobsManager.get_allMobs();

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
			this._SceneManager.rotateSun(this.sun);

			this.RayCaster.checkMouseRayCaster();

			this._PlayerManager.saveOldPos();
			this._PlayerManager.checkRotation();
			this._PlayerManager.checkMoves();
			this._PlayerManager.refreshanimation(timeElapsed);

			this._PlayerManager.checkActions();
			this._PlayerManager.checkSkills(this.allMobs);
			this._PlayerManager.checkZooming();

			// this._PlayerManager.updatePlayerOrbiter();

			// REGENS AND BUFF
			this._PlayerManager.regen();

			// MOBS
			if (typeof this.allMobs === "object" && this.allMobs.length > 0) {
				this._MobsManager.A_InitAllMobsDatas();

				let datasPhaseB = this._MobsManager.B_GetAllMobsDatas(); // all mob cycle

				if (datasPhaseB.colliders)
					this._FrontboardManager.TriggerFrontBloc(
						"ColliderSignal",
						datasPhaseB.colliders.length > 0
					);

				this._MobsManager.C_CleanAllMobsDatas();

				this.allMobs = this._MobsManager.getOnlyLivings()[0];
			}
			if (this.allMobs.length === 0 && this.floorFinished) {
				// you win
				console.log('you win')
			}
			if (this.allMobs.length === 0 && !this.floorFinished) {
				// add new floor
				let activatedNumFloors = this._FloorsManager.activatedNumFloors;
				let activatedNumLength = activatedNumFloors.length - 1;
				let lastfloorNum = activatedNumFloors[activatedNumLength];
				let lastfloor = this._GameConfig.Floors.config[lastfloorNum];
				let currentFloorNum = lastfloor.next[0];
				// console.log("------------lastfloor-------------");

				// console.log("activatedNumFloors", activatedNumFloors);
				// console.log("activatedNumLength", activatedNumLength);
				// console.log("lastfloorNum", lastfloorNum);

				// console.log("lastfloor", lastfloor);

				// console.log(currentFloorNum);
				// console.log("-------------------------");
				if (currentFloorNum) {
					// console.log(activatedNumFloors);
					let existedeja =
						this._FloorsManager.activatedNumFloors.includes(currentFloorNum);
					if (!existedeja) {
						this._FloorsManager.addNewFloor(this.scene, currentFloorNum);
						// console.log("nouvelle map N°", currentFloorNum, "chargé");
						let nextFloorNum =
							this._GameConfig.Floors.config[currentFloorNum].next;
						if (nextFloorNum) {
							// console.log("nextFloorNum ", nextFloorNum);
						} else {
							this.floorFinished = true
						}

						this._MobsManager.addMobs(currentFloorNum, "mobs");
						this.allMobs = this._MobsManager.get_allMobs();
					} else {
						console.log("Map N°", currentFloorNum, "existe deja");
					}
				} else {
					console.log("no more mobs");
				}
				// 	// console.log(this._GameConfig.Floors.config[this._GameConfig.defaultMapNum].next[0])}
				// 	// setTimeout((iii) => {
				// 	// // 	this.scene.remove(this.floor);
				// 	// 	this._FloorsManager.addNewFloor(this.scene,2)
				// 	// 		console.log('---New Floor added-----------')
				// 	// }, 5000, 'vouvou');
				// }
			}
			// if (this._clikableThings) this._clikableThings.update(this._pause, this._WindowActive.get_isWindowActive());

			// Check if floored
			let floorcolide = false;
			if (this.allFloors && this.allFloors.length > 0) {
				floorcolide = this._PlayerManager.detecteCollisionWithFloor(
					this.allFloors
				);
			}
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
