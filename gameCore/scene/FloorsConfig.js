class FloorsConfig {
	constructor() {
		this._init();
	}
	_init() {
		this.floorsRootPath = "./gameCore/3dAssets/floors/";
		this.backgroundsRootPath = "./gameCore/3dAssets/backgrounds/";
		this.config = this.get_config();
	}
	get_config() {
		let config = {
			0: {
				name: "groundZero",
				next:[1],
				fullName: "Lobby Room",
				// mode: { type: "BoxGeometry" },
				mode: {
					type: "PlaneGeometry",
					fileName: "stone_floor_736x736.jpg",
					size: { x: 512, y: 512 },
				},
				color: 0xFFeaea,
				receiveShadow: true,
				repeat: [64, 64],
				spawns: [
					{ x: 0, y: 0, z: 5 },
					{ x: 0, y: 0, z: 0 },
				],
				mobs: { number: 1 },
				size: { x: 16, y: 32, z: 0 },
				position: { x: 0, y: 0, z: 0 },
			},
			1: {
				name: "groundOne",
				next:[2],
				fullName: "Ground-One",
				mode: {
					type: "PlaneGeometry",
					fileName: "stone_floor_736x736.jpg",
					size: { x: 512, y: 512 },
				},
				size: { x: 32, y: 32, z: 0 },
				position: { x: 0, y: 32, z: 0 },
				color: 0x1c1c1c,
				receiveShadow: true,
				repeat: [64, 64],
				spawns: [
					{ x: 0, y: -30, z: 20 },
					{ x: 0, y: 0, z: 5 },
				],
				mobs: { number: 2 },
			},
			2: {
				name: "groundTwo",
				next:[3],
				fullName: "Ground-Two",
				mode: { type: "BoxGeometry" },
				size: { x: 64, y: 64, z: 1 },
				position: { x: 0, y: 80, z: .5 },
				color: 0x1010ff,
				receiveShadow: true,
				repeat: [32, 32],
				spawns: [
					{ x: 0, y: -30, z: 20 },
					{ x: 0, y: 0, z: 15 },
				],
				mobs: { number: 1},
			},
			3: {
				name: "groundThree",
				fullName: "Ground-Three",
				// imagesize: { x: 512, y: 512 },
				size: { x: 32, y: 64, z: 0 },
				position: { x: 0, y: 144, z: 3 },
				mode: {
					type: "PlaneGeometry",
					fileName: "stone_floor_736x736.jpg",
					size: { x: 512, y: 512 },
				},
				color: 0x1c1c1c,
				receiveShadow: true,
				repeat: [64, 64],
				spawns: [
					{ x: 0, y: -30, z: 20 },
					{ x: 0, y: 0, z: 5 },
				],
				mobs: { number: 4 },
			},
		};
		return config
	}
}
export { FloorsConfig };
