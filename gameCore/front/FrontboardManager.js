class FrontboardManager {
	DDom
	conslog = false
	stats
	FrontMobsCounter
	FrontPlayer
	_allPlayers
	_allMobs
	constructor(DDom) {
		this.DDom = DDom
		this.defaultStats = {
			hp: { name: 'Hit Point', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
			energy: { name: 'Energy', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
			def: { name: 'defense', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(9, 59, 223, 0.644)' },
			test: { name: 'test', current: 0, max: 100, regen: 0, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
		}
		// this.FrontPlayer;
		this._init();
	}
	_init() {
		this._setFrontPlayer()
		this._setFrontMobsCounter()
	}

	// called in player manager
	refresh(statname, value) {
		this.defaultStats[statname].current = value
		let centage = (this.defaultStats[statname].current / this.defaultStats[statname].max) * 100
		this.defaultStats[statname].divcurrent.style.width = centage + '%'
		// console.log(centage, value, this.defaultStats[statname])
	}
	_get_centage(key) {
		return (this.defaultStats[key].current / this.defaultStats[key].max) * 100
	}
	_setFrontPlayer() {
		this.FrontPlayer = document.createElement('div');
		this.FrontPlayer.className = 'board';
		for (var key in this.defaultStats) {
			// if (typeof this.defaultStats[key] !== 'function') {

			let div = document.createElement('div');
			div.className = 'stat ' + key;
			div.id = 'id_' + key;

			let divcurrent = document.createElement('div');
			divcurrent.style.width = this._get_centage(key) + '%';
			divcurrent.style.backgroundColor = this.defaultStats[key].backgroundColor;
			divcurrent.title = key;
			divcurrent.className = 'current ' + key + '-current';

			div.appendChild(divcurrent);

			this.defaultStats[key].div = div
			this.defaultStats[key].divcurrent = divcurrent
			// }
			this.FrontPlayer.appendChild(div)
		}
		document.body.appendChild(this.FrontPlayer)
		// let stringCss = '.mire,.target {position: absolute;height: 20px;width: 20px;left: calc(50% - 10px);top: calc(50% - 10px);border-radius: 50%;}.mire {display: none;background-color: rgba(153, 205, 50, 0.493);}.target {background-color: rgba(248, 234, 33, 0.459);}'
		// stringCss += '.board{position: absolute;background-color: rgba(0, 0, 255, 0.644);top: 50px;left:0;width:75px;height:75px;display:flex;flex-direction: column;}'
		// stringCss += '.stat{width:100%;height:33%;display:flex;background-color: rgba(34, 34, 88, 0.644);border: 1px solid rgb(0, 0, 0);}'
		// stringCss += '.current{height:100%;}'
		// addCss(stringCss, 'miretarget')
	}
	setPlayersAndMobs(Players, Mobs) {
		this._allPlayers = Players
		this._allMobs = Mobs
	}
	_setFrontMobsCounter() {
		// console.log(LEJEU)
		this.FrontMobsCounter = this.DDom.createEle({
			tag: 'div', id: 'mobscounter', className: 'mobscounter', textContent: "0/25"
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
		this.FrontMobsCounter.textContent = number
	}
}
export { FrontboardManager }
