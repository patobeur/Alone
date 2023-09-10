class WindowActive {
	conslog = true;
	order = 0
	_windowActive = false;
	_ismobile = false
	_overLay = null;
	_pauseModalText = null;
	constructor(GameConfig = 'Listeners', ismobile = false) {
		this._GameConfig = GameConfig
		this._ismobile = ismobile;
	}
	init() {
		this._pauseModalText = this._GameConfig.pauseModalText;
		if (this._GameConfig.conslog) console.info('WindowActive mounted')
		this._add_Overlay()
		this._Window_Blur()
		this._init_Window_Focus()
		if (this._GameConfig.conslog) console.log('--->WindowActive :',this._windowActive)
	}
	_init_Window_Focus() {
		document.addEventListener('mouseover', () => {
			this._Window_Focus()
		})
		document.addEventListener('mouseout', () => {
			this._Window_Blur()
		})
		window.addEventListener('focus', () => {
			this._Window_Focus()
		})
		window.addEventListener('blur', () => {
			this._Window_Blur()
		})
	}
	_Window_Focus() {
		this._windowActive = true
		// this._overLay.classList.remove('paused')
		this._overLay.style.display = 'none'
		// console.log('focus')
	}
	_Window_Blur() {
		this._windowActive = false
		// this._overLay.classList.add('paused')
		this._overLay.style.display = 'block'
		this._overLay.style.display = 'flex'
		this._overLay.style.alignItems = 'center'
		this._overLay.style.justifyContent = 'center'
		// console.log('blur')
	}
	get_isWindowActive() {
		return this._windowActive
	}
	_add_Overlay() {
		this._overLay = document.createElement('div')
		this._overLay.id = "Pause"
		this._overLay.style.display = 'none'
		this._overLay.textContent = this._pauseModalText
		this._overLay.className = "Pause"
		this._overLay.style.position = 'absolute'
		this._overLay.style.top = '25%'
		this._overLay.style.left = '25%'
		this._overLay.style.width = '50%'
		this._overLay.style.height = '50%'
		// this._overLay.style.zIndex = '1000000'
		this._overLay.style.borderRadius = '1rem'
		this._overLay.style.backgroundColor = 'rgba(255,255,255,.2)'
		this._overLay.style.display = 'flex'
		this._overLay.style.alignItems = 'center'
		this._overLay.style.justifyContent = 'center'
		this._overLay.style.fontSize = '3rem'
		this._overLay.style.color = 'yellowGreen'
		this._appendChild(this._overLay, false)
	}
	_appendChild = (element, targetElement) => {
		let target = !targetElement === false ? targetElement : document.body;
		if (element) { target.appendChild(element) }
	}
}
export {WindowActive}