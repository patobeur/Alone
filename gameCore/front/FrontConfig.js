class FrontConfig {
	constructor() {
		this._init();
	}
	_init() {
		this.config = this.get_config();
	}
	get_config() {
		let colors = {
			hp: 'rgba(250, 59, 9, 0.644)',
			energy: 'rgba(9, 223, 20, 0.644)',
			def: 'rgba(9, 59, 223, 0.644)',
			test: 'rgba(255, 59, 0, 0.644)'
		}
		let parts = {
			playerXp:{
				target:false,
				idCss: 'playerXp',
				// stringCss: "",
				stringCss: ".playerxp{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;top:160px;right:20px;min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}",
				elementAttributs: { tag: 'div', id: 'playerXp', className: 'playerxp', textContent: "xp" ,title:'Experience', alt:'Experience'}
			},
			Alertes:{
				target:false,
				idCss: 'Alertes',
				stringCss: '.alertes {position: absolute;bottom: 7px;display: flex;flex-direction: row;align-self: center;align-items: center;justify-content: center;background-color: rgba(0, 0, 0, 0.3);padding-right:7px;border-radius: 1rem;-webkit-user-select: none;-moz-user-select: none;user-select: none;}' +
				'.alertes div {background-color: rgba(0, 0, 0, 0.3);border-radius: 1rem;color: white;font-family: "Roboto", sans-serif;font-weight: bold;display: flex;align-items: center;justify-content: center;min-width: 50px;max-width: 80px;height: 40px;margin:7px 0 7px 7px;text-align: center;}' +
				'.alertes div.active {background-color: rgba(255, 0, 0, 0.3);}',
				elementAttributs: { tag: 'div', id: 'Alertes', className: 'alertes', textContent: "" },
				children:{

				}
			},
			ColliderSignal:{
				target:"Alertes",
				idCss: 'ColliderSignal',
				stringCss: "",
				elementAttributs: { tag: 'div', id: 'ColliderSignal', className: 'signal collidersignal', textContent: "Collider Alert",title:'Mobs Collider', alt:'Mobs Collider!'}
			},
			FlooredSignal:{
				target:"Alertes",
				idCss: 'FlooredSignal',
				stringCss: "",
				elementAttributs: { tag: 'div', id: 'FlooredSignal', className: 'signal flooredsignal', textContent: "Floored Alert" ,title:'On floor!', alt:'On floor!'}
			},
			Targets:{
				target:false,
				idCss: 'Targets',
				stringCss: ".targets {position: absolute;width: 100px;min-height: 30px;bottom: 100px;display: none;flex-direction: row;align-self: center;align-items: center;justify-content: center;background-color: rgba(0, 0, 0, 0.3);padding-right:7px;border-radius: 1rem;-webkit-user-select: none;-moz-user-select: none;user-select: none;}"+
					".targets.active {display: flex;background-color: rgba(255, 0, 0, 0.3);}",
				elementAttributs: { tag: 'div', id: 'Targets', className: 'targets', textContent: "" ,title:'all targets', alt:'all targets!'}
			},
			FrontMobsCounter:{
				target: false,
				idCss: "mobscounter",
				stringCss: ".mobscounter{background-color:rgba(0,0,0,.3);border-radius:35%;color:white;position:absolute;font-family:'Roboto',sans-serif;font-weight:bold;display:flex;align-items: center;justify-content:center;top:80px;right:20px;min-width:50px;height:50px;z-index:11;display:flex;align-content: center;justify-content: center;}",
				elementAttributs: {
					tag: "div",
					id: "FrontMobsCounter",
					className: "front mobscounter",
					textContent: "0000",
					title: "Mobs counter!",
					alt: "Mobs counter!",
				},
				drag:true,
			}
		}
		return {parts:parts,colors:colors}
	}
}
export { FrontConfig };
