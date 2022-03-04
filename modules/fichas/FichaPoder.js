export default class FichaPoderYsystem extends ItemSheet{
  static get defaultOptions() {
    if (game.settings.get ("ysystem", "forceFontSize")){
      game.settings.set("core","fontSize", "5");
    }
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "item"],
      width: 620,
      height: 420,
      resizable: false
    });
  }
  get template(){
          if (game.settings.get ("ysystem", "aspectoFicha") == "Negro"){
            return `systems/ysystem/templates/items/Negro/Poder.html`;
          }
          if (game.settings.get ("ysystem", "aspectoFicha") == "Rojo"){
            return `systems/ysystem/templates/items/Rojo/Poder.html`;
          }
      }
}
