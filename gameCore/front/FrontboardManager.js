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
	last = {
		mobnumbers:0,
		// FlooredSignal:null,
		// ColliderSignal:null
	}
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

		// bloc for all signals alerte
		this._setFrontPart({
			target:false,
			idCss: 'playerXp',
			// stringCss: "",
			stringCss: ".playerxp{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;top:160px;right:20px;min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}",
			elementAttributs: { tag: 'div', id: 'playerXp', className: 'playerxp', textContent: "xp" ,title:'Experience', alt:'Experience'}
		});
		// bloc for all signals alerte
		this._setFrontPart({
			target:false,
			idCss: 'Alertes',
			stringCss: "",

			stringCss: '.alertes {position: absolute;bottom: 7px;display: flex;flex-direction: row;align-self: center;align-items: center;justify-content: center;background-color: rgba(0, 0, 0, 0.3);padding-right:7px;border-radius: 1rem;-webkit-user-select: none;-moz-user-select: none;user-select: none;}' +
			'.alertes div {background-color: rgba(0, 0, 0, 0.3);border-radius: 1rem;color: white;font-family: "Roboto", sans-serif;font-weight: bold;display: flex;align-items: center;justify-content: center;min-width: 50px;max-width: 80px;height: 40px;margin:7px 0 7px 7px;text-align: center;}' +
			'.alertes div.active {background-color: rgba(255, 0, 0, 0.3);}',
			elementAttributs: { tag: 'div', id: 'Alertes', className: 'alertes', textContent: "" }
		});
		this._setFrontPart({
			target:"Alertes",
			idCss: 'ColliderSignal',
			stringCss: "",
			elementAttributs: { tag: 'div', id: 'ColliderSignal', className: 'signal collidersignal', textContent: "Collider Alert",title:'Mobs Collider', alt:'Mobs Collider!'}
		});
		this._setFrontPart({
			target:"Alertes",
			idCss: 'FlooredSignal',
			stringCss: "",
			elementAttributs: { tag: 'div', id: 'FlooredSignal', className: 'signal flooredsignal', textContent: "Floored Alert" ,title:'On floor!', alt:'On floor!'}
		});
		// this.setColliderSignal('ColliderSignal', false)
		// this.setColliderSignal('ColliderSignal', true)

	}
	
	_setFrontMobsCounter() {
		let stringCss = ".mobscounter{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;top:80px;right:20px;min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}"
		this.DDom.addCss(stringCss, 'mobscounter')

		this.FrontMobsCounter = this.DDom.createEle({
			tag: 'div', id: 'mobscounter', className: 'front mobscounter', textContent: "0" ,title:'Mobs counter!', alt:'Mobs counter!'
		})
		document.body.appendChild(this.FrontMobsCounter)
	}
	setColliderSignal(frontName, isOn) {
		if (typeof this[frontName] === 'object' && typeof isOn === 'boolean') {
			if(isOn !== this.last[frontName]  ) {
				if(isOn === true) {
					this[frontName].classList.add('active') }
				else {
					this[frontName].classList.remove('active')
				}
			}
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

		this._setFrontPlayer()
		this._setMire()
	}
	_setMire() {
		let stringCss = '.mire,.target {position: absolute;height: 20px;width: 20px;left: calc(50% - 10px);top: calc(50% - 10px);border-radius: 50%;}.mire {display: none;background-color: rgba(153, 205, 50, 0.493);}.target {background-color: rgba(248, 234, 33, 0.459);}'
		this.DDom.addCss(stringCss, 'miretarget')
	}
	_setFrontPlayer() {
		this.FrontPlayer = document.createElement('div');
		this.FrontPlayer.className = 'board';
		this.FrontPlayer.id = 'fullboard';
		document.body.appendChild(this.FrontPlayer)
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

		
		let stringCss = '.board{position: absolute;background-color: rgba(0, 0, 255, 0.644);top: 50px;left:0;width:75px;height:75px;display:flex;flex-direction: column;}'
		stringCss += '.stat{width:100%;height:33%;display:flex;background-color: rgba(34, 34, 88, 0.644);border: 1px solid rgb(0, 0, 0);}'
		stringCss += '.current{height:100%;color:white}'
		this.DDom.addCss(stringCss, 'fullboard')
	}
	_setFrontPart(datas = false) {

		this.DDom.addCss(datas.stringCss, datas.elementAttributs.id)
		this[datas.elementAttributs.id] = this.DDom.createEle(datas.elementAttributs)
		this.last[datas.elementAttributs.id] = null
		datas.target 
			? this[datas.target].appendChild(this[datas.idCss])
			: document.body.appendChild(this[datas.idCss]);
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
		if (this.last.mobnumbers!=number && this.FrontMobsCounter) {
			this.last.mobnumbers = number
			this.FrontMobsCounter.textContent = this.last.mobnumbers
		}
	}
	setXpCounter(number) {
		if (this.last.playerXp!=number && this.playerXp) {
			this.last.playerXp = number
			this.playerXp.textContent = this.last.playerXp
		}
	}
}
export { FrontboardManager }
