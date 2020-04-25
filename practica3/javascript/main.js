/*Funcion que prepara el estilo principal del canvas*/
function prepararCanvas(){
	let cv = document.querySelector('canvas');
/*	cv.width = 40%;
	cv.height = 40%;*/

	//podemos controlar por donde nos movemos en el canvas
	cv.onmousemove = function(evt){
		//console.log(evt.offsetX + '-' + evt.offsetY);
	}

	//funcion on click para saber donde clickamos
	cv.onclick = function(evt){
		console.log(evt.offsetX + '-' + evt.offsetY);
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

	cv.onmousedown = function(evt){

	}

	cv.onmouseup = function(evt){

	}

}


/*Funcion que  al hacer click en el logo en acerca lleva a index*/
function logoAcerca(){
	window.location = "/pcw_practicas/practica3/index.html";
}


/*Función que crea el tablero en funcion de el parametro que le meta el usuario*/
function crearTablero(tam){
	let mySelect = document.querySelector('#tablero').value,
		xhr 	 = new XMLHttpRequest();
	let url 	 = 'api/sudoku/generar/'+mySelect;

	let cv = document.querySelector('canvas'),
		ctx = cv.getContext('2d');

	//Dependiendo del numero de celdas un tamaño u otro
	if(tam == "4"){
		cv.width = 180;
		cv.height = 180;
	}else{
		console.log('entro aqui');
		cv.width = 225;
		cv.height = 225;
		ctx.fillSytle = 'red';
	}



	xhr.open('POST',url,true);

	xhr.onerror = function(){
		console.log('Creación de tablero fallida');
	}

	xhr.onload  = function(){
		console.log(xhr.responseText);
	};

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