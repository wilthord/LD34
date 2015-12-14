GUIActionsClass = function(){
	this.acciones = {};
}

GUIActionsClass.prototype.constructor = GUIActionsClass;

GUIActionsClass.prototype.aumentarNivel = function(){
	GE.nivelActual++;
	gInputEngine.actions[CLICK]=false;
	//GE.isGUI = false;
}

GUIActionsClass.prototype.disminuirNivel = function(){
	GE.nivelActual--;
	gInputEngine.actions[CLICK]=false;
	//GE.isGUI = false;
}

GUIActionsClass.prototype.iniciarNivel = function(){
	gInputEngine.actions[CLICK]=false;
	GE.isGUI = false;
	GE.nuevoNivel();
}

GUIActionsClass.prototype.tutoria = function(){
	gInputEngine.actions[CLICK]=false;
	GE.isGUI = false;
	GE.nuevoNivel();
}

GUIActionsClass.prototype.instrucciones = function(){
	gInputEngine.actions[CLICK]=false;
	GE.nuevoGUI("HelpGUI");
	GE.isGUI=true;
}

GUIActionsClass.prototype.inicio = function(){
	gInputEngine.actions[CLICK]=false;
	GE.nuevoGUI("InicioGUI");
	GE.isGUI=true;
}

GUIControl = new GUIActionsClass();
GUIControl.acciones["aumentarNivel"]=GUIControl.aumentarNivel;
GUIControl.acciones["disminuirNivel"]=GUIControl.disminuirNivel;
GUIControl.acciones["iniciarNivel"]=GUIControl.iniciarNivel;
GUIControl.acciones["instrucciones"]=GUIControl.instrucciones;
GUIControl.acciones["inicio"]=GUIControl.inicio;