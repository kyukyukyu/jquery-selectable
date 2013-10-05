/*
 *  Project: jQuery selecTable
 *  Description: A jQuery plugin that makes <table> elements selectable just 
 *               like tables of spreadsheets
 *  Author: Sanggyu Nam <pokeplus@gmail.com>
 *  License: MIT License
 */

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variables rather than globals
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).
  
  // typeof strings
  var STR = 'string', NUM = 'number';

  // mouse button codes
  var MOUSE_LEFT = 1, MOUSE_MIDDLE = 2, MOUSE_RIGHT = 3;

  // keycodes
  var KEY_SHIFT = 16,
      KEY_LARROW = 37, KEY_UARROW = 38, KEY_RARROW = 39, KEY_DARROW = 40;

  // data attribute names
  var DATA_CELL = 'cell';

  // CSS class names
  var CLASS_SELECTABLE = 'selecTable',
      CLASS_SELECTED = 'selected',
      CLASS_CURSORED = 'cursored';

  // Create the defaults once
  var pluginName = 'selecTable',
      document = window.document,
      defaults = {};

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or 
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.clearSelectedCells = function () {
    $(this.selectedCells).removeClass(CLASS_SELECTED);
    this.selectedCells = [];
  };

  Plugin.prototype.updateSelectedCells = function () {
    this.clearSelectedCells();

    var $cellA = this.$cellA, $cellB = this.$cellB;
    var arrA = $cellA.data(DATA_CELL).split(','),
        arrB = $cellB.data(DATA_CELL).split(',');
    var rowA = arrA[0], rowB = arrB[0];
    var colA = arrA[1], colB = arrB[1];
    var rowMin, rowMax, colMin, colMax;

    if (rowA > rowB) {
      rowMin = rowB;
      rowMax = rowA;
    } else {
      rowMin = rowA;
      rowMax = rowB;
    }

    if (colA > colB) {
      colMin = colB;
      colMax = colA;
    } else {
      colMin = colA;
      colMax = colB;
    }

    for (var r = rowMin; r <= rowMax; ++r) {
      var $row = $(this.$rows[r]);
      var $cells = $row.find('td');

      for (var c = colMin; c <= colMax; ++c) {
        //this.selectedCells.push(r + ',' + c);
        var cell = $cells[c];
        this.selectedCells.push(cell);

        $(cell).addClass(CLASS_SELECTED);
      }
    }

    $(this.element).trigger(
        'selectionupdate',
        [$.extend([], this.selectedCells)]);
  };

  var selecTableAttributeName = 'plugin_' + pluginName;
  var selecTableSelector = 'table';

  var findSelecTableObjFromCell = function (domObj) {
    var selecTableObj;

    $(domObj).parents(selecTableSelector)
    .each(function () {
      var data = $(this).data(selecTableAttributeName);

      if (data) {
        selecTableObj = data;
        return false;
      }
    });

    return selecTableObj;
  };

  Plugin.prototype.set$cellB = function ($newCellB) {
    this.$cellB.removeClass(CLASS_CURSORED);
    this.$cellB = $newCellB;
    this.$cellB.addClass(CLASS_CURSORED);
  };

  Plugin.prototype.mousedown = function (e) {
    if (e.which !== MOUSE_LEFT) {
      return true;
    }

    var selecTableObj = findSelecTableObjFromCell(this);

    if (!selecTableObj.isShiftDown) {
      selecTableObj.$cellA = $(e.target);
    } else {
      selecTableObj.selectedCells = [];
    }

    selecTableObj.isMouseDown = true;
  };

  Plugin.prototype.mouseenter = function (e) {
    var target = this;
    setTimeout(function () {
      var selecTableObj = findSelecTableObjFromCell(target);

      if (!selecTableObj.isMouseDown) {
        return true;
      }

      selecTableObj.set$cellB($(e.target));
      selecTableObj.updateSelectedCells();
    }, 0);
  };

  Plugin.prototype.mouseup = function (e) {
    if (e.which !== MOUSE_LEFT) {
      return true;
    }
    
    var selecTableObj = findSelecTableObjFromCell(this);
    selecTableObj.isMouseDown = false;
    selecTableObj.set$cellB($(e.target));
    selecTableObj.updateSelectedCells();
  };

  Plugin.prototype.keydown = function (e) {
    var selecTableObj = $(this).data(selecTableAttributeName);

    var which = e.which;
    var $cellB = selecTableObj.$cellB;
    var arrB = $cellB.data(DATA_CELL).split(',');
    var r = parseInt(arrB[0], 10), c = parseInt(arrB[1], 10);
    var newR, newC;

    if (which === KEY_SHIFT) {
      selecTableObj.isShiftDown = true;
    } else {
      switch (which) {
      case KEY_LARROW:
        newR = r;
        newC = c - 1;
        newC = newC >= 0 ? newC : 0;
        break;

      case KEY_RARROW:
        newR = r;
        newC = c + 1;
        newC = newC < selecTableObj.numOfCols ?
                   newC : selecTableObj.numOfCols - 1;
        break;

      case KEY_UARROW:
        newR = r - 1;
        newR = newR >= 0 ? newR : 0;
        newC = c;
        break;

      case KEY_DARROW:
        newR = r + 1;
        newR = newR < selecTableObj.numOfRows ?
                   newR : selecTableObj.numOfRows - 1;
        newC = c;
        break;
      }

      var $newRow = $(selecTableObj.$rows[newR]);
      var $newCellB = $($newRow.find('td')[newC]);

      if (!selecTableObj.isShiftDown) {
        selecTableObj.$cellA = $newCellB;
      }

      selecTableObj.set$cellB($newCellB);
      selecTableObj.updateSelectedCells();
    }
  };

  Plugin.prototype.keyup = function (e) {
    var selecTableObj = $(this).data(selecTableAttributeName);

    if (e.which === KEY_SHIFT) {
      selecTableObj.isShiftDown = false;
    }
  };

  var setCellDataForTable = function (tableObj) {
    var $rows = $(tableObj).find('tr');

    $rows.each(function (r) {
      var $cells = $(this).find('td');
      $cells.each(function (c) {
        $(this).data(DATA_CELL, r + ',' + c);
      });
    });
  };

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and the options via the instance, 
    // e.g., this.element and this.options
    
    var $elem = $(this.element);
    var $rows = $elem.find('tr');
    var $cells = $elem.find('td');

    this.numOfRows = $rows.length;
    this.numOfCols = $($rows[0]).find('td').length;

    this.$rows = $rows;

    setCellDataForTable(this.element);

    this.$cellA = $();
    this.$cellB = $();

    this.isMouseDown = false;
    this.isShiftDown = false;

    this.selectedCells = [];

    $cells
    .mousedown(this.mousedown)
    .mouseenter(this.mouseenter)
    .mouseup(this.mouseup);

    $elem
    .keydown(this.keydown)
    .keyup(this.keyup);

    // disable selection
    // original source: http://stackoverflow.com/a/5859238/1407838
    $elem
    .attr('unselectable','on')
    .css({
      '-moz-user-select': 'none',
      '-o-user-select': 'none',
      '-khtml-user-select': 'none', /* you could also put this in a class */
      '-webkit-user-select': 'none',/* and add the CSS class here instead */
      '-ms-user-select': 'none',
      'user-select': 'none'
     }).bind('selectstart', function () { return false; });

    $elem.addClass(CLASS_SELECTABLE);
  };

  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  };

}(jQuery, window));