import {IItemStyle} from "./IItemStyle";

export interface IItem {
  label: string|((args:any) => any),
  action?: (args:any) => any,
  style?: IItemStyle,
  items?: IItem[]|((args: any) => any)
}