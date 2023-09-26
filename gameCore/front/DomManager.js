class DomManager {
	conslog = true
	threejs;
	_camera;
	constructor(conslog) {
		this.conslog = conslog
		if (this.conslog) console.log('DomManager Mounted !')
	}
	init(threejs, camera) {
		this.threejs = threejs
		this._camera = camera
		this.append_Child(
			this.threejs.domElement
		)
		this.resize_Listener(this.threejs, this._camera)
		if (this.conslog) console.log('DomManager Initiated !')
	}
	append_Child = (element, targetElement = document.body) => {
		if (targetElement) { targetElement.appendChild(element) }
	}
	resize_Listener = (threejs, camera) => {
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			threejs.setSize(window.innerWidth, window.innerHeight);
		});
	}
	// adds a script tag with given source
	// scriptpath = path of the script file
	// #addScript = (scriptpath = false, scriptid = false) => {
	// 	if(!scriptpath===false) {
	// 		let script = document.createElement('script');
	// 		script.src = scriptpath;
	// 		if(!scriptid===false) script.id = scriptid
	// 		document.getElementsByTagName('head')[0].appendChild(script);
	// 	}
	// }
	addCss(stringcss, styleid = false) {
		let style = document.createElement('style');
		// style.type = 'text/css';
		style.textContent = this.sanitize(stringcss)
		style.id = styleid
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	sanitize = (string) => {
		// Tableau de correspondance pour les caractères spéciaux
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			"./": '&#x2F;',
		};
		// Expression régulière pour rechercher les caractères spéciaux
		const reg = /[&<>"'/]/ig;
		// Remplace les caractères spéciaux par leur équivalent HTML
		return string.replace(reg, (match) => (map[match]));
	}
	// Cette fonction crée un nouvel élément HTML avec les attributs spécifiés
	createEle = (attrib = false) => {
		// Crée une variable pour stocker le nouvel élément
		let newDiv = false;

		// Vérifie si des attributs ont été fournis en tant qu'objet
		if (typeof attrib === 'object') {
			// Définit le type d'élément à créer (par défaut 'div')
			attrib.newDiv = attrib.tag ?? 'div';

			// Crée l'élément avec l'ID spécifié (si fourni)
			attrib.id ? newDiv = document.createElement(attrib.tag) : '';

			// Applique les attributs spécifiés à l'élément nouvellement créé
			attrib.id ? newDiv.id = attrib.id : '';
			attrib.borderRadius ? newDiv.style.borderRadius = attrib.borderRadius : '';
			// ... (d'autres attributs sont traités de la même manière)
			for (var key in attrib) {
				var value = attrib[key];
				newDiv[key] = value
			}

			// // Ajoute le contenu texte (si fourni) à l'élément
			// attrib.textContent ? newDiv.textContent = attrib.textContent : '';
		}

		// Retourne le nouvel élément créé ou false si aucun attribut n'a été fourni
		return newDiv ?? false;
	}

	// Cette fonction nettoie une chaîne de caractères des caractères spéciaux HTML
	sanitize = (string) => {
		// Tableau de correspondance pour les caractères spéciaux
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			"./": '&#x2F;',
		};
		// Expression régulière pour rechercher les caractères spéciaux
		const reg = /[&<>"'/]/ig;
		// Remplace les caractères spéciaux par leur équivalent HTML
		return string.replace(reg, (match) => (map[match]));
	}

	// Cette fonction ajoute un élément à un élément parent ou au corps du document
	addTo = (element, target = false, before = false) => {
		// Vérifie si une cible parent a été spécifiée
		if (target != false && typeof target === 'object') {
			// Ajoute l'élément à la cible parent (avant ou après les enfants existants)
			!before ? target.appendChild(element) : target.prepend(element);
		} else {
			// Ajoute l'élément au corps du document (avant ou après les éléments existants)
			!before ? document.body.appendChild(element) : document.body.prepend(element);
		}
	}
}
export { DomManager }
