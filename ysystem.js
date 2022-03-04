import FichaYsystem from "./modules/fichas/FichaPJ.js";
import FichaPNJYsystem from "./modules/fichas/FichaPNJ.js";
import FichaObjetoYsystem from "./modules/fichas/FichaObjeto.js";
import FichaPoderYsystem from "./modules/fichas/FichaPoder.js";
import YsystemChat from "./modules/Chat.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";

Hooks.once("init", function(){
    console.log("test | INICIALIZANDO HOJAS DE PERSONAJE DE Ysystem");

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Ysystem", FichaYsystem, {
      makeDefault: true,
      types: ['Jugador']
    });
    Actors.registerSheet("Ysystem", FichaPNJYsystem, {
      makeDefault: true,
      types: ['PNJ']
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Ysystem", FichaObjetoYsystem,{
      makeDefault: true,
      types: ['Arma','Armadura','Escudo','Objeto']
    });
    Items.registerSheet("Ysystem", FichaPoderYsystem,{
      makeDefault: true,
      types: ['Poder']
    });
    console.log ("test | HOJAS INICIALIZADAS");
    console.log ("test | CARGANDO TEMPLATES");
    preloadHandlebarsTemplates();
    console.log ("test | TEMPLATES CARGADOS");

    game.settings.register("ysystem", "forceFontSize", {
      name: "Forzar Tamaño de Fuente",
      hint: "Activa esta opción si la ficha se ve rara. Activarla forzará el tamaño de la fuente a 5.",
      scope: "world",
      type: Boolean,
      default: false,
      config: true
    });

    game.settings.register("ysystem", "aspectoFicha", {
      name: "Aspecto",
      hint: "Este setting cambia los assets usados en la ficha modificando su aspecto.",
      scope: "world",
      type: String,
      default: "Negro",
      choices: {
        "Negro": "Por defecto. ficha moderna de color negro.",
        "Rojo": "Ficha moderna de color rojo"
      },
      config: true
    });

});

Hooks.on('renderChatLog', (app, html, data) => YsystemChat.chatListeners(html))
