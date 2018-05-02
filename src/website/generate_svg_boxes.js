/**
 *	@author Axel Murat & Alexandre Mailliu
 *	@version 1.0
 * 	@date 24/04/2018
 *	@module generate_svg_boxes
 */
 
var checkboxes = document.getElementsByTagName('input');

for (var i=0; i<checkboxes.length; i++)  {
  if (checkboxes[i].type == 'checkbox')   {
	checkboxes[i].checked = false;
  }
}
	
/** the default size of a notch
 *  @constant
 *  @type {string}
 *  @default
 */
const NOTCH_SIZE_DEFAULT = 10;

/**
 * 	global value for the notch_size used by the algorithm
 * 	@type {int}
 */
var NOTCH_SIZE = 10;

/**
 * 	global value for the length of the box shape/scheme (svg) the user choosed
 * 	@type {int}
 */
var BOX_SCHEME_LENGTH = 0;

/**
 * 	global value for the width of the box shape/scheme (svg) the user choosed
 * 	@type {int}
 */
var BOX_SCHEME_WIDTH = 0;

/**
 *	@class contains the functions needed to create the svg tag, to make it downloadable, to build it ( the idea is to set multiple path tag inside the g tag of the svg tag, all those path will be the side of your shape at the end ) 
 *	@exemple <svg> <g> <path d="m 10,10 20,20" ></path> </g> </svg>
 */
var svg_builder = {
		
	/**
	 *	function that set the values of BOX_SCHEME_LENGTH and BOX_SCHEME_WIDTH for the algorithm
	 *	@param length the length size you want to set
	 *	@param width the width size you want to set
	 */
	define_box_width_and_length(width, length) {
		BOX_SCHEME_WIDTH = width;
		BOX_SCHEME_LENGTH = length;
	},
	
	/**
	 *	function that defines properly the width, height and the viewbox of the final svg object depending on the type of box/parts the user choose. 
	 *	it also allows the svg file to use the units 'mm' milimeters.
	 *	@param {int} the width of the final svg
	 *	@param {int} the height of the final svg
	 */
	define_attributes_box: function (width, height) {
		var svg = document.getElementById("svg");
		svg.setAttribute("width",width);
		svg.setAttribute("height",height);
		var stringViewBox = "0 0 " + ( width + 10 ) + " " + ( height + 10 ); 	//var stringViewBox = "0 0 " + Number(svg.getAttribute("width").replace(/[^\d]/g, "")) + " " + Number(svg.getAttribute("height").replace(/[^\d]/g, ""));
		svg.setAttribute("viewBox",stringViewBox);
		var stringTranslate = "translate(" + ( width / 2.7 ) + " " + ( height / 2.7 ) + ")";
		svg.setAttribute("transform","scale(3.779528)" + stringTranslate); // dpi problems, scale : 1 px == 3.779528 mm
	},

	/**
	 *	encode the data from the svg tag into URI data, and then set those information directly to the a tag.
	 *	then we use the magic function click that simulate a human click on this a tag, which open the download yes/no window.
	 */
	generate_svg_file: function () {
		svg_builder.define_attributes_box(BOX_SCHEME_WIDTH, BOX_SCHEME_LENGTH);
		// hidding the wooden plate
		var layer = document.getElementById("svgLayer2"); 
		layer.setAttribute("opacity", "0"); 
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
		// show the wooden plate
		layer.setAttribute("opacity", "1"); 
		// on retire la viewBox pour que notre affichage sur le site reste visible avec des proportions correctes
		d.removeAttribute("transform");
	},

	/** 
	 *	clear the svg tag so that it will be up for new parameters/shapes to be drawn in.
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
	 *	function that set/reset the values width, height and the viewbox of the svg tag, using the biggest value among the wooden plate (width/length) and
	 *	the scheme you drawn (width/length). => it result in a good scaling view of both of these items. 
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
	 *	function that display or hide the second layout for our svg.
	 */
	show_layer2: function() {
		var layer = document.getElementById("svgLayer2");
		if (document.getElementById("formCheck-2").checked) { // on affiche
			svg_builder.set_viewbox();
			var svg = document.getElementById("svg");
			svg.removeAttribute("transform");
			layer.setAttribute("opacity", "1");  
			svg_builder.draw_layer2();
		} else { // on efface
			svg_builder.define_attributes_box(BOX_SCHEME_WIDTH, BOX_SCHEME_LENGTH);
			var svg = document.getElementById("svg");
			svg.removeAttribute("transform");
			layer.setAttribute("opacity", "0");  
		}
	},
	
	/** 
	 * 	draw the text parameter inside the svg tag at the (x,y) position
	 *	@param {string} text is the text you want to draw/write
	 *	@param {int} positionX is the x (abscissa) position of the text
	 *	@param {int} positionY is the y (ordinate) position of the text
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
	 *	@param {string} text is the text you want to draw/write
	 *	@param {int} positionX is the x (abscissa) position of the rectangle
	 *	@param {int} positionY is the y (ordinate) position of the rectangle
	 *	@param {int} sizeX is the x (abscissa) size of the rectangle
	 *	@param {int} sizeY is the y (ordinate) size of the rectangle
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
	 * function that draws a simple line from a (x,y) to b (x,y)
	 * @param {int} Ax the x (abscissa) initial position
	 * @param {int} Ay the y (ordinate) initial position
	 * @param {int} Bx the x (abscissa) position where we must move from Ax
	 * @param {int} By the y (ordinate) position where we must move from Ay
	 */
	draw_line: function (Ax, Ay, Bx, By) {
		var tab_coordinate = "m " + Ax + "," + Ay + " " + Bx + "," + By + " "; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, 0, Ax, Ay);
	},

	/**
	 * function that create a string containing the value of the path depending on a (x,y) origin and using rotation eventually.
	 * return the tab_coordinate which contains all the cuple (x,y) to draw a path
	 * @param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * @param size {int} is the length for which we have to make a path
	 * @param rotate_case {int} is the case we want to use, there is 8 differents
	 * @see <a href="#.rotate" >rotate()</a>
	 * @param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 * @param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
	 */
	draw_path: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, 0, draw_origin_x, draw_origin_y);
	},

	/**
	 * function that do the same as draw_path, but change the total size to make it able to be used for the left and right piece of the box which are tinier on the sides
	 * @param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * @param size {int} is the length for which we have to make a path
	 * @param rotate_case {int} is the case we want to use, there is 8 differents
	 * @see <a href="#.rotate" >rotate()</a>
	 * @param draw_origin_x {int} is the x (abscissa) position where we start the drawing.
	 * @param draw_origin_y {int} is the y (ordinate) position where we start the drawing.
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
	 * 	creates the tag elements necessary and put them inside the svg tag using the tab_coordinate values.
	 *	@param {string} tab_coordinate the values (x,y) of the different path position 
	 *  @param {integer} [angle=0] - Angle of the path (optional parameter, default value = 0)
	 */
	create_path: function (tab_coordinate, angle, draw_origin_x, draw_origin_y) {
		var svg = document.getElementById("svgLayer1");
		var newpath = document.createElementNS(svg.namespaceURI,"path");  
		newpath.setAttribute("d", tab_coordinate);
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
	 *	<p> 0 or (a value > 7) : draws the top side/path from left to right </p>
	 *	<p> 1 : draw from left to right reversed == default reversed </p>
	 *	<p> 2 : draw from right to left </p>
	 *	<p> 3 : draw from right to left reversed </p>
	 *	<p> 4 : draw from top to bottom </p>
	 *	<p> 5 : draw from top to bottom reversed </p>
	 *	<p> 6 : draw from bottom to top </p>
	 *	<p> 7 : draw from bottom to top reversed </p>
	 * 	@example it can switch "value1,value2" into "value2,value1"
	 *	@param scheme {string} which is like "value1,value2"
	 * 	@param rotate_case {int} is the case we want to use, there is 8 differents
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
 */
var Box_with_top = {
	
	/**
	 *	function that draws the part 'number_part' of the Box_with_top
	 *	@param number_part {int} the number of the part of the Box_with_top
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		if( (number_part == 1) || (number_part == 3) ) {
			if(bool_top) svg_builder.draw_path(wooden_plate_thickness, width_box, 1, origin_x , origin_y);
			if(bool_right) svg_builder.draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y);
			if(bool_bot) svg_builder.draw_path(wooden_plate_thickness, width_box, 3, origin_x + width_box, origin_y + height_box);
			if(bool_left) svg_builder.draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box);
			svg_builder.define_box_width_and_length(width_box + 10, height_box + 10);
		} else if( (number_part == 2) || (number_part == 6) ) {
			if(bool_top) svg_builder.draw_path(wooden_plate_thickness, width_box, 0, origin_x, origin_y);
			if(bool_right) svg_builder.draw_path(wooden_plate_thickness, depth_box, 4, origin_x + width_box, origin_y);
			if(bool_bot) svg_builder.draw_path(wooden_plate_thickness, width_box, 2, origin_x + width_box, origin_y + depth_box);
			if(bool_left) svg_builder.draw_path(wooden_plate_thickness, depth_box, 6, origin_x, origin_y + depth_box);
			svg_builder.define_box_width_and_length(width_box + 10, depth_box + 10);
		} else if( (number_part == 5) || (number_part == 4) ) {
			if(bool_top) svg_builder.draw_path(wooden_plate_thickness, height_box, 1, origin_x, origin_y + wooden_plate_thickness);
			if(bool_right) svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 5, origin_x + height_box, origin_y + wooden_plate_thickness);
			if(bool_bot) svg_builder.draw_path(wooden_plate_thickness, height_box, 3, origin_x + height_box, origin_y + depth_box - wooden_plate_thickness);
			if(bool_left) svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 7, origin_x, origin_y + depth_box - wooden_plate_thickness);
			svg_builder.define_box_width_and_length(height_box + 10, depth_box + 10);
		}
	},
	
	/** 
	 *	function that draws at a (x,y) position the basic scheme ( 3 pieces bounds perfecly ) which is the best
	 *	to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 * 	@param boolean_duplicate_right {boolean} tell us whether the right part of the basic scheme must be drawn ( to avoid duplicate ) if 2 basic scheme are stick together.
	 *	@param boolean_duplicate_bottom {boolean} tell us whether the bottom part of the basic scheme must be drawn ( to avoid duplicate ) if 2 basic scheme are stick together.
	 */
	economize_laser_and_wood_basic_scheme: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, boolean_duplicate_right, boolean_duplicate_bottom) {
		Box_with_top.draw_single_part(1,origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		Box_with_top.draw_single_part(2,origin_x, origin_y + height_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true, boolean_duplicate_bottom, true);
		Box_with_top.draw_single_part(5,origin_x + width_box, origin_y + height_box, wooden_plate_thickness, width_box, depth_box, height_box, true, boolean_duplicate_right, true, false);
		svg_builder.define_box_width_and_length(width_box + height_box + 10, depth_box + height_box + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the line model which is the best to economize both wood and laser path
	 * 	line model means it use the basic scheme 2 times in line.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 */
	economize_laser_and_wood_line_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
		svg_builder.define_box_width_and_length(width_box * 2 + height_box * 2 + 10, depth_box + height_box + 10);
	},

	/** 
	 *	function that draws at a (x,y) position the column model which is the best to economize both wood and laser path
	 *	column model means it use the basic scheme 2 times in column.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 */
	economize_laser_and_wood_column_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
		svg_builder.define_box_width_and_length(width_box + height_box + 10, depth_box * 2 + height_box * 2 + 10);
	},

	/**
	 *	function that draws at (x,y) position 4 basic scheme ( == 2 entire boxes ) which is the best to economize both wood and laser path
	 * 	this is of couse used to draw two boxes, and have them inside the same svg.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 */
	economize_laser_and_wood_square_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
		svg_builder.define_box_width_and_length(width_box * 2 + height_box * 2 + 10, depth_box * 2 + height_box * 2 + 10);
	}
};


/**
 *	@class contains the functions needed to create a box_without_top, entirely, two in the same svg file, only a single part of it, etc...
 */
var Box_without_top = {
	
	/**
	 *	function that draws the part 'number_part' of the Box_without_top
	 *	@param number_part {int} the number of the part of the Box_without_top
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		if(number_part == 1) {
			if(bool_top)	svg_builder.draw_line(origin_x, origin_y, width_box, 0);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y);
			if(bool_bot) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 3, origin_x + width_box, origin_y + height_box);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box);
			svg_builder.define_box_width_and_length(width_box + 10, height_box + 10);
		} else if(number_part == 2) {
			if(bool_top) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 0, origin_x, origin_y);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, depth_box, 4, origin_x + width_box, origin_y);
			if(bool_bot) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 2, origin_x + width_box, origin_y + depth_box);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, depth_box, 6, origin_x, origin_y + depth_box);
			svg_builder.define_box_width_and_length(width_box + 10, depth_box + 10);
		} else if(number_part == 3) {
			if(bool_top) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 1, origin_x, origin_y );
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y);
			if(bool_bot) 	svg_builder.draw_line(origin_x + width_box, origin_y + height_box, -width_box, 0);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box);
			svg_builder.define_box_width_and_length(width_box + 10, height_box + 10);
		} else if(number_part == 4) {
			if(bool_top) 	svg_builder.draw_line(origin_x, origin_y, depth_box - wooden_plate_thickness * 2, 0);
			if(bool_right)	svg_builder.draw_path(wooden_plate_thickness, height_box, 5, origin_x + depth_box - wooden_plate_thickness * 2, origin_y);
			if(bool_bot) 	svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 3, origin_x + depth_box - wooden_plate_thickness * 2, origin_y + height_box);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 7, origin_x, origin_y + height_box);
			svg_builder.define_box_width_and_length(depth_box + 10, height_box + 10);
		} else if(number_part == 5) {
			if(bool_top)	svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 1, origin_x, origin_y);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 5, origin_x  + depth_box - wooden_plate_thickness * 2, origin_y);
			if(bool_bot) 	svg_builder.draw_line(origin_x + depth_box - wooden_plate_thickness * 2, origin_y + height_box, - depth_box + wooden_plate_thickness * 2, 0);
			if(bool_left)	svg_builder.draw_path(wooden_plate_thickness, height_box, 7, origin_x, origin_y + height_box);
			svg_builder.define_box_width_and_length(depth_box + 10, height_box + 10);
		}
	},
	
	/**
	 *	function that draws at a (x,y) position the box without top which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_one_box: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		Box_without_top.draw_single_part(1, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, true, true, bool_left);
		Box_without_top.draw_single_part(2, origin_x, origin_y + height_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
		Box_without_top.draw_single_part(3, origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true, bool_bot, bool_left);
		Box_without_top.draw_single_part(4, origin_x + width_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, true, false);
		Box_without_top.draw_single_part(5, origin_x + width_box, origin_y + depth_box + height_box, wooden_plate_thickness, width_box, depth_box, height_box, true, bool_right, bool_bot, false);
		svg_builder.define_box_width_and_length(width_box + depth_box + 10, height_box * 2 + depth_box + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position of two boxes without top which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_two_boxes: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_without_top.economize_laser_and_wood_one_box(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		Box_without_top.economize_laser_and_wood_one_box(origin_x + depth_box + width_box - wooden_plate_thickness * 2, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, false);
		svg_builder.define_box_width_and_length(width_box * 2 + depth_box * 2 + 10, height_box * 2 + depth_box + 10);		
	},
	
	/**
	 *	function that draws at a (x,y) position four boxes without top which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a> to get the parameters informations
	 */
	economize_laser_and_wood_four_boxes: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_without_top.economize_laser_and_wood_two_boxes(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box);
		Box_without_top.economize_laser_and_wood_one_box(origin_x, origin_y + height_box * 2 +  depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
		Box_without_top.economize_laser_and_wood_one_box(origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y + height_box * 2 +  depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, false);
		svg_builder.define_box_width_and_length(width_box * 2 + depth_box * 2 + 10, height_box * 4 + depth_box *2 + 10);		
	}
};

/**
 *	@class contains the functions needed to create a Box_paper_stand, entirely, two in the same svg file, only a single part of it, etc...
 */
var Box_paper_stand = {
	/**
	 *	geometry parameters we will need to perform our drawing, @see the web site info tab  for more details
	 */
	tiny_triangle_adjacent_side : 0,	// C'
	triangle_adjacent_side : 0,			// C
	triangle_hypotenuse_side : 0,		// B
	triangle_opposite_side : 0,			// A
	size_stand_front_part : 0,
	size_between_stand : 0,
	stand_number : 0,
	angle_degre : 0,
	
	/**
	 *	function that initialize the different parameters we will need to use for our drawing/creating path
	 *	@see annexes on the info tab on the web site to see a graph/image that explain it better with visual than words
	 */
	init_geometry_parameters(wooden_plate_thickness, width_box, depth_box, height_box, size_stand_front_part, size_between_stand, stand_number, angle_degre) {
		this.size_stand_front_part = size_stand_front_part;
		this.stand_number = stand_number;
		this.size_between_stand = size_between_stand;
		this.angle_degre = angle_degre;
		// geometry calculation, see annexes on the info tab on the web site to see a graph/image that explain it better with visual than words
		// Math.cos sin tan in javascript works with radians not degrees so we need the "* (Math.PI / 180))" conversion"
		this.tiny_triangle_adjacent_side = Math.cos((180 - 90 - angle_degre) * (Math.PI / 180) ) * size_stand_front_part;	// C'
		this.triangle_adjacent_side = depth_box - this.tiny_triangle_adjacent_side;											// C
		this.triangle_hypotenuse_side = ( this.triangle_adjacent_side / Math.cos(angle_degre * (Math.PI / 180)) );			// B
		this.triangle_opposite_side = Math.sin(angle_degre * (Math.PI / 180) ) * this.triangle_hypotenuse_side;				// A
		
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_paper_stand
	 *	@param number_part {int} the number of the part of the Box_paper_stand
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		if( (number_part == 1) || (number_part == 2) ){
			if(bool_top)	svg_builder.draw_line(origin_x, origin_y, depth_box, 0);
			if(bool_right)	svg_builder.draw_line(origin_x + depth_box, origin_y, 0, height_box);
			if(bool_bot)	svg_builder.draw_line(origin_x + depth_box, origin_y + height_box, -depth_box, 0);
			if(bool_left)	svg_builder.draw_line(origin_x, origin_y + height_box, 0, -height_box);
			// we draw as much as we need stands
			for(var i = 0 ; i < this.stand_number ; i++ ) {
				svg_builder.draw_path_rectangle(wooden_plate_thickness,this.triangle_hypotenuse_side, 180 + angle, origin_x + this.triangle_adjacent_side , origin_y + height_box - wooden_plate_thickness - ( i * this.size_between_stand));
				svg_builder.draw_path_rectangle(wooden_plate_thickness,this.size_stand_front_part, 270 + angle, origin_x + this.triangle_adjacent_side, origin_y + height_box - wooden_plate_thickness - ( i * this.size_between_stand));
			}
			svg_builder.define_box_width_and_length(depth_box + 10, height_box + 10);
		} else if(number_part == 3) {
			if(bool_top) 	svg_builder.draw_line(origin_x + wooden_plate_thickness, origin_y, width_box - (2 * wooden_plate_thickness), 0);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, this.triangle_hypotenuse_side, 5, origin_x + width_box - wooden_plate_thickness, origin_y);
			if(bool_bot) 	svg_builder.draw_path(wooden_plate_thickness, width_box  - (2 * wooden_plate_thickness), 3, origin_x + width_box - wooden_plate_thickness, origin_y + this.triangle_hypotenuse_side);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, this.triangle_hypotenuse_side, 7, origin_x + wooden_plate_thickness, origin_y + this.triangle_hypotenuse_side);
			svg_builder.define_box_width_and_length(width_box + 10, this.triangle_hypotenuse_side + 10);
		} else if(number_part == 4) {
			if(bool_top) 	svg_builder.draw_path(wooden_plate_thickness, width_box - (2 * wooden_plate_thickness), 0, origin_x + wooden_plate_thickness, origin_y );
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, this.size_stand_front_part, 5, origin_x + width_box - wooden_plate_thickness, origin_y);
			if(bool_bot) 	svg_builder.draw_line(origin_x + width_box - wooden_plate_thickness, origin_y + this.size_stand_front_part, -width_box + (2 * wooden_plate_thickness), 0);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, this.size_stand_front_part, 7, origin_x + wooden_plate_thickness, origin_y + this.size_stand_front_part);
			svg_builder.define_box_width_and_length(width_box + 10, this.size_stand_front_part + 10);
		}
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand side parts in a line model which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_side_parts_line: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		Box_paper_stand.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		Box_paper_stand.draw_single_part(2,wooden_plate_thickness + depth_box, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, false);
		svg_builder.define_box_width_and_length((depth_box * 2) + 10, height_box + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand side parts in a column model which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_side_parts_column: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		Box_paper_stand.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		Box_paper_stand.draw_single_part(2,wooden_plate_thickness, wooden_plate_thickness + height_box, wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);	
		svg_builder.define_box_width_and_length(depth_box + 10, height_box * 2 + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a line model which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_line: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		Box_paper_stand.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		Box_paper_stand.draw_single_part(2,wooden_plate_thickness + depth_box, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, false);
		// we draw as much as we need stands
		for(var i = 0 ; i < this.stand_number ; i++ ) {
			Box_paper_stand.draw_single_part(3,wooden_plate_thickness + (depth_box * 2) + (i * width_box), wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
			Box_paper_stand.draw_single_part(4,wooden_plate_thickness + (depth_box * 2) + (i * width_box), wooden_plate_thickness + (this.triangle_hypotenuse_side), wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
		}
		svg_builder.define_box_width_and_length((depth_box * (2+i)) + 10, Math.max(height_box + (this.size_stand_front_part), (this.triangle_hypotenuse_side) + (this.size_stand_front_part))  + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a column model which is the best to economize both wood and laser path.
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (abscissa) origin of the drawing of this part
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param bool_top {boolean} if true the top side of this part will be drawn, else way it wont
	 *	@param bool_right {boolean} if true the right side of this part will be drawn, else way it wont
	 *	@param bool_bot {boolean} if true the bot side of this part will be drawn, else way it wont
	 *	@param bool_left {boolean} if true the left side of this part will be drawn, else way it wont
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_column: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, bool_bot, bool_left) {
		Box_paper_stand.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		Box_paper_stand.draw_single_part(2,wooden_plate_thickness + depth_box, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, false);
		// we draw as much as we need stands
		var is_pair = ( (this.stand_number % 2) == 0 ) ? 1 : 0; // 1 pair, 0 impair
		var todo = Math.floor(this.stand_number/2);
		for( var i = 0 ; i < todo ; i++ ) {
			Box_paper_stand.draw_single_part(3,wooden_plate_thickness, wooden_plate_thickness + height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
			Box_paper_stand.draw_single_part(4,wooden_plate_thickness, wooden_plate_thickness + height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + (this.triangle_hypotenuse_side), wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
			Box_paper_stand.draw_single_part(3,wooden_plate_thickness + depth_box, wooden_plate_thickness + height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
			Box_paper_stand.draw_single_part(4,wooden_plate_thickness + depth_box, wooden_plate_thickness + height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + (this.triangle_hypotenuse_side), wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
		} 
		if(is_pair == 0) { // if impair 
			Box_paper_stand.draw_single_part(3,wooden_plate_thickness, wooden_plate_thickness + height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
			Box_paper_stand.draw_single_part(4,wooden_plate_thickness, wooden_plate_thickness + height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + (this.triangle_hypotenuse_side), wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
		}
		var width_all_items = Math.max((depth_box * 2), (width_box * 2));
		var height_all_items =  ((this.stand_number % 2) == 0 ) ? height_box + ((Math.floor(this.stand_number/2)) * (this.triangle_hypotenuse_side + this.size_stand_front_part)) : height_box + ((Math.floor(this.stand_number/2) + 1) * (this.triangle_hypotenuse_side + this.size_stand_front_part));
		svg_builder.define_box_width_and_length(width_all_items + 10, height_all_items + 10);
	}
};

/**
 * function that check is the constraint of our initial parameters are respected or not, return a value depending on the error, 0 is no error.
	 *	@param wooden_plate_width {int} its the width of the wooden plate
	 *	@param wooden_plate_length {int} its the length of the wooden plate
	 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
	 *	@param width_box {int} its the width of the box
	 *	@param depth_box {int} its the depth of the box
	 *	@param height_box {int} its the height of the box
	 *	@param notch_size {int} its the length of a notch
 */
function check_parameters_constraint(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, notch_size) {
	if( !(wooden_plate_thickness <= ( 0.20 * Math.min(depth_box, height_box)) ) ){ return 1; } // thickness too big
	if( wooden_plate_thickness < 1 ) { return 2; } // thickness < 1 milimeter
}

/**
 * function used for testing the project for now on
 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
 *	@param width_box {int} its the width of the box
 *	@param depth_box {int} its the depth of the box
 *	@param height_box {int} its the height of the box
 */
function tests(wooden_plate_thickness, width_box, depth_box, height_box) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	wooden_plate_width = selectPlanche[indexSelection].width;
	wooden_plate_length = selectPlanche[indexSelection].length;
	wooden_plate_thickness = selectPlanche[indexSelection].thickness; 	// = 5; 	// as an exemple.
	width_box = Number(document.getElementById("longueur").value); 		// = 200;
	depth_box = Number(document.getElementById("largeur").value); 		// = 50;
	height_box = Number(document.getElementById("hauteur").value); 		// = 50;
	var notch_size = Number(document.getElementById("encoche").value); 	// = 10;
	
	height_box = height_box - wooden_plate_thickness * 2; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! )
	
	// how to handle the size of the notch parameter ?
	/*if( !( notch_size >= 3 ) || !( notch_size < ( 0.40 * Math.min(depth_box, height_box)) ) ) { NOTCH_SIZE = NOTCH_SIZE_DEFAULT; } // to correct the value if the notch size given isnt good
	else { NOTCH_SIZE = notch_size; }*/ 
	NOTCH_SIZE = notch_size;
	
	/*var error_id = check_parameters_constraint(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, notch_size)
		switch( error_id ) {
			case 1 : 	console.log("erreur : l'épaisseur est trop grande"); 
						return;
			case 2 : 	console.log("erreur : l'épaisseur est trop petite ( < 3 milimètres )"); 
						return;
			default : 	console.log("pas de problème, y'a point S");
		}*/
		
	if ( document.getElementById("formCheck-1").checked ) { // the closed boxes ( with top )
		switch( Number(selectedModel()) ) {
			case 1 : 	Box_with_top.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 2 : 	Box_with_top.draw_single_part(2,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 3 : 	Box_with_top.draw_single_part(3,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 4 : 	Box_with_top.draw_single_part(4,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;			
			case 5 : 	Box_with_top.draw_single_part(5,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 6 : 	Box_with_top.draw_single_part(6,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;			
			case 7 : 	Box_with_top.economize_laser_and_wood_column_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
						break;
			case 8 : 	Box_with_top.economize_laser_and_wood_line_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
						break;	
			case 9 :	Box_with_top.economize_laser_and_wood_square_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
						break;
			default : 	
						
		}
	} else { // the openned boxes ( without top )
		switch( Number(selectedModel()) ) {
			case 1 : 	Box_without_top.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 2 : 	Box_without_top.draw_single_part(2,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 3 : 	Box_without_top.draw_single_part(3,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 4 : 	Box_without_top.draw_single_part(4,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;			
			case 5 : 	Box_without_top.draw_single_part(5,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;
			case 6 : 	Box_without_top.economize_laser_and_wood_one_box(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
						break;			
			case 7 : 	Box_without_top.economize_laser_and_wood_two_boxes(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
						break;
			case 8 :	Box_without_top.economize_laser_and_wood_four_boxes(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
						break;
			default : 	
		}
	}
	
	svg_builder.generate_svg_file();
	svg_builder.show_layer2();
}


/**
 *  function used by the third application which creates a paper stand
 *	@param wooden_plate_thickness {int} its the thickness of the wooden plate
 *	@param width_box {int} its the width of the box
 *	@param depth_box {int} its the depth of the box
 *	@param height_box {int} its the height of the box
 */
function app3_paper_stand(wooden_plate_thickness, width_box, depth_box, height_box) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("svgLayer1");
	svg_builder.clear_svg("svgLayer2");
	wooden_plate_width = selectPlanche[indexSelection].width;
	wooden_plate_length = selectPlanche[indexSelection].length;
	wooden_plate_thickness = selectPlanche[indexSelection].thickness; 	// = 5; 	// as an exemple.
	width_box = Number(document.getElementById("longueur").value); 		// = 200;
	depth_box = Number(document.getElementById("largeur").value); 		// = 50;
	height_box = Number(document.getElementById("hauteur").value); 		// = 50;
	var notch_size = Number(document.getElementById("encoche").value); 	// = 10;
	
	NOTCH_SIZE = notch_size;
	
	angle = 40;
	size_stand_front_part = 50;
	size_between_stand = 120; // 12 cm minimum
	stand_number = 3;
	
	Box_paper_stand.init_geometry_parameters(wooden_plate_thickness, width_box, depth_box, height_box, size_stand_front_part, size_between_stand, stand_number, angle); 
	//Box_paper_stand.draw_single_part(1,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	//Box_paper_stand.draw_single_part(2,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	//Box_paper_stand.draw_single_part(3,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	//Box_paper_stand.draw_single_part(4,wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	//Box_paper_stand.economize_laser_and_wood_side_parts_line(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	//Box_paper_stand.economize_laser_and_wood_side_parts_column(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	Box_paper_stand.economize_laser_and_wood_all_parts_line(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	//Box_paper_stand.economize_laser_and_wood_all_parts_column(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
	
	
	svg_builder.generate_svg_file();
	//svg_builder.show_layer2();
}