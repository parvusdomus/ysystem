export default class FichaObjetoYsystem extends ItemSheet{
  static get defaultOptions() {
    if (game.settings.get ("ysystem", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "item"],
      width: 320,
      height: 370,
      resizable: false
    });
  }
  get template(){
        if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
          return `systems/ysystem/templates/items/Negro/${this.item.data.type}.html`;
        }
        if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
          return `systems/ysystem/templates/items/Rojo/${this.item.data.type}.html`;
        }
        if (game.settings.get ("ysystem", "aspectoFicha") == "Medieval"){
          return `systems/ysystem/templates/items/Medieval/${this.item.data.type}.html`;
        }
      }
}
