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
	let xhr = new XMLHttpRequest(),
		url = 'api/usuarios/registro',
		fd 	= new FormData(formu);

	let wModal = document.querySelector(".modal");
	let buttonAceptar = document.getElementById('AceptarLogin');

	xhr.open('POST',url,true);

	if(registro_Valido_login && registro_Valido_pwd){
		xhr.onload = function(){
			wModal.style.display = 'block';
			document.querySelector('#mensajeLogin').innerHTML = `<p>Nuevo usuario <span style="color:indigo;">${objJava.LOGIN}</span> registrado correctamente</p>`;
			buttonAceptar.addEventListener('click',function(){
				window.location = "/pcw_practicas/login.html";
			});
		};
		xhr.send(fd);
		document.getElementById('formRegistro').reset();

	}else{
		console.log('Error registro');
	}

	return false;
}


function comprobarFoco(){
	let usulogin = document.getElementById('logUser').value;
		pwdUser	 = document.getElementById('pwdUser').value;
		r_pwd = document.getElementById('repeatpwd').value;

	let msgErrorLogin = document.getElementById('errorLogin'),
		msgErrorPwd	  = document.getElementById('errorPwd'),
		msgName		  = document.getElementById('nombreUser');

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

	if(document.activeElement.name == "pwd"){
		if(pwdUser != r_pwd){
			msgErrorPwd.style.display = 'block';
			registro_Valido_pwd = false;
		}else{
			msgErrorPwd.style.display = 'none';
			registro_Valido_pwd = true;
		}
	}

	if(document.activeElement.name == "pwd2"){
		if(pwdUser != r_pwd){
			msgErrorPwd.style.display = 'block';
			registro_Valido_pwd = false;
		}else{
			msgErrorPwd.style.display = 'none';
			registro_Valido_pwd = true;
		}
	}

	if(document.activeElement.name == "nombre"){
		if(pwdUser == r_pwd){
			msgErrorPwd.style.display = 'none';
			registro_Valido_pwd = true;
		}else{
			msgErrorPwd.style.display = 'block';
			registro_Valido_pwd = false;
		}
	}

	xhr.send();
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