/**
 *	@author Axel Murat & Alexandre Mailliu
 *	@version 1.0
 *	@date 24/04/2018
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
 *	@constant
 *	@type {int}
 *	@default
 */
 const NOTCH_SIZE_DEFAULT = 10;

/**
 *	global value for the notch_size used by the algorithm
 *	@type {int}
 */
 var NOTCH_SIZE = 10;

/**
 *	global value for the length of the total box shape/scheme (svg) the user choosed
 *	@type {int}
 */
 var BOX_SCHEME_LENGTH = 0;

/**
 *	global value for the width of the total box shape/scheme (svg) the user choosed
 *	@type {int}
 */
 var BOX_SCHEME_WIDTH = 0;
 
/**
 *	global value for the wooden thickness the user choosed
 *	@type {int}
 */
 var THICKNESS = 0;

/**
 *	@class contains the functions needed to create the svg tag, to make it downloadable, to build it ( the idea is to set multiple path tag inside the g tag of the svg tag, all those path will be the side of your shape at the end ) 
 *	@exemple <svg> <g> <path d="m 10,10 20,20" ></path> </g> </svg>
 */
 var svg_builder = {

	/**
	 *	function that set the values of BOX_SCHEME_LENGTH and BOX_SCHEME_WIDTH for the algorithm
	 *	@param {int} width the width size of the total box shape/scheme
	 *	@param {int} length the length size of the total box shape/scheme
	 */
	 define_box_width_and_length(width, length) {
	 	BOX_SCHEME_WIDTH = width;
	 	BOX_SCHEME_LENGTH = length;
	 },

	/**
	 *	function that defines properly the width, height and the viewbox of the svg object depending on the type of box/parts the user choose. 
	 *	@param {int} width the width of the svg object
	 *	@param {int} height the height of the svg object
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
	 generate_svg_file: function (file_name) {
		// we delete our second layout and make a copie for re-putting it after the download operation
		var wooden_plate_layer = document.getElementById("wooden_plate_layer");
	 	var parentElement = wooden_plate_layer.parentElement;
	 	var clone_wooden_plate_layer = wooden_plate_layer.cloneNode(false);
	 	parentElement.removeChild(wooden_plate_layer);
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
		// my lovely blob
		var aFileParts = ['<?xml version="1.0" encoding="UTF-8" standalone="no"?>', svg_container.innerHTML];
		var oMyBlob = new Blob(aFileParts, {
			type: 'data:image/svg+xml;base64 '
		});
		// we set the uri content
		document.getElementById("filesvg").setAttribute("href", URL.createObjectURL(oMyBlob));
		// we set the file name downloaded
		document.getElementById("filesvg").setAttribute("download", file_name);
		// our a tag is hidden, so we use the click function as we would click on it usualy
		document.getElementById("filesvg").click();
		// we re-put our second layout
	 	parentElement.appendChild(clone_wooden_plate_layer);
		// removing milimeters to show the box on the website in the good scale
		svg.setAttribute("width", svg_width + "");
		svg.setAttribute("height", svg_height + "");
		// reseting the viewbox
		svg_builder.set_viewbox();
	},
		
	/** 
	 *	clear the g tag of the svg tag so that it will be up for new parameters/shapes to be drawn in.
	 *	@param {string} layer the id of the layer g tag you want to clear the components
	 */
	 clear_svg: function (layer){
	 	var svg = document.getElementById(layer);
	 	var parentElement = svg.parentElement;
	 	var emptySvg = svg.cloneNode(false);
	 	parentElement.removeChild(svg);
	 	parentElement.appendChild(emptySvg);
	 },

	/**
	 *	draws the wooden plate on the g tag with the id : "wooden_plate_layer"
	 */
	 draw_layer2: function () {
	 	svg_builder.clear_svg("wooden_plate_layer");
		// to draw (in a second g layout) the wooden plate we use above the shape we want to cut inside.
		svg_builder.draw_rectangle(0.5,0.5,selectPlanche[indexSelection].width,selectPlanche[indexSelection].length,"wooden_plate_layer","#0000ff");
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
	 */
	 show_layer2: function() {
	 	var layer = document.getElementById("wooden_plate_layer");
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
	 *	function that create a <g></g> tag inside the <svg></svg> tag
	 *	@param {string} id the id name you want to give to the g tag
	 */
	create_g_tag: function (id) {
		var svg = document.getElementById("svg");
		var new_g_tag = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		new_g_tag.setAttribute("id", id);
		new_g_tag.setAttribute("class", "g_tag_piece_box");
		svg.appendChild(new_g_tag);
	},
	
	/**
	 *	function that remove all tag with the class name given
	 *	@param {string} class_name the class name of the tags you seek
	 */
	remove_all_tag_by_class_name: function (class_name) {
		var tags = document.getElementsByClassName(class_name);
		while(tags.length > 0){
			tags[0].parentNode.removeChild(tags[0]);
		}
	},

	/**
	 *	function that remove a html tag using its id
	 *	@param {string} id the id name of the tag you seek
	 */
	remove_tag: function (id) {
		var tag = document.getElementById(id);
		tag.parentElement.removeChild(tag);
	},

	/**
	 *	function that set the transform attributes of a tag using its id, it set 3 items (scale, translate, rotate)
	 *	@param {string} id the id name of the tag you seek
	 *	@param {string} scale the scale values you want to use : as "scale(1,1)"
	 *	@param {string} translate the translate values you want to use : as "translate(20,20)" : (abscissa,ordinate)
	 *	@param {string} rotate the rotate values you want to use : as "rotate(90degre,from_x_position,from_y_position)"
	 */
	set_attribute_g_tag: function (id, scale, translate, rotate) {
		var tag = document.getElementById(id);
		tag.setAttribute("id", id);
		tag.setAttribute("transform", scale + translate + rotate);
	},

	/** 
	 *	draw the text parameter inside the svg tag at the (x,y) position
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
	 *	function that draw the rectangle inside the svg tag at the (x,y) : (positionX,positionY) position and for the size (sizeX,sizeY)
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
	 *	function that draws a line of rectangle separated by space, using the same algo technic that the function draw_side(),
	 *	the main purpose of this function is to draw triangle 'holes' in a line to match with the side of a box side ( first use is for paper stand )
	 *	@see <a href="#.draw_side" >draw_side()</a>
	 *	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 *	@param {int} size is the length for which we have to make a path
	 *	@param {int} angle is the angle you want to rotate your path
	 *	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	draw_path_rectangle: function(wooden_plate_thickness, size, angle, draw_origin_x, draw_origin_y, layer) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, true); 	// gets the good values to draw
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, layer);
	},
	
	/**
	 *	function that do the same as draw_path but with tightier notches
	 *	@see <a href="#.draw_path_rectangle" >draw_path_rectangle()</a>
	 *	@see <a href="#.draw_path_tight" >draw_path_tight()</a>
	 *	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 *	@param {int} size is the length for which we have to make a path
	 *	@param {int} angle is the angle you want to rotate your path
	 *	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	draw_path_rectangle_tight: function(wooden_plate_thickness, size, angle, draw_origin_x, draw_origin_y, layer) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size + wooden_plate_thickness*2, true); 	// gets the good values to draw
		tab_coordinate = tab_coordinate.split(' ');
		tab_coordinate[1] = "0,0"; // we delete the "thickness,0" values
		tab_coordinate = tab_coordinate.join(' ');
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, layer);
	},
	
	/**
	 * 	function that draws a circle using svg path tag
	 * 	@param {int} size is the diameter for which we have to make a path
	 * 	@param {int} angle is the angle you want to rotate your path
	 * 	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 * 	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	draw_path_circle: function(size, angle, draw_origin_x, draw_origin_y, layer) {
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " a 1,1 0 0,0 " + size + ",0 a 1,1 0 0,0 " + -size +",0";
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, layer);
	},
	
	/**
	 *	function that draws a half circle using svg path tag
	 *	@see <a href="#.draw_path_circle" >draw_path_circle()</a>
	 *	@param {int} size is the diameter for which we have to make a path
	 *	@param {int} angle is the angle you want to rotate your path
	 *	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {boolean} boolean_down draw a negative half circle, if true the circle points downwards, else ( by default ) it point upwards
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	draw_path_half_circle: function(size, angle, draw_origin_x, draw_origin_y, boolean_down, layer) {
		if(boolean_down) {
			tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " a 1,1 0 0,1 " + size + ",0";
		} else {
			tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " a 1,1 0 0,0 " + size + ",0";
		}
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, layer);
	},
	
	/**
	 *	function that draws a simple line from a (x,y) to b (x,y)
	 *	@param {int} Ax the x (abscissa) initial position
	 *	@param {int} Ay the y (ordinate) initial position
	 *	@param {int} Bx the x (abscissa) position where we must move from Ax
	 *	@param {int} By the y (ordinate) position where we must move from Ay
	 *	@param {int} angle is the angle you want to rotate your path
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	 draw_line: function (Ax, Ay, Bx, By, angle=0, layer) {
		var tab_coordinate = "m " + Ax + "," + Ay + " " + Bx + "," + By + " "; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, Ax, Ay, layer);
	},

	/**
	 *	function that create a string containing the value of the path depending on a (x,y) : (abscissa,ordinate) origin and using rotation eventually.
	 *	return the tab_coordinate which contains all the cuple (x,y) to draw a path
	 *	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 *	@param {int} size is the length for which we have to make a path
	 *	@param {int} rotate_case is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {int} angle is the angle you want to rotate your path
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	draw_path: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, angle=0, layer) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, layer);
	},


	/**
	 *	DEPRACATED, dont use it anymore
	 *	function that do the same as draw_path, but change the total size to make it able to be used for the left and right piece of the box which are tinier on the sides
	 *	reduce the size to ( size - 2 * wooden_plate_thickness ) so it will be able to match with the other part of the box perfectly
	 *	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 *	@param {int} size is the length for which we have to make a path
	 *	@param {int} rotate_case is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {string} layer this is the layer where you want to add your path tag
	 *	@deprecated
	 */
	draw_path_right_left_correction: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, layer) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size, false); 	// gets the good values to draw
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case) 				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		tab_coordinate = tab_coordinate.split(" ");
		tab_coordinate[3] = ""; tab_coordinate[tab_coordinate.length - 2] = "";
		svg_builder.create_path(tab_coordinate.join(' '),0, draw_origin_x, draw_origin_y, layer);
	},
	
	/**
	 *	function that do the same as draw_path but with tightier notches. Very handy when you need to keep the same
	 *	path of notch but with (size-2*wooden_plate_thickness), it is used for inner part of a box, which requires this kind of trick. For exemple the Box_with_top 
	 *	part 5 and 4 use the old version of this function 'draw_path_right_left_correction()' that does the same logic.
	 *	@see <a href="#.draw_path" >draw_path()</a>
	 *	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 *	@param {int} size is the length for which we have to make a path
	 *	@param {int} rotate_case is the case we want to use, there is 8 differents
	 *	@see <a href="#.rotate" >rotate()</a>
	 *	@param {int} draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int} draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {int} angle is the angle you want to rotate your path
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	draw_path_tight: function (wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, angle=0, layer) {
		var tab_coordinate = svg_builder.draw_side(wooden_plate_thickness, size + wooden_plate_thickness*2, false); 	// gets the good values to draw
		tab_coordinate = tab_coordinate.split(' ');
		tab_coordinate[1] = "0,0"; tab_coordinate[tab_coordinate.length - 1] = "0,0";		// we delete the twos "thickness,0" values
		tab_coordinate = tab_coordinate.join(' ');
		tab_coordinate = svg_builder.rotate_path(tab_coordinate, rotate_case);				// rotate them if need be
		tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, layer);
	},
	
	
	/** 
	 *	creates the tag elements necessary and put them inside the svg tag using the tab_coordinate values, and using layer as the g tag target.
	 *	@param {string} tab_coordinate the values (x,y) : (abscissa,ordinate) of the different path position 
	 *	@param {integer} [angle=0] - Angle of the path (optional parameter, default value = 0)
	 *	@param {int}  draw_origin_x is the x (abscissa) position where we start the drawing.
	 *	@param {int}  draw_origin_y is the y (ordinate) position where we start the drawing.
	 *	@param {string} layer this is the layer where you want to add your path tag
	 */
	create_path: function (tab_coordinate, angle, draw_origin_x, draw_origin_y, layer) {
		var layer_chosen = document.getElementById(layer);
		var newpath = document.createElementNS(layer_chosen.namespaceURI,"path");  
		newpath.setAttribute("d", tab_coordinate);
		newpath.setAttribute("fill", "transparent");
		// we need to put "angle draw_origin_x draw_origin_y" as a rotation to delete the offset made by default by "rotate(angle)"
		newpath.setAttribute("transform", "rotate(" + angle + " " + draw_origin_x + " " + draw_origin_y + ")");  
		layer_chosen.appendChild(newpath);
	},
	
	/** 
	 *	function that return a string with all the scheme "value1,value2" as "x,y" : (abscissa,ordinate) which represent an entire side
	 *	taking care of conflict at the borders if the 'wooden_plate_thickness' is too big for instance
	 *	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 *	@param {int} size is the length for which we have to make a path
	 *	@param {boolean} rectangle if we want to create a path with rectangle it will be true, else false
	 *	@return {string} containing the values (x,y) : (abscissa,ordinate) of the different path position for an entire side
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
	 *	function that return a string with all the scheme "value1,value2" as "x,y" : (abscissa,ordinate) which represent the inner part of a side
	 * 	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 * 	@param {int} size is the length for which we have to make a path
	 *	@param {boolean} rectangle if we want to create a path with rectangle (notch holes) it must be true, else false (by default false)
	 *	@return {string} containing the values (x,y) : (abscissa,ordinate) of the different path position for the inner part of a side
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
	 *	function that push in tab_coordinate the two next position that will represent a move "m" to a location x (abscissa) for size move
	 *	@param {string[]} tab_coordinate the values (x,y) : (abscissa,ordinate) of the different path position
	 * 	@param {int} size is the size for which we have to move to in the x (abscissa)
	 */
	next_coordinate_move: function (tab_coordinate,size) {
		tab_coordinate.push(["m" + " " + size + "," + 0 + " "]);
	},
	
	/**
	 *	function that push in tab_coordinate the four next positions that will represent a rectangle ( as a notch hole )
	 *	@param {string[]} tab_coordinate the values (x,y) : (abscissa,ordinate) of the different path position used for the length of the rectangle
	 * 	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the rectangle
	 */
	next_coordinate_rectangle: function (tab_coordinate,wooden_plate_thickness) {
		tab_coordinate.push([NOTCH_SIZE		+ ","	+ 0 						+ " "]);
		tab_coordinate.push([0				+ ","	+ wooden_plate_thickness	+ " "]);
		tab_coordinate.push([-NOTCH_SIZE	+ ","	+ 0 						+ " "]);
		tab_coordinate.push([0				+ ","	+ -wooden_plate_thickness	+ " "]);
	},
	
	/** 
	 *	function that push in tab_coordinate the two next positions that will represent a normal side part
	 *	@param {string[]} tab_coordinate the values (x,y) : (abscissa,ordinate) of the different path position which is a straight line, not a notch
	 * 	@param {int} size is the size for which we have to draw a straight line
	 */
	next_coordinate_non_notch: function (tab_coordinate,size) {
		tab_coordinate.push([0    + "," + 0 + " "]);
		tab_coordinate.push([size + "," + 0 + " "]);
	},

	/**
	 *	function that push in tab_coordinate the two next position that will represent a notch
	 *	@param {string[]} tab_coordinate the values (x,y) : (abscissa,ordinate) of the different path position which is a notch ( meaning a rectangle shape with a side open )
	 * 	@param {int} wooden_plate_thickness is the thickness of the plate, used for the depth of the notch
	 */
	 next_coordinate_notch: function (tab_coordinate,wooden_plate_thickness) {
	 	tab_coordinate.push([0          + "," + wooden_plate_thickness 	+ " "]);
	 	tab_coordinate.push([NOTCH_SIZE + "," + 0 						+ " "]);
	 	tab_coordinate.push([0          + "," + -wooden_plate_thickness + " "]);
	 },

	/** 
	 * 	function that returns the best number_notch possible
	 *	--> the idea is to have aproximatly 50% of a side which is notch, and 50% which isnt
	 * 	@param {int} wooden_plate_thickness  is the thickness of the plate, used for the depth of the notch
	 * 	@param {int} size is the length for which we have to make a path
	 * 	@return {int} the number of notch we can afford on the side having size length
	 */
	get_number_notch: function (size) {
		var number_notch = 1;
		while ( number_notch < Math.trunc( size / ( 2 * NOTCH_SIZE ) ) ) {
			number_notch++;
		}
		return number_notch;
	},

	/**
	 *	function that does the rotate_case rotation for all the scheme "value1,value2" inside tab_coordinate
	 *	@param {string[]} tab_coordinate the values (x,y) : (abscissa,ordinate) of the different path position
	 *	@param {int} rotate_case is the case we want to use, there is 8 differents
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
	 *	@param {string} scheme which is like "value1,value2"
	 *	@param {int} rotate_case is the case we want to use, there is 8 differents
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


/*
 *  function type to show how you have to start to create a new box, to test it, first of all here, then gets to somethings that looks like the previous completed boxes.
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
/*function app0_my_super_box(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("wooden_plate_layer");
	
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