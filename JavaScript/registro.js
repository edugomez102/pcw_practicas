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
					<a href="login.html">
						<span class="icon-login"></span>
						<span>Login</span>
					</a>
				</li>`;
	}
}

function hacerRegistro(formu){
	let xhr = new XMLHttpRequest(),
		url = 'api/usuarios/registro',
		fd 	= new FormData(formu);

	xhr.open('POST',url,true);

	xhr.onload = function(){

	};

	return false;
}