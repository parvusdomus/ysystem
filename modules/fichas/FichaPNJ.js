import {TiradaHabilidadPNJ} from "../tiradas/tirada_habilidadPNJ.js";
import {TiradaAtaquePNJ} from "../tiradas/tirada_ataquePNJ.js";
import {TiradaHechizoPNJ} from "../tiradas/tirada_hechizoPNJ.js";

export default class FichaPNJYsystem extends ActorSheet{

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "actor", "PNJ"],
      template: "systems/ysystem/templates/actors/PNJ.html",
      width: 800,
      height: 470,
      resizable: false,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }]
    });
  }

  getData() {
        const data = super.getData().data;
        data.dtypes = ["String", "Number", "Boolean"];
        if (this.actor.data.type == 'PNJ' ) {
          console.log ("ACTOR")
          console.log (this.actor)
          this._prepareCharacterItems(data);
          this._calculaValores(data);

        }
        return data;
      }

      _calculaValores(actorData) {
    const data = actorData;
    console.log (data)
    const Agilidad =Number(data.data.Destreza)+Number(data.data.Habilidades.Atletismo.Valor)*3;
    const Aplomo =5+Number(data.data.Carisma)+Number(data.data.Inteligencia);
    const Perspicacia=5+Number(data.data.Percepción)+Number(data.data.Inteligencia);
    const Iniciativa=Number(data.data.Destreza)+Number(data.data.Inteligencia);
    const Salud=13+Number(data.data.Fuerza)*2;
    const R_Física=12-Number(data.data.Fuerza);

    const Poder=5+Number(data.data.Percepción)+Number(data.data.Inteligencia)+Number(data.data.Magia.Valor)*3;

    let Protección_Daño=0;
    let Protección_Penalización=0;
    let Protección_Agilidad=0;
    let Armadura = data.Armaduras.find((k) => k.type === "Armadura" && k.data.Equipado=="true");
    if (Armadura){
      Protección_Daño=Armadura.data.Nivel;
      Protección_Penalización+=Armadura.data.Penalizador;
    }
    let Escudo = data.Escudos.find((k) => k.type === "Escudo" && k.data.Equipado=="true");
    if (Escudo){
      Protección_Agilidad=Escudo.data.Nivel;
      Protección_Penalización+=Escudo.data.Penalizador;
    }

    //ACTUALIZO TODOS LOS VALORES
    this.actor.update ({ 'data.Agilidad.Valor': Agilidad });
    this.actor.update ({ 'data.Aplomo.Valor': Aplomo });
    this.actor.update ({ 'data.Perspicacia.Valor': Perspicacia });
    this.actor.update ({ 'data.Iniciativa': Iniciativa });
    this.actor.update ({ 'data.Salud.max': Salud });
    this.actor.update ({ 'data.Resistencia_Física': R_Física });
    this.actor.update ({ 'data.Protección_Daño': Protección_Daño });
    this.actor.update ({ 'data.Protección_Agilidad': Protección_Agilidad });
    this.actor.update ({ 'data.Protección_Penalización': Protección_Penalización });
    this.actor.update ({ 'data.Poder.max': Poder });

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
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'Arma') {
        if (i.data.Habilidad=="Lucha"){i.data.Ataque=actorData.data.Habilidades.Lucha.Valor+"D6+"+actorData.data.Destreza}
        if (i.data.Habilidad=="Puntería"){i.data.Ataque=actorData.data.Habilidades.Puntería.Valor+"D6+"+actorData.data.Percepción}
        if (i.data.Bono=="FUE_2"){i.data.Daño_Total=Number(i.data.Daño)+Math.floor(Number(actorData.data.Fuerza)/2)}
        if (i.data.Bono=="FUE"){i.data.Daño_Total=Number(i.data.Daño)+Number(actorData.data.Fuerza)}
        if (i.data.Bono=="PER"){i.data.Daño_Total=Number(i.data.Daño)+Number(actorData.data.Percepción)}
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
              //Equipar y desequipar
              html.find('.item-equip').click(ev => {
                const li = $(ev.currentTarget).parents(".item");
                const objeto_a_equipar = this.actor.items.get(li.data("itemId"));
                if (objeto_a_equipar.data.data.Equipado =="false"){
                  objeto_a_equipar.update ({ 'data.Equipado': "true" });
                } else {
                  objeto_a_equipar.update ({ 'data.Equipado': "false" });
                }

                this.render(false);
              });
              // Modificar valor de habilidades
              html.find('.mod_habilidad').click(ev => {
                const element = ev.currentTarget;
                const dataset = element.dataset;
                const habilidad_id=dataset.habilidad_id
                const update = {};
                update.data = {};
                var valor_actual=Number(this.actor.data.data.Habilidades[habilidad_id].Valor)
                var valor_nuevo=valor_actual+1
                if (valor_nuevo>=4){valor_nuevo=1}
                const habilidad='data.Habilidades.'+habilidad_id+'.Valor'
                update[habilidad] = valor_nuevo;
                update.id = this.actor.id;
                this.actor.update(update, {diff: true});
              });

              html.find('.item-delete').click(ev => {
                const li = $(ev.currentTarget).parents(".item");
                const objeto_a_borrar = this.actor.items.get(li.data("itemId"));
                objeto_a_borrar.delete();
                this.render(false);
                li.slideUp(200, () => this.render(false));
              });

              html.find('.mod_magia').click(ev => {
                const element = ev.currentTarget;
                const dataset = element.dataset;
                const habilidad_id=dataset.habilidad_id
                const update = {};
                update.data = {};
                var valor_actual=Number(this.actor.data.data.Magia.Valor)
                var valor_nuevo=valor_actual+1
                if (valor_nuevo>=4){valor_nuevo=1}
                const habilidad='data.Magia.Valor'
                update[habilidad] = valor_nuevo;
                update.id = this.actor.id;
                this.actor.update(update, {diff: true});
              });

              html.find('.restaura_salud').contextmenu(ev => {
                const element = ev.currentTarget;
                this.actor.update ({ 'data.Salud.value': this.actor.data.data.Salud.max });
              });

              html.find('.restaura_poder').contextmenu(ev => {
                const element = ev.currentTarget;
                this.actor.update ({ 'data.Poder.value': this.actor.data.data.Poder.max });
              });

              //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS
              html.find('.tirada_habilidad').click(this._onTiradaHabilidad.bind(this));
              html.find('.tirada_ataque_arma').click(this._onTiradaAtaque.bind(this));
              html.find('.tirada_hechizo').click(this._onTiradaHechizo.bind(this));
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
        let objetivo = Array.from(game.user.targets)[0];
        TiradaHabilidadPNJ (this.actor, dataset.habilidad_id, objetivo)
      }

      async _onTiradaAtaque(event) {
        console.log ("TIRADA ATAQUE PNJ")
        const element = event.currentTarget;
        const dataset = element.dataset;
        let objetivo = Array.from(game.user.targets)[0];
        TiradaAtaquePNJ (this.actor, dataset.arma, dataset.habilidad_id, dataset.daño, objetivo)
      }

      async _onTiradaHechizo(event) {
        console.log("ON TIRADA HECHIZO PNJ")
        const element = event.currentTarget;
        const dataset = element.dataset;
        let objetivo = Array.from(game.user.targets)[0];
        console.log ("DATASE")
        console.log (dataset)
        TiradaHechizoPNJ (this.actor, dataset.poder, dataset.id_atributo, dataset.dificultad, objetivo)
      }

}
