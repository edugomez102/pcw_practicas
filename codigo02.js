function pedirInfoArticulo(){

	let xhr =  new XMLHttpRequest(),
		url = 'api/articulos/1',
		auth = 'usuario2:a0c696e672fc38b8899753ee0b077e10f5daa522ef5834af7d36859bf26159d4087eb98ca40ff664518dc9ac9b9edb7910b8e9e5f6d15bb1fee42f0aa3d73d6f';

	//abrir conexion
	xhr.open('GET',url,true); 

	//el codigo que queremos ejecutar cuando recibamos la respuesta


	xhr.onerror = function(){
		console.log('No se encuentra el articulo seleccionado')
	};

	xhr.onload = function(){
		console.log(xhr.responseText);
		//tenemos un objeto JSON y pasamos a js
		let r = JSON.parse(xhr.responseText);
		console.log(r);
		document.querySelector('#info-articulo').innerHTML = xhr.responseText;
		
	};

	//enviamos la cabezera
	xhr.setRequestHeader('Authorization',auth);
	xhr.send();
}