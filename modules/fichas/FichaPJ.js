import {TiradaHabilidad} from "../tiradas/tirada_habilidad.js";
import {TiradaAtaque} from "../tiradas/tirada_ataque.js";
import {TiradaHechizo} from "../tiradas/tirada_hechizo.js";
import {TiradaResistenciaFisica} from "../tiradas/tirada_resistencia_fisica.js";
import {TiradaResistenciaMental} from "../tiradas/tirada_resistencia_mental.js";
import {TiradaPanico} from "../tiradas/tirada_panico.js";
export default class FichaYsystem extends ActorSheet{
  static get defaultOptions() {
    if (game.settings.get ("ysystem", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
      return mergeObject(super.defaultOptions, {
        classes: ["Ysystem", "sheet", "actor"],
        template: "systems/ysystem/templates/actors/Negro/Jugador.html",
        width: 800,
        height: 700,
        resizable: false,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "habilidades" }]
      });
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
      return mergeObject(super.defaultOptions, {
        classes: ["Ysystem", "sheet", "actor"],
        template: "systems/ysystem/templates/actors/Rojo/Jugador.html",
        width: 800,
        height: 700,
        resizable: false,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "habilidades" }]
      });
    }
    if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
      return mergeObject(super.defaultOptions, {
        classes: ["Ysystem", "sheet", "actor"],
        template: "systems/ysystem/templates/actors/Medieval/Jugador.html",
        width: 800,
        height: 700,
        resizable: false,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "habilidades" }]
      });
    }

  }
  getData() {
      const data = super.getData().data;
      data.dtypes = ["String", "Number", "Boolean"];
      if (this.actor.type == 'Jugador') {
        this._prepareCharacterItems(data);
        this._calculaValores(data);
      }
      return data;
    }

    _calculaValores(actorData) {
const data = actorData;
const Agilidad =Number(data.system.Destreza)+Number(data.system.Habilidades.Atletismo.Valor)*3;
const Aplomo =5+Number(data.system.Carisma)+Number(data.system.Inteligencia);
const Perspicacia=5+Number(data.system.Percepción)+Number(data.system.Inteligencia);
const Iniciativa=Number(data.system.Destreza)+Number(data.system.Inteligencia);
const Salud=16+Number(data.system.Fuerza)*2;
const R_Física=12-Number(data.system.Fuerza);
const Estabilidad=11+Aplomo;
const R_Mental=12-Number(data.system.Carisma);
const Proezas=3+Math.floor((data.system.Fuerza+data.system.Inteligencia)/2);
const Poder=5+Number(data.system.Percepción)+Number(data.system.Inteligencia)+Number(data.system.Magia.Valor)*3;
//ACTUALIZO TODOS LOS VALORES
let Protección_Daño=0;
let Protección_Penalización=0;
let Protección_Agilidad=0;
let Armadura = data.Armaduras.find((k) => k.type === "Armadura" && k.system.Equipado=="true");
if (Armadura){
  Protección_Daño=Armadura.system.Nivel;
  Protección_Penalización+=Armadura.system.Penalizador;
}
let Escudo = data.Escudos.find((k) => k.type === "Escudo" && k.system.Equipado=="true");
if (Escudo){
  Protección_Agilidad=Escudo.system.Nivel;
  Protección_Penalización+=Escudo.system.Penalizador;
}


this.actor.update ({ 'system.Agilidad.Valor': Agilidad });
this.actor.update ({ 'system.Aplomo.Valor': Aplomo });
this.actor.update ({ 'system.Perspicacia.Valor': Perspicacia });
this.actor.update ({ 'system.Iniciativa': Iniciativa });
this.actor.update ({ 'system.Salud.max': Salud });
this.actor.update ({ 'system.Resistencia_Física': R_Física });
this.actor.update ({ 'system.Estabilidad.max': Estabilidad });
this.actor.update ({ 'system.Resistencia_Mental': R_Mental });
this.actor.update ({ 'system.Protección_Daño': Protección_Daño });
this.actor.update ({ 'system.Protección_Agilidad': Protección_Agilidad });
this.actor.update ({ 'system.Protección_Penalización': Protección_Penalización });
this.actor.update ({ 'system.Proezas.max': Proezas });
this.actor.update ({ 'system.Poder.max': Poder });

}


    _prepareCharacterItems(sheetData) {
    const actorData = sheetData;

    // Inicializo arrays para meter los objetos por tipo.
    //"arma", "armadura", "aspecto", "don", "habilidad", "limitacion", "maniobra", "objeto", "talento"
     const Armas = [];
     const Armaduras = [];
     const Escudos = [];
     const Poderes = [];
     const Objetos = [];
     // Ordena los objetos por tipo y los mete en el array correspondiente
    for (let i of sheetData.items) {
      let item = i.system;
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'Arma') {
        if (i.system.Habilidad=="Lucha"){i.system.Ataque=actorData.system.Habilidades.Lucha.Valor+"D6+"+actorData.system.Destreza}
        if (i.system.Habilidad=="Puntería"){i.system.Ataque=actorData.system.Habilidades.Puntería.Valor+"D6+"+actorData.system.Percepción}
        if (i.system.Bono=="FUE_2"){i.system.Daño_Total=Number(i.system.Daño)+Math.floor(Number(actorData.system.Fuerza)/2)}
        if (i.system.Bono=="FUE"){i.system.Daño_Total=Number(i.system.Daño)+Number(actorData.system.Fuerza)}
        if (i.system.Bono=="PER"){i.system.Daño_Total=Number(i.system.Daño)+Number(actorData.system.Percepción)}
        Armas.push(i);
      }
      else if (i.type === 'Armadura') {
        Armaduras.push(i);
      }
       else if (i.type === "Escudo") {
         Escudos.push(i);
       }
       else if (i.type === "Poder") {
         Poderes.push(i);
       }
       else if (i.type === "Objeto") {
         Objetos.push(i);
       }
    }
    //Asigno cada array al actordata
actorData.Armas = Armas;
actorData.Armaduras = Armaduras;
actorData.Escudos = Escudos;
actorData.Poderes = Poderes;
actorData.Objetos = Objetos;
}

activateListeners(html) {
        super.activateListeners(html);

        // Si la hoja no es editable me salgo
        if (!this.options.editable) return;

        // Añadir Objeto
        html.find('.item-create').click(this._onItemCreate.bind(this));

        // Editar objetos
        html.find('.item-edit').click(ev => {
          const li = $(ev.currentTarget).parents(".item");
          const item = this.actor.items.get(li.data("itemId"));
          item.sheet.render(true);
        });
        // Modificar valor de habilidades
        html.find('.mod_habilidad').click(ev => {
          const element = ev.currentTarget;
          const dataset = element.dataset;
          const habilidad_id=dataset.habilidad_id
          const update = {};
          update.data = {};
          var valor_actual=Number(this.actor.system.Habilidades[habilidad_id].Valor)
          var valor_nuevo=valor_actual+1
          if (valor_nuevo>=4){valor_nuevo=1}
          const habilidad='system.Habilidades.'+habilidad_id+'.Valor'
          update[habilidad] = valor_nuevo;
          update.id = this.actor.id;
          this.actor.update(update, {diff: true});
        });

        html.find('.mod_magia').click(ev => {
          const element = ev.currentTarget;
          const dataset = element.dataset;
          const habilidad_id=dataset.habilidad_id
          const update = {};
          update.data = {};
          var valor_actual=Number(this.actor.system.Magia.Valor)
          var valor_nuevo=valor_actual+1
          if (valor_nuevo>=4){valor_nuevo=1}
          const habilidad='system.Magia.Valor'
          update[habilidad] = valor_nuevo;
          update.id = this.actor.id;
          this.actor.update(update, {diff: true});
        });
        //Gasta una proeza para mejorar Agilidad/Perspicacia/Aplomo
        html.find('.activa_mod').click(ev => {
          const element = ev.currentTarget;
          const dataset = element.dataset;
          const bono_nombre=dataset.bono_nombre;
          let contenido_Dialogo_chat= this.actor.name+ " usa Proeza para mejorar su "+bono_nombre;
          const update = {};
          update.data = {};
          var valor_nuevo=0;
          var proezas=this.actor.system.Proezas.value;
          var valor_actual=Number(this.actor.system[bono_nombre].Bono)
          if (this.actor.system.Proezas.value > 0){
              valor_nuevo=valor_actual+3
              proezas=this.actor.system.Proezas.value-1
              const bono='data.'+bono_nombre+'.Bono'
              update[bono] = valor_nuevo;
              update.id = this.actor.id;
              this.actor.update(update, {diff: true});
              this.actor.update ({ 'system.Proezas.value': proezas });
              const chatData = {
                content: contenido_Dialogo_chat,
              };
              ChatMessage.create(chatData);
        }
        else {
          ui.notifications.warn("No te quedan puntos de PROEZA!!");
          return 1;
        }
        });
        //RESETEA Agilidad/Perspicacia/Aplomo
        html.find('.activa_mod').contextmenu(ev => {
          const element = ev.currentTarget;
          const dataset = element.dataset;
          const bono_nombre=dataset.bono_nombre;
          let contenido_Dialogo_chat= this.actor.name+ " resetea su "+bono_nombre;
          const update = {};
          update.data = {};
          var valor_nuevo=0;
          const bono='system.'+bono_nombre+'.Bono'
          update[bono] = valor_nuevo;
          update.id = this.actor.id;
          this.actor.update(update, {diff: true});
          const chatData = {
            content: contenido_Dialogo_chat,
          };
          ChatMessage.create(chatData);
        });

        // Borrar objetos
        html.find('.item-delete').click(ev => {
          const li = $(ev.currentTarget).parents(".item");
          const objeto_a_borrar = this.actor.items.get(li.data("itemId"));
          objeto_a_borrar.delete();
          this.render(false);
          li.slideUp(200, () => this.render(false));
        });
        //Equipar objeto, solo armadura y escudo
        html.find('.item-equip').click(ev => {
          const li = $(ev.currentTarget).parents(".item");
          const objeto_a_equipar = this.actor.items.get(li.data("itemId"));
          if (objeto_a_equipar.system.Equipado =="false"){
            objeto_a_equipar.update ({ 'data.Equipado': "true" });
          } else {
            objeto_a_equipar.update ({ 'data.Equipado': "false" });
          }

          this.render(false);
        });

        html.find('.recuerdo_toggle').click(ev => {
          const element = ev.currentTarget;
          const dataset = element.dataset;
          var valor_nuevo="true";
          let contenido_Dialogo_chat= this.actor.name+ " recuerda cuando..."
          const update = {};
          update.data = {};
          const update2 = {};
          update2.data = {};
          if (this.actor.system.Recuerdo_Cuando == "false"){
              const recuerdo='system.Recuerdo_Cuando'
              update[recuerdo] = valor_nuevo;
              update.id = this.actor.id;
              this.actor.update(update, {diff: true});
              const recuerdo2='system.Recuerdo_Cuando_Activo'
              update2[recuerdo2] = valor_nuevo;
              update2.id = this.actor.id;
              this.actor.update(update2, {diff: true});
              const chatData = {
                content: contenido_Dialogo_chat,
              };
              ChatMessage.create(chatData);
            }
          else {
            ui.notifications.warn("Ya has usado tu RECUERDO esta sesión");
            return 1;
          }
        });

        html.find('.recuerdo_toggle').contextmenu(ev => {
          const element = ev.currentTarget;
          const dataset = element.dataset;
          var valor_nuevo="false";
          const update = {};
          update.data = {};
          const update2 = {};
          update2.data = {};
          const recuerdo='data.Recuerdo_Cuando'
          update[recuerdo] = valor_nuevo;
          update.id = this.actor.id;
          this.actor.update(update, {diff: true});
          const recuerdo2='system.Recuerdo_Cuando_Activo'
          update2[recuerdo2] = valor_nuevo;
          update2.id = this.actor.id;
          this.actor.update(update2, {diff: true});
          let contenido_Dialogo_chat= this.actor.name+ " resetea su Recuerdo Cuando"
          const chatData = {
            content: contenido_Dialogo_chat,
          };
          ChatMessage.create(chatData);
        });
        //RESTAURAR PROEZAS, SALUD, ESTABILIDAD Y PODER
        html.find('.restaura_proeza').contextmenu(ev => {
          const element = ev.currentTarget;
          this.actor.update ({ 'system.Proezas.value': this.actor.system.Proezas.max });
          let contenido_Dialogo_chat= this.actor.name+ " resetea sus Proezas"
          const chatData = {
            content: contenido_Dialogo_chat,
          };
          ChatMessage.create(chatData);
        });

        html.find('.restaura_salud').contextmenu(ev => {
          const element = ev.currentTarget;
          this.actor.update ({ 'system.Salud.value': this.actor.system.Salud.max });
          let contenido_Dialogo_chat= this.actor.name+ " resetea su Salud"
          const chatData = {
            content: contenido_Dialogo_chat,
          };
          ChatMessage.create(chatData);
        });

        html.find('.restaura_estabilidad').contextmenu(ev => {
          const element = ev.currentTarget;
          this.actor.update ({ 'system.Estabilidad.value': this.actor.system.Estabilidad.max });
          let contenido_Dialogo_chat= this.actor.name+ " resetea su Estabilidad"
          const chatData = {
            content: contenido_Dialogo_chat,
          };
          ChatMessage.create(chatData);
        });

        html.find('.restaura_poder').contextmenu(ev => {
          const element = ev.currentTarget;
          this.actor.update ({ 'system.Poder.value': this.actor.system.Poder.max });
          let contenido_Dialogo_chat= this.actor.name+ " resetea su Poder"
          const chatData = {
            content: contenido_Dialogo_chat,
          };
          ChatMessage.create(chatData);
        });


        //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS
        html.find('.tirada_habilidad').click(this._onTiradaHabilidad.bind(this));
        html.find('.ataque_arma').click(this._onAtaqueArma.bind(this));
        html.find('.tirada_hechizo').click(this._onTiradaHechizo.bind(this));
        html.find('.tirada_Resistencia_Fisica').click(this._onTiradaResistenciaFisica.bind(this));
        html.find('.tirada_Resistencia_Mental').click(this._onTiradaResistenciaMental.bind(this));
        html.find('.tirada_Resistencia_Mental').contextmenu(this._onTiradaPanico.bind(this));

}
_onItemCreate(event) {
  event.preventDefault();
  const header = event.currentTarget;
  // Get the type of item to create.
  const type = header.dataset.type;
  // Grab any data associated with this control.
  const data = duplicate(header.dataset);
  // Initialize a default name.
  const name = `${type.capitalize()}`;
  // Prepare the item object.
  const itemData = {
    name: name,
    type: type,
    data: data
  };
  // Remove the type from the dataset since it's in the itemData.type prop.
  delete itemData.data["type"];

  // Finally, create the item!
  //     return this.actor.createOwnedItem(itemData);
  return Item.create(itemData, {parent: this.actor});
}

async _onTiradaHabilidad(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  let objetivo = Array.from(game.user.targets)[0]?.actor;
  TiradaHabilidad (this.actor, dataset.habilidad_id, objetivo)
}

async _onAtaqueArma(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  let objetivo = Array.from(game.user.targets)[0]?.actor;
  TiradaAtaque (this.actor, dataset.arma, dataset.habilidad_id, dataset.daño, objetivo)
}

async _onTiradaHechizo(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  let objetivo = Array.from(game.user.targets)[0]?.actor;
  TiradaHechizo (this.actor, dataset.poder, dataset.id_atributo, dataset.dificultad, objetivo)
}

async _onTiradaResistenciaFisica(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  TiradaResistenciaFisica (this.actor);
}

async _onTiradaResistenciaMental(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  TiradaResistenciaMental (this.actor);
}

async _onTiradaPanico(event) {
  const element = event.currentTarget;
  const dataset = element.dataset;
  TiradaPanico (this.actor);
  //TiradaHechizo (this.actor, dataset.poder, dataset.id_atributo, dataset.dificultad, objetivo)
}

}
