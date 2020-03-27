var contadorPaginas = 1;

function comprobarLogin(){
	//probelma etiqueta a que no tiene ni ancho ni alto
	//ponerle un inline block o block a la etiqueta a para arregralo

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
		console.log('joder');
		window.location = "/pcw_practicas/buscar.html?t="+r;
	}else{
		window.location = "/pcw_practicas/buscar.html";
	}
	return false;
}


// total = 8   / tamPag = 2 = 4;
// npag 0 npag 1  npag 2 npag3
// if(npag<totalPag){
// 
// }else{
// 		//dejar de hacer
// }



function mostrarArticulos(npag, tampag){
	// let npag;
	// let tampag;
	let xhr = new XMLHttpRequest(),
		// url = 'api/articulos';
		url = 'api/articulos?pag='+npag+'&lpag='+tampag;

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	xhr.onload = function(){
		document.querySelector('main>section').innerHTML = '';
		let articulos = JSON.parse(xhr.responseText);
		let numArt = articulos.TOTAL_COINCIDENCIAS;
		console.log('Npag: ' +npag);
		console.log('Tampag: '+tampag);
		let totalPags = Math.round(numArt / tampag);
		console.log(totalPags);
		if(npag<totalPags){
			console.log('me meto aqui');
			document.getElementById('totalPag').innerHTML = `${tampag}`;
			document.getElementById('nPag').innerHTML = `${npag+1}`;
			// x = 7 / 2 = 4;
			// 
			// console.log('ARITUCLOS:', articulos);
			if(articulos.RESULTADO == 'OK'){
				// console.log('articulos cargados con exito');
				// console.log(numArt);
				// console.log(articulos);
				articulos.FILAS.forEach(function(item){

					console.log(item);
					let articulo = document.createElement('article');
					let foto = item.imagen;
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
									<time datetime="2020-02-27 00:42">
										${item.fecha}
									</time>
									<p>${item.descripcion.replace(new RegExp(/<br>/g), "")}</p>
					`;
					document.querySelector('main>section').appendChild(articulo);
				});
			}
			else{
				// reject(articulos);
			}
		}
	};

	xhr.send();
}


function siguientePag (tamanoPagina){
	mostrarArticulos(contadorPaginas,tamanoPagina);
	contadorPaginas++;
}


function anteriorPag (tamanoPagina){
	mostrarArticulos(contadorPaginas,tamanoPagina);
	contadorPaginas--;
}

