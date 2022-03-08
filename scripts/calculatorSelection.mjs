import {getItemList, getItemDetails, sortSettings, generateSummary} from './itemManagement.mjs';

var RecipeCalculator = function(){
  var summary = {};
  var selectedItems = [];
  var calculateSummary = document.getElementById('calculate-summary');
  var itemSelection = document.getElementById('item-selection-main');
  
  function buildItemList(){
    var items = getItemList('', sortSettings.label);
    if (items.length === 0){
      for (var i=0; i<5; i++){
        items.push({Id: i, Label: 'Test item ' + i});
      }
    }
    return items.reduce((prevValue, item) => {return prevValue += `<option value=${item.Id}>${item.Label}</option>`}, '<option value=0>-Select an item-</option>');
  }
  const optionsText = buildItemList();

  function buildAddItemButton(){
    var nodeTemplate = document.createElement('a');
    nodeTemplate.setAttribute('onclick', 'addItem()');
    nodeTemplate.setAttribute('class', 'ico');
    nodeTemplate.setAttribute('additem', '');
    nodeTemplate.innerHTML = '&#xE109';
    return nodeTemplate;
  }

  function buildItemRow(){
    var nodeTemplate = document.createElement('div');
    nodeTemplate.setAttribute('itemselect', '');
    nodeTemplate.innerHTML = `<select required onchange='recipeCalculator.selectItem(this)' class='item-select'>${optionsText}</select>`;
    nodeTemplate.innerHTML += `<input type='number' placeholder='Total level multiplier' value='1' class='item-multiply' onfocusout='recipeCalculator.selectItem(this, true)' min=1 />`;
    nodeTemplate.innerHTML += `<a onclick='recipeCalculator.removeItem(this)' class='ico' removeitem>&#xE108</a><a onclick='recipeCalculator.addItem()' class='ico' additem>&#xE109</a>`;
    nodeTemplate.innerHTML += `<div itemid=0 mult=0 class='item-quick-rate'>Rate: N/A<br/>Building: N/A</div>`; 
    return nodeTemplate;
  }
  
  function checkItemValid(item){
    return item.itemId !== 0 && item.multiplier >= 1;
  }

  this.selectItem = function(select, isMultiplier=false){
    var itemDiv = select.closest('[itemselect]');
    var item = itemDiv.selectedItem;
    var preview = itemDiv.querySelector('.item-quick-rate');
    

    if (isMultiplier){
      if (select.valueAsNumber < 1)
         select.value = 1;
      select.value = Math.ceil(select.valueAsNumber/0.5) * 0.5;
      item.multiplier = select.valueAsNumber;
    }
    else
      item.itemId = parseInt(select.value);

    if (item.itemId === 0){
      preview.innerHTML = `Rate: N/A<br/>Building: N/A`
      calculateSummary.setAttribute('disabled', '');
    }
    else{
      var itemDetail = getItemDetails(item.itemId);
      preview.innerHTML = `Rate: ${(itemDetail.Base * item.multiplier).toFixed(2)} / min<br/>Building: ${itemDetail.Building}`
      if (!selectedItems.every(checkItemValid))
        calculateSummary.removeAttribute('disabled');
    }
  };
  
  this.addItem = function(){
    var newNode = buildItemRow();
    newNode.selectedItem = {itemId: 0, multiplier: 1};
    document.querySelectorAll('[additem]').forEach(node => {node.remove()});

    selectedItems.push(newNode.selectedItem);
    itemSelection.appendChild(newNode);
    calculateSummary.setAttribute('disabled');
  };
  
  this.removeItem = function(button){
    var itemDiv = button.closest('[itemselect]');
    selectedItems.splice(selectedItems.indexOf(itemDiv.selectedItem), 1);

    if (!itemDiv.nextElementSibling)
      itemDiv.previousElementSibling.appendChild(buildAddItemButton());
    itemDiv.remove()
  };
  
  this.calculateSummary = function(){
    if (!selectedItems.every(checkItemValid))
      return;
    summary = generateSummary(selectedItems);
    console.log(calc.summary);
  };
  
  addItem();
  return this;
}

document.addEventListener('DOMContentLoaded', function(){
  window.recipeCalculator = new RecipeCalculator();
});
