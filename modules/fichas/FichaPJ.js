export default class FichaYsystem extends ActorSheet{
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "actor"],
      template: "systems/ysystem/templates/actors/Jugador.html",
      width: 800,
      height: 700,
      resizable: false,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "habilidades" }]
    });
  }
  getData() {
      const data = super.getData().data;
      data.dtypes = ["String", "Number", "Boolean"];
      if (this.actor.data.type == 'Jugador') {
        this._prepareCharacterItems(data);
        //this._calculaValores(data);
        console.log ("ACTOR")
        console.log (this.actor)
      }
      return data;
    }


    _prepareCharacterItems(sheetData) {
    const actorData = sheetData;

    // Inicializo arrays para meter los objetos por tipo.
    //"arma", "armadura", "aspecto", "don", "habilidad", "limitacion", "maniobra", "objeto", "talento"
     const Armas = [];
     const Armaduras = [];
     const Escudos = [];
     const Hechizos = [];
     const Objetos = [];
     const Talentos = [];
     // Ordena los objetos por tipo y los mete en el array correspondiente
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'Arma') {
        Armas.push(i);
      }
      else if (i.type === 'Armadura') {
        Armaduras.push(i);
      }
       else if (i.type === "Escudo") {
         Escudos.push(i);
       }
       else if (i.type === "Hechizo") {
         Hechizos.push(i);
       }
       else if (i.type === "Objeto") {
         Objetos.push(i);
       }
       else if (i.type === "Talento") {
         Talentos.push(i);
       }
    }
    //Asigno cada array al actordata
actorData.Armas = Armas;
actorData.Armaduras = Armaduras;
actorData.Escudos = Escudos;
actorData.Hechizos = Hechizos;
actorData.Objetos = Objetos;
actorData.Talentos = Talentos;
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
          if (objeto_a_equipar.data.data.Equipado =="false"){
            objeto_a_equipar.update ({ 'data.Equipado': "true" });
          } else {
            objeto_a_equipar.update ({ 'data.Equipado': "false" });
          }

          this.render(false);
        });

        //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS

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


}
