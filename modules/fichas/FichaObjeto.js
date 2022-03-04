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
          return `systems/ysystem/templates/items/${this.item.data.type}.html`;
      }
}
