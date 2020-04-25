var contadorPaginas = 0;
var totalPags = 0;

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
		window.location = "/pcw_practicas/buscar.html?t="+r;
	}else{
		window.location = "/pcw_practicas/buscar.html";
	}
	return false;
}



function mostrarArticulos(npag, tampag){
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos?pag='+npag+'&lpag='+tampag;

	xhr.open('GET', url, true);

	xhr.onerror = function(){
		console.log('Error al consultar los articulos');
	};

	xhr.onload = function(){
		document.querySelector('main>section').innerHTML = '';
		let ache = document.createElement('h3');
		ache.innerHTML = 'Últimos artículos'
		document.querySelector('main>section').appendChild(ache);
		let articulos = JSON.parse(xhr.responseText);
		let numArt = articulos.TOTAL_COINCIDENCIAS;
		let totalPagsR = Math.floor((numArt / tampag)*10) /10;
		totalPags = Math.round(totalPagsR);
		if(totalPags < totalPagsR){
			totalPags++;
		}
		if(npag<totalPags){
			document.getElementById('totalPag').innerHTML = `${totalPags}`;
			document.getElementById('nPag').innerHTML = `${npag+1}`;

			if(articulos.RESULTADO == 'OK'){
				articulos.FILAS.forEach(function(item){

					let articulo = document.createElement('article');
					let foto = item.imagen;

					if(foto==null){

						foto = "img/No-Image-Found-400x264.png";

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
								<a href="articulo.html?id=${item.id}"  >
									<img src="${foto}" alt="foto_articulo">
									</a>
										<h5>${item.precio}€</h5>
										<time datetime="2020-02-27 00:42">
											${item.fecha}
										</time>
										<p>${item.descripcion.replace(new RegExp(/<br>/g), "")}</p>
						`;
						document.querySelector('main>section').appendChild(articulo);




					}else{
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
								<a href="articulo.html?id=${item.id}"  >
									<img src="fotos/articulos/${foto}" alt="foto_articulo">
									</a>
										<h5>${item.precio}€</h5>
										<time datetime="2020-02-27 00:42">
											${item.fecha}
										</time>
										<p>${item.descripcion.replace(new RegExp(/<br>/g), "")}</p>
						`;
						document.querySelector('main>section').appendChild(articulo);
					}
				});
			}
			else{

			}
		}
	};

	xhr.send();
}


function siguientePag (tamanoPagina){
	if(contadorPaginas<totalPags-1){
	contadorPaginas++;
	mostrarArticulos(contadorPaginas,tamanoPagina);
	}

}


function anteriorPag (tamanoPagina){
	if(contadorPaginas>0){
		contadorPaginas--;
		mostrarArticulos(contadorPaginas,tamanoPagina);
	}

}


function primeraPag(ta){
	if(contadorPaginas>0){
		contadorPaginas = 0;
		mostrarArticulos(0,ta);
	}
}


function ultimaPag(ta){
	if(contadorPaginas < totalPags -1 ){
		contadorPaginas = totalPags-1;
		mostrarArticulos (totalPags-1,ta);
	}
}



