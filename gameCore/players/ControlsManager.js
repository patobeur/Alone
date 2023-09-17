import { Formula } from '../mecanics/Formula.js';
import { TouchMe } from '../mecanics/TouchMe.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

class ControlsManager {
	conslog = true
	_preventDefaultRightClick = true; // dev mod
	_TouchM
	pMouse
	_GameConfig;
	_touchDeviceActive;
	zooming
	constructor(Type, GameConfig) {
		// this.conslog = GameConfig.conslog
		this._Formula = new Formula()
		this.order = 0;
		this._GameConfig = GameConfig;
		this.conslog = this._GameConfig.conslog;

		if (this.conslog) console.info('ControlsManager Mounted !', 'conslog:', this.conslog);

		this._initProperties();
		this.detectDevice = this._isTouchDevice();
		this._setupDeviceControls();
	}

	_initProperties() {
		this.zooming = false
		// this.raycaster = new THREE.Raycaster();
		this.oldintersect = null;
		this.pMouse = new THREE.Vector2();
		this.thetaDeg = 0;

		this.shoot1 = false;
		this.shoot2 = false;
		this.shoot3 = false;
		this.shoot4 = false;
		this.shoot5 = false;

		this.space = false; // same ??
		this.jump = false; // same ??
		this.falling = false;

		this.forward = false;
		this.left = false;
		this.right = false;
		this.reverse = false;
		this.sleft = false;
		this.sright = false;
	}

	_isTouchDevice() {
		const ontouchstart = 'ontouchstart' in window;
		const maxTouchPoints = (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
		const isMousePointer = window.matchMedia('(pointer:fine)').matches;

		let touchEvent = false;
		try {
			touchEvent = document.createEvent("TouchEvent");
		} catch (e) { }

		const detectedDevice = { touchEvent, ontouchstart, maxTouchPoints, isMousePointer };

		console.table(detectedDevice);

		return detectedDevice;
	}

	_setupDeviceControls() {
		if (!this.detectDevice.isMousePointer && (this.detectDevice.touchEvent || this.detectDevice.ontouchstart || this.detectDevice.maxTouchPoints)) {
			this._touchDeviceActive = true;
			console.log('------------> Tactil device on ! 📱');
			this._TouchM = new TouchMe(this);
		}

		if (this.detectDevice.isMousePointer && this.detectDevice.maxTouchPoints === false) {
			this._touchDeviceActive = false;
			console.log('------------> Keyboard\'n\'mouse on ! 🖱️ + ⌨️');
			this._addKeyboardListeners();
			this._addMouseListeners();
		}
		if (this.detectDevice.isMousePointer && this.detectDevice.maxTouchPoints) {
			this._touchDeviceActive = false;
			console.log('------------> Keyboard\'n\'Pad on, Sorry you need to conect a Mouse and refresh [5] ! ⌨️');
			this._addKeyboardListeners();
			this._addMouseListeners();
		}
	}

	_addMouseListeners() {
		const mire = document.createElement('div');
		mire.className = 'mire';
		document.body.appendChild(mire);

		const target = document.createElement('div');
		target.className = 'target';
		document.body.appendChild(target);

		document.documentElement.oncontextmenu = event => {
			if (this.conslog) console.log('right click');
			if (this._preventDefaultRightClick) event.preventDefault();
			this.shoot2 = true;
		};

		document.documentElement.onclick = () => {
			if (this.conslog) console.log('left click');
			this.shoot1 = true;
		};

		document.documentElement.onwheel = event => {
			event.preventDefault();
			this._handleMouseWheel(event);
		};

		document.getElementById('game').onmousemove = event => {
			this._handleMouseMove(event, target);
		};
	}

	_handleMouseWheel(event) {
		if (event.ctrlKey === false && event.altKey === false) {
			if (this.conslog) console.info(event)
			this.zooming = event.deltaY > 0 ? 'out' : 'in'
		}
	}

	_handleMouseMove(event, target) {
		target.style.left = `${event.clientX - 5}px`;
		target.style.top = `${event.clientY - 5}px`;

		this.thetaDeg = this._Formula.get_DegreeWithTwoPos(window.innerWidth / 2, window.innerHeight / 2, event.clientX, event.clientY);
		this.pMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	_addKeyboardListeners() {
		if (this.conslog) console.log('addKeyboardListeners');

		document.onkeydown = event => this._handleKeyDown(event);
		document.onkeyup = event => this._handleKeyUp(event);
	}

	_handleKeyDown(event) {
		const KEY_MAP = {
			"&": () => this.shoot1 = true,
			"é": () => this.shoot2 = true,
			'"': () => this.shoot3 = true,
			"'": () => this.shoot4 = true,
			"(": () => this.shoot5 = true,
			"-": () => this.shoot6 = true,
			"è": () => this.shoot7 = true,
			"_": () => this.shoot8 = true,
			"ç": () => this.shoot9 = true,
			"à": () => this.shoot10 = true,
			"ArrowLeft": () => this.left = true,
			"q": () => this.left = true,
			"a": () => this.sleft = true,
			"ArrowRight": () => this.right = true,
			"d": () => this.right = true,
			"e": () => this.sright = true,
			"ArrowUp": () => this.forward = true,
			"z": () => this.forward = true,
			"ArrowDown": () => this.reverse = true,
			"s": () => this.reverse = true,
			" ": () => this.space = true,
			"Space": () => this.space = true,
		};

		if (KEY_MAP[event.key]) {
			if (this.conslog) console.log('EVENT', event);
			if (this._preventDefaultRightClick) event.preventDefault();
			KEY_MAP[event.key]();
		}
	}

	_handleKeyUp(event) {
		const KEY_MAP = {
			"&": () => this.shoot1 = false,
			"é": () => this.shoot2 = false,
			'"': () => this.shoot3 = false,
			"'": () => this.shoot4 = false,
			"(": () => this.shoot5 = false,
			"-": () => this.shoot6 = false,
			"è": () => this.shoot7 = false,
			"_": () => this.shoot8 = false,
			"ç": () => this.shoot9 = false,
			"à": () => this.shoot10 = false,
			"ArrowLeft": () => this.left = false,
			"q": () => this.left = false,
			"a": () => this.sleft = false,
			"ArrowRight": () => this.right = false,
			"d": () => this.right = false,
			"e": () => this.sright = false,
			"ArrowUp": () => this.forward = false,
			"z": () => this.forward = false,
			"ArrowDown": () => this.reverse = false,
			"s": () => this.reverse = false,
			" ": () => this.space = false,
			"Space": () => this.space = true,
		};

		if (KEY_MAP[event.key]) KEY_MAP[event.key]();
	}

	// _get_intersectionColorChange() {

	// 	this.raycaster.setFromCamera(this.pMouse, camera);
	// 	let intersects = this.raycaster.intersectObject(scene, true);
	// 	if (intersects.length > 1) {
	// 		if (intersects[0].object.name != "sand") {
	// 			// if old intersect
	// 			if (this.oldintersect) {
	// 				if (this.oldintersect.uuid != intersects[0].object.uuid) {
	// 					this.oldintersect.material.color.setHex(this.oldintersect.currentHex);
	// 					this.oldintersect = null;
	// 				}
	// 			}
	// 			else {
	// 				// new intersect
	// 				this.oldintersect = intersects[0].object;
	// 				this.oldintersect.currentHex = this.oldintersect.material.color.getHex();
	// 				this.oldintersect.uuid = intersects[0].object.uuid;
	// 				this.oldintersect.material.color.setHex(0xffFF00);
	// 			}

	// 		}
	// 		else {
	// 			// sol
	// 			if (this.oldintersect) {
	// 				this.oldintersect.material.color.setHex(this.oldintersect.currentHex);
	// 				this.oldintersect = null;
	// 			}
	// 		}
	// 	}
	// 	else // there are no intersections
	// 	{
	// 		if (intersects.length < 1) {
	// 			// if (this.conslog) console.log('oldintersect = null', this.oldintersect)
	// 			this.oldintersect = null;
	// 		}
	// 	}

	// }
}
export { ControlsManager }
