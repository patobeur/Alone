class OtherPlayersManager {
	conslog=true
	#playersImmat;
	#otherPlayers;
	constructor() {
		this.#init();
	}
	#init() {
		if (this.conslog) console.log('OtherPlayersManager Mounted')
		this.#playersImmat = 0;
		this.#otherPlayers = {};
	}
	
	// public
	updateOtherPlayersPosition(data) {
		if(typeof(data)  === 'object' && data.id && this.#otherPlayers[data.id]){
			this.#otherPlayers[data.id].playerGroupe.position.x = data.position.x
			this.#otherPlayers[data.id].playerGroupe.position.y = data.position.y
			this.#otherPlayers[data.id].playerGroupe.position.z = data.position.z
			this.#otherPlayers[data.id].playerGroupe.rotation.z = data.rotation.z
			this.#otherPlayers[data.id].playerGroupe.thetaDeg = data.thetaDeg
		}
	}
	getOtherPlayers() {
		return this.#otherPlayers
	}
	getOtherPlayerByImmat(Immat) {
		if(this.#otherPlayers[Immat]) return this.#otherPlayers[Immat];
		return false
	}
	addOtherPlayer(player) {
		// todo : check incoming new player datas
		if("check" === "bad") return false;
		// add
		this.#otherPlayers[this.playersImmat] = player
		this.#playersImmat++
		return true
	}
}
