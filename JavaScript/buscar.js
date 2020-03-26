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


function establecerBusqueda(){
	let urlCoger = window.location.search;

	if(urlCoger==null || urlCoger == ""){
		console.log('No realizar busqueda');
	}else{
		console.log(urlCoger);
		urlArray = urlCoger.split('=');
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

		xhr.send();
		hacerBusqueda();
	}
}


function hacerBusqueda(){
	// let usu = JSON.parse(sessionStorage['usuario']);
	// let xhrArticulos = new XMLHttpRequest();
	// let	urlArticulos = 'api/articulos';



	// xhrArticulos.open('GET',urlArticulos,true);

	// xhrArticulos.onerror = function(){
	// 	console.log('Error buscando los productos')
	// };

	// xhrArticulos.onload = function(){
		
	// };

	// xhrArticulos.send()

}
