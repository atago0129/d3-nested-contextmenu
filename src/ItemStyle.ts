export class ItemStyle {
  private _fontSize = 11;
  
  private _fillColor = 'rgb(250, 250, 250)';
  
  private _onMouseFillColor = 'rgb(200, 200, 200)';
  
  constructor(fontSize: number|null, fillColor: string|null, onMouseFillColor: string|null){
    if (fontSize !== null) {
      this._fontSize = fontSize;
    }
    if (fillColor !== null) {
      this._fillColor = fillColor;
    }
    if (onMouseFillColor !== null) {
      this._onMouseFillColor = onMouseFillColor;
    }
  }
  
  get fontSize(): number {
    return this._fontSize;
  }
  
  get fillColor(): string {
    return this._fillColor;
  }
  
  get onMouseFillColor(): string {
    return this._onMouseFillColor;
  }
}