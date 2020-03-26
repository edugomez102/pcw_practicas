function comprobarLogin(){
	
	let = document.querySelector('#barraNav');
	if(sessionStorage.usuario!=null){
		let usuario = JSON.parse(sessionStorage.usuario).login;
		barraNav.innerHTML = `
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

function buscaRapida(){
let r = document.getElementById('textoBuscar').value;
	if(r){
		window.location = "/pcw_practicas/buscar.html?="+r;
	}else{
		window.location = "/pcw_practicas/buscar.html";
	}
	return false;
}

function mostrarArticulos(){
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos';

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	xhr.onload = function(){
		let articulos = JSON.parse(xhr.responseText);
		if(articulos.RESULTADO == 'OK'){
			console.log('articulos cargados con exito');
			// console.log(articulos);
			articulos.FILAS.forEach(function(item){
			console.log(item);
				// let xhrFoto = new XMLHttpRequest(),
				// 	url = 'api/articulos/' + item.id + '/fotos';
				// xhrFoto.open('GET', url, true);
				// xhrFoto.onerror = function(){
				// 	console.log("Erro al abrir las fotos");
				// };
				// xhrFoto.onload = function(){
				// 	let fotos = JSON.parse(xhrFoto.responseText);
				// 	console.log(fotos);
				// };
				// xhrFoto.send();
					
				
				let articulo = document.createElement('article');
				let foto = item.imagen;
				// let tost = document.querySelector('#tostadora');
				// tost= foto;
				console.log(foto);
				articulo.innerHTML = `
					<h4>${item.nombre}</h4>
						<ul>
							<li>
								<span class="icon-picture"></span>
								<span>${item.nfotos}</span>
							</li>
							<li>
								<span>${item.veces_visto}</span>
								<span class="icon-eye"></span>
							</li>
							<li>
								<span>${item.nsiguiendo}</span>
								<span class="icon-bookmark"></span>
							</li>
						</ul>
						<a href="articulo.html"  >
							<img src="fotos/articulos/${item.imagen}" alt="foto_articulo">
							</a>
								<h5>${item.precio}€</h5>
								<p>${item.descripcion}</p>
				`;
				document.querySelector('main>section').appendChild(articulo);
			});
		}
		else{
			reject(articulos);
		}
	};

	xhr.send();
}
