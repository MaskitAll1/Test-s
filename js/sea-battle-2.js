var canvasPlayer_BS = document.getElementById("sea-battle_canvas"),
	ctxPlayer_BS     = canvasPlayer_BS.getContext('2d');
var canvasEnemy_BS = document.getElementById("sea-battle-enemy_canvas"),
	ctxEnemy_BS     = canvasEnemy_BS.getContext('2d');
var canvasShips_BS = document.getElementById("sea-battle-ship_canvas"),
	ctxShips_BS     = canvasShips_BS.getContext('2d');



    canvasPlayer_BS.width = Math.floor(canvasPlayer_BS.offsetWidth);
    canvasPlayer_BS.height =  Math.floor(canvasPlayer_BS.offsetHeight);

    ctxPlayer_BS.fillStyle = "#ccc";
    ctxPlayer_BS.fillRect(0, 0, canvasPlayer_BS.width, canvasPlayer_BS.height);

    canvasEnemy_BS.width = Math.floor(canvasEnemy_BS.offsetWidth);
    canvasEnemy_BS.height =  Math.floor(canvasEnemy_BS.offsetHeight);
    ctxEnemy_BS.fillStyle = "#ccc";
    ctxEnemy_BS.fillRect(0, 0, canvasEnemy_BS.width, canvasEnemy_BS.height);

    canvasShips_BS.width = Math.floor(canvasShips_BS.offsetWidth);
    canvasShips_BS.height =  Math.floor(canvasShips_BS.offsetHeight);
    ctxShips_BS.fillStyle = "#ccc";
    ctxShips_BS.fillRect(0, 0, canvasShips_BS.width, canvasShips_BS.height);
 

/*****************
    Class BS
******************/
class Ships{
    constructor(x = 0, y = 0, rotate = "e", length = 0){        
        this.x = x;
        this.y = y;

        this.rotate = rotate;
        this.length = length;

        if(rotate === "v"){
            this.width = 1;
            this.height = this.length;

            this.ship = createArr(this.width,  this.height);
        } 
        else if(rotate === "h"){
            this.width = this.length;
            this.height = 1;

            this.ship = createArr(this.width,  this.height);
        }

        for(var i = 0; i < this.width; ++i){
            for(var j = 0; j < this.height; ++j){
                this.ship[i][j] = new Cell(this.x + i, this.y + j, 1);
            }
        }
	}

}

/*****************
    Class Ship Map
******************/

class MapShip extends Map{
    constructor(width = 10, height = 5, indent = 5 ){
		super(width, height, indent);
        // this.colorArray = ["#aaf", "#55f", "#000", "#faa", "#fdd"];
        this.colorArray = ["#fff", "#000", "#fdd"];
	}

    setShip(ship){
        for(var i = -1; i <= ship.width; ++i){      // ширина (Ox)
            for(var j = -1; j <= ship.height; ++j){ // высота (Oy)

                // проверка на выход за границы полей карты
                if( ship.x + i >= 0 && ship.x + i < this.cellMap.length && 
                    ship.y + j >= 0 && ship.y + j < this.cellMap[ship.x].length ) {

                    // если корабль залезает в зону другого
                    if(this.cellMap[ship.x + i][ship.y + j].value === 1){
                        for(var k = -1; k <= ship.width; ++k){      // ширина (Ox)
                            for(var l = -1; l <= ship.height; ++l){ // высота (Oy)
                                if(l === j && k === i) { return; }
                                this.cellMap[ship.x + k][ship.y + l].value = 2;
                            }   
                        }
                    }

                    // заполняются пустые места вокруг корабля
                    if(i === -1 || j === -1 || i === ship.width || j === ship.height){
                        this.cellMap[ship.x + i][ship.y + j].value = 2;
                    }
                    // заполняется сам корабль
                    else {
                        this.cellMap[ship.x + i][ship.y + j].value = 1;
                    }
                }
                // если корабль выходит за границы полей
                else{
                    if(i === -1 || j === -1 || i === ship.width || j === ship.height){
                    } else {
                            for(var k = -1; k <= ship.width; ++k){      // ширина (Ox)
                                for(var l = -1; l <= ship.height; ++l){ // высота (Oy)
                                
                                if( ship.x + k < 0 || ship.x + k >= this.cellMap.length ||
                                    ship.y + l < 0 || ship.y + l >= this.cellMap[ship.x + k].length){
                                    continue;
                                }

                                if(l === j && k === i) { return; }
                                this.cellMap[ship.x + k][ship.y + l].value = 2;
                            } 
                        }  
                    }
                }
            }   
        }
    }

    findRotate(x, y){
		if(x > 0){
			if(this.cellMap[x - 1][y].value === 1){
				return "h";
			}
		}
		if(x < this.cellMap.length - 1){
			if(this.cellMap[x + 1][y].value === 1){
				return "h";
			}
		}
		if(y > 0){
			if(this.cellMap[x][y - 1].value === 1){
				return "v";
			}
		}
		if(y < this.cellMap[x].length - 1){
			if(this.cellMap[x][y + 1].value === 1){
				return "v";
			}
		}

		return "e";
	}

    findStart(x, y){
        if(x > 0){
            if(this.cellMap[x - 1][y].value === 1){
                return this.findStart(x - 1, y);
            }
        }
        if(y > 0){
            if(this.cellMap[x][y - 1].value === 1){
                return this.findStart(x, y - 1);
            }
        }
		return [x, y];
	}

    
	findLen(x, y, rot){
		var len = 0;

		while(this.cellMap[x][y].value === 1){
			len++;
			if(rot === "h"){
				if(x < this.cellMap.length - 1) {x += 1;}
				else break;
			} else
			if(rot === "v"){
				if(y < this.cellMap[x].length - 1) {y += 1;}
				else break;
			}
		}
		return len;
	}

    isShip(x, y){
        if(this.cellMap[x][y].value != 1){ console.log("0"); return false; }
        var rotate = this.findRotate(x, y)

        if(rotate === "e"){ return new Ships(x, y, "v", 1);}

        var startX = this.findStart(x, y)[0];
        var startY = this.findStart(x, y)[1];

        var len = this.findLen(startX, startY, rotate);

        return new Ships(startX, startY, rotate, len);

    }

    startGame(){
        this.fillMap();
        console.log("start");

        shipArray.forEach(ship => {
            this.setShip(ship);
        });



    }
}


const mapPlayer = new Map(10, 10, 10);
const mapEnemy = new Map(10, 10, 10);
const mapShips = new MapShip(20, 6, 10);

// mapPlayer.fillMap();
// mapEnemy.fillMap();
// mapShips.fillMap();


drawMap(canvasPlayer_BS, ctxPlayer_BS, mapPlayer);
drawMap(canvasEnemy_BS, ctxEnemy_BS, mapEnemy);
drawMap(canvasShips_BS, ctxShips_BS, mapShips);


/*****************
    Ship Map
******************/

// выбирает корабль
canvasShips_BS.addEventListener('mousedown', function (e) {
    var loc = windowToCanvas(canvasShips_BS, e.clientX, e.clientY, mapShips.indent);
    var x = loc.x;
    var y = loc.y;
    
    x = Math.floor(x / (canvasShips_BS.width - mapShips.indent * 2) * mapShips.width);
    y = Math.floor(y / (canvasShips_BS.height - mapShips.indent * 2) * mapShips.height);

    // изменить в зависимости от логики
   console.log(x + " - " + y);
   console.log(mapShips.isShip(x, y));

    // drawMap(canvasShips_BS, ctxShips_BS, mapShips);
});



// var s = new Ships(3, 5, 1, 1, 5);
// console.log(s);
           
const shipArray = [ 
                    new Ships(0, 0, "v", 4),

                    new Ships(3, 1, "v", 3),  
                    new Ships(5, 1, "v", 3),

                    new Ships(7, 1, "v", 2),
                    new Ships(9, 1, "v", 2),
                    new Ships(11, 1, "v", 2),
                    
                    new Ships(13, 1, "v", 1),
                    new Ships(16, 1, "v", 1),
                    new Ships(13, 5, "v", 1),
                    new Ships(19, 5, "v", 1),
]


mapShips.startGame();
drawMap(canvasShips_BS, ctxShips_BS, mapShips);

