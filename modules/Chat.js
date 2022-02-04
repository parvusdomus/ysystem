export default class YsystemChat {
  static chatListeners (html) {
    html.on('click', '.repite_habilidad_proeza', this._onrepite_habilidad_proeza.bind(this));
  }

  static _onrepite_habilidad_proeza (event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    console.log ("REPITE HABILIDAD PROEZA")
    console.log (dataset)

  }
}
