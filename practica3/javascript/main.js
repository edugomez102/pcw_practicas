var isMarch = false; 
var acumularTime = 0;
var tamTablero =0;
var tableroJuego;
var filaCliked = -1;
var columnaClicked = -1;
var tableroJugador;

/*Descripción de las funciones mas importantes del js
	
	#En la mayoría de metodo se llaman a varios de estos para repintar el canvas con los nuevos cambios realizados
	pero aqui solo se explica lo que realiza cada uno#


	--crearPartida(tamañoTablero)
	*Funcion que se llama cada vez que el jugador le da a empezar una partida
	Esta lo que hace es dibujar el canvas con las casillas grises correspondientes  de la matriz original que nos devuelve
	la db y además las rejillas grises y la principal negra*


	--comportamientoCanvas()
	*Este metodo se encarga de los comportamientos principales del canvas, es decir, onmousemove, onmouseclick en el canvas
	onmove -> pintamos de verde a modo de "hover" por las casillas que estemos encima de ellas las cuales no sean las originales
	es decir las que no sean grises.
	onclick -> cuando se hace click a una de las celdas se recoge su fila y columna exacta y se llama al metodo celdaSeleccionada(f,c)
	con la fila y la columna seleccionada*


	--celdaSeleccionada(filaSeleccionada,columnaSeleccionada)
	*Este metodo se encarga de dibujar la celda seleccionada destacandola de las demás con un borde rojo
	y ademas tanto su fila como su columna como el cubo en el que se encuentre se pintarán de un color verde mas claro.
	Además de esto se desplegara un label y diferentes numeros con un hover para poder seleccionar el numero que
	irá en esa casilla, una vez pulsado un numero se llamará a cambiarNumero(num);
	* 


	--cambiarNumero(numeroSeleccionado)
	*Una vez se clickea en el numero deseado para poner en la celda se llama a esta función. Esta función
	pinta en la celda seleccionada el numero seleccionado por el usuario y después elimina el desplegable
	para elegir numero. Y el juego sigue*


	--rejillaSudoku(tamañoTablero,1 o 0) 
	*El último parametro es para saber si hay que reacher el canvas entero o solo dibujar las rejillas 
	0 -> solo dibujar la rejilla (lineas grises finas y la principal negra)
	1 -> rejilla dibujada y se resetea el canvas es decir vacio como cuando empezamos*


	--celdasGrises(1 o 0, 1 o 0)
	*El primer parametro significa si queremos resetear el canvas, y el segundo parametro es el de los cuadrados blancos, es decir si queremos
	eliminar los verdes de el onclick y pintarlos de blanco, esa es la unica funcionalidad del segundo parametro
	Por otra parte, este metodo lo que hace es pintar de gris las casillas originales del sudoku es decir las que nos devuelve la db y además
	la segunda parte es rellenar con numeros la matriz, esta vez los numeros van en relación al tablero actual del jugador, que será mandado
	posteriormente en la peticion de comprobar*
*/

function celroja(f,c){
	let cv          = document.querySelector('canvas'),
		ctx         = cv.getContext('2d'),
		tamCuadrado = cv.width / tamTablero;

	ctx.beginPath();
	ctx.fillStyle = 'pink';
	ctx.fillRect(c * tamCuadrado , f * tamCuadrado, tamCuadrado, tamCuadrado);

	// console.log(ctx);
}

function celdaSeleccionada(f,c){
	filaCliked = f;
	columnaClicked = c;
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d');
	let posX = 0,
		posY = 0;
	let tamCuadrado = cv.width / tamTablero;

	if(tamTablero == '4'){
		cv.width = 200;
		cv.height = 200;
	}else{
		cv.width = 270;
		cv.height = 270;
	}

	//Vamos a pintar los cubos de dentro de cada cuadrado también de verde
	//Para ello vamos a calcular en que cubo estamos;
	let medidaTotal;
	let filaTotal;
	let columnaTotal;
	let tamRellenoCuadrado;
	ctx.beginPath();
	ctx.fillStyle = '#49FF6A';
	/*| 0 Al final de la operación obtiene el numero entero*/
	if(tamTablero == 4){
		medidaTotal = 2;
		tamRellenoCuadrado = 2 * tamCuadrado;
		filaTotal = filaCliked / medidaTotal | 0;
		columnaTotal = columnaClicked /medidaTotal | 0;
		ctx.fillRect(medidaTotal * columnaTotal * tamCuadrado,medidaTotal * filaTotal * tamCuadrado,tamRellenoCuadrado,tamRellenoCuadrado);
	}else{
		tamRellenoCuadrado = 3 * tamCuadrado;
		medidaTotal = 3;
		filaTotal = filaCliked / medidaTotal | 0;
		columnaTotal = columnaClicked /medidaTotal | 0;
		ctx.fillRect(medidaTotal * columnaTotal * tamCuadrado,medidaTotal * filaTotal * tamCuadrado,tamRellenoCuadrado,tamRellenoCuadrado);
	}


	//Pintamos las columnas y las filas de verde y el cuadrado seleccionado más oscuro y resaltado
	for(let i=0;i<tamTablero;i++){
		for(let j=0;j<tamTablero;j++){
			if(i==f){
				ctx.beginPath();
				ctx.fillStyle = '#49FF6A';
				ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
			}
			if(j==c){
				ctx.beginPath();
				ctx.fillStyle = '#49FF6A';
				ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
			}
			if(i==f && j==c){
				ctx.beginPath();
				ctx.fillStyle = '#00AF14';
				ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 2;
				ctx.strokeRect(posX,posY,tamCuadrado,tamCuadrado);
			}
			posX = posX + tamCuadrado;
		}
		posX = 0;
		posY = posY + tamCuadrado;
	}


	ctx.stroke();
	 
	celdasGrises(0,0);
	rejillaSudoku(tamTablero,0);

	//Vamos a crear la parte de los numeros
	//Vamos a comprobar si estan ya creados los labels para no volver a crearlos
	let lTituloNumeros = document.querySelector('#labelNumeros');
	let divNumerosNuevo = document.querySelector('#divNumeros'); 
	if(lTituloNumeros == null && divNumerosNuevo == null){
		let lb = document.createElement('label');
		lb.id = "labelNumeros";
		lb.innerHTML = 'Números disponibles';
		document.querySelector('section').appendChild(lb);


		let divNum = document.createElement('div');
		divNum.id = "divNumeros";
		for(let h = 1;h<=tamTablero;h++){
			divNum.innerHTML += `<span class="numeros" onclick="cambiarNumero(${h});">${h}</span>`;
		}
		document.querySelector('section').appendChild(divNum);
	}
}


function cambiarNumero(num){
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d');
	let tamCuadrado = cv.width / tamTablero;


	let posX = tamCuadrado*filaCliked,
		posY = tamCuadrado * columnaClicked;

	ctx.fillStyle = 'black';
	ctx.font = 'bold 18px sans-serif';
	ctx.textAlign = 'center';

	//Poner el numero nuevo en la matriz visual
	if(tamTablero == '4'){
		ctx.fillText(num,posY+25,posX+30);
	}else{
		ctx.fillText(num,posY+15,posX+20);
	}

	tableroJugador[filaCliked][columnaClicked] = num;

	celdasGrises(0,1);
	rejillaSudoku(tamTablero,0);
	ctx.stroke();
	
	document.querySelector('section').removeChild(document.querySelector('#labelNumeros'));
	document.querySelector('section').removeChild(document.querySelector('#divNumeros'));

	let lleno = 0;
	for(let i = 0; i < tamTablero; i++) {
		for(let j = 0; j < tamTablero; j++) {
			// console.log(tableroJugador[i][j]);
			if(tableroJugador[i][j] != 0 ){ lleno++; }
		}
	}
	if(lleno == tamTablero * tamTablero){
		console.log('tablero Lleno');
		comprobarAuto();
	}
}

function comprobarAuto(){
	let xhr  = new XMLHttpRequest(),
		sudo = JSON.parse(sessionStorage.sudoku),
		url  = 'api/sudoku/' + sudo.ID + '/comprobar',
		fd   = new FormData();

	xhr.open('POST', url, true);
	fd.append("juego", JSON.stringify(tableroJugador));

	xhr.onload = function(){
		console.log(xhr.responseText);
		let resp = JSON.parse(xhr.responseText),
			fallos = resp.FALLOS;

		ventanaModal(fallos);

	};
	xhr.onerror = function(){
		console.log('Error al comprobar');
	};

	xhr.setRequestHeader('Authorization',sudo.TOKEN);
	xhr.send(fd);

}

function ventanaModal(numError){
	let modal = 
		`<div class="modal">
				<div class="modal-content">`;
	if(numError.length == 0){
		console.log(tiempoTranscurrido);
		modal += `<h2>¡ENHORABUNA!</h2> 
			<p>has completado el sudoku en ${tiempoTranscurrido.hh}:${tiempoTranscurrido.mm}:${tiempoTranscurrido.ss}</p>
			<button onclick="borrarPartida();borrarModal();">Volver</button>
		`;
	}
	else{
		modal += `
			<h2>Hay ${numError.length} errores</h2>
			<p>¿Quieres intentar corregirlos?</p>
			<button onclick="borrarModal();">Sí</button>
			<button onclick="borrarPartida();borrarModal();">No</button>
		`;
	}
	modal += `
				</div>
			</div>
			`;
	document.querySelector('main').innerHTML += modal;
	comportamientoCanvas();
	celdasGrises(1,0);
	rejillaSudoku(tamTablero,0);
}

function borrarModal(){
	let aux = document.querySelector('.modal');
	aux.parentNode.removeChild(aux);

}


//Resetemaos valores
var filaActual = -1;
var columnaActual = -1;
function comportamientoCanvas(){ 
	celdasGrises(1,0); 
	rejillaSudoku(tamTablero,0);
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d');

	//podemos controlar por donde nos movemos en el canvas
	cv.onmousemove = function(evt){
		if(tableroJuego!=null && document.querySelector("#labelNumeros")==null){
			let regiones = tamTablero,
				ancho = cv.width / regiones, //ancho de cada celda
				alto = cv.height /regiones; //alto de cada celda


			let fila,columna;

			columna = Math.floor(evt.offsetX/ancho);
			fila = Math.floor(evt.offsetY /alto);



			let tamCuadrado = cv.width / regiones;
			let posX,posY = 0;


			if(tableroJuego[fila][columna] == 0){
				if(fila!=filaActual || columna!=columnaActual){
					celdasGrises(1,0); 
					rejillaSudoku(tamTablero,0);
					posX = tamCuadrado * columna;
					posY = tamCuadrado * fila;
					ctx.beginPath();
					ctx.fillStyle = '#6BFA73';
					ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
					cv.style.cursor = "pointer";
					//0 0
					filaActual = fila;
					columnaActual = columna;
				}
			}else if(tableroJuego[fila][columna] == 'undefined'){
				celdasGrises(1,0); 
				rejillaSudoku(tamTablero,0);
				filaActual = fila;
				columnaActual = columna;
				cv.style.cursor = "default";
			}else{		 
				celdasGrises(1,0); 
				rejillaSudoku(tamTablero,0);
				filaActual = fila;
				columnaActual = columna;
				cv.style.cursor = "default";
			}
		}
		ctx.stroke();
	};

	//funcion on click para saber donde clickamos
	cv.onclick = function(evt){
			let regiones = tamTablero,
				ancho = cv.width / regiones, //ancho de cada celda
				alto = cv.height /regiones; //alto de cada celda

			let fila,columna;

			columna = Math.floor(evt.offsetX/ancho);
			fila = Math.floor(evt.offsetY /alto);

			if(tableroJuego!=null && tableroJuego[fila][columna] == 0){
				celdaSeleccionada(fila,columna);
			}
	};
}


function rejillaSudoku(tam,id){
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d'),
		regiones = tam;

	//Dependiendo del numero de celdas un tamaño u otro
	if(tam == "4"){
		if(id == 1){
			cv.width = 200;
			cv.height = 200;
		}
		let dimensiones = cv.width/regiones; //siempre será la misma pq es cuadrado
		//Si las dimensiones son de 4
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'grey';
		for(let i=0;i<regiones;i++){
			//verticales
			ctx.moveTo(i*dimensiones,0);
			ctx.lineTo(i*dimensiones,cv.height);
			//horizontales
			ctx.moveTo(0,i*dimensiones);
			ctx.lineTo(cv.width,i*dimensiones);
		}
		ctx.moveTo(cv.width,0);
		ctx.lineTo(cv.width,cv.height);
		ctx.moveTo(cv.width,cv.height);
		ctx.lineTo(0,cv.height);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'black';
		ctx.moveTo(2*dimensiones,0);
		ctx.lineTo(2*dimensiones,cv.height);
		ctx.moveTo(0,2*dimensiones);
		ctx.lineTo(cv.width,2*dimensiones);
		ctx.stroke();
	}else{
		if(id == 1){
			cv.width = 270;
			cv.height = 270;
		}
		let dimensiones = cv.width/regiones; //siempre será la misma pq es cuadrado
		//Si las dimensiones son de 9
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'grey';
		for(let i=0;i<regiones;i++){
			//verticales
			ctx.moveTo(i*dimensiones,0);
			ctx.lineTo(i*dimensiones,cv.height);
			//horizontales
			ctx.moveTo(0,i*dimensiones);
			ctx.lineTo(cv.width,i*dimensiones);
		}
		ctx.moveTo(cv.width,0);
		ctx.lineTo(cv.width,cv.height);
		ctx.moveTo(cv.width,cv.height);
		ctx.lineTo(0,cv.height);
		ctx.stroke();
		let x = 0;
		for(let j=0;j<2;j++){
			if(j==0){
				x = 3;
			}else{
				x = 6;
			}
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'black';
			ctx.moveTo(x*dimensiones,0);
			ctx.lineTo(x*dimensiones,cv.height);
			ctx.moveTo(0,x*dimensiones);
			ctx.lineTo(cv.width,x*dimensiones);
			ctx.stroke();
		}
	}
}


function celdasGrises(id,blanco){
	let cv = document.querySelector('canvas');
	let ctx = cv.getContext('2d');
	ctx.fillStyle = 'grey';

	let tamCuadrado = cv.width / tamTablero;
	let posX = 0,
		posY = 0;

	if(id==1){
		if(tamTablero == '4'){
			cv.width = 200;
			cv.height = 200;
		}else{
			cv.width = 270;
			cv.height = 270;
		}
	}

	//Dibujamos casillas grises
	for(let i=0;i<tamTablero;i++){
		for(let j=0;j<tamTablero;j++){
			//Si en la matriz original hay un numero distinto 0
			if(tableroJuego[i][j]!=0){
				ctx.beginPath();
				ctx.fillStyle = '#DFDFDF';
				ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);			
			}else if(blanco == 1){
				ctx.beginPath();
				ctx.fillStyle = 'white';
				ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
			}
			posX = posX + tamCuadrado;
		}
		posX = 0;
		posY = posY + tamCuadrado;
	}


	posX = 0;
	posY = 0;
	//Dibujamos los numeros tanto de las casillas grises como de las otras
	for(let i=0;i<tamTablero;i++){
		for(let j=0;j<tamTablero;j++){
			if(tableroJugador[i][j]!=0){
				ctx.beginPath();
				ctx.fillStyle = 'black';
				ctx.font = 'bold 18px sans-serif';
				ctx.textAlign = 'center';
				if(tamTablero == '4'){
					ctx.fillText(tableroJugador[i][j],posX+25,posY+30);
				}else{
					ctx.fillText(tableroJugador[i][j],posX+15,posY+20);
				}
				
			}
			posX = posX + tamCuadrado;
		}
		posX = 0;
		posY = posY + tamCuadrado;
	}
	ctx.stroke();
}


/*Funcion que se llama cuando se le da empezar para jugar una nueva partida y llama a crearPartida
 para hacer el tablero*/
function empezarPartida(){
	crearPartida(document.querySelector('#tablero').value);
}



function crearPartida(tam){
	//Establecemos el tamaño en una variable global para tenerlo controlado en todo momento
	tamTablero = tam;
	let	xhr 	 = new XMLHttpRequest(),
		url 	 = 'api/sudoku/generar/'+tamTablero;

	xhr.open('POST',url,true);

	xhr.onerror = function(){
		console.log('Creación de tablero fallida');
	};

	xhr.onload  = function(){
		//Desactivamos la opcion de cambiar de canvas
		document.querySelector('#tablero').disabled = true;
		console.log(xhr.responseText);
		let respuesta = JSON.parse(xhr.responseText);
		
		//Guardamos el tablero de nuestra partida
		tableroJuego = respuesta.SUDOKU;

		//Copiamos el sudoku original para despues modificarlo
		tableroJugador = [];
		for(let i=0;i<tableroJuego.length;i++){
			tableroJugador[i] = [];
			for(let j=0;j<tableroJuego[0].length;j++){
				tableroJugador[i][j]  = tableroJuego[i][j];
			}
		}

		//Y lo guardamos en el sessionStorage para su futura manipulación
		sessionStorage['sudoku'] = JSON.stringify(respuesta);

		//Funciones onclick y onmove y la creación del canvas de la partida
		comportamientoCanvas();
		celdasGrises(1,0);
		rejillaSudoku(tamTablero,0);
		//Creamos los elementos necesarios para cuando empieze la partida como cronometro y  botones
		crearElementos();
		};

	xhr.send();
}

/*Funcion que crea los elementos como los botones y el cronometro cuando se esta en juego*/
function crearElementos(){
	/*Creación de los botones comprobar y finalizar cuando estamos en juego*/
	document.querySelector('#botonesDiv').innerHTML = `<button id="comprobar" onclick="comprobarPartida();">Comprobar</button>
		<button id="finalizar" onclick="borrarPartida();">Finalizar</button>
		`;
	// <button onclick="ventanaModal([1]);"> modal</button>

	//Cada vez que se crean los elementos empieza una nueva partida por lo tanto el cronometro a 0
	isMarch = false; 
	acumularTime = 0; 
	//Creamos el label donde va a ir el cronometro
    let r = document.createElement('label');
 	r.id = "labelTiempito";
	document.querySelector('#tiempoDiv').appendChild(r); 
	//Llamamos a la función que inicia el cronometro
	start(r);
}


/*Funcion que llama a rejillaSudoku enfuncion del valor que establezco el usuario al principio*/
function cambiaTablero(){
	rejillaSudoku(document.querySelector('#tablero').value,1);
}


/*Funcion que  al hacer click en el logo en acerca lleva a index*/
function logoAcerca(){
	window.location = "index.html";
}


/*Implementación cronometro que se inicia cuando empieza la partida y se reseta cuando se finaliza una nueva
mientras el juego no se acabe sigue contando*/
function start (r) {
	if (isMarch == false) { 
		timeInicial = new Date();
		control = setInterval(cronometro,10,r);
		isMarch = true;
	}
}
var tiempoTranscurrido = {};
function cronometro (r) { 
	timeActual = new Date();
	acumularTime = timeActual - timeInicial;
	acumularTime2 = new Date();
	acumularTime2.setTime(acumularTime); 
	cc = Math.round(acumularTime2.getMilliseconds()/10);
	ss = acumularTime2.getSeconds();
	mm = acumularTime2.getMinutes();
	hh = acumularTime2.getHours()-1;
	if (cc < 10) {cc = "0"+cc;}
	if (ss < 10) {ss = "0"+ss;} 
	if (mm < 10) {mm = "0"+mm;}
	if (hh < 10) {hh = "0"+hh;}
	r.innerHTML = `Tiempo: ${hh}:${mm}:${ss}`;
	tiempoTranscurrido.hh = hh;
	tiempoTranscurrido.mm = mm;
	tiempoTranscurrido.ss = ss;
}



/*Funcion para borrar la partida y resetea la página como si fuera nueva*/
function borrarPartida(){
	let xhr = new XMLHttpRequest(),
		sudo = JSON.parse(sessionStorage['sudoku']);
	url = 'api/sudoku/'+sudo.ID;

	xhr.open('DELETE',url,true);

	xhr.onerror = function(){
		console.log('Se ha producido un error borrando la partida');
	};

	xhr.onload = function(){
		//Reiniciamos contador
		acumularTime = 0;
		//Borramos sesion storage
		sessionStorage.clear();
		/*Y volveriamos a la pantalla de inicio borrando el label de tiempo y los botones correspondientes
		ademas de resetar ambos tableros para que la partida sea completamente limpia*/
		document.querySelector('#botonesDiv').innerHTML = `<button id="empezar" onclick="empezarPartida();">Empezar</button>`;
		document.querySelector('#tiempoDiv').innerHTML = '';
		let labelcito = document.querySelector('#labelNumeros');
		let divNumeritos = document.querySelector('#divNumeros');
		if(labelcito != null && divNumeritos !=null){
			document.querySelector('section').removeChild(labelcito);
			document.querySelector('section').removeChild(divNumeritos);
		}
		tableroJuego = null;
		tableroJugador = null;
		document.querySelector('#tablero').disabled = false;
		rejillaSudoku(tamTablero,1);
	};

	xhr.setRequestHeader('Authorization',sudo.TOKEN);
	xhr.send();
}

function comprobarPartida(){
	let xhr  = new XMLHttpRequest(),
		sudo = JSON.parse(sessionStorage.sudoku),
		url  = 'api/sudoku/' + sudo.ID + '/comprobar',
		fd   = new FormData();

	xhr.open('POST', url, true);
	fd.append("juego", JSON.stringify(tableroJugador));
	console.log(tableroJugador);

	xhr.onload = function(){
		console.log(xhr.responseText);
		let resp = JSON.parse(xhr.responseText),
			fallos = resp.FALLOS;

		console.log(fallos);
		for(let i = 0; i < fallos.length; i++) {
			celroja(fallos[i].fila, fallos[i].columna);
		}
		celdasGrises(0,0);
		rejillaSudoku(tamTablero,0);
		// cv.onmousemove = function(evt){
			// console.log("test");
			// celdasGrises(0, 1);
		// };
		// TODO al volver al canvas borrarlos
		
	};
	xhr.onerror = function(){
		console.log('Error al comprobar');
	};

	xhr.setRequestHeader('Authorization',sudo.TOKEN);
	xhr.send(fd);
}
