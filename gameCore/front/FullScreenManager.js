class FullScreenManager {
    conslog=false
    #fullScreenDiv
    #isFullScreenOn
	constructor() {
	}
	init() {
        this.#addDiv()
        this.#activatebuttonsfullscreen()
		if (this.conslog) console.log('FullScreenManager initiated !','conslog:',this.conslog)
	}
    #addDiv(){
        this.#fullScreenDiv = document.createElement('div')
        this.#fullScreenDiv.id = 'fullscreen'
        let css = '#fullscreen {position: absolute;height: 40px;width: 40px;right: 5px;top: 5px;background-image: url(./gameCore/htmlAssets/svg/resize_large.svg);background-position: center;background-size: cover;background-repeat: no-repeat;border-radius: 50%;display: flex;align-items: center;justify-content: center;font-size: 35px;line-height: 35px;cursor: pointer;}' +
        '#fullscreen.full{background-image: url(./gameCore/htmlAssets/svg/resize_small.svg);}';
        this.addCss(css,'FullScreenManager');
        document.body.prepend(this.#fullScreenDiv)

    }
    
	addCss(stringcss, styleid) {
		let style = document.createElement('style');
		style.textContent = stringcss
		style.id = styleid
		document.getElementsByTagName('head')[0].appendChild(style);
	}
    #activatebuttonsfullscreen() {
        // 💻🖥️📱
        const elem = document.documentElement;
        elem.onfullscreenchange = () => {
            this.#isFullScreenOn = !this.#isFullScreenOn
            this.#fullScreenDiv.className = this.#isFullScreenOn ? "full" : ""
        };
    
        this.#fullScreenDiv.addEventListener('click', (ele) => {
            if (this.conslog) console.log('click',this.#isFullScreenOn)
            if (this.#isFullScreenOn === true) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    window.top.document.msExitFullscreen();
                }
            }
            else {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) { /* Firefox */
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE/Edge */
                    elem = window.top.document.body; //To break out of frame in IE
                    elem.msRequestFullscreen();
                }
            }
        })
    }
}
export {FullScreenManager}