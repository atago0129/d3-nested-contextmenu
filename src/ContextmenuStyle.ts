export class ContextmenuStyle {
  private _labelMargin = 12;

  private _borderColor = 'rgb(140, 140, 140)';

  private _borderStrokeWidth = '0.2px';

  private _drawMargin = 1;

  get labelMargin(): number {
    return this._labelMargin;
  }

  set labelMargin(value: number) {
    this._labelMargin = value;
  }

  get borderColor(): string {
    return this._borderColor;
  }

  set borderColor(value: string) {
    this._borderColor = value;
  }

  get borderStrokeWidth(): string {
    return this._borderStrokeWidth;
  }

  set borderStrokeWidth(value: string) {
    this._borderStrokeWidth = value;
  }

  get drawMargin(): number {
    return this._drawMargin;
  }

  set drawMargin(value: number) {
    this._drawMargin = value;
  }
}