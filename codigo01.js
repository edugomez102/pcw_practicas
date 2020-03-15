function pedirCateogorias(){
	// necesito un objeto XMLHttp.... para hacer una peticion
	let xhr = new XMLHttpRequest(),
		url = 'api/categorias';

		//peticion asincrona = true
		xhr.open('GET',url,true);

		xhr.onerror = function(){
			console.log('ERROR');
		};

		xhr.onload = function(){
			//Todo funciona y tengo la respuesta del servidor
			console.log(xhr.responseText);
			let r = JSON.parse(xhr.responseText);
			console.log(r);
			// for(let i=0;i<r.FILAS.length;i++){
			// 	console.log(r.FILAS[i].id + ' - '+ r.FILAS[i].nombre);
			// }
			// let html = '';
			// r.FILAS.forEach(function(e,idx,v){
			// 	//e objecto, idx = indixe, v = array base
			// 	html += `<li>${e.id} - ${e.nombre}</li>`;
			// });

			// document.querySelector('#categorias').innerHTML = html;


			//Asi borramos los hijos de ese sector
			document.querySelector('#categorias').innerHTML = ''

			//Otra forma de añadir elmento
			r.FILAS.forEach(function(e){
				let li = document.createElement('li');
				li.innerHTML = `${e.id} - ${e.nombre}`;
				document.querySelector('#categorias').appendChild(li);
			});
		};
		xhr.send();
}



function hacerLogin(obj){
	let xhr =  new XMLHttpRequest(),
		url = 'api/usuarios/login',
		fd = new FormData(obj);

	xhr.open('POST',url,true);

	xhr.onload = function(){
		console.log(xhr.responseText);
	};

	xhr.send(fd);
	return false;
}