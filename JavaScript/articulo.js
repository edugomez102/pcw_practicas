var totalFotosArt = 0;
var indice = 0;

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

function autentificar(xhr){
	if(sessionStorage.usuario){
		let user = JSON.parse(sessionStorage.usuario);
		let auth = user.login+':'+user.token;
		xhr.setRequestHeader('Authorization',auth);
	}
}
function logout(){
	sessionStorage.clear();
	window.location = "/pcw_practicas/index.html";
}

function paginaArticulo(){
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id;

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};
	
	autentificar(xhr);

	xhr.onload = function(){
		let articulo = JSON.parse(xhr.responseText);
		console.log(articulo.FILAS.length);
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
			let boton = '';
			if(auth){
				seSigue = (art.estoy_siguiendo == 0) ? 'Seguir Articulo' : 'Dejar de seguir';
				boton = ` <button onclick="seguirBool(${art.id});">${seSigue}</button> `;
			}
			contenido.innerHTML = `
			<h3>${art.nombre}</h3>
			<ul>
				<li>
					<span>${art.nsiguiendo}</span>
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
			</ul>
			<img src="fotos/articulos/${art.imagen}" alt="imgTostadora">
			<div>
				<button onclick="anteriorFoto();" >Anterior</button>
				<label>Foto</label>
				<label>1</label>
				<label>de</label>
				<label>${art.nfotos}</label>
				<button onclick="siguienteFoto();" >Siguiente</button>
			</div>
			<h4>Precio: </h4>
			<h5>${art.precio}€</h5>
			<label>Vendedor:</label>
			<a href="buscar.html?t=${art.vendedor}">${art.vendedor}</a>
			<img src="fotos/usuarios/${art.foto_vendedor}" alt="">
			<h4>Subido el</h4>
			<time datetime="2020-02-27 00:42">
				${art.fecha}
			</time>
			<h4>Descripcion:</h4>
			<p>${art.descripcion}</p>
			${boton}
			<a href="#preguntas">Preguntas</a>
		`;
			mostrarPreguntas(art);
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
	console.log(indice);
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

function mostrarPreguntas(art){
	let user = null;
	if(sessionStorage.usuario){
		user = JSON.parse(sessionStorage.usuario);
	}
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
		console.log(preguntas);
		preguntas.forEach( function(item){
			console.log(item);
			cajaPreg.innerHTML = `
				<h5>Pregunta</h5>
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
			// if(item.respuesta == null && sessionStorage.usuario && user.login == art.vendedor){
			if(sessionStorage.usuario && user.login == art.vendedor){
				cajaPreg.innerHTML += `<button onclick="respPregunta(${item.id});">Responder</button>`;
			}
			if(item.respuesta){
				console.log('existe respuesta');
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

function respPregunta(id){
	let boton = document.querySelector('main>section:nth-of-type(2)>article button');
	let div = document.createElement('div');
	div.innerHTML = `
		<textarea name="texto" id="respondido"></textarea>
		<button onclick="enviarResp(${id});">Enviar respuesta</button>
	`;
	// document.querySelector('main>section:nth-of-type(2)>article button') = null;
	boton.parentNode.replaceChild(div, boton);
}

function enviarResp(id){
	console.log(id);
	let xhr = new XMLHttpRequest(),
		url = 'api/preguntas/' + id + '/respuesta';

	xhr.open('POST', url, true);

	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// xhr.setRequestHeader("Content-type", "multipart/form-data");
	// xhr.setRequestHeader("Content-type", "text/html");
	// xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

	let user = JSON.parse(sessionStorage.usuario);
	let auth = user.login+':'+user.token;
	xhr.setRequestHeader('Authorization',auth);

	xhr.onerror = function(){
		console.log('Error');
	};
	
	xhr.onload = function(){
		let response = JSON.parse(xhr.responseText);
		if(response.RESULTADO == 'OK'){
			paginaArticulo();
		}
	};
	let respuestaPregunta = document.getElementById('respondido').value;

	xhr.send('texto=' + respuestaPregunta);
}

function seguirBool(id){
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id + '/seguir/true';
	console.log(id);

	xhr.open('POST', url, true);
	autentificar(xhr);

	xhr.onerror = function(){
		console.log("Error");
	};

	xhr.onload = function(){
		console.log(JSON.parse(xhr.responseText));
	};

	xhr.send();
}
