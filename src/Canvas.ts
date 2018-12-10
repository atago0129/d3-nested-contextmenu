import * as d3 from 'd3';
import Contextmenu from './Contextmenu';
import {Item} from './Item';
import {Group} from "./Group";
import {Selection} from "d3-selection";

export class Canvas {

  constructor(private _contextmenu: Contextmenu){
  }

  public showMenu(x: number, y: number) {
    d3.selectAll('.d3-nested-contextmenu').remove();
    this.render(x, y, this._contextmenu.rootGroup);
  }

  private render(x: number, y: number, group: Group) {
    const items: Item[] = group.getItems();
    const labelSizes: {widths: number[]; heights: number[]} = this.calculateLabelSizes(items);
    const menuWidth: number = d3.max(labelSizes.widths);
    const menuHeight: number = labelSizes.heights.reduce((sum: number, height: number) => (sum + height));

    const menuContainerGroup: d3.Selection<SVGGElement, {}, HTMLElement, any> = this.generateMenuContainerGroup(x, y, group, menuWidth, menuHeight);
    const contextmenuItems: d3.Selection<d3.BaseType, {}, d3.BaseType, {}> = this.generateContextmenuItems(menuContainerGroup, items, labelSizes, menuWidth);
    this.bindMouseEventToItems(contextmenuItems, x, y, group);
  }

  private calculateLabelSizes(items: Item[]) {
    const g = d3.select('body').append('svg').attr('class', 'd3-nested-contextmenu-dummy').append('g');
    const dummyContextmenu = g.selectAll('rect').data(items);
    const dummyContextmenuItems = dummyContextmenu.enter().append('svg');
    dummyContextmenuItems.append('text')
      .text((item: Item) => (item.getLabel(this._contextmenu.d3Data, this._contextmenu.d3Index, this._contextmenu.eventTarget) + (item.childGroup !== null ?  '>' : '')))
      .style('font-size', (item: Item) => (item.style.getFontSize()))
      .attr('class', 'd3-nested-contextmenu-dummy-text');
    const dtext = d3.selectAll('.d3-nested-contextmenu-dummy-text');
    const size: {widths: number[]; heights: number[]} = {
      widths: dtext.nodes().map((node: SVGGraphicsElement) => (node.getBBox().width + this._contextmenu.style.labelMargin)),
      heights: dtext.nodes().map((node: SVGGraphicsElement) => (node.getBBox().height+ this._contextmenu.style.labelMargin))
    };
    d3.selectAll('.d3-nested-contextmenu-dummy').remove();
    return size;
  }

  private generateMenuContainerGroup(x:number, y:number, group:Group, menuWidth: number, menuHeight: number): d3.Selection<SVGGElement, {}, HTMLElement, any> {
    const menuContainer = d3.select('body').append('div')
      .style('width', String(menuWidth) + 'px')
      .style('height', String(menuHeight) + 'px')
      .style('left', String(x) + 'px')
      .style('top', String(y) + 'px')
      .style('position', 'absolute')
      .attr('class', 'd3-nested-contextmenu')
      .attr('id', group.getId());
    return menuContainer.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', 0)
      .attr('y', 0)
      .append('g');
  }

  /**
   *
   * @param {d3.Selection<SVGGElement, {}, HTMLElement, *>} menuContainerGroup
   * @param {Item[]} items
   * @param {{}} labelSizes
   * @param {number} menuWidth
   * @returns {d3.Selection<BaseType, {}, BaseType, {}>}
   */
  private generateContextmenuItems(menuContainerGroup: d3.Selection<SVGGElement, {}, HTMLElement, any>, items: Item[], labelSizes: {widths: number[]; heights: number[]}, menuWidth: number): d3.Selection<d3.BaseType, {}, d3.BaseType, {}> {
    const contextmenu: d3.Selection<d3.BaseType, {}, d3.BaseType, {}> = menuContainerGroup.selectAll('rect').data(items);
    const contextmenuItems: d3.Selection<d3.BaseType, {}, d3.BaseType, {}> = contextmenu.enter().append('svg')
      .attr('id', (item: Item) => (item.id))
      .attr('x', 0)
      .attr('y', (item, i) => (i * labelSizes.heights[i]))
      .attr('width', menuWidth)
      .attr('height', (item, i) => (labelSizes.heights[i]))
      .style('cursor', 'default');
    contextmenuItems.append('rect')
      .style('fill', (item: Item) => (item.style.fillColor))
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', '100%')
      .attr('height', '100%');
    contextmenuItems.append('text')
      .text((item: Item) => (item.getLabel(this._contextmenu.d3Data, this._contextmenu.d3Index, this._contextmenu.eventTarget)))
      .attr('class', 'item-label')
      .style('fill', 'rgb(0, 0, 0')
      .style('font-size', 11)
      .attr('x', '5px')
      .attr('y', '50%');
    contextmenuItems.append('text')
      .text((item: Item) => (item.childGroup !== null ? '>' : null))
      .attr('x', '100%')
      .attr('y', '50%')
      .style("font-size", 11)
      .attr('transform', 'translate(-12, 0)');
    return contextmenuItems;
  }

  private bindMouseEventToItems(contextmenuItems: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>, x: number, y: number, group: Group) {
    contextmenuItems
      .on('click', (item: Item) => {
        item.doAction(this._contextmenu.d3Data, this._contextmenu.d3Index, this._contextmenu.eventTarget)
      })
      .on('mouseover', (item: Item, i: number, nodes: any[]) => {
        const mouseOverElement: d3.Selection<d3.BaseType, {}, d3.BaseType, {}> = d3.select(nodes[i]);
        mouseOverElement.select('rect').style('fill', 'rgb(200, 200, 200)');
        if (item.childGroup !== null) {
          if (!item.childGroupDisplayed) {
            item.childGroupDisplayed = true;
            this.renderChildGroup(x, y, mouseOverElement, item.childGroup);
            this.removeAnotherChildren(group, item);
          }
        }
      })
      .on('mouseout', (item: Item, i: number, nodes: any[]) => {
        const mouseOutElement: d3.Selection<d3.BaseType, {}, d3.BaseType, {}> = d3.select(nodes[i]);
        mouseOutElement.select('rect').style('fill', 'rgb(250, 250, 250)');
      });
  }

  private renderChildGroup(x: number, y: number, mouseOverElement: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>, group: Group) {
    this.render(
      x + Number(mouseOverElement.attr('x')) + Number(mouseOverElement.attr('width')) - this._contextmenu.style.drawMargin * 3,
      y + Number(mouseOverElement.attr('y')) + this._contextmenu.style.drawMargin,
      group);
  }

  private removeAnotherChildren(parentGroup: Group, onMouseItem: Item) {
    parentGroup.getItems().map((item) => {
      console.log(item.id, item.childGroup.getId());
      if (item === onMouseItem) {
        return;
      }
      if (item.childGroup === null) {
        return;
      }
      item.childGroupDisplayed = false;
      d3.select('#' + item.childGroup.getId()).remove();
    });
  }
}