var registro_Valido_login = false;
var registro_Valido_pwd = false;

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
	if(document.querySelector('.modal')==null){
		let xhr = new XMLHttpRequest(),
			url = 'api/usuarios/registro',
			fd 	= new FormData(formu);

		let mainModal = document.querySelector("#mainModal");
		
		let divModal = document.createElement('div');
		divModal.setAttribute("class","modal");


		let wModal = document.querySelector(".modal");
		let buttonAceptar = document.getElementById('AceptarLogin');

		xhr.open('POST',url,true);

		if(registro_Valido_login && registro_Valido_pwd){
			xhr.onload = function(){
				console.log('Entro aqui');
				let objJava = JSON.parse(xhr.responseText);
				divModal.innerHTML = `<div class="contenido-modal">
							<div>
								<p>Login usuario</p>
							</div>
							<div>
								<p>Nuevo usuario <span style="color:indigo;">${objJava.LOGIN}</span> registrado correctamente</p>
								<button id="AceptarLogin" onclick="sacarModal();"">Aceptar</button>
							</div>
						</div>`;
				document.getElementById('formRegistro').reset();
				mainModal.appendChild(divModal);
				document.getElementById("logUser").disabled = true;
				document.getElementById("pwdUser").disabled = true;
				document.getElementById("repeatpwd").disabled = true;
				document.getElementById("nombreUser").disabled = true;
				document.getElementById("emailUser").disabled = true;
			};
			xhr.send(fd);
			return false;
		}else{
			console.log('Error registro');
		}
	}
	return false;
}


function sacarModal(){
	window.location = "/pcw_practicas/login.html";
}




function comprobarFocoLogin(){
	let usulogin = document.getElementById('logUser').value;
		pwdUser	 = document.getElementById('pwdUser').value;
		r_pwd = document.getElementById('repeatpwd').value;

	let msgErrorLogin = document.getElementById('errorLogin'),
		msgErrorPwd	  = document.getElementById('errorPwd');

	if(usulogin!=null && usulogin!=""){
		let xhr = new XMLHttpRequest(),
			url = 'api/usuarios/'+usulogin;

		xhr.open('GET',url,true);


		xhr.onload = function(){
			let loginValido = JSON.parse(xhr.responseText).DISPONIBLE;
			if(loginValido){
				msgErrorLogin.style.display = 'none';
				registro_Valido_login = true;
			}else{
				msgErrorLogin.style.display = 'block';
				registro_Valido_login = false;
			}			
		}
		xhr.send();
	}else{
		msgErrorLogin.style.display = 'block';
		registro_Valido_login = false;
	}
}

function comprobarPWD(){
	let	pwdUser	 = document.getElementById('pwdUser').value;
		r_pwd = document.getElementById('repeatpwd').value;
	let msgErrorPwd	  = document.getElementById('errorPwd');

	if(pwdUser!=r_pwd){
		msgErrorPwd.style.display = 'block';
		registro_Valido_pwd = false;
	}else{
		msgErrorPwd.style.display = 'none';
		registro_Valido_pwd = true;
	}
}


function insertarFoto(foto){
	let fr = new FileReader();

	fr.onload = function(){
		document.getElementById('fotouser').src = fr.result;
	};

	if (foto.files[0]!=null){
		fr.readAsDataURL(foto.files[0]);
	}
}