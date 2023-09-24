class FrontboardManager {
	DDom = null
	conslog = false
	stats = null
	FrontMobsCounter = null
	FrontPlayer = null
	_allPlayers = null
	_allMobs = null
	defaultStats = null
	currentPlayer = 0
	constructor(DDom) {
		this.DDom = DDom
	}
	init(datas) {
		// currentPlayer: 0, players: [this._PlayerManager], allMobs: this.allMobs
		let Players = datas.Players;
		let PlayerIndex = datas.PlayerIndex
		let Mobs = datas.Mobs
		// this.defaultStats = {
		// 	hp: { name: 'Hit Point', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
		// 	// energy: { name: 'energy', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
		// 	// def: { name: 'defense', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(9, 59, 223, 0.644)' },
		// 	// test: { name: 'test', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
		// }
		this.colors = {
			hp: 'rgba(250, 59, 9, 0.644)',
			energy: 'rgba(9, 223, 20, 0.644)',
			def: 'rgba(9, 59, 223, 0.644)',
			test: 'rgba(255, 59, 0, 0.644)'
		}
		this.setPlayer(Players, PlayerIndex)
		this.setAllMobs(Mobs)

		this._setFrontPart({
			idCss: 'ColliderSignal',
			stringCss: ".collidersignal{" +
				"background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;" +
				"font-family:'Roboto',sans-serif;font-weight:bold;" +
				"display:flex;align-items: center;justify-content:center;bottom:80px;left:calc(50% - 25px);" +
				"min-width:50px;max-width:80px;height:50px;z-index:11;text-align: center;}" +
				".collidersignal.active{background-color:rgba(255,0,0,.3);}",
			elementAttributs: { tag: 'div', id: 'collidersignal', className: 'collidersignal active', textContent: "Collider Alert" }
		});
		this.setColliderSignal('ColliderSignal', false)
		this.setColliderSignal('ColliderSignal', true)

	}
	setColliderSignal(frontName = 'ColliderSignal', booleanData) {
		if (typeof this[frontName] === 'object') {
			(booleanData === true) ? this[frontName].classList.add('active') : this[frontName].classList.remove('active')
		}
	}
	setPlayer(Players, PlayerIndex) {
		this._allPlayers = Players
		this.currentPlayer = PlayerIndex
		this.defaultStats = this._allPlayers[this.currentPlayer].PlayerConfig.config.stats
		this._initFrontPlayer()
	}

	setAllMobs(Mobs) {

		this._allMobs = Mobs
		this._setFrontMobsCounter()
	}
	// called in player manager
	refresh(statname, value) {
		// console.log(typeof this.defaultStats)
		if (this.defaultStats !== null) {
			if (this.defaultStats[statname]) {
				this.defaultStats[statname].current = value
				let centage = Math.floor((this.defaultStats[statname].current / this.defaultStats[statname].max) * 1000) / 10
				this.defaultStats[statname].divcurrent.style.width = Math.floor(centage) + '%'
				this.defaultStats[statname].divcurrent.textContent = centage + '%'
			}
		}
	}
	_get_centage(key) {
		let pourcentage = (this.defaultStats[key].current / this.defaultStats[key].max) * 100
		console.log(key, ':', pourcentage)
		return pourcentage
	}
	_initFrontPlayer() {
		this.FrontPlayer = document.createElement('div');
		this.FrontPlayer.className = 'board';
		this.FrontPlayer.id = 'fullboard';
		document.body.appendChild(this.FrontPlayer)

		this._setFrontPlayer()
	}
	_setFrontPlayer() {
		for (var key in this.defaultStats) {
			// if (typeof this.defaultStats[key] !== 'function') {
			let div = document.createElement('div');
			div.className = 'stat ' + key;
			div.id = 'id_' + key;
			let divcurrent = document.createElement('div');
			divcurrent.style.width = '0%';
			divcurrent.style.backgroundColor = this.colors[key];
			divcurrent.title = key;
			divcurrent.className = 'current ' + key + '-current';
			div.appendChild(divcurrent);
			this.defaultStats[key].div = div
			this.defaultStats[key].divcurrent = divcurrent
			// }
			this.FrontPlayer.appendChild(div)
		}
		let stringCss = '.mire,.target {position: absolute;height: 20px;width: 20px;left: calc(50% - 10px);top: calc(50% - 10px);border-radius: 50%;}.mire {display: none;background-color: rgba(153, 205, 50, 0.493);}.target {background-color: rgba(248, 234, 33, 0.459);}'
		stringCss += '.board{position: absolute;background-color: rgba(0, 0, 255, 0.644);top: 50px;left:0;width:75px;height:75px;display:flex;flex-direction: column;}'
		stringCss += '.stat{width:100%;height:33%;display:flex;background-color: rgba(34, 34, 88, 0.644);border: 1px solid rgb(0, 0, 0);}'
		stringCss += '.current{height:100%;color:white}'
		this.DDom.addCss(stringCss, 'miretarget')
	}
	_setFrontPart(datas = false) {

		datas = datas === false ? {
			stringCss: ".collidersignal{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;bottom:80px;left:calc(50% - 25px);min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}",
			idCss: 'ColliderSignal',
			elementAttributs: { tag: 'div', id: 'collidersignal', className: 'collidersignal', textContent: "Collider Alert" }
		} : datas;

		this.DDom.addCss(datas.stringCss, datas.idCss)
		this[datas.idCss] = this.DDom.createEle(datas.elementAttributs)

		document.body.appendChild(this[datas.idCss])
	}
	// _setFrontPlayerColliderSignal() {
	// 	let partName = 'ColliderSignal'
	// 	let datas = {
	// 		stringCss: ".collidersignal{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;bottom:80px;left:calc(50% - 25px);min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}",
	// 		idCss: 'collidersignal',
	// 		elementAttributs: { tag: 'div', id: 'collidersignal', className: 'collidersignal', textContent: "Collider Alert" }
	// 	}
	// 	this.DDom.addCss(datas.stringCss, datas.idCss)
	// 	this[partName] = this.DDom.createEle(datas.elementAttributs)

	// 	document.body.appendChild(this[partName])
	// }
	_setFrontMobsCounter() {
		let stringCss = ".mobscounter{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;top:80px;right:20px;min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}"
		this.DDom.addCss(stringCss, 'mobscounter')

		this.FrontMobsCounter = this.DDom.createEle({
			tag: 'div', id: 'mobscounter', className: 'mobscounter', textContent: "0"
		})
		document.body.appendChild(this.FrontMobsCounter)
	}
	// set_ContextMenu = () => {
	// 	var cosmos = document.getElementById("game");
	// 	cosmos.addEventListener("navmenu", function (event) {
	// 		event.preventDefault();
	// 		// var ctxMenu = document.getElementById("ctxMenu");
	// 		// ctxMenu.style.display = "flex";
	// 		// ctxMenu.style.left = (event.pageX - 10) + "px";
	// 		// ctxMenu.style.top = (event.pageY - 10) + "px";
	// 	}, false);
	// 	// notepad.addEventListener("click", function (event) {
	// 	// 	event.preventDefault();
	// 	// 	// var ctxMenu = document.getElementById("ctxMenu");
	// 	// 	// ctxMenu.style.display = "";
	// 	// 	// ctxMenu.style.left = "";
	// 	// 	// ctxMenu.style.top = "";
	// 	// }, false);
	// }
	addMobCounter = (number) => {
		this.FrontMobsCounter.textContent = number
	}
	setMobCounter(number) {
		if (this.FrontMobsCounter) this.FrontMobsCounter.textContent = number
	}
}
export { FrontboardManager }
