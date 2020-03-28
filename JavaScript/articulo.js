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

function paginaArticulo(){
	let id = location.search.substring(4, location.search.length);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id;

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	let auth;
	if(sessionStorage.usuario){
		let user = JSON.parse(sessionStorage.usuario);
		auth = user.login+':'+user.token;
		xhr.setRequestHeader('Authorization',auth);
	}

	xhr.onload = function(){
		let articulo = JSON.parse(xhr.responseText);
		if(articulo.FILAS.length == 0){
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
			if(auth){
				seSigue = (art.estoy_siguiendo == 0) ? 'Seguir Articulo' : 'Dejar de seguir';
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
			<button for="seguir-no" class="follow">${seSigue}</button>
			<a href="#preguntas">Preguntas</a>
		`;
			// document.querySelector('main>section:nth-child(1)').appendChild(contenido);
		}
		else{
			console.log('Resultado no es OK');
		}
	};

	xhr.send();
}

function mostrarFoto(indice){
	let id = location.search.substring(4, location.search.length);
	// enviarAuth(id);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id + '/fotos';

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	xhr.onload = function(){
		let fotos = JSON.parse(xhr.responseText);
		if(fotos.RESULTADO == 'OK'){
			console.log(fotos.FILAS);
			let etfoto = document.querySelector('main>section>img:nth-of-type(1)');
			// console.log(etfoto.attributes.src);
			console.log("total" + fotos.FILAS.length + "indice:" + indice);
			if(indice >= 0 && indice < fotos.FILAS.length){
				etfoto.attributes.src.value = 'fotos/articulos/' + fotos.FILAS[indice].fichero;
				document.querySelector('main>section>div>label:nth-of-type(2)').innerHTML = '';
				document.querySelector('main>section>div>label:nth-of-type(2)').append(indice + 1);
			}
			else{
				console.log("rop");
				indice = fotos.FILAS.length - 1;
			}
		}
	};
	xhr.send();
	console.log(indice);
}

var indice = 1;
function siguienteFoto(){
	mostrarFoto(indice++);
}
function anteriorFoto(){
	mostrarFoto(indice--);
}
