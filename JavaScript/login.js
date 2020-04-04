function insertarDespues(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function crearModal(){
	let divModal = document.createElement('div'),
		main     = document.querySelector('main');
	divModal.setAttribute("class", "modal");
	insertarDespues(divModal, main);
	console.log(divModal);
	return divModal;
}


function ventanaModal(titulo, precio, descripcion){
	let wModal = crearModal();
	wModal.innerHTML = `
			<div class="contenido-modal modw">
				<div>
					<p>${titulo}</p>
				</div>
				<div>
					<form onsubmit="return false;">
						<label >Precio</label>
						<input type="number" value="${precio}">
						<label >Descripción</label>
						<textarea name="Name" rows="8" cols="40">${descripcion}</textarea>
						<button id="botonCancelar">Cancelar</button>
						<button id="botonAceptar">Aceptar</button>
					</form>
				</div>
			</div>
		`;
	return wModal;
}




function comprobarLogin(){

	//si esta logueado no puede acceder a la pagina
	let = document.querySelector('#barraNav');
	if(sessionStorage['usuario']!=null){
		window.location = "/pcw_practicas/index.html";
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
					<a href="registro.html">
						<span class="icon-user-plus"></span>
						<span>Registro</span>
					</a>
				</li>`;
	}
}



function hacerLogin(formu){
	if(document.querySelector('.modal')==null){
		let xhr = new XMLHttpRequest(),
			url = 'api/usuarios/login',
			fr	= new FormData(formu);
		let mainModal = document.querySelector("#mainModal");
		let divModal = document.createElement('div');
		divModal.setAttribute("class","modal");
		let todosDivModal = document.querySelectorAll('#mainModal>div');


		xhr.open('POST',url,true);

		xhr.onload = function(){
			let objJava = JSON.parse(xhr.responseText);
			let mensajeModal = "";
			if (objJava.RESULTADO == "OK") {
				divModal.innerHTML = `<div class="contenido-modal">
						<div>
							<p>Login usuario</p>
						</div>
						<div>
							<p>Usuario ${objJava.login} identificado correctamente</p>
							<button id="AceptarLogin" onclick="sacarModal();"">Aceptar</button>
						</div>
					</div>`;
				sessionStorage['usuario'] = JSON.stringify(objJava);
				mainModal.appendChild(divModal);
				document.querySelector("#loginUser").disabled = true;
				document.querySelector("#passUser").disabled = true;
			}else{
				divModal.innerHTML =`<div class="contenido-modal">
						<div>
							<p>Login usuario</p>
						</div>
						<div>
							<p>Usuario/contraseña incorrectos</p>
							<button id="AceptarLogin" onclick="borrarModal();"">Aceptar</button>
						</div>
					</div>`;
				mainModal.appendChild(divModal);
				document.querySelector("#loginUser").disabled = true;
				document.querySelector("#passUser").disabled = true;
			}
		};

		xhr.send(fr);
	}
	return false;
}

function sacarModal(){
	window.location = "/pcw_practicas/index.html";
}

function borrarModal(){
	let divModal = document.querySelector(".modal");
	divModal.remove();
	document.querySelector("#loginUser").disabled = false;
	document.querySelector("#passUser").disabled = false;
	document.getElementById("loginUser").focus();
}

