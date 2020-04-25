function prepararCanvas(){
	let cvs = document.querySelectorAll('canvas');
	cvs.forEach(function(e){
		e.width = 480;
		e.height = 360;
	});
}

function pintar01(idCV){
	let cv = document.querySelector('#'+idCV),
		ctx = cv.getContext('2d');

	//elegimos color
	ctx.fillStyle = '#ED0505';
	//x,y posicion ; x,y dimension
	ctx.fillRect(40,50,100,75);
}

function pintar02(idCV){
	let cv = document.querySelector('#'+idCV),
		ctx = cv.getContext('2d');
	//grosor de la  linea
	ctx.lineWidth = 4;
	//color de la linea
	ctx.strokeStyle = '#ED0505';
	//donde empezamos a dibujar
	ctx.moveTo(200,200);
	//hasta donde dibujamos
	ctx.lineTo(250,200);

	ctx.lineCap = 'square';

	//si no se hace esto no se pinta nada ya que son figuras geometricas lo que se dibuja y se necesita invocar
	//a este metodo
	ctx.stroke();
}

function pintar03(idCV){
	let cv = document.querySelector('#'+idCV),
		ctx = cv.getContext('2d');

	ctx.rect(150,125,150,75);
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'green';

	ctx.stroke();
}

function pintar4(idCV){
	let cv = document.querySelector('#'+idCV),
		ctx = cv.getContext('2d');
	//color del border
	ctx.strokeStyle = 'yellow';
	ctx.lineWidth = 4;

	//color del relleno
	ctx.fillStyle = 'blue';

	//declaramos posiciones de ambos
	ctx.fillRect(150,125,150,75);
	//el stroke va definido en esta opcion el .stroke(); por lo tanto debemos definir el estilo antes
	ctx.strokeRect(150,125,150,75);
}

function pintar08(idCV){
	let cv = document.querySelector('#'+idCV),
		ctx = cv.getContext('2d');

	ctx.fillStyle = 'orange';
	ctx.font = 'bold 32px sans-serif,arial';

	//texto, pos-> x y
	ctx.fillText('HOLA',200,200);

	ctx.moveTo(200,0);
	ctx.lineTo(200,cv.height);
	ctx.moveTo(0,200);
	ctx.lineTo(cv.width,200);
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 4;
	ctx.stroke();
}