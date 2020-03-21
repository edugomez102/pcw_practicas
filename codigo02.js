"use strict";

function pedirInfoArticulo(){

	// Primera manera de hacer peticiones: AJAX

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

	// #El atributo estoy_siguiendo de la cabezera hace refenrecia a si el usuario de  la autorizacion de la cabezera esta siguiendo el artiuclo que hemos  solicitado

}

//Segunda forma de peticiones: Fetch API (mezcla ajax y promesas)
//Tipo get sin cabecera
function pedirCategorias(){
	let url = 'api/categorias';

	//El objeto respuesta es objeto response
	fetch(url).then(function(respuesta){
		if(respuesta.ok){
			//texto es el resultado de aplicar el metodo text() sobre el objeto respuesta
			// respuesta.text().then(function(texto){
				// console.log(texto);
			// });
			//El metodo json nos devuelve los datos en objeto js
			respuesta.json().then(function(datos){
				console.log(datos)
				if(datos.RESULTADO == 'OK'){
					console.log('Los datos se han recibido con exito');
					let html = '';
					datos.FILAS.forEach(function(e){
						//para interpolar estas comillas `` y el dolar ${variable} para las variables
						html += `<li>${e.id} - ${e.nombre}</li>`;
					});
					document.querySelector('#categorias').innerHTML = html;

				}else{
					console.log('ERROR: '+datos.DESCRIPCION);
				}
			});


			//solo se puede hacer uno de los dos , porque una vez  que se hace  se vacian los  datos
			
		}else{
			console.log('ERROR PETICION FETCH');
		}
	});

}


function hacerLogin(formu){
	let url = 'api/usuarios/login',
		fd 	= new FormData(formu),
		init= {method:'post',body:fd};


	fetch(url,init).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				console.log(datos);

				//Nos lo convierte a texto el objeto javastirng y es lo que queremos guardar en el sessionStorage *creo*
				console.log(JSON.stringify(datos));
				sessionStorage['usuario'] = JSON.stringify(datos);
				//Luego hacer un parse JSON.parse()
			});
		}else{
			console.log('Error inesperado  en la peticion');
		}
	});



	return false;
}

function pedirInfoArticuloFetch(){
	// Ejemplo con cabecera accediendo desde el sessionStorage

	let url = 'api/articulos/2',
		usu = JSON.parse(sessionStorage['usuario']),
		cabecera;

		cabecera = usu.login +':'+usu.token;

	let	init = {method:'GET',headers:{'Authorization':cabecera}};
	
	fetch(url,init).then(function(respuesta){
		if(respuesta.ok){
			respuesta.json().then(function(datos){
				// console.log(datos);
				document.querySelector('#info-articulo-fetch').innerHTML = JSON.stringify(datos);
			});
		}else{
			console.log('Error en  la peticion fetch')
		}
	});
}




