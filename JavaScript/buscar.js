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
	}

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


function establecerBusqueda(){
	let urlCoger = window.location.search;

	if(urlCoger==null || urlCoger == ""){
		console.log('No realizar busqueda');
	}else{
		console.log(urlCoger);
		urlArray = urlCoger.split('=');
		if (urlArray[0]=="?t") {
			busqueda = urlArray[1];
			console.log(busqueda);

			let xhr = new XMLHttpRequest(),
				url = 'api/usuarios/'+busqueda;

			xhr.open('GET',url,true);

			xhr.onerror = function(){
				console.log('Error en consultar los usuarios');
			};

			xhr.onload = function(){
				let objJava = JSON.parse(xhr.responseText);
				console.log(JSON.parse(xhr.responseText));
				if(objJava.DISPONIBLE){
					console.log('Me meto en disponible');
					document.querySelector('#textArticulo').value = busqueda;
				}else {
					nVendedor = busqueda;
					nVendedor= document.querySelector('#nameVendedor').value = busqueda;
				}
			};
			hacerBusqueda("?t="+busqueda);
			xhr.send();
		}else{

		}
	}
}


function hacerBusqueda(peti){
	let texto = document.getElementById('textArticulo').value,
		vended= document.getElementById('nameVendedor').value,
		bs    = document.getElementById('botonSeguidos').checked,
		bv    = document.getElementById('botonVenta').checked,
		cat   = document.getElementById('lista-categorias').value,
		desde = document.getElementById('pDesde').value,
		hasta = document.getElementById('pHasta').value;

	let peticion = peti;

	// console.log(texto);
	// console.log(vended);
	// console.log(cat);
	// console.log(desde);
	// console.log(hasta);
	// console.log(bs);
	// console.log(bv);

	if(texto){
		peticion += "?t="+texto;
	}
	if(vended){
		peticion += "&v="+vended;
	}
	if(cat!="-"){
		peticion += "&c="+cat;
	}
	if(bs){
		peticion += "&mios";
	}
	if(bv){
		peticion += "&siguiendo";
	}

	console.log("Peticion: "+peticion);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos'+peticion;

	xhr.open('GET',url,true);

	xhr.onerror = function(){
		console.log('Error buscar articulos');
	}

	xhr.onload = function(){
		console.log(JSON.parse(xhr.responseText));
	}

	xhr.send();

	return false;
}