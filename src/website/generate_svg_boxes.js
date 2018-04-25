/**
 *	@author Axel Murat & Alexandre Mailliu
 *	@version 1.0
 * 	@date 24/04/2018
 *	@module generate_svg_boxes
 */
 
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
 *	@class contains the functions needed to create the svg tag, to make it downloadable, to build it ( the idea is to set multiple path tag inside the g tag of the svg tag, all those path will be the side of your shape at the end ) 
 *	@exemple <svg> <g> <path d="m 10,10 20,20" ></path> </g> </svg>
 */
var svg_builder = {
		
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
		var stringViewBox = "0 0 " + width + " " + height; 	//var stringViewBox = "0 0 " + Number(svg.getAttribute("width").replace(/[^\d]/g, "")) + " " + Number(svg.getAttribute("height").replace(/[^\d]/g, ""));
		svg.setAttribute("viewBox",stringViewBox);
		var stringTranslate = "translate(" + ( width / 2.7 ) + " " + ( height / 2.7 ) + ")";
		svg.setAttribute("transform","scale(3.779528)" + stringTranslate); // dpi problems, scale : 1 px == 3.779528 mm
	},

	/**
	 *	encode the data from the svg tag into URI data, and then set those information directly to the a tag.
	 *	then we use the magic function click that simulate a human click on this a tag, which open the download yes/no window.
	 */
	generate_svg_file: function () {
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
	},

	/** 
	 *	clear the svg tag so that it will be up for new parameters/shapes to be drawn in.
	 */
	clear_svg: function (layer){
		var svg = document.getElementById(layer);
		var parentElement = svg.parentElement;
		var emptySvg = svg.cloneNode(false);
		parentElement.removeChild(svg);
		parentElement.appendChild(emptySvg);
	},
	
	/**
	 *
	 * @param {boolean} show if true the layer 2 will be display, else it wont.
	 */
	show_layer2(show) {
		var layer = document.getElementById(svgLayer2);
		if(show) {
			layer.setAttribute("opacity", 1);  
			//define_attributes_box(selectPlanche[indexSelection].width,selectPlanche[indexSelection].length);
		} else {
			layer.setAttribute("opacity", 0);  
			//define_attributes_box();
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
	draw_rectangle: function (positionX, positionY, sizeX, sizeY, layer) {
		var svg = document.getElementById(layer);
		var newRect = document.createElementNS(svg.namespaceURI,"rect");  
		newRect.setAttribute("x", positionX);  
		newRect.setAttribute("y", positionY); 
		newRect.setAttribute("width", sizeX);  
		newRect.setAttribute("height", sizeY);   
		newRect.setAttribute("stroke", "#0000ff");  
		svg.appendChild(newRect);
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
		svg_builder.create_path(tab_coordinate);
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
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size); 							// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 								// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate);
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
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size); 							// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 								// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		tab_coordinate = tab_coordinate.split(" ");
		tab_coordinate[3] = ""; tab_coordinate[tab_coordinate.length - 2] = "";
		svg_builder.create_path(tab_coordinate.join(' '));
	},
	
	/** 
	 * 	creates the tag elements necessary and put them inside the svg tag using the tab_coordinate values.
	 *	@param {string[]} tab_coordinate the values (x,y) of the different path position 
	 */
	create_path: function (tab_coordinate) {
		var svg = document.getElementById("svgLayer1");
		var newpath = document.createElementNS(svg.namespaceURI,"path");  
		newpath.setAttribute("d", tab_coordinate);  
		svg.appendChild(newpath);
	},
	
	/** 
	 *	function that return a string with all the scheme "value1,value2" as "x,y" which represent an entire side
	 *	taking care of conflict at the borders if the 'wooden_plate_thickness' is too big for instance
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 *	@return {string} containing the values (x,y) of the different path position for an entire side
	 */
	draw_side: function (wooden_plate_thickness, size) {
		var inner_size = size - ( wooden_plate_thickness * 2 );
		var coordinate_inner_side = svg_builder.draw_inner_side(wooden_plate_thickness, inner_size);
		return "0,0 " + wooden_plate_thickness + ",0 " + coordinate_inner_side + wooden_plate_thickness + ",0";
	},

	/**
	 *	function that return a string with all the scheme "value1,value2" as "x,y" which represent the inner part of a side
	 * 	@param wooden_plate_thickness {int} is the thickness of the plate, used for the depth of the notch
	 * 	@param size {int} is the length for which we have to make a path
	 *	@return {string} containing the values (x,y) of the different path position for the inner part of a side
	 */
	draw_inner_side: function (wooden_plate_thickness, size) {
		var number_notch = svg_builder.get_number_notch(wooden_plate_thickness, size);
		var size_rest = ( size - ( number_notch * NOTCH_SIZE ) );
		var size_rest_parts = ( size_rest / ( number_notch + 1 ) );
		var tab_coordinate = [];
		for( var i = 0 ; i < number_notch ; i++ ) {
			svg_builder.next_coordinate_non_notch(tab_coordinate,size_rest_parts);
			svg_builder.next_coordinate_notch(tab_coordinate,wooden_plate_thickness);
		}
		svg_builder.next_coordinate_non_notch(tab_coordinate,size_rest_parts);
		return tab_coordinate.join('');
	},

	/** 
	 *	function that push in tab_coordinate the two next position that will represent a normal side part
	 *	@param tab_coordinate {string[]} the values (x,y) of the different path position which is a straight line, not a notch
	 * 	@param size_rest_parts {int} is the size for which we have to draw a straight line
	 */
	next_coordinate_non_notch: function (tab_coordinate,size_rest_parts) {
		tab_coordinate.push([0               + "," + 0 + " "]);
		tab_coordinate.push([size_rest_parts + "," + 0 + " "]);
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
	get_number_notch: function (wooden_plate_thickness, size) {
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
	 *	function that draws at a (x,y) position the basic scheme ( 3 pieces bounds perfecly ) which is the best
	 *	to economize both wood and laser path.
	 * 	@boolean_duplicate_right, boolean_duplicate_bottom are boolean values which tell us wether a side mustnt be drawn to avoid duplicate
	 */
	economize_laser_and_wood_basic_scheme: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, boolean_duplicate_right, boolean_duplicate_bottom) {
		// part 1 == part 3
		svg_builder.draw_path(wooden_plate_thickness, width_box, 1, origin_x , origin_y);
		svg_builder.draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y);
		svg_builder.draw_path(wooden_plate_thickness, width_box, 3, origin_x + width_box, origin_y + height_box);
		svg_builder.draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box);
		// part 2 == part 6
		svg_builder.draw_path(wooden_plate_thickness, depth_box, 4, origin_x + width_box, origin_y + height_box);
		if(!boolean_duplicate_bottom) { svg_builder.draw_path(wooden_plate_thickness, width_box, 2, origin_x + width_box, origin_y + height_box + depth_box); }
		svg_builder.draw_path(wooden_plate_thickness, depth_box, 6, origin_x, origin_y + height_box + depth_box);
		// part 5 == part 4
		svg_builder.draw_path(wooden_plate_thickness, height_box, 1, origin_x + width_box, origin_y + height_box + wooden_plate_thickness);
		if(!boolean_duplicate_right) { svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 5, origin_x + height_box + width_box, origin_y + height_box + wooden_plate_thickness); }
		svg_builder.draw_path(wooden_plate_thickness, height_box, 3, origin_x + height_box + width_box, origin_y + height_box + depth_box - wooden_plate_thickness);
		svg_builder.define_attributes_box(width_box + height_box + 10, depth_box + height_box + 10);
	},
	
	/**
	 *	draws at a (x,y) position the line model which is the best to economize both wood and laser path
	 * line model means it use the basic scheme 2 times in line.
	 */
	economize_laser_and_wood_line_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		svg_builder.define_attributes_box(width_box * 2 + height_box * 2 + 10, depth_box + height_box + 10);
	},

	/** 
	 *	draws at a (x,y) position the column model which is the best to economize both wood and laser path
	 *	column model means it use the basic scheme 2 times in column.
	 */
	economize_laser_and_wood_column_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		svg_builder.define_attributes_box(width_box + height_box + 10, depth_box * 2 + height_box * 2 + 10);
	},

	/**
	 *	draws at (x,y) position 4 basic scheme which is the best to economize both wood and laser path
	 * this is of couse used to draw two boxes, and have them inside the same svg.
	 */
	economize_laser_and_wood_square_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, true, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		svg_builder.define_attributes_box(width_box * 2 + height_box * 2 + 10, depth_box * 2 + height_box * 2 + 10);
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
		} else if(number_part == 2) {
			if(bool_top) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 0, origin_x, origin_y + height_box);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, depth_box, 4, origin_x + width_box, origin_y + height_box);
			if(bool_bot) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 2, origin_x + width_box, origin_y + height_box + depth_box);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, depth_box, 6, origin_x, origin_y + height_box + depth_box);
		} else if(number_part == 3) {
			if(bool_top) 	svg_builder.draw_path(wooden_plate_thickness, width_box, 1, origin_x, origin_y + height_box + depth_box);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y + height_box + depth_box);
			if(bool_bot) 	svg_builder.draw_line(origin_x + width_box, origin_y + height_box * 2 + depth_box, -width_box, 0);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box * 2 + depth_box);
		} else if(number_part == 4) {
			if(bool_top) 	svg_builder.draw_line(origin_x + width_box, origin_y, depth_box - wooden_plate_thickness * 2, 0);
			if(bool_right)	svg_builder.draw_path(wooden_plate_thickness, height_box, 5, origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y);
			if(bool_bot) 	svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 3, origin_x + depth_box - wooden_plate_thickness * 2 + width_box, origin_y + height_box);
			if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 7, origin_x + width_box, origin_y + height_box);
		} else if(number_part == 5) {
			if(bool_top)	svg_builder.draw_path_right_left_correction(wooden_plate_thickness, depth_box, 1, origin_x + width_box, origin_y + depth_box + height_box);
			if(bool_right) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 5, origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y + depth_box + height_box);
			if(bool_bot) 	svg_builder.draw_line(origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y + depth_box + height_box * 2, - depth_box + wooden_plate_thickness * 2, 0);
			if(bool_left)	svg_builder.draw_path(wooden_plate_thickness, height_box, 7, origin_x + width_box, origin_y + depth_box + height_box * 2);
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
		Box_without_top.draw_single_part(2, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true, true, true);
		Box_without_top.draw_single_part(3, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true, bool_bot, bool_left);
		Box_without_top.draw_single_part(4, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, bool_top, bool_right, true, false);
		Box_without_top.draw_single_part(5, origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, bool_right, bool_bot, false);
		svg_builder.define_attributes_box(width_box + depth_box + 10, height_box * 2 + depth_box + 10);
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
		svg_builder.define_attributes_box(width_box * 2 + depth_box * 2 + 10, height_box * 2 + depth_box + 10);		
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
		svg_builder.define_attributes_box(width_box * 2 + depth_box * 2 + 10, height_box * 4 + depth_box *2 + 10);		
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
	if( width_box < depth_box ){ return 1; } // width_box is the actually the length, and depth_box is the width, which means length must be >= than depth_box
	if( !(wooden_plate_thickness <= ( 0.20 * Math.min(depth_box, height_box)) ) ){ return 2; } // thickness too big
	if( wooden_plate_thickness < 1 ) { return 3; } // thickness < 1 milimeter
}

/**
 * function that check the mod selected, and return a value depending on the error, 0 if no error.
 */
function check_mod() {
	// a simple piece
	// basic scheme
	// line_model
	// column_model
	// square_model
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
	wooden_plate_thickness = selectPlanche[indexSelection].thickness; // = 5;
	console.log(wooden_plate_length + " " + wooden_plate_thickness + " " + wooden_plate_width);
	width_box = Number(document.getElementById("longueur").value); // = 200;
	depth_box = Number(document.getElementById("largeur").value); // = 50;
	height_box = Number(document.getElementById("hauteur").value); // = 50;
	var notch_size = Number(document.getElementById("encoche").value); // = 10;
	
	height_box = height_box - wooden_plate_thickness * 2; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! )
	if( !( notch_size >= 3 ) || !( notch_size < ( 0.40 * Math.min(depth_box, height_box)) ) ) { NOTCH_SIZE = NOTCH_SIZE_DEFAULT; } // to correct the value if the notch size given isnt good
	else { NOTCH_SIZE = notch_size; }
	
	/*var error_id = check_parameters_constraint(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, notch_size)
		switch( error_id ) {
			case 1 : 	console.log("erreur : la largeur est supérieur à la longueur !"); 
						return;
			case 2 : 	console.log("erreur : l'épaisseur est trop grande"); 
						return;
			case 3 : 	console.log("erreur : l'épaisseur est trop petite ( < 3 milimètres )"); 
						return;
			default : 	console.log("pas de problème, y'a point S");
		}*/
		
	if( document.getElementById("formCheck-1").checked ) { Box_with_top.economize_laser_and_wood_line_model(wooden_plate_thickness, wooden_plate_thickness * 2, wooden_plate_thickness, width_box, depth_box, height_box); }
	else { Box_without_top.economize_laser_and_wood_one_box(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true); }
		
	//svg_builder.define_attributes_box(300,600);
		
	// to draw the wooden plate we use, behind the shape we want to cut inside.
	svg_builder.draw_rectangle(1,1,selectPlanche[indexSelection].width,selectPlanche[indexSelection].length,"svgLayer2");
	svg_builder.draw_text(wooden_plate_thickness + 50, wooden_plate_thickness + 15, selectPlanche[indexSelection].width, "svgLayer2");
	svg_builder.draw_text(wooden_plate_thickness + 5, wooden_plate_thickness + 50, selectPlanche[indexSelection].length, "svgLayer2");
	
	// box with top :
		//Box_with_top.economize_laser_and_wood_basic_scheme(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_with_top.economize_laser_and_wood_line_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_with_top.economize_laser_and_wood_column_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_with_top.economize_laser_and_wood_square_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
	
	// box without top :
		//Box_without_top.economize_laser_and_wood_one_box(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box, true, true, true, true);
		//Box_without_top.economize_laser_and_wood_two_boxes(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_without_top.economize_laser_and_wood_four_boxes(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		
	svg_builder.generate_svg_file();
	
	// on retire la viewBox pour que notre affichage sur le site reste visible avec des proportions correctes
	var svg = document.getElementById("svg");
	svg.removeAttribute("transform");
}
