jQuery selecTable Plugin
========================

A simple jQuery plugin that makes table elements selectable with mouse or 
keyboard, just like tables of spreadsheet softwares.

## Features

* No dependent to other libraries except jQuery>=1.2.3.
* The cells of `<table>` elements can be selected by clicking them, 
click-and-dragging over them, or Shift-clicking them. (Ctrl-clicking is not 
supported at the moment.)
* The cells of `<table>` elements can be selected by pressing arrow keys with 
or without Shift key, after clicking one of the cells.

## Requirements

The element to be applied this plugin should be a `<table>` element which has
no `colspan`ed or `rowspan`ed cells. That means that every row (`<tr>` 
element) in the table should have a same number of cells(`<td>` elements). 
Also, *the element should have `tabindex` attribute* so that the `<table>` 
element can be focused and emit `keydown` and `keyup` events, which are needed
to implement keyboard-based selecting.

## How to Use

First, insert the source file after jQuery.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="dist/jquery.selectable.min.js"></script>
```

Second, call `.selecTable()` in your JS code.

```javascript
$('#selectable').selecTable();
```

As the plugin is applied, all the cells in the table have a data value of key 
`cell`. The value contains the row index and the column index of cell, in the
form of `row,col`. For example, the third cell of the second row has the 
value `1,2`. The indices are zero-based.

When the user selects the cells, an jQuery event named `selectionupdate` is
triggered with an argument which is a DOM objects array of the selected cells.
Following is an example that prints the data of `cell` key of selected cells.

```javascript
$('#selectable').on('selectionupdate', function (e, cells) {
  var cellsInfoStr = '';

  $(cells).each(function () {
    cellsInfoStr += $(this).data('cell') + ' ';
  });

  $('#cells-info').text(cellsInfoStr);
});
```

At the same time, all the selected cells (more specifically, 
`<td>` elements) have `.selected` class. The cursored cell (more 
specifically, `<td>` element) has also `.cursored` class. With these, you can 
style the selected cells and the cursored cell.

## How to Build

If you want to build your own jQuery selecTable, it would be better to use
[Grunt](http://gruntjs.com/), the JavaScript task runner. You can use [Grunt
command line interface](https://github.com/gruntjs/grunt-cli) to make use of
it. You can install it by running this command:

```
npm install -g grunt-cli
```

Run this command on your shell to get your own build.

```
grunt
```

Your own build will be available in `dist` directory.

An useful Grunt task is available to 'watch' the changes of source files
automatically, and run predefined Grunt tasks. Run this task by running
this command on your shell:

```
grunt watch
```

## License

The MIT License (MIT) Copyright (c) 2014 Sanggyu Nam.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contacts

Feel free to say anything about this plugin by sending an email to pokeplus@gmail.com.
