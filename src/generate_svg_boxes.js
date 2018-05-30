/**
 *	@author Axel Murat & Alexandre Mailliu
 *	@version 1.0
 * 	@date 24/04/2018
 *	@module generate_svg_boxes
 */
 
 // uncheck every checkbox on the page
 var checkboxes = document.getElementsByTagName('input');
 for (var i=0; i<checkboxes.length; i++)  {
 	if (checkboxes[i].type == 'checkbox')   {
 		checkboxes[i].checked = false;
 	}
 }

/** the default size of a notch
 *  @constant
 *  @type {int}
 *  @default
 */
 const NOTCH_SIZE_DEFAULT = 10;

/**
 * 	global value for the notch_size used by the algorithm
 * 	@type {int}
 */
 var NOTCH_SIZE = 10;

/**
 * 	global value for the length of the total box shape/scheme (svg) the user choosed
 * 	@type {int}
 */
 var BOX_SCHEME_LENGTH = 0;

/**
 * 	global value for the width of the total box shape/scheme (svg) the user choosed
 * 	@type {int}
 */
 var BOX_SCHEME_WIDTH = 0;
 
 /**
 * 	global value for the wooden thickness the user choosed
 * 	@type {int}
 */
 var THICKNESS = 0;

/**
 *	@class contains the functions needed to create the svg tag, to make it downloadable, to build it ( the idea is to set multiple path tag inside the g tag of the svg tag, all those path will be the side of your shape at the end ) 
 *	@exemple <svg> <g> <path d="m 10,10 20,20" ></path> </g> </svg>
 */
 var svg_builder = {

	/**
	 *	function that set the values of BOX_SCHEME_LENGTH and BOX_SCHEME_WIDTH for the algorithm
	 *	@param length the length size of the total box shape/scheme
	 *	@param width the width size of the total box shape/scheme
	 */
	 define_box_width_and_length(width, length) {
	 	BOX_SCHEME_WIDTH = width;
	 	BOX_SCHEME_LENGTH = length;
	 },

	/**
	 *	function that defines properly the width, height and the viewbox of the svg object depending on the type of box/parts the user choose. 
	 *	@param {int} the width of the svg object
	 *	@param {int} the height of the svg object
	 */
	 define_attributes_box: function (width, height) {
	 	var svg = document.getElementById("svg");
		svg.setAttribute("width",width + "");
		svg.setAttribute("height",height + "");
		var stringViewBox = -THICKNESS + " " + -THICKNESS + " " + ( width + (THICKNESS*2) ) + " " + ( height + (THICKNESS*2) ); 
		svg.setAttribute("viewBox",stringViewBox);
	},

	/**
	 *	encode the data from the svg tag into URI data, and then set those information directly to the a tag as "href".
	 *	then we use the magic function "click()" that simulate a human click on this tag, which open the download yes/no window.
	 */
	 generate_svg_file: function () {
		// we delete our second layout and make a copie for re-putting it after the download operation
		var svgLayer2 = document.getElementById("svgLayer2");
	 	var parentElement = svgLayer2.parentElement;
	 	var clone_svgLayer2 = svgLayer2.cloneNode(false);
	 	parentElement.removeChild(svgLayer2);
		// resizing correctly the viewbox of the svg tag
		svg_builder.define_attributes_box(BOX_SCHEME_WIDTH,BOX_SCHEME_LENGTH);
		// putting milimeters to download in the good scale
		var svg = document.getElementById("svg");
		var svg_width = svg.getAttribute("width");
		var svg_height = svg.getAttribute("height");
		svg.setAttribute("width", svg_width + "mm");
		svg.setAttribute("height", svg_height + "mm");
		var stringViewBox = "0 0 " + ( BOX_SCHEME_WIDTH ) + " " + ( BOX_SCHEME_LENGTH ); 
		svg.setAttribute("viewBox",stringViewBox);
		// Use XMLSerializer to convert the DOM to a string
		var s = new XMLSerializer();
		var d = document.getElementById("svg");
		var str = s.serializeToString(d); // the svg tag with its contents 
		// and then btoa can convert that to base64
		var encodedData = "data:image/svg+xml;base64," + window.btoa("<?xml version='1.0' encoding='UTF-8' standalone='no'?> " + str); 
		// we set the uri content
		document.getElementById("filesvg").setAttribute("href", encodedData);
		// we set the file name downloaded
		document.getElementById("filesvg").setAttribute("download", "thismustbethebest.svg");
		// our a tag is hidden, so we use the click function as we would click on it usualy
		document.getElementById("filesvg").click();
		// we re-put our second layout
	 	parentElement.appendChild(clone_svgLayer2);
		// removing milimeters to show the box on the website in the good scale
		svg.setAttribute("width", svg_width + "");
		svg.setAttribute("height", svg_height + "");
		// reseting the viewbox
		svg_builder.set_viewbox();
	},

	/** 
	 *	clear the g tag of the svg tag so that it will be up for new parameters/shapes to be drawn in.
	 *	@param layer {string} the id of the layer g tag you want to clear the components
	 */
	 clear_svg: function (layer){
	 	var svg = document.getElementById(layer);
	 	var parentElement = svg.parentElement;
	 	var emptySvg = svg.cloneNode(false);
	 	parentElement.removeChild(svg);
	 	parentElement.appendChild(emptySvg);
	 },

	/**
	 *	draws the wooden plate on the second layer "svgLayer2" id
	 */
	 draw_layer2: function () {
	 	svg_builder.clear_svg("svgLayer2");
		// to draw (in a second g layout) the wooden plate we use above the shape we want to cut inside.
		svg_builder.draw_rectangle(0.5,0.5,selectPlanche[indexSelection].width,selectPlanche[indexSelection].length,"svgLayer2","#0000ff");
	},
	
	/**
	 *	function that set the values width, height and the viewbox of the svg tag, using the biggest value among the wooden plate (width/length) and
	 *	the scheme you drawn (width/length). => it result in a good view of both of these items.
	 */
	 set_viewbox: function () {
	 	if( BOX_SCHEME_WIDTH > selectPlanche[indexSelection].width ) {
	 		if ( BOX_SCHEME_LENGTH > selectPlanche[indexSelection].length ) {
	 			svg_builder.define_attributes_box(BOX_SCHEME_WIDTH, BOX_SCHEME_LENGTH);
	 		} else {
	 			svg_builder.define_attributes_box(BOX_SCHEME_WIDTH, selectPlanche[indexSelection].length);
	 		}
	 	} else {
	 		if ( BOX_SCHEME_LENGTH > selectPlanche[indexSelection].length ) {
	 			svg_builder.define_attributes_box(selectPlanche[indexSelection].width, BOX_SCHEME_LENGTH);
	 		} else {
	 			svg_builder.define_attributes_box(selectPlanche[indexSelection].width, selectPlanche[indexSelection].length);
	 		}
	 	}
	 },

	/**
	 *	function called by a checkbox, it display or hide the second layout for our svg. This second layout represent the wooden plate the user is using.
	 *	@param {boolean} show if true the layer 2 will be display, else it wont.
	 */
	 show_layer2: function() {
	 	var layer = document.getElementById("svgLayer2");
		if (document.getElementById("formCheck-2").checked) { // we show
			svg_builder.set_viewbox();
			layer.setAttribute("opacity", "1");  
			svg_builder.draw_layer2();
		} else { // we hide
			svg_builder.define_attributes_box(BOX_SCHEME_WIDTH, BOX_SCHEME_LENGTH);
			layer.setAttribute("opacity", "0");  
		}
	},
	
	/** 
	 * 	draw the text parameter inside the svg tag at the (x,y) position
	 *	@param {int} positionX is the x (abscissa) position of the text
	 *	@param {int} positionY is the y (ordinate) position of the text
	 *	@param {string} text is the text you want to draw/write
	 *	@param {string} layer is the layer you want to use
	 */
	 draw_text: function (positionX, positionY, text, layer) {
	 	var svg = document.getElementById(layer);
	 	var newText = document.createElementNS(svg.namespaceURI,"text");  
	 	newText.setAttribute("x", positionX);  
	 	newText.setAttribute("y", positionY);  
	 	newText.setAttribute("stroke", "#0000ff");  
	 	var textNode = document.createTextNode(text);
	 	newText.appendChild(textNode);
	 	svg.appendChild(newText);
	 },

	/** 
	 * 	draw the rectangle inside the svg tag at the (x,y) : (positionX,positionY) position and for the size (sizeX,sizeY)
	 *	@param {int} positionX is the x (abscissa) position of the rectangle
	 *	@param {int} positionY is the y (ordinate) position of the rectangle
	 *	@param {int} sizeX is the x (abscissa) size of the rectangle
	 *	@param {int} sizeY is the y (ordinate) size of the rectanglewrite
	 *	@param {string} layer is the layer you want to use
	 *	@param {string} color is the color you want to use
	 */
	draw_rectangle: function (positionX, positionY, sizeX, sizeY, layer, color) {
		var svg = document.getElementById(layer);
		var newRect = document.createElementNS(svg.namespaceURI,"rect");  
		newRect.setAttribute("x", positionX);  
		newRect.setAttribute("y", positionY); 
		newRect.setAttribute("width", sizeX);  
		newRect.setAttribute("height", sizeY);   
		newRect.setAttribute("stroke", color);  
		svg.appendChild(newRect);
	},

	/**
	 * 	function that draws a line of rectangle separated by space, using the same algo technic that the function draw_side(),
	 *	the main purpose of this function is to draw triangle 'holes' in a line to match with the side of a box side ( first use is for paper stand )
	 *	@see <a href="#.draw_side" >draw_side()</a>
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 * 	@param angle {int} is the angle you want to rotate your path
	 * 	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 * 	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 */
	draw_path_rectangle: function(wooden_plate_thickness, size, angle, draw_origin_x, draw_origin_y) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, true); 	// gets the good values to draw
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},
	
	/**
	 *	function that do the same as draw_path but with tightier notches
	 *	@see <a href="#.draw_path_rectangle" >draw_path_rectangle()</a>
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 * 	@param angle {int} is the angle you want to rotate your path
	 * 	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 * 	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 */
	draw_path_rectangle_tight: function(wooden_plate_thickness, size, angle, draw_origin_x, draw_origin_y) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size + wooden_plate_thickness*2, true); 	// gets the good values to draw
		tab_coordinate = tab_coordinate.split(' ');
		tab_coordinate[1] = "0,0"; // we delete the "thickness,0" values
		tab_coordinate = tab_coordinate.join(' ');
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},
	
	/**
	 * 	function that draws a circle using svg path tag
	 * 	@param size {int} is the length for which we have to make a path
	 * 	@param angle {int} is the angle you want to rotate your path
	 * 	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 * 	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 */
	draw_path_circle: function(size, angle, draw_origin_x, draw_origin_y) {
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " a 1,1 0 0,0 " + size + ",0 a 1,1 0 0,0 " + -size +",0";
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},
	
	/**
	 * 	function that draws a half circle using svg path tag
	 *	@see <a href="#.draw_path_circle" >draw_path_circle()</a>
	 * 	@param size {int} is the length for which we have to make a path
	 * 	@param angle {int} is the angle you want to rotate your path
	 * 	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 * 	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 *	@param boolean_down {boolean} draw a negative half circle, if true the circle points downwards, else ( by default ) it point upwards
	 */
	draw_path_half_circle: function(size, angle, draw_origin_x, draw_origin_y, boolean_down) {
		if(boolean_down) {
			tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " a 1,1 0 0,1 " + size + ",0";
		} else {
			tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " a 1,1 0 0,0 " + size + ",0";
		}
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},
	
	/**
	 *	function that draws a simple line from a (x,y) to b (x,y)
	 *	@param {int} Ax the x (abscissa) initial position
	 *	@param {int} Ay the y (ordinate) initial position
	 *	@param {int} Bx the x (abscissa) position where we must move from Ax
	 *	@param {int} By the y (ordinate) position where we must move from Ay
	 */
	 draw_line: function (Ax, Ay, Bx, By,angle=0) {
		var tab_coordinate = "m " + Ax + "," + Ay + " " + Bx + "," + By + " "; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, Ax, Ay);
	},

	/**
	 *	function that create a string containing the value of the path depending on a (x,y) origin and using rotation eventually.
	 *	return the tab_coordinate which contains all the cuple (x,y) to draw a path
	 *	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 *	@param size {int} is the length for which we have to make a path
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 *	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 *	@param angle {int} is the angle you want to rotate your path
	 */
	draw_path: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, angle=0) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},


	/**
	 *	function that do the same as draw_path, but change the total size to make it able to be used for the left and right piece of the box which are tinier on the sides
	 *	reduce the size to ( size - 2 * wooden_plate_thickness ) so it will be able to match with the other part of the box perfectly
	 *	DEPRACATED, dont use it anymore
	 *	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 *	@param size {int} is the length for which we have to make a path
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 *	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 *	@deprecated
	 */
	draw_path_right_left_correction: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		tab_coordinate = tab_coordinate.split(" ");
		tab_coordinate[3] = ""; tab_coordinate[tab_coordinate.length - 2] = "";
		svg_builder.create_path(tab_coordinate.join(' '),0, draw_origin_x, draw_origin_y);
	},
	
	/**
	 *	function that do the same as draw_path but with tightier notches
	 *	@see <a href="#.draw_path" >draw_path()</a>
	 *	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 *	@param size {int} is the length for which we have to make a path
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 *	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 *	@param angle {int} is the angle you want to rotate your path
	 */
	draw_path_tight: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, angle) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size + wooden_plate_thickness*2, false); 	// gets the good values to draw
		tab_coordinate = tab_coordinate.split(' ');
		tab_coordinate[1] = "0,0"; tab_coordinate[tab_coordinate.length - 1] = "0,0";		// we delete the twos "thickness,0" values
		tab_coordinate = tab_coordinate.join(' ');
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case);				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},
	
	
	/** 
	 * 	creates the tag elements necessary and put them inside the svg tag using the tab_coordinate values.
	 *	@param {string} tab_coordinate the values (x,y) of the different path position 
	 *  @param {integer} [angle=0] - Angle of the path (optional parameter, default value = 0)
	 */
	create_path: function (tab_coordinate, angle, draw_origin_x, draw_origin_y) {
		var svg = document.getElementById("svgLayer1");
		var newpath = document.createElementNS(svg.namespaceURI,"path");  
		newpath.setAttribute("d", tab_coordinate);
		newpath.setAttribute("fill", "transparent");
		// we need to put "angle draw_origin_x draw_origin_y" as a rotation to delete the offset made by default by "rotate(angle)"
		newpath.setAttribute("transform", "rotate(" + angle + " " + draw_origin_x + " " + draw_origin_y + ")");  
		svg.appendChild(newpath);
	},
	
	/** 
	 *	function that return a string with all the scheme "value1,value2" as "x,y" which represent an entire side
	 *	taking care of conflict at the borders if the 'wooden_plate_thickness' is too big for instance
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 *	@param rectangle {boolean} if we want to create a path with rectangle it will be true, else false
	 *	@return {string} containing the values (x,y) of the different path position for an entire side
	 */
	draw_side: function (wooden_plate_thickness, size, rectangle) {
		var inner_size = size - ( wooden_plate_thickness * 2 );
		var coordinate_inner_side = svg_builder.draw_inner_side(wooden_plate_thickness, inner_size, rectangle);
		if( rectangle ) { 
			return "m " + wooden_plate_thickness + ",0 " + coordinate_inner_side + "m " + wooden_plate_thickness + ",0";
		} else {
			return "0,0 " + wooden_plate_thickness + ",0 " + coordinate_inner_side + wooden_plate_thickness + ",0";
		}
	},
	
	/**
	 *	function that return a string with all the scheme "value1,value2" as "x,y" which represent the inner part of a side
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 *	@param rectangle {boolean} if we want to create a path with rectangle (notch holes) it must be true, else false
	 *	@return {string} containing the values (x,y) of the different path position for the inner part of a side
	 */
	draw_inner_side: function (wooden_plate_thickness, size, rectangle) {
		var number_notch = svg_builder.get_number_notch(size);
		var size_rest = ( size - ( number_notch * NOTCH_SIZE ) );
		var size_rest_parts = ( size_rest / ( number_notch + 1 ) );
		var tab_coordinate = [];
		if( rectangle ) {
			svg_builder.next_coordinate_move(tab_coordinate,size_rest_parts);
			for( var i = 0 ; i < number_notch ; i++ ) {
				svg_builder.next_coordinate_rectangle(tab_coordinate,wooden_plate_thickness);
				svg_builder.next_coordinate_move(tab_coordinate, NOTCH_SIZE + size_rest_parts );
			}
		} else {
			for( var i = 0 ; i < number_notch ; i++ ) {
				svg_builder.next_coordinate_non_notch(tab_coordinate,size_rest_parts);
				svg_builder.next_coordinate_notch(tab_coordinate,wooden_plate_thickness);
			}
			svg_builder.next_coordinate_non_notch(tab_coordinate,size_rest_parts);
		}
		return tab_coordinate.join('');
	},

	/** 
	 *	function that push in tab_coordinate the two next position that will represent a move "m" to a location
	 *	@param tab_coordinate {string[]} the values (x,y) of the different path position
	 * 	@param size {int} is the size for which we have to move to in the x (abscissa)
	 */
	next_coordinate_move: function (tab_coordinate,size) {
		tab_coordinate.push(["m" + " " + size + "," + 0 + " "]);
	},
	
	/**
	 *	function that push in tab_coordinate the four next positions that will represent a rectangle ( as a notch hole )
	 *	@param tab_coordinate {string[]} the values (x,y) of the different path position used for the length of the rectangle
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the rectangle
	 */
	next_coordinate_rectangle: function (tab_coordinate,wooden_plate_thickness) {
		tab_coordinate.push([NOTCH_SIZE + "," + 0 						+ " "]);
		tab_coordinate.push([0          + "," + wooden_plate_thickness + " "]);
		tab_coordinate.push([-NOTCH_SIZE + "," + 0 						+ " "]);
		tab_coordinate.push([0          + "," + -wooden_plate_thickness + " "]);
	},
	
	/** 
	 *	function that push in tab_coordinate the two next positions that will represent a normal side part
	 *	@param tab_coordinate {string[]} the values (x,y) of the different path position which is a straight line, not a notch
	 * 	@param size {int} is the size for which we have to draw a straight line
	 */
	next_coordinate_non_notch: function (tab_coordinate,size) {
		tab_coordinate.push([0               + "," + 0 + " "]);
		tab_coordinate.push([size + "," + 0 + " "]);
	},

	/**
	 *	function that push in tab_coordinate the two next position that will represent a notch
	 *	@param tab_coordinate {string[]} the values (x,y) of the different path position which is a notch ( meaning a rectangle shape with a side open )
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 */
	 next_coordinate_notch: function (tab_coordinate,wooden_plate_thickness) {
	 	tab_coordinate.push([0          + "," + wooden_plate_thickness 	+ " "]);
	 	tab_coordinate.push([NOTCH_SIZE + "," + 0 						+ " "]);
	 	tab_coordinate.push([0          + "," + -wooden_plate_thickness + " "]);
	 },

	/** 
	 * 	function that returns the best number_notch possible
	 *	--> the idea is to have aproximatly 50% of a side which is notch, and 50% which isnt
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 * 	@return {int} the number of notch we can afford on the side having @param size length
	 */
	get_number_notch: function (size) {
		var number_notch = 1;
		while ( number_notch < Math.trunc( size / ( 2 * NOTCH_SIZE ) ) ) {
			number_notch++;
		}
		return number_notch;
	},

	/**
	 *	for all the scheme "value1,value2" inside splited_tab, it does the rotate_case rotation
	 *	@param tab_coordinate {string[]} the values (x,y) of the different path position
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 * 	@see <a href="#.rotate" >rotate()</a>
	 *	@return {string[]} which contains the schemes "value1,value2" at each index
	 */
	 rotate_path: function (tab_coordinate, rotate_case) {
	 	var splited_tab = tab_coordinate.split(" ");
	 	for( var i = 0 ; i < splited_tab.length ; i++ ) {
	 		splited_tab[i] = svg_builder.rotate(splited_tab[i], rotate_case);
	 	}
	 	return splited_tab;
	 },

	/**
	 *	function that modify the direction of the drawing path using things like this scheme : "value1,value2"
	 *	@example it can switch "value1,value2" into "value2,value1"
	 *	@param scheme {string} which is like "value1,value2"
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 *	@return {string} the scheme with the rotation we want
	 */
	 rotate: function (scheme, rotate_case) {
	 	var stringTab = scheme.split(",");
	 	var value1 = stringTab[0];
	 	var value2 = stringTab[1];
		switch( rotate_case ) { // by default it draws the top side/path from left to right
			case 1: return value1 + "," + -value2 + " ";	// draw from left to right reversed == default reversed
			case 2: return -value1 + "," + -value2 + " ";	// draw from right to left
			case 3: return -value1 + "," + value2 + " ";	// draw from right to left reversed
			case 4: return -value2 + "," + value1 + " ";	// draw from top to bottom
			case 5: return value2 + "," + value1 + " ";		// draw from top to bottom reversed
			case 6: return value2 + "," + -value1 + " ";	// draw from bottom to top
			case 7: return -value2 + "," + -value1 + " ";	// draw from bottom to top reversed
			default: return scheme;
		}
	}
}

/**
 *	@class contains the functions needed to create a box_with_top, entirely, two in the same svg file, only a single part of it, etc...
 *	@property {int} wooden_plate_width the width of the wooden plate the user is using
 *	@property {int} wooden_plate_length the length of the wooden plate the user is using
 *	@property {int} wooden_plate_thickness the thickness of the wooden plate the user is using
 *	@property {int} width_box the width of the box
 *	@property {int} depth_box the depth of the box
 *	@property {int} height_box the height of the box
 */
 var Box_with_top = {
	 	
	/**
	 *	function that initialize the different instance parameters
	 *	@param wooden_plate_width {int} the width of the wooden plate
	 *	@param wooden_plate_length {int} the length of the wooden plate
	 *	@param wooden_plate_thickness {int} the thickness of the wooden plate
	 *	@param width_box {int} the width of the box
	 *	@param depth_box {int} the depth of the box
	 *	@param height_box {int} the height of the box
	 */
	init_parameters: function (wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box) {
		this.wooden_plate_width = wooden_plate_width,
		this.wooden_plate_length = wooden_plate_length,
		this.wooden_plate_thickness = wooden_plate_thickness,
		this.width_box = width_box,
		this.depth_box = depth_box,
		this.height_box = height_box
		// if it's internal == checked then we need to grow up a little bit the values depending on the wooden thickness
		if ( document.getElementById("formCheck-3").checked ) {
			this.width_box += (wooden_plate_thickness * 2);
			this.depth_box += (wooden_plate_thickness * 2);
			this.height_box += (wooden_plate_thickness * 2);
		}
	},

	/**
	 *	function that check if the parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 */
	check_parameters: function() {
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		if( NOTCH_SIZE*2 > Math.min(this.width_box,Math.min(this.depth_box,this.height_box)) ) return 2; // if the notch_size is too big
		if( this.width_box < 40 ) return 3; // the width_box must be minimum 5cm
		if( this.depth_box < 40 ) return 4; // the depth_box must be minimum 8cm
		if( this.height_box < 40 ) return 5; // the height_box must be minimum 5cm
		return 0; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_with_top
	 *	@param number_part {int} the number of the part of the Box_with_top
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		if( (number_part == 1) || (number_part == 3) ) {
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 1, origin_x , origin_y);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
	 	} else if( (number_part == 2) || (number_part == 6) ) {
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 0, origin_x, origin_y);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 4, origin_x + this.width_box, origin_y);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 2, origin_x + this.width_box, origin_y + this.depth_box);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 6, origin_x, origin_y + this.depth_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.depth_box + 10);
	 	} else if( (number_part == 5) || (number_part == 4) ) {
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 1, origin_x, origin_y + this.wooden_plate_thickness);
	 		if(bool_right) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 5, origin_x + this.height_box, origin_y + this.wooden_plate_thickness);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 3, origin_x + this.height_box, origin_y + this.depth_box - this.wooden_plate_thickness);
	 		if(bool_left) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 7, origin_x, origin_y + this.depth_box - this.wooden_plate_thickness);
	 		svg_builder.define_box_width_and_length(this.height_box + 10, this.depth_box + 10);
	 	} else if( (number_part == 50) || (number_part == 40) ) { // same parts as 4 and 5 but with a rotation of 90°
			if(bool_top) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 1, origin_x, origin_y);
			if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box - this.wooden_plate_thickness*2, origin_y);
			if(bool_bot) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 3, origin_x + this.depth_box - this.wooden_plate_thickness*2, origin_y + this.height_box);
			if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box);
			svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box + 10);
		}
	 },

	/** 
	 *	function that draws at a (x,y) position the box with top in the model 1
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	economize_laser_and_wood_model_1: function (origin_x, origin_y) {
		this.draw_single_part(2,origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4,origin_x + this.width_box, origin_y, true, false, true, false);
		this.draw_single_part(6,origin_x + this.width_box + this.height_box, origin_y, true, true, true, true);
		this.draw_single_part(5,origin_x + this.width_box*2 + this.height_box, origin_y, true, true, true, false);
		this.draw_single_part(1,origin_x + this.width_box*2 + this.height_box*2 + this.wooden_plate_thickness*1.5, origin_y + this.wooden_plate_thickness, true, true, true, true);
		this.draw_single_part(3,origin_x + this.width_box*3 + this.height_box*2 + this.wooden_plate_thickness*2, origin_y + this.wooden_plate_thickness, true, true, true, true);
	 	svg_builder.define_box_width_and_length(this.width_box*4 + this.height_box*2 + 10, Math.max(this.depth_box,this.height_box) + 10);
	 },

	/**
	 *	function that draws at a (x,y) position the box with top in the model 2
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	 economize_laser_and_wood_model_2: function (origin_x, origin_y) {
		this.draw_single_part(2,origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4,origin_x + this.width_box, origin_y, true, false, true, false);
		this.draw_single_part(6,origin_x + this.width_box + this.height_box, origin_y, true, true, true, true);
		this.draw_single_part(5,origin_x + this.width_box*2 + this.height_box, origin_y, true, true, true, false);
		this.draw_single_part(1,origin_x, origin_y + this.depth_box, false, true, true, true);
		this.draw_single_part(3,origin_x + this.width_box + this.wooden_plate_thickness/2, origin_y + this.depth_box + this.wooden_plate_thickness*1.5, true, true, true, true);
	 	svg_builder.define_box_width_and_length(this.width_box*2 + this.height_box*2 + 10, this.depth_box + this.height_box + 10);
	 },

	/**
	 *	function that draws at (x,y) position the box with top in the model 3
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	economize_laser_and_wood_model_3: function (origin_x, origin_y) {
		this.draw_single_part(1,origin_x, origin_y, true, true, true, true);
		this.draw_single_part(40,origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(3,origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(50,origin_x + this.width_box*2 + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(2,origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(6,origin_x + this.width_box + this.wooden_plate_thickness/2, origin_y + this.height_box + this.wooden_plate_thickness*1.5, true, true, true, true);
	 	svg_builder.define_box_width_and_length(this.width_box*2 + this.depth_box*2 + 10, this.depth_box + this.height_box + 10);
	},
	
	/**
	 *	function that draws the box/part of box which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 6 : 	this.draw_single_part(6,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;	
			case 7 : 	this.economize_laser_and_wood_model_1(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			case 8 : 	this.economize_laser_and_wood_model_2(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;	
			case 9 :	this.economize_laser_and_wood_model_3(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			default : 	
						
		}
	}
};

/**
 *	@class contains the functions needed to create a box_without_top, entirely, two in the same svg file, only a single part of it, etc...
 *	@property {int} wooden_plate_width the width of the wooden plate the user is using
 *	@property {int} wooden_plate_length the length of the wooden plate the user is using
 *	@property {int} wooden_plate_thickness the thickness of the wooden plate the user is using
 *	@property {int} width_box the width of the box
 *	@property {int} depth_box the depth of the box
 *	@property {int} height_box the height of the box
 */
 var Box_without_top = {
	
	/**
	 *	function that initialize the different instance parameters
	 *	@param wooden_plate_width {int} the width of the wooden plate
	 *	@param wooden_plate_length {int} the length of the wooden plate
	 *	@param wooden_plate_thickness {int} the thickness of the wooden plate
	 *	@param width_box {int} the width of the box
	 *	@param depth_box {int} the depth of the box
	 *	@param height_box {int} the height of the box
	 */
	init_parameters: function (wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box) {
		this.wooden_plate_width = wooden_plate_width,
		this.wooden_plate_length = wooden_plate_length,
		this.wooden_plate_thickness = wooden_plate_thickness,
		this.width_box = width_box,
		this.depth_box = depth_box,
		this.height_box = height_box
		// if it's internal == checked then we need to grow up a little bit the values depending on the wooden thickness
		if ( document.getElementById("formCheck-3").checked ) {
			this.width_box += (wooden_plate_thickness * 2);
			this.depth_box += (wooden_plate_thickness * 2);
			this.height_box += (wooden_plate_thickness);
		}
	},
	
	/**
	 *	function that check if the parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 */
	check_parameters: function() {
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		if( NOTCH_SIZE*2 > Math.min(this.width_box,Math.min(this.depth_box,this.height_box)) ) return 2; // if the notch_size is too big
		if( this.width_box < 40 ) return 3; // the width_box must be minimum 5cm
		if( this.depth_box < 40 ) return 4; // the depth_box must be minimum 8cm
		if( this.height_box < 40 ) return 5; // the height_box must be minimum 5cm
		return 0; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_without_top
	 *	@param number_part {int} the number of the part of the Box_without_top
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	 draw_single_part: function (number_part, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
	 	if(number_part == 1) {
	 		if(bool_top)	svg_builder.draw_line(origin_x, origin_y, this.width_box, 0);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y, 0, 3);
	 		if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
	 	} else if(number_part == 2) {
	 		if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 0, origin_x, origin_y);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 4, origin_x + this.width_box, origin_y);
	 		if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 2, origin_x + this.width_box, origin_y + this.depth_box);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 6, origin_x, origin_y + this.depth_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.depth_box + 10);
	 	} else if(number_part == 20) { // same as part 2 but with a rotation by 90°
			if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 0, origin_x, origin_y);
			if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 4, origin_x + this.depth_box, origin_y);
			if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 2, origin_x + this.depth_box, origin_y + this.width_box);
			if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 6, origin_x, origin_y + this.width_box);
			svg_builder.define_box_width_and_length(this.depth_box + 10, this.width_box + 10);
		} else if(number_part == 3) {
	 		if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 1, origin_x, origin_y );
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y);
	 		if(bool_bot) 	svg_builder.draw_line(origin_x + this.width_box, origin_y + this.height_box, -this.width_box, 0);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
	 	} else if(number_part == 4) {
	 		if(bool_top) 	svg_builder.draw_line(origin_x, origin_y, this.depth_box - this.wooden_plate_thickness * 2, 0);
	 		if(bool_right)	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box - this.wooden_plate_thickness * 2, origin_y);
	 		if(bool_bot) 	svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 3, origin_x + this.depth_box - this.wooden_plate_thickness * 2, origin_y + this.height_box);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box + 10);
	 	} else if(number_part == 5) {
	 		if(bool_top)	svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 1, origin_x, origin_y);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x  + this.depth_box - this.wooden_plate_thickness * 2, origin_y);
	 		if(bool_bot) 	svg_builder.draw_line(origin_x + this.depth_box - this.wooden_plate_thickness * 2, origin_y + this.height_box, - this.depth_box + this.wooden_plate_thickness * 2, 0);
	 		if(bool_left)	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box + 10);
	 	}
	 },

	/**
	 *	function that draws at a (x,y) position the box without top in the model 1
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a> to get the parameters informations
	 */
	economize_laser_and_wood_model_1: function (origin_x, origin_y) {
		this.draw_single_part(3, origin_x, origin_y, true, true, true, true);
		this.draw_single_part(5, origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(1, origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(4, origin_x + this.width_box, origin_y + this.height_box, false, true, true, false);
		this.draw_single_part(20, origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness/2, origin_y, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness + this.depth_box*2 + 10, Math.max(this.height_box*2, this.width_box) + 10);		
	},

	/**
	 *	function that draws at a (x,y) position the box  without top in the model 3
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	 economize_laser_and_wood_model_2: function (origin_x, origin_y) {
		this.draw_single_part(3, origin_x, origin_y, true, true, true, true);
		this.draw_single_part(5, origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(1, origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(4, origin_x + this.width_box, origin_y + this.height_box, false, true, true, false);
		this.draw_single_part(2, origin_x, origin_y + this.height_box*2, false, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness + this.depth_box + 10, this.height_box*2 + this.depth_box + 10);	
	 },
	
	/**
	 *	function that draws at a (x,y) position the box without top in the model 2
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_model_3: function (origin_x, origin_y) {
		this.draw_single_part(3, origin_x, origin_y, true, true, true, true);
		this.draw_single_part(5, origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(1, origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(4, origin_x + this.width_box, origin_y + this.height_box, false, true, false, false);
		this.draw_single_part(20, origin_x + this.width_box, origin_y + this.height_box*2, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness + this.depth_box + 10, this.height_box*2 + this.width_box + 10);	
	 },

	/**
	 *	function that draws the box/part of box which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 6 : 	this.economize_laser_and_wood_model_1(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;			
			case 7 : 	this.economize_laser_and_wood_model_2(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			case 8 :	this.economize_laser_and_wood_model_3(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			default : 	
		}
	}
};

/**
 *	@class contains the functions needed to create a Toolbox, entirely, two in the same svg file, only a single part of it, etc...
 *	DO NOT TAKE THIS CLASS AS AN EXAMPLE TO BUILD OTHER BOXES, PREFER USING THE OTHER OBJECTS...
 *	@property {int} wooden_plate_width the width of the wooden plate the user is using
 *	@property {int} wooden_plate_length the length of the wooden plate the user is using
 *	@property {int} wooden_plate_thickness the thickness of the wooden plate the user is using
 *	@property {int} width_box the width of the box
 *	@property {int} depth_box the depth of the box
 *	@property {int} height_box the height of the box
 *	@property {int} nose the length of the nose
 *	@see <img id="img_tool_box_jsdoc" src="../../src/assets/img/tool_box/jsdoc.png" alt="img_tool_box_jsdoc" height="100%" width="100%" >
 */
var Toolbox = {

	/**
	 *	function that initialize the different instance parameters
	 *	@param wooden_plate_width {int} the width of the wooden plate
	 *	@param wooden_plate_length {int} the length of the wooden plate
	 *	@param wooden_plate_thickness {int} the thickness of the wooden plate
	 *	@param width_box {int} the width of the box
	 *	@param depth_box {int} the depth of the box
	 *	@param height_box {int} the height of the box
	 *	@param nose {int} the length of the nose
	 */
	init_parameters: function (wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, nose) {
		this.wooden_plate_width = wooden_plate_width,
		this.wooden_plate_length = wooden_plate_length,
		this.wooden_plate_thickness = wooden_plate_thickness,
		this.width_box = width_box,
		this.depth_box = depth_box,
		this.height_box = height_box,
		this.nose = nose
	},
	
	/**
	 *	function that initialize the different parameters we will need to use for our drawing/creating path
	 *	@see <a href="#img_tool_box_jsdoc" >img_tool_box_jsdoc</a>
	 */
	init_geometry_parameters: function () {
	  this.oppose =   (Math.tan(45*(Math.PI /180))*(this.height_box-nose)/2);
	  this.hypothenuse =   Math.sqrt(((this.height_box-this.nose)/2)*((this.height_box-this.nose)/2) +  this.oppose * this.oppose);  
	},

	/**
	 *	small modification of the function draw_path from svg_builder to add angle
	 *	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 *	@param size {int} is the length for which we have to make a path
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 *	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 *	@param angle {int} is the angle we want to rotate the path
	 *	@see <a href="#.draw_path" >draw_path()</a>
	 */
	draw_path2: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, angle) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case); 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y);
	},

	/**
	 *	small modification of the function draw_path_right_left_correction to add angle
	 *	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 *	@param size {int} is the length for which we have to make a path
	 *	@param rotate_case {int} is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 *	@param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 *	@param angle {int} is the angle we want to rotate the path
	 *	@see <a href="#.draw_path_right_left_correction" >draw_path_right_left_correction()</a>
	 */
	draw_path_right_left_correction2: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, angle=0) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		tab_coordinate = tab_coordinate.split(" ");
		tab_coordinate[3] = ""; tab_coordinate[tab_coordinate.length - 2] = "";
		svg_builder.create_path(tab_coordinate.join(' '), angle, draw_origin_x, draw_origin_y);
	},


	/**
	 *	Function to draw the top side of the piece 1
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (abscissa) origin of the drawing of this part
	 *	@param nbNotch {int} it's the number of notch that's have to be drawn on the side of the part
	 *	@param height_box {int} its the height of the box
	 *	@param width_box {int} its the width of the box
	 *	@param nose {int} it's the length of the nose
	 *	@param depth_box {int} its the depth of the box
	 */
	draw_base_side: function(origin_x, origin_y, nbNotch, height_box, width_box, nose, depth_box){
		var l_origin_x = origin_x;
		var l_origin_y = origin_y;
		
		sizeBetweenBigNotch = (width_box - this.oppose - (NOTCH_SIZE * 4)*nbNotch) / (nbNotch+1);
		sizeBigNotch = NOTCH_SIZE * 4;
		for(i = 1;i<=nbNotch*2+1; i++){
			if(i%2 == 0){
				svg_builder.draw_line(l_origin_x, l_origin_y, sizeBigNotch, 0);
				l_origin_x = l_origin_x + sizeBigNotch;
			}
			else{
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(wooden_plate_thickness, sizeBetweenBigNotch, 1, l_origin_x, origin_y);
				//svg_builder.draw_line(l_origin_x, l_origin_y,sizeBetweenBigNotch, 0)
				l_origin_x = l_origin_x + sizeBetweenBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}				
		}
	},

	/**
	 *	Function to draw the bot side of the piece 1
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (abscissa) origin of the drawing of this part
	 *	@param nbNotch {int} it's the number of notch that's have to be drawn on the side of the part
	 *	@param height_box {int} its the height of the box
	 *	@param width_box {int} its the width of the box
	 *	@param nose {int} it's the length of the nose
	 *	@param depth_box {int} its the depth of the box
	 */
	draw_base_side2:function(origin_x, origin_y, nbNotch, height_box, width_box, nose, depth_box){
		var l_origin_x2 = origin_x;
		var l_origin_y2 = origin_y;
		sizeBetweenBigNotch = (width_box - this.oppose - (NOTCH_SIZE * 4)*nbNotch) / (nbNotch+1);
		sizeBigNotch = NOTCH_SIZE * 4;
		total = 0;
		for(i = 1;i<=nbNotch*2+1; i++){
			if(i%2 == 0){
				svg_builder.draw_line(l_origin_x2, l_origin_y2 + depth_box,sizeBigNotch, 0);
				l_origin_x2 = l_origin_x2 + sizeBigNotch;
				total += sizeBetweenBigNotch;
			}
			else{
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(wooden_plate_thickness, sizeBetweenBigNotch, 0, l_origin_x2, origin_y + depth_box);
				l_origin_x2 = l_origin_x2 + sizeBetweenBigNotch;
				total += sizeBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}
		}
	},
	
	/**
	 *	function that's draw the top side of the piece 2 and 6 of the Toolbox
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (abscissa) origin of the drawing of this part
	 *	@param nbNotch {int} it's the number of notch that's have to be drawn on the side of the part
	 *	@param height_box {int} its the height of the box
	 *	@param width_box {int} its the width of the box
	 *	@param nose {int} it's the length of the nose
	 *	@param rotate {int} Direction to take from origin point
	*/
	draw_top: function(origin_x, origin_y, nbNotch, height_box, width_box, nose, rotate){
		var l_origin_x = origin_x + this.oppose;
		var l_origin_y = origin_y -(height_box-nose)/2;
		sizeBetweenBigNotch = (width_box - this.oppose - (NOTCH_SIZE * 4)*nbNotch) / (nbNotch+1);
		sizeBigNotch = NOTCH_SIZE * 4;
		for(i = 1;i<=nbNotch*2+1; i++){
			if(i%2 == 1){ // tiny
				svg_builder.draw_line(l_origin_x, l_origin_y,sizeBetweenBigNotch, 0)
				l_origin_x = l_origin_x + sizeBetweenBigNotch;
			}
			else{ // big
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(this.wooden_plate_thickness, sizeBigNotch, rotate, l_origin_x, l_origin_y);
				l_origin_x = l_origin_x + sizeBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}
		}
	},
	
	/**
	 *	function that's draw the bot side of the piece 2 and 6 of the Toolbox
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (abscissa) origin of the drawing of this part
	 *	@param nbNotch {int} it's the number of notch that's have to be drawn on the side of the part
	 *	@param height_box {int} its the height of the box
	 *	@param width_box {int} its the width of the box
	 *	@param nose {int} it's the length of the nose
	 *	@param rotate {int} Direction to take from origin point
	*/
	draw_bot: function(origin_x, origin_y, nbNotch, height_box, width_box, nose, rotate){
		var l_origin_x = origin_x;
		var l_origin_y = origin_y;
		sizeBetweenBigNotch = (width_box - this.oppose - (NOTCH_SIZE * 4)*nbNotch) / (nbNotch+1);
		sizeBigNotch = NOTCH_SIZE * 4;
		for(i = 1;i<=nbNotch*2+1; i++){
			if(i%2 == 1){
				svg_builder.draw_path(wooden_plate_thickness, sizeBetweenBigNotch, rotate, l_origin_x, origin_y -(height_box-nose)/2);
				l_origin_x = l_origin_x - sizeBetweenBigNotch;
			}
			else{
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(wooden_plate_thickness, sizeBigNotch, rotate, l_origin_x, origin_y -(height_box-nose)/2);
				l_origin_x = l_origin_x - sizeBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}
		}

	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_without_top
	 *	@param number_part {int} the number of the part of the Box_without_top
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 *	@see <a href="#img_tool_box_jsdoc" >img_tool_box_jsdoc</a>
	 */
	draw_single_part: function (number_part, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		nbNotch = Math.round((width_box - Math.tan(45*(Math.PI /180))*((this.height_box-this.nose)/2))/70);

		if(number_part == 1) {
			if(bool_top)  Toolbox.draw_base_side(origin_x, origin_y, nbNotch, this.height_box, this.width_box 	- this.wooden_plate_thickness, this.nose, this.depth_box);  
			if(bool_right)   svg_builder.draw_line(origin_x + (this.width_box - this.oppose) - this.wooden_plate_thickness, origin_y, 0, this.depth_box);
			if(bool_bot)   Toolbox.draw_base_side2(origin_x, origin_y, nbNotch, this.height_box, this.width_box - this.wooden_plate_thickness, this.nose, this.depth_box);
			if(bool_left)  svg_builder.draw_line(origin_x, origin_y, 0, this.depth_box);   
			svg_builder.define_box_width_and_length(this.width_box, this.depth_box + this.height_box/2 + 50);
		} else if(number_part == 6) {
			Toolbox.draw_path2(this.wooden_plate_thickness, this.hypothenuse,0, origin_x, origin_y,-45);
			if(bool_top)  Toolbox.draw_bot(origin_x + this.width_box, origin_y, nbNotch, this.height_box, this.width_box, this.nose,3);
			if(bool_right)   svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y -(this.height_box-this.nose)/2);
			if(bool_bot)   Toolbox.draw_top(origin_x, origin_y + this.height_box, nbNotch, this.height_box, this.width_box, this.nose,0);
			if(bool_left)   svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 5, origin_x, origin_y);
			svg_builder.draw_line(origin_x, origin_y + this.nose, this.oppose, (this.height_box-this.nose)/2);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
		} else if(number_part == 2) {
			svg_builder.draw_line(origin_x, origin_y, this.oppose, -(this.height_box-this.nose)/2);
			if(bool_top)  Toolbox.draw_top(origin_x, origin_y, nbNotch, this.height_box, this.width_box, this.nose,1);
			if(bool_right)   svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y -(this.height_box-this.nose)/2);
			if(bool_bot)   Toolbox.draw_bot(origin_x + width_box, origin_y + this.height_box, nbNotch, this.height_box, this.width_box, this.nose,2);
			if(bool_left)   svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 5, origin_x, origin_y);
			Toolbox.draw_path2(this.wooden_plate_thickness, this.hypothenuse,1,origin_x, origin_y+this.nose,45);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + this.height_box/2 + 10);
		} else if(number_part == 3) {
			if(bool_top)  svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 1, origin_x, origin_y);
			if(bool_right)  svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box, origin_y);
			if(bool_bot)   svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 2, origin_x + this.depth_box, origin_y + this.height_box);
			if(bool_left)   svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box);
			/*
			else{
				if(bool_top)	svg_builder.draw_path(wooden_plate_thickness, height_box, 1, origin_x, origin_y);
				if(bool_right)	svg_builder.draw_path(wooden_plate_thickness, depth_box, 5, origin_x+height_box, origin_y);
				if(bool_bot) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 3, origin_x+height_box, origin_y+depth_box);
				if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, depth_box, 7, origin_x, origin_y+depth_box);
			}*/
			svg_builder.define_box_width_and_length(this.hypothenuse + 10, this.depth_box + this.height_box + 10);
		} else if(number_part == 4) {
			if(bool_top)   /*svg_builder.draw_line(origin_x, origin_y, this.depth_box, 0);*/svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 1, origin_x, origin_y);
			if(bool_right)  /*svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 5, origin_x+this.depth_box, origin_y);*/svg_builder.draw_line(origin_x + this.nose, origin_y, 0, this.depth_box);
			if(bool_bot)   /*svg_builder.draw_line(origin_x, origin_y + nose, depth_box,0);*/svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 3, origin_x + this.nose, origin_y + this.depth_box);
			if(bool_left)  /*svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 7, origin_x, origin_y+this.nose);*/svg_builder.draw_line(origin_x, origin_y + this.depth_box, 0, -this.depth_box);
			svg_builder.define_box_width_and_length(this.nose + 10, this.depth_box  + this.height_box);
		} else if(number_part == 5) {
			if(bool_top)  /*svg_builder.draw_line(origin_x, origin_y, depth_box, 0);*/Toolbox.draw_path_right_left_correction2(this.wooden_plate_thickness, this.hypothenuse, 1, origin_x, origin_y);
			if(bool_right)   /*svg_builder.draw_path(wooden_plate_thickness, hypothenuse, 5, origin_x+depth_box, origin_y);*/svg_builder.draw_line(origin_x + this.hypothenuse - 2* this.wooden_plate_thickness, origin_y, 0, this.depth_box);
			if(bool_bot)   /*svg_builder.draw_line(origin_x, origin_y + hypothenuse, depth_box,0);*/Toolbox.draw_path_right_left_correction2(this.wooden_plate_thickness, this.hypothenuse, 3, origin_x + this.hypothenuse - 2* this.wooden_plate_thickness, origin_y + this.depth_box);
			if(bool_left)  /*svg_builder.draw_path(wooden_plate_thickness, hypothenuse, 7, origin_x, origin_y+hypothenuse);*/svg_builder.draw_line(origin_x, origin_y + this.depth_box, 0, -this.depth_box);
			svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box*2 + 10);
		}
	},

	/**
	 *	function to add missing line on all face drawing when we assemble piece 2 and piece 1 together and piece 6 and piece 1
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param height_box {int} its the height of the box
	 *	@param width_box {int} its the width of the box
	 *	@param nose {int} it's the length of the nose
	 */
	optimize_part_1_add_line: function(origin_x, origin_y, height_box, width_box, nose){
		nbNotch = Math.round((width_box - this.oppose)/70);
		l_origin_x = origin_x;
		l_origin_y = origin_y;
		sizeBigNotch = NOTCH_SIZE * 4;
		sizeBetweenBigNotch = (width_box - this.oppose - (NOTCH_SIZE * 4)*nbNotch) / (nbNotch+1);
		for(i = 1;i<=nbNotch*2+1; i++){
			if(i%2 == 0){
				svg_builder.draw_line(l_origin_x, l_origin_y,sizeBigNotch, 0)
				l_origin_x = l_origin_x + sizeBigNotch;
			}
			else{
				l_origin_x = l_origin_x + sizeBetweenBigNotch;
			}
		}
	},

	/**
	 *	Main function of the Toolbox drawing, it's draw and choose the better placement of pieces depend on parameters value
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	economize_laser_and_wood_one_box: function (origin_x, origin_y) {
		Toolbox.draw_single_part(2, origin_x, origin_y, true, true, true, true);
		Toolbox.optimize_part_1_add_line(origin_x + this.oppose, origin_y + (this.height_box-this.nose)/2 + this.nose,this.height_box, this.width_box, this.nose)
		Toolbox.draw_single_part(1, origin_x + this.oppose, origin_y + (this.height_box-this.nose)/2 + this.nose, false, true, false, true);
		Toolbox.optimize_part_1_add_line(origin_x + this.oppose, origin_y + (this.height_box-this.nose)/2 + this.nose + this.depth_box,this.height_box, this.width_box, this.nose)
		Toolbox.draw_single_part(6, origin_x, origin_y + this.height_box + this.depth_box, true, true, true, true);

		if(this.oppose > this.nose){
			if(this.nose < NOTCH_SIZE*2){
			  Toolbox.draw_single_part(4, origin_x + this.oppose - this.nose - NOTCH_SIZE, origin_y + (this.height_box-this.nose)/2 + this.nose, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, true, this.nose);
			}
			else{
			  Toolbox.draw_single_part(4, origin_x + this.oppose - this.nose, origin_y + (this.height_box-this.nose)/2 + this.nose, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, false, true, true, this.nose);
			}
			Toolbox.draw_single_part(5, origin_x, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, true, this.nose);
			if(this.hypothenuse > this.width_box){
			  Toolbox.draw_single_part(3, origin_x + this.width_box, origin_y - this.oppose, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, false, this.nose);
			}
			else{
			  Toolbox.draw_single_part(3, origin_x + this.hypothenuse, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2  , this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, true, this.nose);
			}
		  }
		else{
			if(this.width_box - this.nose - this.hypothenuse > this.height_box){
			  Toolbox.draw_single_part(4, origin_x + this.hypothenuse - this.wooden_plate_thickness*2, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, false, this.nose);
			  
			  Toolbox.draw_single_part(5, origin_x, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, true, this.nose);
			}
			else{
			  Toolbox.draw_single_part(4, origin_x + this.hypothenuse - this.wooden_plate_thickness*2, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, false, this.nose);
			  Toolbox.draw_single_part(3, origin_x + this.hypothenuse + this.nose, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2  , this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, true, this.nose);
			  Toolbox.draw_single_part(5, origin_x, origin_y + ((this.height_box-this.nose)/2) + this.nose + this.height_box + this.depth_box + this.wooden_plate_thickness*2, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box, true, true, true, true, this.nose);
			}
		}
		svg_builder.define_box_width_and_length(this.width_box + this.depth_box + this.height_box/2 + 10,this.height_box*3 + this.depth_box*2 + 10);
	},

	/**
	 *	function that draws the box/part of box which is selected in the option listStyleType
	 */
	draw_selected_item: function() {
		switch( selectedModel() ) {
			case "1" : 	this.draw_single_part(1, this.wooden_plate_thickness,this.wooden_plate_thickness+100, true, true, true, true);
						break;
			case "2" : 	this.draw_single_part(2, this.wooden_plate_thickness,this.wooden_plate_thickness+100, true, true, true, true);
						break;
			case "3" : 	this.draw_single_part(3, this.wooden_plate_thickness,this.wooden_plate_thickness+100, true, true, true, true);
						break;
			case "4" : 	this.draw_single_part(4, this.wooden_plate_thickness,this.wooden_plate_thickness+100, true, true, true, true);
						break;
			case "5" : 	this.draw_single_part(5, this.wooden_plate_thickness,this.wooden_plate_thickness+100, true, true, true, true);
						break;
			case "6" : 	
						Toolbox.economize_laser_and_wood_one_box(this.wooden_plate_thickness, this.wooden_plate_thickness+this.height_box/2, this.wooden_plate_thickness, this.width_box, this.depth_box, this.height_box,this.nose);
						break;
			default : 	console.log("pas de problème, y'a point S");
		}
	}
};

/**
 *	@class contains the functions needed to create a Box_paper_stand, entirely, two in the same svg file, only a single part of it, etc...
 *	@property {int} wooden_plate_width the width of the wooden plate the user is using
 *	@property {int} wooden_plate_length the length of the wooden plate the user is using
 *	@property {int} wooden_plate_thickness the thickness of the wooden plate the user is using
 *	@property {int} width_box the width of the box
 *	@property {int} depth_box the depth of the box
 *	@property {int} height_box the height of the box
 *	@property {int} size_stand_front_part the size of the front part of a stand
 *	@property {int} size_between_stand  the size between stands
 *	@property {int} stand_number the number of stands
 *	@property {int} angle_degre the angle of inclination of each stands
 *	@property {int} tiny_triangle_adjacent_side (geometry parameters) // C' @see below to understand the meaning of this trigonometry parameters
 *	@property {int} triangle_adjacent_side (geometry parameters) // C @see below
 *	@property {int} triangle_hypotenuse_side (geometry parameters) // B @see below
 *	@property {int} triangle_opposite_side (geometry parameters) // A @see below
 *	@see <img id="img_paper_stand_jsdoc" src="../../src/assets/img/paper_stand/jsdoc.png" alt="img_paper_stand_jsdoc" height="100%" width="100%" >
 */
var Box_paper_stand = {
	
	/**
	 *	function that initialize the different instance parameters
	 *	@param wooden_plate_width {int} the width of the wooden plate the user is using
	 *	@param wooden_plate_length {int} the length of the wooden plate the user is using
	 *	@param wooden_plate_thickness {int} the thickness of the wooden plate the user is using
	 *	@param width_box {int} the width of the box
	 *	@param depth_box {int} the depth of the box
	 *	@param height_box {int} the height of the box
	 *	@param size_stand_front_part {int} the size of the front part of a stand
	 *	@param size_between_stand {int} the size between stands
	 *	@param stand_number {int} the number of stands
	 *	@param angle_degre {int} the angle of inclination of each stands
	 */
	init_parameters: function(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, size_stand_front_part, size_between_stand, stand_number, angle_degre) {
		this.wooden_plate_width = wooden_plate_width,
		this.wooden_plate_length = wooden_plate_length,
		this.wooden_plate_thickness = wooden_plate_thickness,
		this.width_box = width_box,
		this.depth_box = depth_box,
		this.height_box = height_box,
		this.size_stand_front_part = size_stand_front_part,
		this.size_between_stand = size_between_stand,
		this.stand_number = stand_number,
		this.angle_degre = angle_degre
		// if it's internal == checked then we need to grow up a little bit the values depending on the wooden thickness
		if ( document.getElementById("formCheck-3").checked ) {
			this.width_box += (wooden_plate_thickness * 2);
		}
	},
	 
	/**
	 *	function that check if the parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 */
	check_parameters: function() {
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimetersif( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		//if(  ) return 2; // if the notch_size is too big // a bit hard to implement, depends on too many things
		if( this.width_box < 40 ) return 3; // the width_box must be minimum 4cm
		if( this.depth_box < 40 ) return 4; // the depth_box must be minimum 4cm
		if( this.height_box < 40 ) return 5; // the height_box must be minimum 4cm
		if( this.size_stand_front_part < (2 * NOTCH_SIZE) + 2 ) return 6; // for compatibility between size_stand_front_part and NOTCH_SIZE
		//if( 60 < this.size_stand_front_part ) return 7; // if size_stand_front_part too big
		if( this.size_stand_front_part < 10 ) return 8; // if size_stand_front_part too tiny
		//if( this.size_between_stand < 120 ) return 9; // if size_between_stand too tiny, the hand of a normal human must be able to be used to catch items in the paper stand
		if( 40 < this.angle_degre ) return 10; // if angle_degre too big
		if( this.angle_degre < 0 ) return 11; // if angle_degre too tiny
		return 0; // no problem
	},
	
	/**
	 *	function that initialize the different parameters we will need to use for our drawing/creating path
	 *	@see <a href="#img_paper_stand_jsdoc" >img_paper_stand_jsdoc</a>
	 */
	init_geometry_parameters: function () {
		// geometry/trigonometry calculation, see annexes on the info tab on the web site to see a graph/image that explain it better with visual than words
		// Math.cos sin tan in javascript works with radians not degrees so we need the "* (Math.PI / 180))" conversion"
		this.tiny_triangle_adjacent_side = Math.cos((180 - 90 - this.angle_degre) * (Math.PI / 180) ) * this.size_stand_front_part + this.wooden_plate_thickness;	// C'
		this.triangle_adjacent_side = this.depth_box - this.tiny_triangle_adjacent_side;											// C
		this.triangle_hypotenuse_side = ( this.triangle_adjacent_side / Math.cos(this.angle_degre * (Math.PI / 180)) );				// B
		this.triangle_opposite_side = Math.sin(this.angle_degre * (Math.PI / 180) ) * this.triangle_hypotenuse_side;				// A
	},
	
	/**
	 *	function that check if the geometry parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 *	@see <a href="#img_paper_stand_jsdoc" >img_paper_stand_jsdoc</a>
	 */
	check_geometry_parameters: function() {
		if( this.stand_number > Math.ceil( (this.height_box - this.triangle_opposite_side) / this.size_between_stand) ) return 1; // for a stand_number correct
		return 0; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_paper_stand
	 *	@param number_part {int} the number of the part of the Box_paper_stand
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		if( (number_part == 1) || (number_part == 2) ){ // side parts
			if(bool_top)	svg_builder.draw_line(origin_x, origin_y, this.depth_box, 0);
			if(bool_right)	svg_builder.draw_line(origin_x + this.depth_box, origin_y, 0, this.height_box);
			if(bool_bot)	svg_builder.draw_line(origin_x + this.depth_box, origin_y + this.height_box, -this.depth_box, 0);
			if(bool_left)	svg_builder.draw_line(origin_x, origin_y + this.height_box, 0, -this.height_box);
			// we draw as much as we need stands
			for(var i = 0 ; i < this.stand_number ; i++ ) {
				svg_builder.draw_path_rectangle(this.wooden_plate_thickness,this.triangle_hypotenuse_side, 180 + this.angle_degre, origin_x + this.triangle_adjacent_side , origin_y + this.height_box - this.wooden_plate_thickness - ( i * this.size_between_stand));
				svg_builder.draw_path_rectangle(this.wooden_plate_thickness,this.size_stand_front_part, 270 + this.angle_degre, origin_x + this.triangle_adjacent_side, origin_y + this.height_box - this.wooden_plate_thickness - ( i * this.size_between_stand));
			}
			svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box + 10);
		} else if(number_part == 3) { // stand main part
			if(bool_top) 	svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y, this.width_box - (2 * this.wooden_plate_thickness), 0);
			if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.triangle_hypotenuse_side, 5, origin_x + this.width_box - this.wooden_plate_thickness, origin_y);
			if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box  - (2 * this.wooden_plate_thickness), 3, origin_x + this.width_box - this.wooden_plate_thickness, origin_y + this.triangle_hypotenuse_side);
			if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.triangle_hypotenuse_side, 7, origin_x + this.wooden_plate_thickness, origin_y + this.triangle_hypotenuse_side);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.triangle_hypotenuse_side + 10);
		} else if(number_part == 4) { // front part of a stand
			if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box - (2 * this.wooden_plate_thickness), 0, origin_x + this.wooden_plate_thickness, origin_y );
			if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.size_stand_front_part, 5, origin_x + this.width_box - this.wooden_plate_thickness, origin_y);
			if(bool_bot) 	svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness, origin_y + this.size_stand_front_part, -this.width_box + (2 * this.wooden_plate_thickness), 0);
			if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.size_stand_front_part, 7, origin_x + this.wooden_plate_thickness, origin_y + this.size_stand_front_part);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.size_stand_front_part + 10);
		}
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand side parts in a line model which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_side_parts_line: function (origin_x, origin_y) {
		this.draw_single_part(1,origin_x, origin_y, true, true, true, true);
		this.draw_single_part(2,origin_x + this.depth_box, origin_y, true, true, true, false);
		svg_builder.define_box_width_and_length((this.depth_box * 2) + 10, this.height_box + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand side parts in a column model which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_side_parts_column: function (origin_x, origin_y) {
		this.draw_single_part(1,origin_x, origin_y, true, true, true, true);
		this.draw_single_part(2,origin_x, origin_y + this.height_box, false, true, true, true);	
		svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box * 2 + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a line model with one line which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_one_line: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_line(origin_x,origin_y);
		// we draw as much as we need stands
		for(var i = 0 ; i < this.stand_number ; i++ ) {
			this.draw_single_part(3,origin_x + (this.depth_box * 2) + (i * this.width_box), origin_y, true, true, true, true);
			this.draw_single_part(4,origin_x + (this.depth_box * 2) + (i * this.width_box), origin_y + (this.triangle_hypotenuse_side), false, true, true, true);
		}
		svg_builder.define_box_width_and_length((this.depth_box * 2) + (this.width_box * i) + 10, Math.max(this.height_box, (this.triangle_hypotenuse_side) + (this.size_stand_front_part))  + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a line model with two line which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_two_line: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_column(origin_x,origin_y);
		// we draw as much as we need stands
		var is_pair = ( (this.stand_number % 2) == 0 ) ? 1 : 0; // 1 pair, 0 impair
		var todo = Math.floor(this.stand_number/2);
		for( var i = 0 ; i < todo ; i++ ) {
			this.draw_single_part(3,origin_x + this.depth_box + (i * this.width_box), origin_y, true, true, true, true);
			this.draw_single_part(4,origin_x + this.depth_box + (i * this.width_box), origin_y + this.triangle_hypotenuse_side, false, true, true, true);
			this.draw_single_part(3,origin_x + this.depth_box + (i * this.width_box), origin_y + this.triangle_hypotenuse_side + this.size_stand_front_part, true, true, true, true);
			this.draw_single_part(4,origin_x + this.depth_box + (i * this.width_box), origin_y + (2 * this.triangle_hypotenuse_side) + this.size_stand_front_part, false, true, true, true);
		} 
		if(is_pair == 0) { // if impair 
			this.draw_single_part(3,origin_x + this.depth_box + (i * this.width_box), origin_y, true, true, true, true);
			this.draw_single_part(4,origin_x + this.depth_box + (i * this.width_box), origin_y + this.triangle_hypotenuse_side, false, true, true, true);
		}
		var width_all_items =  ((this.stand_number % 2) == 0 ) ? this.depth_box + ((Math.floor(this.stand_number/2)) * this.width_box) : this.depth_box + ((Math.floor(this.stand_number/2) + 1) * this.width_box);
		var height_all_items = Math.max((this.height_box * 2), ((this.triangle_hypotenuse_side + this.size_stand_front_part) * 2));	
		svg_builder.define_box_width_and_length(width_all_items + 10, height_all_items + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a column model with one column which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_one_column_model_1: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_column(origin_x,origin_y);
		// we draw as much as we need stands
		for(var i = 0 ; i < this.stand_number ; i++ ) {
			this.draw_single_part(3,origin_x, origin_y + (this.height_box * 2) + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), true, true, true, true);
			this.draw_single_part(4,origin_x, origin_y + (this.triangle_hypotenuse_side) + (this.height_box * 2) + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
		}
		svg_builder.define_box_width_and_length(Math.max(this.depth_box, this.width_box) + 10, (this.height_box * 2) + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part))  + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a column model with two column which is the best to economize both wood and laser path.
	 *	-> perfect for the form ( length 300, width 150, height 350 ) and dynamically (  length 150, width 150, height 350 )
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_one_column_model_2: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_line(origin_x,origin_y);
		// we draw the stands in 1 column
		if( this.depth_box < this.width_box ) {
			// we draw as much as we need stands
			for( var i = 0 ; i < this.stand_number ; i++ ) {
				this.draw_single_part(3,origin_x, origin_y + this.height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), true, true, true, true);
				this.draw_single_part(4,origin_x, origin_y + this.height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + (this.triangle_hypotenuse_side), false, true, true, true);
			}
			var width_all_items = Math.max((this.depth_box * 2), this.width_box);
			var height_all_items =  this.height_box + ( this.stand_number * (this.triangle_hypotenuse_side + this.size_stand_front_part));
			svg_builder.define_box_width_and_length(width_all_items + 10, height_all_items + 10);
		} 
		// we draw the stands in 2 column
		else { 
			// we draw as much as we need stands
			var is_pair = ( (this.stand_number % 2) == 0 ) ? 1 : 0; // 1 pair, 0 impair
			var todo = Math.floor(this.stand_number/2);
			for( var i = 0 ; i < todo ; i++ ) {
				this.draw_single_part(3,origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4,origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + this.triangle_hypotenuse_side, false, true, true, true);
				this.draw_single_part(3,origin_x + this.width_box, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4,origin_x + this.width_box, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + this.triangle_hypotenuse_side, false, true, true, true);
			} 
			if(is_pair == 0) { // if impair 
				this.draw_single_part(3,origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), true, true, true, true);
				this.draw_single_part(4,origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + this.triangle_hypotenuse_side, false, true, true, true);
			}
			var width_all_items =  Math.max(this.depth_box * 2, this.width_box);
			var height_all_items = this.height_box + ((Math.ceil(this.stand_number/2)) * (this.triangle_hypotenuse_side + this.size_stand_front_part))// Math.max((this.height_box * 2), ((this.triangle_hypotenuse_side + this.size_stand_front_part) * 2));	
			svg_builder.define_box_width_and_length(width_all_items + 10, height_all_items + 10);
		}
	},
	
	/**
	 *	function that draws the box/part of box which is selected in the option listStyleType
	 */
	draw_selected_item: function() {
		switch( selectedModel() ) {
			case "1" : 	this.draw_single_part(1,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case "2" : 	this.draw_single_part(2,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case "3" : 	this.draw_single_part(3,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case "4" : 	this.draw_single_part(4,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case "5" : 	this.economize_laser_and_wood_all_parts_one_line(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			case "6" : 	this.economize_laser_and_wood_all_parts_two_line(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			case "7" : 	this.economize_laser_and_wood_all_parts_one_column_model_1(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			case "8" : 	this.economize_laser_and_wood_all_parts_one_column_model_2(this.wooden_plate_thickness, this.wooden_plate_thickness);
						break;
			default : 	console.log("pas de problème, y'a point S");
		}
	}
};

/**
 *	@class contains the functions needed to create a Box_hinged_lid, entirely, two in the same svg file, only a single part of it, etc...
 *	@property {int} wooden_plate_width the width of the wooden plate the user is using
 *	@property {int} wooden_plate_length the length of the wooden plate the user is using
 *	@property {int} wooden_plate_thickness the thickness of the wooden plate the user is using
 *	@property {int} width_box the width of the box
 *	@property {int} depth_box the depth of the box
 *	@property {int} height_box the height of the box
 */
var Box_hinged_lid = {
	
	/**
	 *	function that initialize the different instance parameters
	 *	@param wooden_plate_width {int} the width of the wooden plate the user is using
	 *	@param wooden_plate_length {int} the length of the wooden plate the user is using
	 *	@param wooden_plate_thickness {int} the thickness of the wooden plate the user is using
	 *	@param width_box {int} the width of the box
	 *	@param depth_box {int} the depth of the box
	 *	@param height_box {int} the height of the box
	 */
	init_parameters: function(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box) {
		this.wooden_plate_width = wooden_plate_width,
		this.wooden_plate_length = wooden_plate_length,
		this.wooden_plate_thickness = wooden_plate_thickness,
		this.width_box = width_box,
		this.depth_box = depth_box,
		this.height_box = height_box
		this.clutch_radius_top_part = wooden_plate_thickness * 2.5;
		this.clutch_diameter_top_part = wooden_plate_thickness * 5;
		// if it's internal == checked then we need to grow up a little bit the values depending on the wooden thickness
		if ( document.getElementById("formCheck-3").checked ) {
			this.width_box += (wooden_plate_thickness * 2);
			this.depth_box += (wooden_plate_thickness * 2);
			this.height_box += (wooden_plate_thickness * 2);
		}
	},
	 
	/**
	 *	function that check if the parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 */
	check_parameters: function() {
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		if( NOTCH_SIZE*2 > Math.min(this.width_box,Math.min(this.depth_box,this.height_box)) ) return 2; // if the notch_size is too big
		if( this.width_box < 40 ) return 3; // the width_box must be minimum 4cm
		if( this.depth_box < 40 ) return 4; // the depth_box must be minimum 4cm
		if( this.height_box < 40 ) return 5; // the height_box must be minimum 4cm
		return 0; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_hinged_lid
	 *	@param number_part {int} the number of the part of the Box_hinged_lid
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		if( (number_part == 4) || (number_part == 5) ){ // side plate parts
			// top line
			svg_builder.draw_line(origin_x, origin_y, this.depth_box - (this.wooden_plate_thickness * 2) - (this.clutch_diameter_top_part * 2), 0);
			svg_builder.draw_path_half_circle(this.clutch_diameter_top_part * 2, 0, origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - (this.clutch_diameter_top_part * 2), origin_y - this.wooden_plate_thickness, true);
			svg_builder.draw_line(origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - (this.clutch_diameter_top_part * 2), origin_y, 0, - this.wooden_plate_thickness);
			svg_builder.draw_path_circle(this.clutch_diameter_top_part + this.wooden_plate_thickness, 0, origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - (this.wooden_plate_thickness/2) - this.clutch_diameter_top_part - this.clutch_radius_top_part, origin_y - this.wooden_plate_thickness, true);
			svg_builder.draw_line(origin_x + this.depth_box - (this.wooden_plate_thickness * 2), origin_y - this.wooden_plate_thickness, 0, this.wooden_plate_thickness);
			var tempo = NOTCH_SIZE;	NOTCH_SIZE = this.wooden_plate_thickness; // we draw a notch with a wooden thickness size
			svg_builder.draw_path_rectangle_tight(this.wooden_plate_thickness,this.clutch_diameter_top_part, 0, origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - this.clutch_diameter_top_part - this.clutch_radius_top_part, origin_y - this.wooden_plate_thickness);
			NOTCH_SIZE = tempo; // we reset it as previously
			// right, bot, left lines/path
			if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box - (this.wooden_plate_thickness * 2), origin_y);
	 		if(bool_bot) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 3, origin_x + this.depth_box - (this.wooden_plate_thickness * 2), origin_y + this.height_box);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box + this.clutch_diameter_top_part + this.wooden_plate_thickness + 10);
		} else if( (number_part == 1) || (number_part == 3) ) { // front & back side plate parts
	 		if(bool_top) svg_builder.draw_line(origin_x, origin_y, this.width_box, 0);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
	 	} else if( (number_part == 2) ) { // floor plate part
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 0, origin_x, origin_y);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 4, origin_x + this.width_box, origin_y);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 2, origin_x + this.width_box, origin_y + this.depth_box);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 6, origin_x, origin_y + this.depth_box);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.depth_box + 10);
		} else if( number_part == 6 ) { // cover plate part
			if(bool_top) svg_builder.draw_line(origin_x, origin_y, this.width_box, 0); // top side
			if(bool_right) {
				svg_builder.draw_line(origin_x + this.width_box, origin_y, 0, this.depth_box - this.wooden_plate_thickness - this.clutch_diameter_top_part*2 - this.wooden_plate_thickness);
				svg_builder.draw_line(origin_x + this.width_box, origin_y + this.depth_box - this.wooden_plate_thickness*2 - this.clutch_diameter_top_part*2, -this.wooden_plate_thickness, 0);
				svg_builder.draw_line(origin_x - this.wooden_plate_thickness + this.width_box, origin_y + this.depth_box - this.wooden_plate_thickness * 2 - this.clutch_diameter_top_part*2, 0, this.clutch_radius_top_part + this.wooden_plate_thickness);
				var tempo = NOTCH_SIZE;	NOTCH_SIZE = this.wooden_plate_thickness; // we draw a notch with a wooden thickness size
				svg_builder.draw_path_tight(this.wooden_plate_thickness,this.clutch_diameter_top_part, 5, origin_x - this.wooden_plate_thickness + this.width_box, origin_y + this.depth_box - (this.wooden_plate_thickness * 1) - this.clutch_diameter_top_part - this.clutch_radius_top_part, 0);
				NOTCH_SIZE = tempo; // we reset it as previously
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness, origin_y + (this.depth_box - (this.wooden_plate_thickness * 1) - this.clutch_radius_top_part), 0, this.clutch_radius_top_part);
			}
			if(bool_left) {
				svg_builder.draw_line(origin_x, origin_y, 0, this.depth_box - this.wooden_plate_thickness - this.clutch_diameter_top_part*2 - this.wooden_plate_thickness);
				svg_builder.draw_line(origin_x, origin_y + this.depth_box - this.wooden_plate_thickness*2 - this.clutch_diameter_top_part*2, this.wooden_plate_thickness, 0);
				svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - this.wooden_plate_thickness*2 - this.clutch_diameter_top_part*2, 0, this.clutch_radius_top_part + this.wooden_plate_thickness);
				var tempo = NOTCH_SIZE;	NOTCH_SIZE = this.wooden_plate_thickness; // we draw a notch with a wooden thickness size
				svg_builder.draw_path_tight(this.wooden_plate_thickness,this.clutch_diameter_top_part, 4, origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - (this.wooden_plate_thickness * 1) - this.clutch_diameter_top_part - this.clutch_radius_top_part, 0);
				NOTCH_SIZE = tempo; // we reset it as previously
				svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y + (this.depth_box - this.wooden_plate_thickness - this.clutch_radius_top_part), 0, this.clutch_radius_top_part);
			}
			if(bool_bot) svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - this.wooden_plate_thickness, this.width_box - this.wooden_plate_thickness*2, 0); // top side
			svg_builder.define_box_width_and_length(this.width_box + 10, this.depth_box + this.wooden_plate_thickness+ 10);
		}
	},
		
	/** 
	 *	function that draws at a (x,y) position the line model 1 which is the best to economize both wood and laser path
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	 economize_laser_and_wood_line_model_1: function (origin_x, origin_y) {
	 	this.draw_single_part(3,origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4,origin_x + this.width_box, origin_y, true, true, true, false);
	 	this.draw_single_part(1,origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(5,origin_x + this.width_box*2 + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
	 	this.draw_single_part(2,origin_x + this.width_box*2 + this.depth_box*2 - this.wooden_plate_thickness*3, origin_y, true, true, true, true);
		this.draw_single_part(6,origin_x + this.width_box*3 + this.depth_box*2 - this.wooden_plate_thickness*3, origin_y, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box*4 + this.depth_box*2 + this.wooden_plate_thickness + 10, Math.max(this.depth_box, this.height_box) + this.wooden_plate_thickness*6 + 10);
	 },

	/**
	 *	function that draws at a (x,y) position the line model 2 which is the best to economize both wood and laser path
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	economize_laser_and_wood_line_model_2: function (origin_x, origin_y) {
	 	this.draw_single_part(3,origin_x, origin_y, true, true, false, true);
		this.draw_single_part(4,origin_x + this.width_box, origin_y, true, true, true, false);
	 	this.draw_single_part(1,origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(5,origin_x + this.width_box*2 + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
	 	this.draw_single_part(2,origin_x, origin_y + this.height_box, true, true, true, true);
		this.draw_single_part(6,origin_x + this.width_box, origin_y + this.height_box + this.wooden_plate_thickness, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box*2 + this.depth_box*2 + 10, this.depth_box + this.height_box + this.wooden_plate_thickness*6 + 10);
	 },

	/**
	 *	function that draws the box/part of box which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4,this.wooden_plate_thickness, this.wooden_plate_thickness * 6, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5,this.wooden_plate_thickness, this.wooden_plate_thickness * 6, true, true, true, true);
						break;
			case 6 : 	this.draw_single_part(6,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 7 :	this.economize_laser_and_wood_line_model_1(this.wooden_plate_thickness,this.wooden_plate_thickness * 6);
						break;
			case 8 : 	this.economize_laser_and_wood_line_model_2(this.wooden_plate_thickness,this.wooden_plate_thickness * 6);
						break;
			default : 	
		}
	}
};

/**
 *	@class contains the functions needed to create a Collecting_box, entirely, two in the same svg file, only a single part of it, etc...
 *	@property {int} wooden_plate_width the width of the wooden plate the user is using
 *	@property {int} wooden_plate_length the length of the wooden plate the user is using
 *	@property {int} wooden_plate_thickness the thickness of the wooden plate the user is using
 *	@property {int} width_box the width of the box
 *	@property {int} depth_box the depth of the box
 *	@property {int} height_box the height of the box 
 *	@property {int} opposite (geometry parameters) // C' @see below to understand the meaning of this trigonometry parameters
 *	@property {int} adjacent_1 (geometry parameters) // C @see below
 *	@property {int} adjacent_2 (geometry parameters) // B @see below
 *	@property {int} hypotenuse_1 (geometry parameters) // A @see below
 *	@property {int} hypotenuse_2 (geometry parameters) // A @see below
 *	@see <img id="img_collecting_box_jsdoc" src="../../src/assets/img/collecting_box/jsdoc.png" alt="img_collecting_box_jsdoc" height="100%" width="100%" >
 */
var Collecting_box = {
	
	/**
	 *	function that initialize the different instance parameters
	 *	@param wooden_plate_width {int} the width of the wooden plate the user is using
	 *	@param wooden_plate_length {int} the length of the wooden plate the user is using
	 *	@param wooden_plate_thickness {int} the thickness of the wooden plate the user is using
	 *	@param width_box {int} the width of the box
	 *	@param depth_box {int} the depth of the box
	 *	@param height_box {int} the height of the box
	 *	@param angle_degre {int} the angle of the front part of the box
	 */
	init_parameters: function(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, angle_degre, big_notch_depth) {
		this.wooden_plate_width = wooden_plate_width,
		this.wooden_plate_length = wooden_plate_length,
		this.wooden_plate_thickness = wooden_plate_thickness,
		this.width_box = width_box,
		this.depth_box = depth_box,
		this.height_box = height_box
		this.angle_degre = angle_degre;
		this.big_notch_depth = big_notch_depth;
		// if it's internal == checked then we need to grow up a little bit the values depending on the wooden thickness
		if ( document.getElementById("formCheck-3").checked ) {
			this.width_box += (wooden_plate_thickness * 2);
			this.depth_box += (wooden_plate_thickness * 2);
			this.height_box += (wooden_plate_thickness * 2);
		}
	},
	 
	/**
	 *	function that check if the parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 */
	check_parameters: function() {
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		//if(  ) return 2; // if the notch_size is too big // a bit hard to implement, depends on too many things
		if( this.width_box < 50 ) return 3; // the width_box must be minimum 5cm
		if( this.depth_box < 80 ) return 4; // the depth_box must be minimum 8cm
		if( this.height_box < 50 ) return 5; // the height_box must be minimum 5cm
		if( this.angle_degre < 1 ) return 6; // we need an angle at least of 1 degre
		if( this.angle_degre > 60 ) return 7; // we need an angle at least of 1 degre		
		return 0; // no problem
	},
	
	/**
	 *	function that initialize the different parameters we will need to use for our drawing/creating path
	 *	@see <a href="#img_collecting_box_jsdoc" >img_collecting_box_jsdoc</a>
	 */
	init_geometry_parameters: function () {
		// geometry/trigonometry calculation, see annexes on the info tab on the web site to see a graph/image that explain it better with visual than words
		// Math.cos sin tan in javascript works with radians not degrees so we need the "* (Math.PI / 180))" conversion"
		this.opposite = ((Math.tan(45 * (Math.PI / 180)) * Math.tan(this.angle_degre * (Math.PI / 180))) / (Math.tan(45 * (Math.PI / 180)) + Math.tan(this.angle_degre * (Math.PI / 180))) * this.height_box);
		this.adjacent_1 = ( this.opposite / Math.tan(45 * (Math.PI / 180)) );
		this.adjacent_2 = ( this.opposite / Math.tan(this.angle_degre * (Math.PI / 180)) );
		this.hypotenuse_1 = ( this.opposite / Math.sin(45 * (Math.PI / 180)) );
		this.hypotenuse_2 = ( this.opposite / Math.sin(this.angle_degre * (Math.PI / 180)) );
		this.depth_box = this.depth_box - this.opposite; // so that the length will be as the user wanted it to be, such as '30cm' instead of '30cm + opposite', already big enough...
	},
	
	/**
	 *	function that check if the geometry parameters are correct or not, return 0 if no problem found, else it return an integer value depending on the issue found
	 *	@see <a href="#img_collecting_box_jsdoc" >img_collecting_box_jsdoc</a>
	 */
	check_geometry_parameters: function() {
		//if( ) return 1;
		return 0; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Collecting_box
	 *	@param number_part {int} the number of the part of the Collecting_box
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		if( number_part == 1) { // front plate part
			if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 1, origin_x, origin_y + this.wooden_plate_thickness, 0); //svg_builder.draw_line(origin_x, origin_y, this.width_box, 0);
	 		if(bool_right) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y + this.wooden_plate_thickness, 0);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box - this.wooden_plate_thickness);
	 		if(bool_left) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box - this.wooden_plate_thickness);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
		}
		else if( (number_part == 2 ) || (number_part == 6) ) { // ceilling and floor plate part 
			if(bool_top) {
				if( number_part == 2 ) svg_builder.draw_path_tight(this.wooden_plate_thickness, this.width_box - this.wooden_plate_thickness*2, 0, origin_x, origin_y, 0);
				if( number_part == 6 ) svg_builder.draw_line(origin_x, origin_y, this.width_box - this.wooden_plate_thickness*2, 0);
			}
			var parts_side = (this.depth_box - this.wooden_plate_thickness*2)/5;
			if(bool_right) { 
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y, 0, this.wooden_plate_thickness);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 5, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + this.wooden_plate_thickness, 0);
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side + this.wooden_plate_thickness, 0, parts_side);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 5, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side*2 + this.wooden_plate_thickness, 0);
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side*3 + this.wooden_plate_thickness, 0, parts_side);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 5, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side*4 + this.wooden_plate_thickness, 0);
			}
	 		if(bool_bot) {
				if( number_part == 2 ) svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + this.depth_box - this.wooden_plate_thickness, - this.width_box + this.wooden_plate_thickness*2, 0);
				if( number_part == 6 ) svg_builder.draw_path_tight(this.wooden_plate_thickness, this.width_box - this.wooden_plate_thickness*2, 2, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + this.depth_box - this.wooden_plate_thickness, 0);
			}
			if(bool_left) {
				svg_builder.draw_line(origin_x, origin_y, 0, this.wooden_plate_thickness);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 4, origin_x, origin_y + this.wooden_plate_thickness, 0);
				svg_builder.draw_line(origin_x, origin_y + parts_side + this.wooden_plate_thickness, 0, parts_side);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 4, origin_x, origin_y + parts_side*2 + this.wooden_plate_thickness, 0);
				svg_builder.draw_line(origin_x, origin_y + parts_side*3 + this.wooden_plate_thickness, 0, parts_side);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 4, origin_x, origin_y + parts_side*4 + this.wooden_plate_thickness, 0);
			}
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.depth_box + this.wooden_plate_thickness * 2+ 10);
		}
		else if( number_part == 3 ) { // back plate part
			if(bool_top) svg_builder.draw_line(origin_x, origin_y, this.width_box, 0);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.hypotenuse_2, 4, origin_x + this.width_box, origin_y, 0);
	 		if(bool_bot) svg_builder.draw_line(origin_x + this.width_box, origin_y + this.hypotenuse_2 - this.wooden_plate_thickness, -this.width_box, 0);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.hypotenuse_2, 6, origin_x, origin_y + this.hypotenuse_2);
	 		svg_builder.define_box_width_and_length(this.width_box + 10, this.hypotenuse_2 + 10);
	 	} 
		else if( (number_part == 4) || (number_part == 5) ){ // side plate parts
			var parts_side = (this.depth_box - this.wooden_plate_thickness*2)/5;
			if(bool_top) { 
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 0, origin_x, origin_y, 0);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side, origin_y, 0);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 0, origin_x + parts_side*2, origin_y, 0);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side*3, origin_y, 0);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 0, origin_x + parts_side*4, origin_y, 0);
			}
			if(bool_right) {
				svg_builder.draw_line(origin_x + this.depth_box - this.wooden_plate_thickness*2, origin_y, this.opposite, this.adjacent_1);
				svg_builder.draw_path(this.wooden_plate_thickness, this.hypotenuse_2, 0, origin_x + this.depth_box - this.wooden_plate_thickness*2, origin_y + this.height_box, -90+this.angle_degre); // in javascript the angle are reversed from maths ( 90 goes to the bot, -90 goes to the top direction )
			}
			if(bool_bot) {
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 1, origin_x, origin_y + this.height_box, 0);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side, origin_y + this.height_box, 0);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 1, origin_x + parts_side*2, origin_y + this.height_box, 0);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side*3, origin_y + this.height_box, 0);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 1, origin_x + parts_side*4, origin_y + this.height_box, 0);
			}
			if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x, origin_y, 0);
			svg_builder.define_box_width_and_length(this.depth_box + this.opposite + 10, this.height_box + this.big_notch_depth + 10);
		}
	},
		
	/** 
	 *	function that draws at a (x,y) position the line model 1 which is the best to economize both wood and laser path
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 */
	 economize_laser_and_wood_all_part: function (origin_x, origin_y) {
		this.draw_single_part(2,origin_x + this.wooden_plate_thickness, origin_y, true, true, true, true);
		this.draw_single_part(6,origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - this.wooden_plate_thickness, false, true, false, true);
		this.draw_single_part(5,origin_x + this.width_box + this.wooden_plate_thickness*2, origin_y + this.big_notch_depth, true, true, true, true);
		this.draw_single_part(4,origin_x + this.width_box + this.wooden_plate_thickness*2, origin_y + this.height_box + this.big_notch_depth, true, true, true, true);
		this.draw_single_part(1,origin_x, origin_y + this.depth_box*2 - this.wooden_plate_thickness*3, true, true, true, true);
		this.draw_single_part(3,origin_x, origin_y + this.depth_box*2 + this.height_box - this.wooden_plate_thickness*3 + this.wooden_plate_thickness, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box + this.depth_box + this.opposite + 10, Math.max(this.depth_box*2, this.height_box) + this.hypotenuse_2 + this.height_box + this.big_notch_depth + 10);
	 },

	/**
	 *	function that draws the box/part of box which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4,this.wooden_plate_thickness, this.big_notch_depth, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5,this.wooden_plate_thickness, this.big_notch_depth, true, true, true, true);
						break;
			case 6 : 	this.draw_single_part(6,this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 7 :	this.economize_laser_and_wood_all_part(this.wooden_plate_thickness,this.big_notch_depth);
						break;
			default : 	
		}
	}
};

/**
 *  function used for testing the project for now on
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app1_close_or_open_box(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	
	// parameters
	var wooden_plate_width = selectPlanche[indexSelection].width;
	var wooden_plate_length = selectPlanche[indexSelection].length;
	var wooden_plate_thickness = selectPlanche[indexSelection].thickness;   // = 5;   // as an exemple.
	var width_box = Number(document.getElementById("longueur").value);     // = 200;
	var depth_box = Number(document.getElementById("largeur").value);     // = 50;
	var height_box = Number(document.getElementById("hauteur").value);     // = 50;
	var notch_size = Number(document.getElementById("encoche").value);   // = 10;
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	
	// we create our object, depending on whether the checkbox is checked or not
	var app1_close_or_open_box;
	if ( document.getElementById("formCheck-1").checked ) {
		height_box = height_box - wooden_plate_thickness * 2; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! )
		app1_close_or_open_box = Object.create(Box_with_top);
	} else {
		height_box = height_box - wooden_plate_thickness; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! )
		var app1_close_or_open_box = Object.create(Box_without_top);
	}
	
	// we initialize the parameters and check them if error / invalid values are found
	app1_close_or_open_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box);
	if( !checkValue("longueur","largeur","hauteur","encoche") ) {
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app1_close_or_open_box.check_parameters() != 0 ) { 
		console.log("error, to detail : " + app1_close_or_open_box.check_parameters()); 
		return;
	}
	
	// whether it is checked, we draw the corresponding with/without top box
	if ( document.getElementById("formCheck-1").checked ) { // the closed boxes ( with top )
		app1_close_or_open_box.draw_selected_item();
	} else { // the openned boxes ( without top )*/
		app1_close_or_open_box.draw_selected_item();
	}
	
	if( download == true ) svg_builder.generate_svg_file(); // if download is true, it will be downloadable by the user
	svg_builder.show_layer2();			// to show the result in the good scale
}

/**
 *  function used by the second application which creates a tool box
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app2_toolbox(download){

	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	wooden_plate_width = selectPlanche[indexSelection].width;
	wooden_plate_length = selectPlanche[indexSelection].length;
	wooden_plate_thickness = selectPlanche[indexSelection].thickness; // = 5;
	width_box = Number(document.getElementById("longueur").value); // = 200;
	depth_box = Number(document.getElementById("largeur").value); // = 50;
	height_box = Number(document.getElementById("hauteur").value); // = 50;
	notch_size = Number(document.getElementById("encoche").value); // = 10;
	nose = Number(document.getElementById("nose").value);
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;

	height_box = height_box - wooden_plate_thickness; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! )
	depth_box = depth_box - ( 2 * wooden_plate_thickness ); // to correct the depth_box lack ( its the fact that we must count the wooden_plate_thickness ! )
	//nose = 50;

	// if it's internal == checked then we need to grow up a little bit the values depending on the wooden thickness
	if ( document.getElementById("formCheck-3").checked ) {
		width_box += (wooden_plate_thickness * 2);
		depth_box += (wooden_plate_thickness * 2);
		height_box += (wooden_plate_thickness);
	}
		
	if( !checkValue("longueur","largeur","hauteur","encoche","nose") ) {
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app1_close_or_open_box.check_parameters() != 0 ) { 
		console.log("error, to detail : " + app1_close_or_open_box.check_parameters()); 
		return;
	}

	Toolbox.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, nose);
	Toolbox.init_geometry_parameters();
	Toolbox.draw_selected_item();

	if( download == true ) svg_builder.generate_svg_file();  
	svg_builder.show_layer2();
}

/**
 *  function used by the third application which creates a paper stand
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app3_paper_stand(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	
	// parameters from the form
	var wooden_plate_width = selectPlanche[indexSelection].width;
	var wooden_plate_length = selectPlanche[indexSelection].length;
	var wooden_plate_thickness = selectPlanche[indexSelection].thickness; 	// = 5; 	// as an exemple.
	var width_box = Number(document.getElementById("longueur").value); 		// = 200;
	var depth_box = Number(document.getElementById("largeur").value); 		// = 50;
	var height_box = Number(document.getElementById("hauteur").value); 		// = 50;
	var notch_size = Number(document.getElementById("encoche").value); 	// = 10;
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	
	var size_stand_front_part = Number(document.getElementById("hauteurPartieAvant").value);	// = 50;	// is at 90 degree of his associated stand
	var size_between_stand = Number(document.getElementById("hauteurSeparation").value);		// = 120; 	// 12 cm minimum
	var stand_number = Number(document.getElementById("nombreEtage").value);					// = 3;		// at least 1 please
	var angle_degre = Number(document.getElementById("angle").value);							// = 40;	// the angle of rotation for each stands

	var app3_paper_stand = Object.create(Box_paper_stand);
	app3_paper_stand.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, size_stand_front_part, size_between_stand, stand_number, angle_degre);
	
	// we initialize the parameters and check them if error / invalid values are found
	if( !checkValue("longueur","largeur","hauteur","encoche","hauteurPartieAvant","hauteurSeparation","nombreEtage","angle") ) {
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app3_paper_stand.check_parameters() != 0 ) { 
		console.log("error, to detail : " + app3_paper_stand.check_parameters()); 
		return;
	} else {
		app3_paper_stand.init_geometry_parameters(); 
		if( app3_paper_stand.check_geometry_parameters() != 0 ) {
			console.log("error geometry parameters, to detail : " + app3_paper_stand.check_geometry_parameters()); 
			return;
		}
	}
	
	app3_paper_stand.draw_selected_item();
	
	if( download == true ) svg_builder.generate_svg_file(); // if download is true, it will be downloadable by the user
	svg_builder.show_layer2();								// to show the result in the good scale
}

/**
 *  function used by the fourth application which creates a "hinged lid box".
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app4_hinged_lid_box(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	
	// parameters from the form
	var wooden_plate_width = selectPlanche[indexSelection].width;
	var wooden_plate_length = selectPlanche[indexSelection].length;
	var wooden_plate_thickness = selectPlanche[indexSelection].thickness; 	// = 5; 	// as an exemple.
	var width_box = Number(document.getElementById("longueur").value); 		// = 200;
	var depth_box = Number(document.getElementById("largeur").value); 		// = 50;
	var height_box = Number(document.getElementById("hauteur").value); 		// = 50;
	var notch_size = Number(document.getElementById("encoche").value); 		// = 10;
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	
	var app4_hinged_lid_box = Object.create(Box_hinged_lid);
	app4_hinged_lid_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box);
	
	// we initialize the parameters and check them if error / invalid values are found
	if( !checkValue("longueur","largeur","hauteur","encoche") ) {
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app4_hinged_lid_box.check_parameters() != 0 ) { 
		console.log("error, to detail : " + app4_hinged_lid_box.check_parameters()); 
		return;
	}
	
	app4_hinged_lid_box.draw_selected_item();
	
	if( download == true ) svg_builder.generate_svg_file(); // if download is true, it will be downloadable by the user
	svg_builder.show_layer2();								// to show the result in the good scale
}

/*
 *  function used by the fourth application which creates a "collecting box".
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app5_collecting_box(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	
	// parameters from the form
	var wooden_plate_width = selectPlanche[indexSelection].width;
	var wooden_plate_length = selectPlanche[indexSelection].length;
	var wooden_plate_thickness = selectPlanche[indexSelection].thickness; 	// = 5; 	// as an exemple.
	var width_box = Number(document.getElementById("longueur").value); 		// = 200;
	var depth_box = Number(document.getElementById("largeur").value); 		// = 50;
	var height_box = Number(document.getElementById("hauteur").value); 		// = 50;
	var notch_size = Number(document.getElementById("encoche").value); 		// = 10;
	var angle_degre = Number(document.getElementById("angle").value);
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	var big_notch_depth = wooden_plate_thickness*2;
	
	var app5_collecting_box = Object.create(Collecting_box);
	app5_collecting_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, angle_degre, big_notch_depth);
	
	// to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! ), it depends on the way we choose to build our Collecting_box object, it could be simplified later on of course.
	height_box = height_box - wooden_plate_thickness * 2; 
	width_box = width_box - wooden_plate_thickness * 3;
	depth_box = depth_box - wooden_plate_thickness * 2;
	
	// we initialize the parameters and check them if error / invalid values are found
	if( !checkValue("longueur","largeur","hauteur","encoche","angle") ) {
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app5_collecting_box.check_parameters() != 0 ) { 
		console.log("error, to detail : " + app5_collecting_box.check_parameters()); 
		return;
	} else {
		app5_collecting_box.init_geometry_parameters(); 
		if( app5_collecting_box.check_geometry_parameters() != 0 ) {
			console.log("error geometry parameters, to detail : " + app5_collecting_box.check_geometry_parameters()); 
			return;
		}
	}
	
	app5_collecting_box.draw_selected_item();
	
	if( download == true ) svg_builder.generate_svg_file(); // if download is true, it will be downloadable by the user
	svg_builder.show_layer2();								// to show the result in the good scale
}

/*
 *  function type to show how you have to start to create a new box, to test it, first of all here, then gets to somethings that looks like the previous completed boxes.
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
/*function app0_my_super_box(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	
	// parameters from the form
	var wooden_plate_width = selectPlanche[indexSelection].width;
	var wooden_plate_length = selectPlanche[indexSelection].length;
	var wooden_plate_thickness = selectPlanche[indexSelection].thickness; 	// = 5; 	// as an exemple.
	var width_box = Number(document.getElementById("longueur").value); 		// = 200;
	var depth_box = Number(document.getElementById("largeur").value); 		// = 50;
	var height_box = Number(document.getElementById("hauteur").value); 		// = 50;
	var notch_size = Number(document.getElementById("encoche").value); 	// = 10;
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	
	var app0_my_super_box = Object.create(Hinged_lid_box);
	app0_my_super_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box);
	
	
	//svg_builder.draw_path_circle(100, 0, 0, 100);
	//svg_builder.define_box_width_and_length(1000 + 10, 1000 + 10);
	// what u xwant to start building
	
	if( download == true ) svg_builder.generate_svg_file(); // if download is true, it will be downloadable by the user
	svg_builder.show_layer2();								// to show the result in the good scale
}*/