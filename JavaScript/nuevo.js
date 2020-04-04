var contadorFotos = 0;

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
				`;
	}else{
		window.location = "/pcw_practicas/index.html";
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
		r.FILAS.forEach(function(e) {
			let option = document.createElement('option');
			option.innerHTML = `${e.nombre}`;
			document.querySelector('#lista-categorias').appendChild(option);
		});
	};

	xhr.send();
}

function insertarFoto(fotito){
	let fr = new FileReader();

	let mainModal = document.querySelector("body");
	let divModal = document.createElement('div');
	divModal.setAttribute("class","modal");



	let wModal = document.querySelector(".modal");
	let buttonAceptar = document.getElementById('AceptarLogin');
	// let idFotohtml = '#fotoobjeto'+contadorFotos; 

	fr.onload = function(){
		fotito.parentNode.querySelector('img').src = fr.result;
	};

	if(fotito.files[0]!=null){
		if(fotito.files[0].size/1024 > 300){
			divModal.innerHTML = `<div class="contenido-modal">
			<div>
				<p>Fichero no soportado</p>
			</div>
			<div>
				<p id="mensajeLogin">El peso del archivo es mayor que 300KB</p>
				<button onclick="borrarModal();"id="AceptarLogin">Aceptar</button>
			</div>
			</div>`;
			mainModal.appendChild(divModal);
			document.getElementById('A').disabled = true;
			document.getElementById('B').disabled = true;
			document.getElementById('C').disabled = true;
			document.getElementById('D').disabled = true;
			document.getElementById('lista-categorias').disabled = true;
		}else{
			fr.readAsDataURL(fotito.files[0]);
		}
	}
}

function borrarModal(){
	let divModal = document.querySelector(".modal");
	divModal.remove();
	document.getElementById('A').disabled = false;
	document.getElementById('B').disabled = false;
	document.getElementById('C').disabled = false;
	document.getElementById('D').disabled = false;
	document.getElementById('lista-categorias').disabled = false;
}


function anadirFoto(){
	let contFotos = document.querySelector('#contenedorFotos');
	let div = document.createElement('div');
	contadorFotos++;
	div.innerHTML = `<label for ="foto${contadorFotos}"><img src="img/No-Image-Found-400x264.png" alt="fotoOBjecto" id="fotoobjeto${contadorFotos}"></label>
							<label for="foto${contadorFotos}" class="icon-picture"></label>
							<label onclick="eliminarFoto(this);">Eliminar foto</label>
							<input onchange="insertarFoto(this);" type="file" name="foto" accept="image/*" id="foto${contadorFotos}">`
	contFotos.appendChild(div);
	let input  = "foto"+contadorFotos;
	document.getElementById(input).click();
}


function eliminarFoto(lab){
	let contFotos = document.querySelector('#contenedorFotos');
	let borrar = lab.parentNode;
	contFotos.removeChild(borrar);
}


function hacerNuevo(formu){
	if(document.querySelector('.modal2')==null){
		let usu = JSON.parse(sessionStorage['usuario']);
		let xhr = new XMLHttpRequest(),
			url = 'api/articulos',
			fd  = new FormData(formu);

		let auth = usu.login+':'+usu.token;
			
		xhr.open('POST',url,true);

		xhr.onerror = function(){
			console.log('Error subiendo archivo');
		};

		xhr.onload = function (){
			let respuesta = JSON.parse(xhr.responseText);
			let idArticulo = respuesta.ID;
			if(respuesta.RESULTADO == "OK"){
				subirFotos(idArticulo,0);
			}else{

			}
		};


		//enviamos la  cabezera necesario para saber que usuario ha subido el articulo
		xhr.setRequestHeader('Authorization',auth);
		xhr.send(fd);
	}
	return false;
}


function subirFotos(idArticulo,nFoto){
	let usu = JSON.parse(sessionStorage['usuario']);
	let	url = 'api/articulos/'+idArticulo+'/foto';
	let auth = usu.login+':'+usu.token


	let contenedorF = document.querySelector('#contenedorFotos');
	//numero de divs del contenedor
	let todosDivs = document.querySelectorAll('#contenedorFotos>div');
	
	if(nFoto<todosDivs.length){
		if(todosDivs[nFoto].querySelector('input').files[0]!=null){
			let fd 	=  new FormData();
			fd.append('fichero',todosDivs[nFoto].querySelector('input').files[0]);
			fetch(url,{method:'POST',
						body:fd,
						headers:{'Authorization':auth}}).then(function(respuesta){
							if(respuesta.ok){
								respuesta.json().then(function(datos){
									if(datos.RESULTADO == "OK"){
										subirFotos(idArticulo,nFoto+1);
									}else{

									}
								});
							}else{

							}
						});
		}else{
			if(todosDivs.length == 1){
				hacerModal();
			}
		}
	}else{
		hacerModal();
	}
}


function hacerModal(){
	let mainModal = document.querySelector("body");
	let divModal = document.createElement('div');
	divModal.setAttribute("class","modal2");

	divModal.innerHTML = `<div class="contenido-modal2">
					<div>
						<p>Nuevo articulo</p>
					</div>
					<div>
						<p id="mensajeLogin2">Se ha guardado correctamente el articulo</p>
						<button onclick="sacarModal();"id="AceptarLogin2">Aceptar</button>
					</div>
				</div>`;
	mainModal.appendChild(divModal);
	document.getElementById('A').disabled = true;
	document.getElementById('B').disabled = true;
	document.getElementById('C').disabled = true;
	document.getElementById('D').disabled = true;
	document.getElementById('lista-categorias').disabled = true;
}

function sacarModal(){
	window.location = "/pcw_practicas/index.html";
}