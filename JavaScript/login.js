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
	let xhr = new XMLHttpRequest(),
		url = 'api/usuarios/login',
		fr	= new FormData(formu);
	let wModal = document.querySelector(".modal");
	let buttonAceptar = document.getElementById('AceptarLogin');

	xhr.open('POST',url,true);

	xhr.onload = function(){
		let objJava = JSON.parse(xhr.responseText);
		let mensajeModal = "";
		console.log(objJava);
		if (objJava.RESULTADO == "OK") {
			mensajeModal = `<p>Usuario ${objJava.login} identificado correctamente</p>`;
			sessionStorage['usuario'] = JSON.stringify(objJava);
			wModal.style.display = 'block';
			document.querySelector('#mensajeLogin').innerHTML = mensajeModal;
			buttonAceptar.addEventListener('click',function(){
				window.location = "/pcw_practicas/index.html";
			});
		}else{
			mensajeModal = `<p>Usuario/contraseña incorrectos</p>`;
			wModal.style.display = 'block';
			document.querySelector('#mensajeLogin').innerHTML = mensajeModal;
			buttonAceptar.addEventListener('click',function(){
				wModal.style.display = 'none';
				document.getElementById("loginUser").focus();
			});
		}
	};

	xhr.send(fr);
	return false;

}

