FichaEnemigoEntity = function(fichaEnemigoJson){
	EntityClass.call(this);

	this.pos = {x:fichaEnemigoJson.xIni, y:fichaEnemigoJson.yIni};   //Posición de acuerdo a la grilla

    if(fichaEnemigoJson.nivel){
        this.nivel = fichaEnemigoJson.nivel;
    }else{
        this.nivel=1;
    }

    // Invocador=0; Corto=1; Largo=2; fusion=3; Muro=4
    this.tipo = fichaEnemigoJson.tipo;       //Numero que indica el tipo de ficha

    this.vida = 0;

    this.vidaMaxima = 0;

    this.ataque = 0;

    this.velocidadAccion = 0;       //Numero de segundos para cargar la siguiente acción

	this.currSpriteName = "";

    cambiarTipoActualizaEstadisticasEnemigo(this, true);

    this.siguienteAccion = this.velocidadAccion*60;

    this.isSeleccionada = false;

    this.isArribaBloqueado = false;     // utilizado para evitar que se quede bloqueado

    this.isAbajoBloqueado = false;      // utilizado para evitar que se quede bloqueado

    this.isRetrocediendo = false;       // Si no pudo moverse hacia adelante, arriba o abajo, retrocede

}

FichaEnemigoEntity.prototype = Object.create(EntityClass.prototype);

FichaEnemigoEntity.prototype.constructor = FichaEnemigoEntity;

FichaEnemigoEntity.prototype.update = function(){
	
    if(this.vida<1){
        this.isDead=true;
    }

    //Validamos si se hizo click derecho, para hacerle flip a la ficha
    if(this.isDead){
        return;
    }

    if(this.tipo===0){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            for(i=-1; i<2; i++){
                if(this.siguienteAccion<1){
                    for(j=-1; j<2; j++){
                        if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8 && this.siguienteAccion<1){
                            if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==0){
                                var nuevaFicha = new FichaEnemigoEntity({xIni:this.pos.x+i, yIni:this.pos.y+j, tipo:(Math.floor(Math.random()*3))});
                                GE.grillaBatalla[this.pos.y+j][this.pos.x+i]=-1;
                                GE.entities.push(nuevaFicha);
                                this.siguienteAccion = this.velocidadAccion*60;
                            }
                        }
                    }
                }
            }
        }
            // SI acá this.siguienteAccion sigue siendo < a 1, no se pudo invocar una nueva unidad.
    }else if(this.tipo===1){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            for(i=1; i>-2; i--){
                for(j=1; j>-2; j--){
                    if(i!==0 && j!==0){
                        continue;
                    }
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8 && this.siguienteAccion<1){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==1){
                            var enemyPos = this.pos;
                            var entidadAtacar = null;
                            GE.entities.forEach(function(entidad) {
                                if(entidad instanceof FichaAliadaEntity && entidad.pos.x===enemyPos.x+i && entidad.pos.y===enemyPos.y+j){
                                    entidadAtacar = entidad;
                                }
                            });
                            if(entidadAtacar!==null){
                                entidadAtacar.vida-=this.ataque;
                                this.siguienteAccion = this.velocidadAccion*60;
                            }
                        }
                    }
                }
                if(this.siguienteAccion>0){
                    break;
                }
            }
            if(this.siguienteAccion<1){
                this.mover();
                this.siguienteAccion = this.velocidadAccion*60;
            }
        }
        //alert('tipo '+this.tipo+' No programado');
    }else if(this.tipo===2){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            for(i=3; i>-4; i--){
                for(j=3; j>-4; j--){
                    if( (i!==0 && j!==0) || (i===0 && j===0) ){
                        continue;
                    }else if(Math.abs(i)<2 && Math.abs(j)<2){
                        continue;
                    }
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8 && this.siguienteAccion<1){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==1){
                            var enemyPos = this.pos;
                            var entidadAtacar = null;
                            GE.entities.forEach(function(entidad) {
                                if(entidad instanceof FichaAliadaEntity && entidad.pos.x===enemyPos.x+i && entidad.pos.y===enemyPos.y+j){
                                    entidadAtacar = entidad;
                                }
                            });
                            if(entidadAtacar!==null){
                                entidadAtacar.vida-=this.ataque;
                                this.siguienteAccion = this.velocidadAccion*60;
                            }
                        }
                    }
                }
                if(this.siguienteAccion>0){
                    break;
                }
            }
            if(this.siguienteAccion<1){
                this.mover();
                this.siguienteAccion = this.velocidadAccion*60;
            }
        }
        //alert('tipo '+this.tipo+' No programado');
    }

}

FichaEnemigoEntity.prototype.draw = function() { 
    pintarSpriteCustom(this.currSpriteName, (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    pintarSpriteCustom('Nivel'+this.nivel, (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    this.pintarVida();
}

FichaEnemigoEntity.prototype.pintarVida = function() {

    if(this.vida/this.vidaMaxima<0.3){
        pintarSpriteCustom('VidaVacia', (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    }else{
        pintarSpriteCustom('VidaLlena', (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    }

    GE.ctx.beginPath();
    GE.ctx.strokeStyle='#239700';
    GE.ctx.lineWidth=3;
    GE.ctx.moveTo((this.pos.x*64)+12, (this.pos.y*64)+(64-18));
    GE.ctx.lineTo((this.pos.x*64)+12, (this.pos.y*64)+(64-(((this.vida/this.vidaMaxima) * (60-18))+18)));
    GE.ctx.stroke();


    //Pintamos la barra de carga
    var porcentajeCarga = ((this.velocidadAccion*60)-this.siguienteAccion) /(this.velocidadAccion*60);
    if(porcentajeCarga>1){
        porcentajeCarga=1;
    }

    GE.ctx.beginPath();
    GE.ctx.strokeStyle='#97F4C9';
    GE.ctx.lineWidth=5;
    GE.ctx.moveTo((this.pos.x*64)+16, (this.pos.y*64)+6);
    GE.ctx.lineTo((this.pos.x*64)+59, (this.pos.y*64)+6);
    GE.ctx.stroke();

    GE.ctx.beginPath();
    GE.ctx.strokeStyle='#2397FF';
    GE.ctx.lineWidth=3;
    GE.ctx.moveTo((this.pos.x*64)+18, (this.pos.y*64)+6);
    GE.ctx.lineTo((this.pos.x*64)+(39*porcentajeCarga)+18, (this.pos.y*64)+6);
    GE.ctx.stroke();
    
}

FichaEnemigoEntity.prototype.mover = function(){
    if(this.pos.x+1<10 && GE.grillaBatalla[this.pos.y][this.pos.x+1]==0 && this.isRetrocediendo==false){
        GE.grillaBatalla[this.pos.y][this.pos.x+1]=-1;
        GE.grillaBatalla[this.pos.y][this.pos.x]=0;
        this.pos.x+=1;
    }else if(this.pos.x-1>=0 && GE.grillaBatalla[this.pos.y][this.pos.x+1]==0){
        GE.grillaBatalla[this.pos.y][this.pos.x-1]=-1;
        GE.grillaBatalla[this.pos.y][this.pos.x]=0;
        this.pos.x-=1;
        this.isRetrocediendo=true;
    }else{
        this.isRetrocediendo=false;
    }
}

// Invocador=0; Corto=1; Largo=2; fusion=3; Muro=4
velAccionEnemigoDef = [[10, 8, 6], [3, 2, 1],[4, 3, 2],[5, 10, 15],[10, 7, 4]];
vidaEnemigoDef = [[5, 7, 9], [10, 15, 20],[9, 13, 17],[10, 15, 20],[20, 30, 40]];
//Para el muro, el ataque significa la capacidad de curación.
ataqueEnemigoDef = [[0, 0, 0], [2, 3, 5],[4, 6, 9],[1, 2, 3],[2, 4, 6]];
spriteNameEnemigoDef = ["invocadorEnemigo","cortoEnemigo","largoEnemigo","fusionEnemigo","muroEnemigo"];

/** Si llega el parámetro nuevoNivel el False, se aumenta el tipo en 1 y se actualizan las estadisticas**/
function cambiarTipoActualizaEstadisticasEnemigo(fichaEnemiga, nuevoNivel){
    
    if(nuevoNivel===true){
        fichaEnemiga.velocidadAccion=velAccionEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
        fichaEnemiga.vida=vidaEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
        fichaEnemiga.vidaMaxima = fichaEnemiga.vida;
        fichaEnemiga.ataque=ataqueEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
    }else{
        fichaEnemiga.tipo = (fichaEnemiga.tipo+1)%5;
        fichaEnemiga.velocidadAccion=velAccionEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
        fichaEnemiga.vida=(fichaEnemiga.vida/fichaEnemiga.vidaMaxima)*vidaEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
        if(fichaEnemiga.vida<1){
            fichaEnemiga.vida=1;
        }
        fichaEnemiga.vidaMaxima = vidaEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
        fichaEnemiga.ataque=ataqueEnemigoDef[fichaEnemiga.tipo][fichaEnemiga.nivel];
    }
    fichaEnemiga.currSpriteName=spriteNameEnemigoDef[fichaEnemiga.tipo];
}