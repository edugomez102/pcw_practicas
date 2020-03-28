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
	// enviarAuth(id);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos/' + id;

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	let user = JSON.parse(sessionStorage.usuario);
	let auth = user.login+':'+user.token;

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
				<input type="button" name="prev" value="Prev">
				<label>${art.nfotos}</label>
				<input type="button" name="next" value="Next">
			</div>
			<h4>Precio: </h4>
			<h5>${art.precio}€</h5>
			<label>Vendedor:</label>
			<a href="buscar.html">${art.vendedor}</a>
			<h4>Subido el</h4>
			<h4>Descripcion:</h4>
			<p>${art.descripcion}</p>
			<input type="checkbox" id="seguir-no">
			<label for="seguir-no" class="follow1"> Seguir Articulo</label>
			<label for="seguir-no" class="follow2"> Dejar de seguir</label>
			<a href="#preguntas">Preguntas</a>
		`;
			// document.querySelector('main>section:nth-child(1)').appendChild(contenido);
		}
		else{
			console.log('Resultado no es OK');
		}
	};

	xhr.setRequestHeader('Authorization',auth);
	xhr.send();
}
