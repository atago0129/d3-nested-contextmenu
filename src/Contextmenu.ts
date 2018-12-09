import {Group} from "./Group";
import {Item} from "./Item";
import {IItem} from "./interface/IItem";
import {ItemStyle} from "./ItemStyle";
import {ContextmenuStyle} from "./ContextmenuStyle";
import {style} from "d3-selection";

export default class Contextmenu {

  private _style: ContextmenuStyle;

  private _rootGroup: Group;

  constructor(dataSets: {items: IItem[], style: IContextmenuStyle}|IItem[], private _d3Data: any, private _d3Index: number, private _eventTarget: EventTarget) {
    if (dataSets.hasOwnProperty('items') && dataSets.hasOwnProperty('style')) {
      this._rootGroup = this.parse(dataSets['items'], 0, 0);
      const style: IContextmenuStyle = dataSets['style'];
      this._style = new ContextmenuStyle();
      if (style.labelMargin) {
        this._style.labelMargin = style.labelMargin;
      }
      if (style.borderColor) {
        this._style.borderColor = style.borderColor;
      }
      if (style.borderStrokeWidth) {
        this._style.borderStrokeWidth = style.borderStrokeWidth;
      }
      if (style.drawMargin) {
        this._style.drawMargin = style.drawMargin;
      }
    } else if (Array.isArray(dataSets)) {
      this._rootGroup = this.parse(dataSets, 0, 0);
      this._style = new ContextmenuStyle();
    }
  }

  /**
   * @param {(IItem[]) | ((args: any) => IItem[])} itemDataList
   * @param {number} groupIdNum
   * @param {number} itemIdNum
   * @returns {Group}
   */
  private parse(itemDataList: IItem[]|((args: any) => IItem[]), groupIdNum: number, itemIdNum: number): Group {
    groupIdNum++;
    const group: Group = new Group(['d3-nested-contextmenu', itemIdNum, groupIdNum].join('-'));
    if (typeof itemDataList === 'function') {
      itemDataList = itemDataList.bind(this._d3Data, this._d3Index)();
    }
    if (!Array.isArray(itemDataList)) {
      throw new Error('parse error.');
    }
    itemDataList.map((itemData: IItem) => {
      itemIdNum++;
      let childGroup: Group|null = null;
      if (itemData.items !== undefined) {
        childGroup = this.parse(itemData.items, groupIdNum, itemIdNum);
      }
      let itemStyle: ItemStyle;
      if (itemData.style === undefined) {
        itemStyle = new ItemStyle(11);
      } else {
        itemStyle = new ItemStyle(itemData.style.fontSize);
      }
      const item: Item = new Item(
        ['d3-nested-contextmenu', groupIdNum, itemIdNum].join('-'),
        itemData.label,
        itemData.action ? itemData.action : null,
        childGroup,
        itemStyle
      );
      group.pushItem(item);
    });
    return group;
  }

  get style(): ContextmenuStyle {
    return this._style;
  }

  get rootGroup(): Group {
    return this._rootGroup;
  }

  get d3Data(): any {
    return this._d3Data;
  }

  get d3Index(): number {
    return this._d3Index;
  }

  get eventTarget(): EventTarget {
    return this._eventTarget;
  }
}