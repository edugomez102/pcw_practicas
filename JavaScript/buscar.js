var contadorPaginas = 0;
var totalPags = 0;

function comprobarLogin(){
	
	let barraNav = document.querySelector('#barraNav');
	let ls = document.querySelector('#labelSeguidos');
	let bs = document.querySelector('#botonSeguidos');
	let lv = document.querySelector('#labelVenta');
	let bv = document.querySelector('#botonVenta');
	if(sessionStorage['usuario']!=null){
		let usuario = JSON.parse(sessionStorage['usuario']).login;
		barraNav.innerHTML = `<li>
					<a href="index.html">
						<span class="icon-home"></span>
						<span>Inicio</span>
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
		ls.style.display = 'none';
		bs.style.display = 'none';
		lv.style.display = 'none';
		bv.style.display = 'none';
	}
}

function logout(){
	sessionStorage.clear();
	window.location = "/pcw_practicas/index.html";
}

function cargarCategorias(){
	let xhr = new XMLHttpRequest(),
		url = 'api/categorias';

	xhr.open('GET',url,true);

	xhr.onerror = function(){
		console.log('Error cargando categorias');
	};

	xhr.onload = function(){
		let r = JSON.parse(xhr.responseText);
		r.FILAS.forEach( function(e) {
			let option = document.createElement('option');
			option.innerHTML = `${e.nombre}`;
			document.querySelector('#lista-categorias').appendChild(option);
		});
	};

	xhr.send();
}



function nombreCatId(npag,tampag){
	let cat  = document.getElementById('lista-categorias').value;
	let hacerelse = true;
	let xhr = new XMLHttpRequest(),
		url = 'api/categorias';

	xhr.open('GET',url,true);

	xhr.onerror = function(){
		console.log('Error sabiendo categorias');
	}

	xhr.onload = function(){
		let r = JSON.parse(xhr.responseText);
		r.FILAS.forEach( function(e) {
			if(e.nombre == cat){
				hacerBusqueda('',e.id,npag,tampag);
				hacerelse = false;
			}
		});
		if(hacerelse){
			hacerBusqueda('','-',npag,tampag);
		}
	};
	xhr.send();
	return false;
}



function establecerBusqueda(npag,tampag){
	let urlCoger = window.location.search;
	if(urlCoger==null || urlCoger == ""){
		hacerBusqueda("",'-',npag,tampag);
	}else{
		urlArray = urlCoger.split('=');
		if (urlArray[0]=="?t") {
			busqueda = urlArray[1];

			let xhr = new XMLHttpRequest(),
				url = 'api/usuarios/'+busqueda;

			xhr.open('GET',url,true);

			xhr.onerror = function(){
				console.log('Error en consultar los usuarios');
			};

			xhr.onload = function(){
				let objJava = JSON.parse(xhr.responseText);
				
				if(objJava.DISPONIBLE){
					document.querySelector('#textArticulo').value = busqueda;
				}else {
					nVendedor = busqueda;
					nVendedor= document.querySelector('#nameVendedor').value = busqueda;
				}
				hacerBusqueda("",'-',npag,tampag);
			};
			xhr.send();
		}else{
		}
	}
}


function hacerBusqueda(peti,idCat,npag,tampag){
	let texto = document.getElementById('textArticulo').value,
		vended= document.getElementById('nameVendedor').value,
		bs    = document.getElementById('botonSeguidos').checked,
		bv    = document.getElementById('botonVenta').checked,
		cat   = document.getElementById('lista-categorias').value,
		desde = document.getElementById('pDesde').value,
		hasta = document.getElementById('pHasta').value;

	let peticion = peti;


	if(texto){
		peticion += "?t="+texto;
	}
	if(vended){
		peticion += "?v="+vended;
	}
	if(cat!="-"){
		peticion += "?c="+idCat;
	}
	if(bv){
		peticion += "?mios";
	}
	if(bs){
		peticion += "?siguiendo";
	}
	if(desde){
		peticion += "?pd="+desde;
	}
	if(hasta){
		peticion += "?ph="+hasta;
	}


		let xhr = new XMLHttpRequest(),
			url = 'api/articulos'+peticion+'&pag='+npag+'&lpag='+tampag;
		let usu = JSON.parse(sessionStorage['usuario']);
		let auth = usu.login+':'+usu.token;

		console.log('Url es:'+url);

		xhr.open('GET', url, true);

		xhr.onerror = function(){
			console.log('Error al consultar los articulos');
		};

		xhr.onload = function(){
			document.querySelector('#sectionArticulos').innerHTML = '';
			let articulos = JSON.parse(xhr.responseText);
			let numArt = articulos.TOTAL_COINCIDENCIAS;
			let totalPagsR = Math.floor((numArt / tampag)*10) /10;
			totalPags = Math.round(totalPagsR);
			if(totalPags < totalPagsR){
				totalPags++;
			}
			if(npag<totalPags){
				document.getElementById('totalPagi').innerHTML = `${totalPags}`;
				document.getElementById('nPagi').innerHTML = `${npag+1}`;

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
									<a href="articulo.html"  >
										<img src="${foto}" alt="foto_articulo">
										</a>
											<h5>${item.precio}€</h5>
											<time datetime="2020-02-27 00:42">
												${item.fecha}
											</time>
											<p>${item.descripcion.replace(new RegExp(/<br>/g), "")}</p>
							`;
							document.querySelector('#sectionArticulos').appendChild(articulo);




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
									<a href="articulo.html"  >
										<img src="fotos/articulos/${foto}" alt="foto_articulo">
										</a>
											<h5>${item.precio}€</h5>
											<time datetime="2020-02-27 00:42">
												${item.fecha}
											</time>
											<p>${item.descripcion.replace(new RegExp(/<br>/g), "")}</p>
							`;
							document.querySelector('#sectionArticulos').appendChild(articulo);
						}
					});
				}
				else{

				}
			}
		};

		xhr.setRequestHeader('Authorization',auth);
		xhr.send();
}

function siguientePag (tamanoPagina){
	if(contadorPaginas<totalPags-1){
	contadorPaginas++;
	nombreCatId(contadorPaginas,tamanoPagina);
	}

}


function anteriorPag (tamanoPagina){

	if(contadorPaginas>0){
		contadorPaginas--;
		nombreCatId(contadorPaginas,tamanoPagina);
	}

}


function primeraPag(ta){
	contadorPaginas = 0;
	nombreCatId(0,ta);
}


function ultimaPag(ta){
	contadorPaginas = totalPags-1;
	nombreCatId(totalPags-1,ta);
}



