export default class FichaPNJYsystem extends ActorSheet{

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["Ysystem", "sheet", "actor", "PNJ"],
      template: "systems/ysystem/templates/actors/PNJ.html",
      width: 800,
      height: 470,
      resizable: false
    });
  }

  getData() {
        const data = super.getData().data;
        data.dtypes = ["String", "Number", "Boolean"];
        if (this.actor.data.type == 'PNJ' ) {

        }
        return data;
      }

      activateListeners(html) {
              super.activateListeners(html);

              // Si la hoja no es editable me salgo
              if (!this.options.editable) return;

              //AQUI IRIAN LOS LISTENERS DE LAS TIRADAS

      }

}
