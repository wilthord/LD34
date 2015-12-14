FichaAliadaEntity = function(fichaAliadaJson){
	EntityClass.call(this);

	this.pos = {x:fichaAliadaJson.xIni, y:fichaAliadaJson.yIni};   //Posición de acuerdo a la grilla

    if(fichaAliadaJson.nivel){
        this.nivel = fichaAliadaJson.nivel;
    }else{
        this.nivel=1;
    }

    // Invocador=0; Corto=1; Largo=2; fusion=3; Muro=4
    this.tipo = fichaAliadaJson.tipo;       //Numero que indica el tipo de ficha

    this.vida = 0;

    this.vidaMaxima = 0;

    this.ataque = 0;

    this.velocidadAccion = 0;       //Numero de segundos para cargar la siguiente acción

	this.currSpriteName = "";

    this.fichaFusion = null;    //Ficha con la cual se está fusionando

    cambiarTipoActualizaEstadisticas(this, true);

    this.siguienteAccion = this.velocidadAccion*60;

    this.isSeleccionada = false;

}

FichaAliadaEntity.prototype = Object.create(EntityClass.prototype);

FichaAliadaEntity.prototype.constructor = FichaAliadaEntity;

FichaAliadaEntity.prototype.update = function(){
	
    if(this.tipo===0){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            for(i=-1; i<2; i++){
                for(j=-1; j<2; j++){
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==0){
                            var nuevaFicha = new FichaAliadaEntity({xIni:this.pos.x+i, yIni:this.pos.y+j, tipo:1});
                            GE.grillaBatalla[this.pos.y+j][this.pos.x+i]=1;
                            GE.entities.push(nuevaFicha);
                            this.siguienteAccion = this.velocidadAccion*60;
                            break;
                        }
                    }
                }
                if(this.siguienteAccion>0){
                    break;
                }
            }
            // SI acá this.siguienteAccion sigue siendo < a 1, no se pudo invocar una nueva unidad.
        }
    }else if(this.tipo===1){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            for(i=-1; i<2; i++){
                for(j=-1; j<2; j++){
                    /*Ataca cualquier ficha a un espacio de distacia*/
                    /*if(i!==0 && j!==0){
                        continue;
                    }*/
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8 && this.siguienteAccion<1){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==-1){
                            var enemyPos = {x:this.pos.x+i, y:this.pos.y+j};
                            var entidadAtacar = null;
                            GE.entities.forEach(function(entidad) {
                                if(entidad instanceof FichaEnemigoEntity && entidad.pos.x===enemyPos.x && entidad.pos.y===enemyPos.y){
                                    entidadAtacar = entidad;
                                    return;
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
        }
    }else if(this.tipo===2){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            for(i=-3; i<4; i++){
                for(j=-3; j<4; j++){
                    if(i!==0 && j!==0 && (Math.abs(i)<2 || Math.abs(j)<2)){
                        continue;
                    }
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8 && this.siguienteAccion<1){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==-1){
                            var enemyPos = {x:this.pos.x+i, y:this.pos.y+j};
                            var entidadAtacar = null;
                            GE.entities.forEach(function(entidad) {
                                if(entidad instanceof FichaEnemigoEntity && entidad.pos.x===enemyPos.x && entidad.pos.y===enemyPos.y){
                                    entidadAtacar = entidad;
                                    return;
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
        }
    }else if(this.tipo===3){           // Fuuuuuuuuuuuuuuusion
        if(this.fichaFusion!==null && this.nivel<3){
            this.siguienteAccion--;
            if(this.siguienteAccion<1 && this.isDead===false){
                this.nivel++;
                this.tipo=1;
                this.fichaFusion.isDead=true;
                cambiarTipoActualizaEstadisticas(this, true);
                this.fichaFusion=null;
            }
        }else if(this.nivel<3){
            this.siguienteAccion = this.velocidadAccion*60;
            for(i=-1; i<2; i++){
                for(j=-1; j<2; j++){
                    if(i===0 && j===0){
                        continue;
                    }
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==1){
                            var fichaPos = {x:this.pos.x+i, y:this.pos.y+j};
                            var nivelFusionActual=this.nivel;
                            var fichaFusionNueva = null;
                            GE.entities.forEach(function(entidad) {
                                if(entidad instanceof FichaAliadaEntity && entidad.tipo===3 && entidad.fichaFusion===null && entidad.nivel===nivelFusionActual && entidad.pos.x===fichaPos.x && entidad.pos.y===fichaPos.y){
                                    fichaFusionNueva = entidad;
                                    return;
                                }
                            });
                            if(fichaFusionNueva!==null){
                                this.fichaFusion=fichaFusionNueva;
                                this.fichaFusion.fichaFusion = this;
                                this.fichaFusion.siguienteAccion = this.velocidadAccion*60;
                                break;
                            }
                        }
                    }
                }
                if(this.fichaFusion!==null){
                    break;
                }
            }
        }
    }else if(this.tipo===4){
        this.siguienteAccion--;
        if(this.siguienteAccion<1){
            this.siguienteAccion = this.velocidadAccion*60;
            for(i=-1; i<2; i++){
                for(j=-1; j<2; j++){
                    //Cura a todas las unidades aliades a una casilla de ella misma
                    if(i===0 && j===0){
                        continue;
                    }
                    if(this.pos.x+i>=0 && this.pos.x+i<10 && this.pos.y+j>=0 && this.pos.y+j<8){
                        if(GE.grillaBatalla[this.pos.y+j][this.pos.x+i]==1){
                            var aliadoPos = {x:this.pos.x+i, y:this.pos.y+j};
                            var puntosCurar = this.ataque;
                            GE.entities.forEach(function(entidad) {
                                if(entidad instanceof FichaAliadaEntity && entidad.pos.x===aliadoPos.x && entidad.pos.y===aliadoPos.y){
                                    entidad.vida+=puntosCurar;
                                    if(entidad.vidaMaxima<entidad.vida){
                                        entidad.vida=entidad.vidaMaxima;
                                    }
                                    return;
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    if(this.vida<1){
        this.isDead=true;
        if(this.fichaFusion!==null){
            this.fichaFusion.fichaFusion=null;
        }
        this.fichaFusion=null;
    }

    //Validamos si se hizo click derecho, para hacerle flip a la ficha
    if(this.isDead===false && gInputEngine.actions[CLICK_DERECHO] && Math.floor(gInputEngine.mouse.x/64)==this.pos.x && Math.floor(gInputEngine.mouse.y/64)==this.pos.y){
        cambiarTipoActualizaEstadisticas(this, false);
        this.siguienteAccion = this.velocidadAccion*60;
        gInputEngine.actions[CLICK_DERECHO]=false;
    }
}

rectPant = document.getElementById("myCanvas").getBoundingClientRect();
FichaAliadaEntity.prototype.draw = function() {
    if(this.fichaFusion===null) {
        pintarSpriteCustom(this.currSpriteName, (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);    
    }else{
        pintarSpriteCustom('fusionando', (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    }

    //Pintamos la vida
    this.pintarVida();
    
    //alert('Nivel'+this.nivel);
    pintarSpriteCustom('Nivel'+this.nivel, (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    if(this.isSeleccionada){
        pintarSpriteCustom('Seleccionado', (this.pos.x*64)+32, (this.pos.y*64)+32, this.w, this.h, this.angulo);
    }
}

FichaAliadaEntity.prototype.pintarVida = function() {

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

FichaAliadaEntity.prototype.mover = function(nuevox, nuevoy){
    if(nuevox-this.pos.x <2 && nuevox-this.pos.x >-2 && nuevoy-this.pos.y <2 && nuevoy-this.pos.y >-2){
        GE.grillaBatalla[nuevoy][nuevox]=1;
        GE.grillaBatalla[this.pos.y][this.pos.x]=0;
        this.pos.x=nuevox;
        this.pos.y=nuevoy;
        this.siguienteAccion=this.velocidadAccion*60;
        if(this.fichaFusion!==null){
            this.fichaFusion.fichaFusion=null;
        }
        this.fichaFusion=null;
    }
}

// Invocador=0; Corto=1; Largo=2; fusion=3; Muro=4
velAccionAliadasDef = [[10, 8, 6], [3, 2, 1],[4, 3, 2],[5, 10, 15],[10, 7, 4]];
vidaAliadasDef = [[5, 7, 9], [10, 15, 20],[9, 13, 17],[10, 15, 20],[20, 30, 40]];
//Para el muro, el ataque significa la capacidad de curación.
ataqueAliadasDef = [[0, 0, 0], [2, 3, 5],[4, 6, 9],[1, 2, 3],[2, 4, 6]];
spriteNameAliadasDef = ["invocador","corto","largo","fusion","muro"];

/** Si llega el parámetro nuevoNivel el False, se aumenta el tipo en 1 y se actualizan las estadisticas**/
function cambiarTipoActualizaEstadisticas(fichaAliada, nuevoNivel){
    
    if(nuevoNivel===true){
        fichaAliada.velocidadAccion=velAccionAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
        fichaAliada.vida=vidaAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
        fichaAliada.vidaMaxima = fichaAliada.vida;
        fichaAliada.ataque=ataqueAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
    }else{
        fichaAliada.tipo = (fichaAliada.tipo+1)%5;
        fichaAliada.velocidadAccion=velAccionAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
        fichaAliada.vida=(fichaAliada.vida/fichaAliada.vidaMaxima)*vidaAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
        if(fichaAliada.vida<1){
            fichaAliada.vida=1;
        }
        fichaAliada.vidaMaxima = vidaAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
        fichaAliada.ataque=ataqueAliadasDef[fichaAliada.tipo][fichaAliada.nivel];
    }
    if(fichaAliada.fichaFusion!==null){
        fichaAliada.fichaFusion.fichaFusion=null;
    }
    fichaAliada.fichaFusion=null;
    fichaAliada.currSpriteName=spriteNameAliadasDef[fichaAliada.tipo];
}