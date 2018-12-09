import {Item} from "./Item";

export class Group {
  private _items: Item[] = [];

  constructor(private _id: string) {
  }

  public getId(): string {
    return this._id;
  }

  public pushItem(item: Item): void {
    this._items.push(item);
  }

  public getItems(): Item[] {
    return this._items;
  }
}