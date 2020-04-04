// TODO 02/04/2020: Pregunta recargar desde base de datos
// TODO 02/04/2020: Pregunta cabecera y los send
// TODO boton seguir recargar pagina

var totalFotosArt = 0;
var indice = 0;

function esVendedor(){
	let user = getUser();
	let esvend = false;
	let nombreVendedor = document.querySelector("#perfilVendedor").innerHTML;
	if(sessionStorage.usuario && user.login == nombreVendedor){
		esvend = true;
	}
	return esvend;
}
function getUser(){
	let user = null;
	if(sessionStorage.usuario){
		user = JSON.parse(sessionStorage.usuario);
	}
	return user;
}
function autentificar(xhr){
	let auth;
	if(sessionStorage.usuario){
		let user = JSON.parse(sessionStorage.usuario);
		auth = user.login+':'+user.token;
		xhr.setRequestHeader('Authorization',auth);
	}
	return auth;
}
function insertarDespues(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function crearModal(){
	let divModal = document.createElement('div'),
		main     = document.querySelector('main');
	divModal.setAttribute("class", "modal");
	insertarDespues(divModal, main);
	console.log(divModal);
	return divModal;
}

function comprobarLogin(){
	let = document.querySelector('#barraNav');
	if(sessionStorage['usuario']!=null){
		let usuario = JSON.parse(sessionStorage['usuario']).login;
		barraNav.innerHTML = `<li>
					<a href="index.html">
						<span class="icon-home"></span>
						<span>Inicio</span>
					</a>
				</li>
				<li>
					<a href="buscar.html">
						<span class="icon-search"></span>
						<span>Buscar</span>
					</a>
				</li>
				<li>
					<a onclick="logout();">
						<span class="icon-user-times"></span>
						<span>Logout (${usuario})</span>
					</a>
				</li>
				<li>
					<a href="nuevo.html">
						<span class="icon-doc-new"></span>
						<span>Nuevo articulo</span>
						</a>
				</li>
				`;
	}else{
		barraNav.innerHTML = `<li>
					<a href="index.html">
						<span class="icon-home"></span>
						<span>Inicio</span>
					</a>
				</li>
				<li>
					<a href="buscar.html">
						<span class="icon-search"></span>
						<span>Buscar</span>
					</a>
				</li>
				<li>
					<a href="login.html">
						<span class="icon-login"></span>
						<span>Login</span>
					</a>
				</li>
				<li>
					<a href="registro.html">
						<span class="icon-user-plus"></span>
						<span>Registro</span>
					</a>
				</li>`;
	}
}

function logout(){
	sessionStorage.clear();
	window.location = "/pcw_practicas/index.html";
}

// TODO 31/03/2020: mirar para actualizar por elementos en vez de todo
function paginaArticulo(){
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id;

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};
	
	let auth = autentificar(xhr);

	xhr.onload = function(){
		let articulo = JSON.parse(xhr.responseText);
		// console.log(articulo.FILAS.length);
		if(articulo.FILAS.length == 0 || articulo.FILAS.length > 1){
			// Pregunta hace falta un else
			window.location = "index.html";
		}
		// limpiar el section
		document.querySelector('main>section:nth-child(1)').innerHTML = '';
		let contenido = document.querySelector('main>section:nth-child(1)');
		// console.log(id);
		if(articulo.RESULTADO == 'OK'){
			let art = articulo.FILAS[0];
			console.log(articulo);
			let seSigue;
			let boton;
			if(auth){
				seSigue = (art.estoy_siguiendo == 0) ? 'Seguir Articulo' : 'Dejar de seguir';
				boton = ` <button id="botonSeguimiento" onclick="seguirBool(${art.id});">${seSigue}</button> `;
			}
			contenido.innerHTML = `
			<h3>${art.nombre}</h3>
			<ul>
				<li>
					<span id="nsiguiendo">${art.nsiguiendo}</span>
					<span class="icon-user"></span>
				</li>
				<li>
					<span>${art.veces_visto}</span>
					<span class="icon-eye"></span>
				</li>
				<li>
					<span>${art.npreguntas}</span>
					<span class="icon-mail-alt"></span>
				</li>
			</ul>`;
			if(art.imagen){
				contenido.innerHTML += ` <img src="fotos/articulos/${art.imagen}" alt="imgTostadora">`;
			}
			else{
				contenido.innerHTML += ` <img src="img/No-Image-Found-400x264.png" alt="imgTostadora">`;
			}
			contenido.innerHTML +=`
			<div>
				<button onclick="anteriorFoto();" >Anterior</button>
				<label>Foto</label>
				<label>1</label>
				<label>de</label>
				<label>${art.nfotos}</label>
				<button onclick="siguienteFoto();" >Siguiente</button>
			</div>
			<h4>Precio: </h4>
			<h5 id="precioArticulo">${art.precio}€</h5>
			<label>Vendedor:</label>
			<a id="perfilVendedor" href="buscar.html?t=${art.vendedor}">${art.vendedor}</a>
			<img src="fotos/usuarios/${art.foto_vendedor}" alt="">
			<h4>Subido el</h4>
			<time datetime="2020-02-27 00:42">
				${art.fecha}
			</time>
			<h4 >Descripcion:</h4>
			<p id="descripcionArticulo">${art.descripcion}</p>
			${boton}
			<a href="#preguntas">Preguntas</a>
		`;
			mostrarPreguntas();
			mostrarCajaPregunta();
			modificarEliminar();
		}
		else{
			console.log('Resultado no es OK');
		}
	};
	xhr.send();
}

function mostrarFoto(indice){
	let id = location.search.substring(4, location.search.length);

	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id + '/fotos';

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	xhr.onload = function(){
		let fotos = JSON.parse(xhr.responseText);
		if(fotos.RESULTADO == 'OK'){
			let etfoto = document.querySelector('main>section>img:nth-of-type(1)');
			totalFotosArt = fotos.FILAS.length;
			if(indice >= 0 && indice < fotos.FILAS.length){
				etfoto.attributes.src.value = 'fotos/articulos/' + fotos.FILAS[indice].fichero;
				document.querySelector('main>section>div>label:nth-of-type(2)').innerHTML = '';
				document.querySelector('main>section>div>label:nth-of-type(2)').append(indice + 1);
			}
			else{
			}
		}
	};
	xhr.send();
}


function siguienteFoto(){
	if(indice<totalFotosArt-1 && indice!=0){
		indice++;
		mostrarFoto(indice);
	}else if(indice==0){
		indice++;
		mostrarFoto(indice);
	}
}
function anteriorFoto(){
	if(indice!=0){
		indice--;
		mostrarFoto(indice);
	}
}
// TODO 31/03/2020: el enlace para hacer scroll a las preguntas
function mostrarPreguntas(){
	let user = getUser();
	let esvend = esVendedor();
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id + '/preguntas';

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar las preguntas');
	};

	xhr.onload = function(){
		let preguntas = JSON.parse(xhr.responseText).FILAS;
		document.querySelector('main>section:nth-of-type(2)>article').innerHTML = '';
		let cajaPreg = document.querySelector('main>section:nth-of-type(2)>article');
		// console.log(preguntas);
		let count = 0;
		preguntas.forEach( function(item){
			count++;
			// console.log(item);
			cajaPreg.innerHTML += ` <h5>Pregunta</h5>`;
			cajaPreg.innerHTML += `
				<div>
					<p>${item.pregunta}</p>
					<ul>
						<li>${item.login}</li>
						<li><img src="fotos/usuarios/${item.foto_usuario}" alt=""></li>
						<li>
							<time datetime="2020-02-27 00:42">
								${item.fecha_hora}
							</time>
						</li>
					</ul>
				</div>
			`;
			if(esvend){
				cajaPreg.innerHTML += `<button id="botonPregunta${count}"onclick="respPregunta(${item.id},${esvend}, ${count});">Responder</button>`;
			}
			if(item.respuesta){
				// console.log('existe respuesta');
				cajaPreg.innerHTML += `
					<article>
						<h5>Respuesta</h5>
						<div>
							<p>${item.respuesta}</p>
						</div>
					</article>
				`;
			}
		});
	};

	xhr.send();
}

var activo = false;
// querySelector all
function respPregunta(id, esvend, npreg){
	// if(!activo){
	// 	activo = true;
	// 	console.log("if " + activo);
	// }
	// else{
	// 	console.log("else " + activo);
	// 	mostrarPreguntas(esvend);
	// 	activo = false;
	// }
	let boton = document.querySelector('#botonPregunta'+ npreg);
	let div = document.createElement('div');
	div.innerHTML = `
		<textarea name="texto" id="respondido"></textarea>
		<button onclick="enviarResp(${id});">Enviar respuesta</button>
		`;
	boton.parentNode.replaceChild(div, boton);
	console.log('final');
	console.log(boton);
	// console.log(div);
}

function enviarResp(id){
	// enviar thois para lo del dom
	console.log(id);
	let xhr = new XMLHttpRequest(),
		url = 'api/preguntas/' + id + '/respuesta';

	xhr.open('POST', url, true);

	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	autentificar(xhr);

	xhr.onerror = function(){
		console.log('Error');
	};
	
	xhr.onload = function(){
		let response = JSON.parse(xhr.responseText);
		console.log(response);
		if(response.RESULTADO == 'OK'){
			// paginaArticulo();
			mostrarPreguntas();
		}
	};
	// todo este id sobra hacer con arbol del dom
	let respuestaPregunta = document.getElementById('respondido').value;

	xhr.send('texto=' + respuestaPregunta);
}
function seguirBool(id){
	let boton     = document.querySelector('#botonSeguimiento'),
		siguiendo = boton.innerHTML,
		nseg      = parseInt( document.querySelector('#nsiguiendo').innerHTML, ),
		bool      = ( siguiendo == 'Seguir Articulo' ) ? true : false;
	// console.log(bool);
	// console.log(nseg);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id + '/seguir/' + bool;

	xhr.open('POST', url, true);
	autentificar(xhr);

	xhr.onerror = function(){
		console.log("Error");
	};

	xhr.onload = function(){
		console.log(JSON.parse(xhr.responseText));
		if(boton.innerHTML == 'Seguir Articulo'){
			boton.innerHTML = 'Dejar de seguir'
			nseg++;
		}
		else{
			boton.innerHTML = 'Seguir Articulo'
			nseg--;
		}
		document.querySelector('#nsiguiendo').innerHTML = nseg;
	};
	xhr.send();

}

function modificarEliminar(){
	let id     = location.search.substring(4, location.search.length),
		esvend = esVendedor(),
		xhr    = new XMLHttpRequest(),
		url    = 'api/articulos/' + id;

	xhr.open('POST', url, true);
	autentificar(xhr);
	// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onerror = function(){
		console.log("Error");
	};
	xhr.onload = function(){
		// let response = JSON.parse(xhr.responseText);
		// console.log(response);
		// TODO revisar el response
		if(esvend){
			let div  = document.createElement('div');
			div.innerHTML = `
				<button onclick="botonModificar();" id="botonModificar"style="background-color:chocolate;">modificar</button>
				<button onclick="botonEliminar();"style="background-color:red;">eliminar</button>
			`;
			// let boton = document.createElement('button');
			// boton.addEventListener('click', function(){
			// 	botonModificar(art.precio);
			// });
			// boton.style.background-color = 'chocolate';
			insertarDespues(div, document.querySelector('main>section h3'));
		}
	};

	xhr.send();
}

function ventanaModal(titulo, precio, descripcion){
	let wModal = crearModal();
	wModal.innerHTML = `
			<div class="contenido-modal modw">
				<div>
					<p>${titulo}</p>
				</div>
				<div>
					<form onsubmit="return false;">
						<label >Precio</label>
						<input type="number" value="${precio}">
						<label >Descripción</label>
						<textarea name="Name" rows="8" cols="40">${descripcion}</textarea>
						<button id="botonCancelar">Cancelar</button>
						<button id="botonAceptar">Aceptar</button>
					</form>
				</div>
			</div>
		`;
	return wModal;
}

function botonModificar(){
	let descripcion   = document.querySelector('#descripcionArticulo').innerText,
		precio        = document.querySelector('#precioArticulo').innerHTML.slice(0, -1),
		wModal        = ventanaModal("Modificar articulo", precio, descripcion),
		botonAceptar  = document.getElementById('botonAceptar'),
		botonCancelar = document.getElementById('botonCancelar');
	wModal.style.display = 'block';
	botonCancelar.addEventListener('click', function(){
		// wModal.style.display = 'none';
		wModal.remove();
		console.log('Cancelar');
	});
	botonAceptar.addEventListener('click', function(){
		console.log('Aceptar');
		aceptarModificar(precio, descripcion);
		// wModal.style.display = 'none';
		wModal.remove();
	});
}

function aceptarModificar(precio, descripcion){
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id;

	xhr.open('POST', url, true);
	autentificar(xhr);
	// TODO probar con formdata
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onerror = function(){
		console.log("Error");
	};
	xhr.onload = function(){
		let response = JSON.parse(xhr.responseText);
		if(response.RESULTADO == "OK"){
			console.log(response);
			document.querySelector('#precioArticulo').innerHTML = precio;
			document.querySelector('#descripcionArticulo').innerHTML = descripcion;
		}
	};
	precio = document.querySelector('.contenido-modal div form>input').value;
	descripcion = document.querySelector('.contenido-modal div form>textarea').value;

	xhr.send('precio=' + precio + '&descripcion=' + descripcion);
}

function botonEliminar(){
	let wModal = crearModal();
	wModal.style.display = 'block';
	wModal.innerHTML = `
			<div class="contenido-modal modw">
				<div>
					<p>Confirmar eliminar Articulo</p>
				</div>
				<div>
					<button id="botonCancelar">Cancelar</button>
					<button id="botonAceptar">Aceptar</button>
				</div>
			</div>
		`;
	let botonAceptar = document.getElementById('botonAceptar');
	let botonCancelar = document.getElementById('botonCancelar');
	botonCancelar.addEventListener('click', function(){
		// wModal.style.display = 'none';
		wModal.remove();
		console.log('Cancelar');
	});
	botonAceptar.addEventListener('click', function(){
		console.log('Aceptar');
		aceptarEliminar();
		// wModal.style.display = 'none';
		wModal.remove();
	});

}
function aceptarEliminar(){
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id;

	xhr.open('DELETE', url, true);
	autentificar(xhr);

	xhr.onerror = function(){
		console.log("Error");
	};
	xhr.onload = function(){
		// console.log('mmmm');
		let response = JSON.parse(xhr.responseText);
		console.log(response);
		if(response.RESULTADO == 'OK'){
			window.location = 'index.html';
		}
	};
	xhr.send();
}

function mostrarCajaPregunta(){
	if(getUser()){
		let cajaPreg = document.querySelector('#dejarPregunta');
		// console.log(cajaPreg);
		let fichero = new XMLHttpRequest(),
			url     = 'dejarPregunta.html';

		fichero.open('GET', url, true);
		fichero.onload = function(){
			// console.log(fichero);
			cajaPreg.innerHTML = fichero.response;
		};

		fichero.send();
	}
}

function guardarPregunta(){
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id + '/pregunta';
	let wModal = crearModal();

	xhr.open('POST', url, true);
	autentificar(xhr);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onerror = function(){
		console.log("Error");
	};
	let gpreg = document.querySelector('#nuevaPregunta').value;
	xhr.onload = function(){
		response = JSON.parse(xhr.responseText);
		// console.log(response);
		wModal.innerHTML = `
			<div class="contenido-modal">
				<div>
					<p>Enviar Pregunta</p>
				</div>
				<div>
					<p> ${response.DESCRIPCION} </p>
					<button id="botonAceptar">Aceptar</button>
				</div>
			</div>
		`;
		wModal.style.display = 'block';
		let botonAceptar = document.getElementById('botonAceptar');
		botonAceptar.addEventListener('click', function(){
			// borrar la ventan en vez de esconderla
			wModal.remove();
			if(response.RESULTADO != 'OK'){
				document.querySelector('#nuevaPregunta').focus();
			}
		});
		if(response.RESULTADO == 'OK'){
			document.querySelector('#nuevaPregunta').value = '';
			mostrarPreguntas();
		}
		// TODO 30/03/2020: el autofocus no funciona primero 
		// eliminiar ventana modal
	};

	xhr.send('texto=' + gpreg);
	
}
