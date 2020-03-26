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
	let wModal = document.querySelector(".modal");
	let buttonAceptar = document.getElementById('AceptarLogin');
	// let idFotohtml = '#fotoobjeto'+contadorFotos; 

	fr.onload = function(){
		fotito.parentNode.querySelector('img').src = fr.result;
	};

	if(fotito.files[0]!=null){
		if(fotito.files[0].size/1024 > 300){
			wModal.style.display = 'block';
			buttonAceptar.addEventListener('click',function(){
				wModal.style.display = 'none';
			});
		}else{
			fr.readAsDataURL(fotito.files[0]);
		}
	}
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
	let usu = JSON.parse(sessionStorage['usuario']);
	let xhr = new XMLHttpRequest(),
		url = 'api/articulos',
		fd  = new FormData(formu);
	let auth = usu.login+':'+usu.token;

	console.log(auth);
	xhr.open('POST',url,true);

	xhr.onerror = function(){
		console.log('Error subiendo archivo');
	}

	xhr.onload = function (){
		let respuesta = JSON.parse(xhr.responseText);
		let idArticulo = respuesta.ID;
		if(respuesta.RESULTADO == "OK"){
			let xhrFotos = new XMLHttpRequest(),
				urlFotos = 'api/articulos/'+idArticulo+'/foto'

			xhrFotos.open('POST',urlFotos,true);

			xhrFotos.onerror = function(){
				console.log('Error subiendo fotos');
			}

			xhr.onload = function(){
				console.log(JSON.parse(xhrFotos.responseText));
			}

		}else{

		}
	};


	//enviamos la  cabezera necesario para saber que usuario ha subido el articulo
	xhr.setRequestHeader('Authorization', auth);
	xhr.send(fd);

	return false;
}
