/*Dudas Javier
Petición del delete para finalizar 405 interal server error
Como quita el clickeado del canvas cuando selecciono un numero que no lo consigo
Lo de una variable para el tablero del jugador y otra para el tablero inicial no se pq se guardan a la vez.
*/






var isMarch = false; 
var acumularTime = 0;
var tamTablero =0;
var tableroJuego;
var estaMarcado = false;
var filaCliked = -1;
var columnaClicked = -1;
var poniendoNumero = false;
var tableroJugador;



var ids =0;
var idPrueba = 0;

/*Funcion que cuando se marca una celda las pinta azules*/
function celdaSeleccionada(f,c){
	if(poniendoNumero){
		filaCliked = f;
		columnaClicked = c;
		estaMarcado = true;
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
				//Caso para los de 4
				//Queda lo de pintar los de su mismo cubo vaya movida
				if(i==3 || i==1){
					if(j==1 || j==0){
						/*ctx.beginPath();
						ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);*/
						/*ctx.fillStyle = '#49FF6A';*/
					}else if(j==2 || j == 3){

					}
				}


				posX = posX + tamCuadrado;
			}
			posX = 0;
			posY = posY + tamCuadrado;
		}

		ctx.stroke();
		 
		celdasGrises(0);
		rejillaSudoku(tamTablero,0);

		//Vamos a crear la parte de los numeros
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


/*Funcion que intercambia el número seleccionado por el de la casilla*/
function cambiarNumero(num){
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d');
	let tamCuadrado = cv.width / tamTablero;

	//console.log('filaEs: '+filaCliked);
	//console.log('columnaEs: '+columnaClicked);
	let posX = tamCuadrado*filaCliked,
		posY = tamCuadrado * columnaClicked;

	ctx.fillStyle = 'black';
	ctx.font = 'bold 18px sans-serif';
	ctx.textAlign = 'center';

	if(tamTablero == '4'){
		ctx.fillText(num,posY+25,posX+30);
	}else{
		ctx.fillText(num,posY+15,posX+20);
	}
	poniendoNumero = false;

	tableroJugador[filaCliked][columnaClicked] = num;
		console.log('TableroJugador: '+tableroJugador);
		console.log('TableroJuego: '+tableroJuego);

	idPrueba = 5123;
		console.log('idPrueba: '+idPrueba);
		console.log('id: '+ids);


	celdasGrises(0);
	rejillaSudoku(tamTablero,0);
	estaMarcado = false;
	ctx.stroke();
	document.querySelector('section').removeChild(document.querySelector('#labelNumeros'));
	document.querySelector('section').removeChild(document.querySelector('#divNumeros'));

}


var filaActual = -1;
var columnaActual = -1;
/*Funcion que prepara el estilo principal del canvas*/
function prepararCanvas(){ 
	celdasGrises(1); 
	rejillaSudoku(tamTablero,0);
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d');

	//podemos controlar por donde nos movemos en el canvas
	cv.onmousemove = function(evt){
		if(tableroJuego!=null && !estaMarcado){
			let regiones = tamTablero,
				ancho = cv.width / regiones, //ancho de cada celda
				alto = cv.height /regiones; //alto de cada celda

			//console.log("width: "+cv.width);
			let fila,columna;

			columna = Math.floor(evt.offsetX/ancho);
			fila = Math.floor(evt.offsetY /alto);

			//console.log(fila + '-' + columna);

			let tamCuadrado = cv.width / regiones;
			let posX,posY = 0;


			if(tableroJuego[fila][columna] == 0){
				if(fila!=filaActual || columna!=columnaActual){
					celdasGrises(1); 
					rejillaSudoku(tamTablero,0);
					posX = tamCuadrado * columna;
					posY = tamCuadrado * fila;
					ctx.beginPath();
					ctx.fillStyle = '#6BFA73';
					ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
					//0 0
					filaActual = fila;
					columnaActual = columna;
				}
			}else if(tableroJuego[fila][columna] == 'undefined'){
				celdasGrises(1); 
				rejillaSudoku(tamTablero,0);
				filaActual = fila;
				columnaActual = columna;
			}else{		 
				celdasGrises(1); 
				rejillaSudoku(tamTablero,0);
				filaActual = fila;
				columnaActual = columna;
			}
		}
		ctx.stroke();
	}

	//funcion on click para saber donde clickamos
	cv.onclick = function(evt){
			poniendoNumero = true;
			let regiones = tamTablero,
				ancho = cv.width / regiones, //ancho de cada celda
				alto = cv.height /regiones; //alto de cada celda

			let fila,columna;

			columna = Math.floor(evt.offsetX/ancho);
			fila = Math.floor(evt.offsetY /alto);

			if(tableroJuego!=null && tableroJuego[fila][columna] == 0){
				celdaSeleccionada(fila,columna);
			}

			//console.log(fila + '-' + columna);




		//Queremos saber en  que celda estamos haciendo click
		/*
		let cv = document.querySelector('canvas'),
			regiones = 2,
			ancho = cv.width / regiones, //ancho de cada celda
			alto = cv.height /regiones //alto de cada celda

		let fila,columna:

		columna = Math.floor(evt.offset/ancho);
		fila = Math.floor(evt.offsetY /alto);

		console.log(fila + '-' + columna);
		pintarCuadrado(fila,columna);
		
		//para pintar imagenes otra funcion()
		function pintarImagen(f,c){
			let cv = document.querySelector('canvas'),
				regiones = 2,
				ancho = cv.width / regiones, //ancho de cada celda
				alto = cv.height /regiones, //alto de cada celda
				imagen;
			imagen = new Image();
			imagen.onload = function(){
				ctx.drawImage(imagen,c*ancho,f*alto,ancho,alto);
				//llamamos a rejilla para que nos costruya otra vez la rejilla
				rejilla();
			}
			imagen.src = '';
		}

		*/


	}

	//ademas estos eventos se pueden capturar por separado
	//pero solo necesitamos onclick y  mousemove
}


/*Funcion que  al hacer click en el logo en acerca lleva a index*/
function logoAcerca(){
	window.location = "/pcw_practicas/practica3/index.html";
}

/*Funcion que pinta la rejilla del sudoku solo sin numeros
se llama cada vez el usuario cambia de numero o cuando empieza*/
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

/*Funcion que rellan el sudoku y lo deja listo para empezar a jugar*/
function celdasGrises(id){
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

/*	console.log('TableroJugador: '+tableroJugador);
	console.log('TableroJuego: '+tableroJuego);*/
	//Dibujamos casillas grises
	for(let i=0;i<tamTablero;i++){
		for(let j=0;j<tamTablero;j++){
			if(tableroJuego[i][j]!=0){
				ctx.beginPath();
				ctx.fillStyle = '#DFDFDF';
				ctx.fillRect(posX,posY,tamCuadrado,tamCuadrado);
/*				ctx.beginPath();
				ctx.fillStyle = 'black';
				ctx.font = 'bold 18px sans-serif';
				ctx.textAlign = 'center';
				if(tamTablero == '4'){
					ctx.fillText(tableroJuego[i][j],posX+25,posY+30);
				}else{
					ctx.fillText(tableroJuego[i][j],posX+15,posY+20);
				}*/				
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

	/*cv.onclick = function(evt){
		let regiones = tam,
			ancho = cv.width / regiones, //ancho de cada celda
			alto = cv.height /regiones; //alto de cada celda

		console.log("width: "+cv.width);
		let fila,columna;

		columna = Math.floor(evt.offsetX/ancho);
		fila = Math.floor(evt.offsetY /alto);

		console.log(fila + '-' + columna);
	}*/
}


/*Funcion que se llama cuando se le da empezar para jugar una nueva partida*/
function empezarPartida(){
	crearPartida(document.querySelector('#tablero').value);
}

/*Función que crea el tablero en funcion de el parametro que le meta el usuario*/
function crearPartida(tam){
	tamTablero = tam;
	//console.log('Llamo con: '+tam);

	let mySelect = document.querySelector('#tablero').value,
		xhr 	 = new XMLHttpRequest();
	let url 	 = 'api/sudoku/generar/'+mySelect;

	xhr.open('POST',url,true);

	xhr.onerror = function(){
		console.log('Creación de tablero fallida');
	}

	xhr.onload  = function(){
		//Desactivamos la opcion de cambiar de canvas
		document.querySelector('#tablero').disabled = true;
		//Vamos a rellenar y a pintar las casillas grises además de sacar los demas elementos
		let respuesta = JSON.parse(xhr.responseText);
		//console.log(respuesta);
		//Guardamos el tablero de nuestra partida

		tableroJuego = respuesta.SUDOKU;

		tableroJugador = respuesta.SUDOKU;

		ids = respuesta.ID;
		idPrueba = respuesta.ID;

		sessionStorage['sudoku'] = JSON.stringify(respuesta);
		//Rellenamos con numeros y grises
		
		prepararCanvas();

		
		celdasGrises(1);

		rejillaSudoku(tam,0);

		//Creamos los elementos
		crearElementos();
		


		};

	xhr.send();
}


/*Creamos elementos cuando se inicia la partida*/
function crearElementos(){
	document.querySelector('#botonesDiv').innerHTML = `<button id="comprobar" onclick="comprobarPartida();">Comprobar</button>
		<button id="finalizar" onclick="borrarPartida();">Finalizar</button>`;
	//llamamos a la funcion para crear el cronometro
	isMarch = false; 
	acumularTime = 0; 
    let r = document.createElement('label');
 	r.id = "labelTiempito"
	document.querySelector('#tiempoDiv').appendChild(r); 
	start(r);
}


/*Funcion que llama a crear tablero en funcion de si el usuario cambia el valor*/
function cambiaTablero(){
	 
		rejillaSudoku(document.querySelector('#tablero').value,1);
}

/*Implementación cronometro*/
function start (r) {
         if (isMarch == false) { 
            timeInicial = new Date();
            control = setInterval(cronometro,10,r);
            isMarch = true;
            }
         }
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
         }



/*Funcion para borrar la partida y volver al principio*/
function borrarPartida(){
	let xhr = new XMLHttpRequest(),
		sudo = JSON.parse(sessionStorage['sudoku']);
		url = '/api/sudoku/'+sudo.ID;

	//console.log('url es: '+url);
	xhr.open('DELETE',url,true);

	xhr.onerror = function(){
		console.log('Se ha producido un error borrando la partida');
	}

	xhr.onload = function(){
		//console.log(xhr.responseText);
		sessionStorage.clear();
		//Y volveriamos a la pantalla de inicio
	}

	//console.log('sudo token: '+sudo.TOKEN);
	xhr.setRequestHeader('Authorization',sudo.TOKEN);
	xhr.send();
}





//Funcion ejemplo sobre como subdividir las cosas y jugar con ellas
/*
function rejilla(){
	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d'),
		regiones = 2, //numero en el que se divivde nuestro canvas
		ancho = cv.width / regiones;

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'red';

	for(let i=0;i<regiones;i++){
		//verticales
		ctx.moveTo(i*ancho,0);
		ctx.lineTo(i*ancho,cv.height);
		//horizontales
		ctx.moveTo(0,i*ancho);
		ctx.lineTo(cv.width,i*ancho);
	}


}		
*/