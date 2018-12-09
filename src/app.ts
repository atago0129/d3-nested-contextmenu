import * as d3 from "d3";
import Contextmenu from "./Contextmenu";
import {IItem} from "./interface/IItem";
import {Canvas} from "./Canvas";

export default function(items: IItem[]) {
  return function (d: any, i: number) {
    const mouseEvent: MouseEvent = d3.event;
    mouseEvent.preventDefault();
    const contextmenu: Contextmenu = new Contextmenu(items, d, i, mouseEvent.target);
    const canvas: Canvas = new Canvas(contextmenu);
    canvas.showMenu(mouseEvent.pageX, mouseEvent.pageY);
  }
}
