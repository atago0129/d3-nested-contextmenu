import {Group} from "./Group";
import {ItemStyle} from "./ItemStyle";

export class Item {

  private _childGroupDisplayed: boolean = false;

  /**
   *
   * @param {string} _id
   * @param {(string) | ((args: any) => any)} _label
   * @param {((args: any) => any) | null} _action
   * @param {Group | null} _childGroup
   * @param {ItemStyle} _style
   */
  constructor(private _id: string, private _label: string|((args:any) => any), private _action: ((args:any) => any)|null, private _childGroup: Group|null, private _style: ItemStyle) {
  };

  public getLabel(d: number, i: number, target: EventTarget): string {
    if (typeof this._label === 'function') {
      return String(this._label.bind(target, d, i)());
    } else {
      return String(this._label);
    }
  }

  public doAction(d: number, i: number, target: EventTarget): void {
    if (this._action !== null) {
      this._action.bind(target, d, i)();
    }
  }

  get id(): string {
    return this._id;
  }

  get childGroupDisplayed(): boolean {
    return this._childGroupDisplayed;
  }

  set childGroupDisplayed(value: boolean) {
    this._childGroupDisplayed = value;
  }

  get childGroup(): Group | null {
    return this._childGroup;
  }

  get style(): ItemStyle {
    return this._style;
  }

}