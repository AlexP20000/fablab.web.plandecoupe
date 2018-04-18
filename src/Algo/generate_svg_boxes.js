
var NOTCH_SIZE = 10;

// it create the tag elements necessary and put them inside the svg tag using the tab_coordiante values.
function create_path(tab_coordinate) {
	var svg = document.getElementById("svginfo");
	var newpath = document.createElementNS(svg.namespaceURI,"path");  
	newpath.setAttribute("transform", "translate(50,50)"); 
	newpath.setAttribute("d", tab_coordinate);  
	svg.appendChild(newpath);
}

// function that draws a simple line from a (x,y) to b (x,y)
function draw_line(Ax, Ay, Bx, By) {
	var tab_coordinate = "m " + Ax + "," + Ay + " " + Bx + "," + By + " "; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
	create_path(tab_coordinate);
}

// function that draws a path depending on a (x,y) origin and using rotation eventually.
// return the tab_coordiante which contains all the cuple (x,y) to draw a path
// @param draw_origin_x, draw_origin_x 	are the (x,y) position where we start the drawing.
// @param translate_x, translate_y 		are the (x,y) position where we move our drawing to.
function draw_path(wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, translate_x, translate_y) {
	var tab_coordinate = draw_side(wooden_plate_thickness, size); 							// gets the good values to draw
	tab_coordinate = rotate_path(tab_coordinate, rotate_case) 								// rotate them if need be
	var tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
	create_path(tab_coordinate);
}

// function that return a string with all the scheme "value1,value2" as "x,y" which represent an entire side
// taking care of conflict at the borders if the 'wooden_plate_thickness' is too big for instance
function draw_side(wooden_plate_thickness, size) {
	var inner_size = size - ( wooden_plate_thickness * 2 );
	var coordinate_inner_side = draw_inner_side(wooden_plate_thickness, inner_size);
	return "0,0 " + wooden_plate_thickness + ",0 " + coordinate_inner_side + wooden_plate_thickness + ",0";
}

// function that return a string with all the scheme "value1,value2" as "x,y" which represent the inner part of a side
function draw_inner_side(wooden_plate_thickness, size) {
	var number_notch = get_number_notch(wooden_plate_thickness, size);
	var size_rest = ( size - ( number_notch * NOTCH_SIZE ) );
	var size_rest_parts = ( size_rest / ( number_notch + 1 ) );
	var tab_coordinate = [];
	for( var i = 0 ; i < number_notch ; i++ ) {
		next_coordinate_non_notch(tab_coordinate,size_rest_parts);
		next_coordinate_notch(tab_coordinate,wooden_plate_thickness);
	}
	next_coordinate_non_notch(tab_coordinate,size_rest_parts);
	return tab_coordinate.join('');
}

// function that push in tab_coordinate the two next position that will represent a normal side part
function next_coordinate_non_notch(tab_coordinate,size_rest_parts) {
	tab_coordinate.push([0               + "," + 0 + " "]);
	tab_coordinate.push([size_rest_parts + "," + 0 + " "]);
}

// function that push in tab_coordinate the two next position that will represent a notch
function next_coordinate_notch(tab_coordinate,wooden_plate_thickness) {
	tab_coordinate.push([0          + "," + wooden_plate_thickness + " "]);
	tab_coordinate.push([NOTCH_SIZE + "," + 0 + " "]);
	tab_coordinate.push([0          + "," + -wooden_plate_thickness + " "]);
}

// return the best number_notch possible
// --> the idea is to have aproximatly 50% of a side which is notch, and 50% which isnt
function get_number_notch(wooden_plate_thickness, size) {
	var number_notch = 1;
	while ( number_notch < Math.trunc( size / ( 2 * NOTCH_SIZE ) ) ) {
		number_notch++;
	}
	return number_notch;
}

// for all the scheme "value1,value2" inside splited_tab, it does the rotate_case rotation
// @see rotate(scheme, rotate_case)
function rotate_path(tab_coordinate, rotate_case) {
	var splited_tab = tab_coordinate.split(" ");
	for( var i = 0 ; i < splited_tab.length ; i++ ) {
		splited_tab[i] = rotate(splited_tab[i], rotate_case);
	}
	return splited_tab;
}

// function that modify the direction of the drawing path using things like this scheme : "value1,value2"
// for example it can switch "value1,value2" into "value2,value1"
function rotate(scheme, rotate_case) {
	var stringTab = scheme.split(",");
	var value1 = stringTab[0];
	var value2 = stringTab[1];
	
	switch( rotate_case ) { // by default it draws the top side/path from left to right
		case 1: return value1 + "," + -value2 + " ";	// draw from left to right reversed == default reversed
		case 2: return -value1 + "," + -value2 + " ";	// draw from right to left
		case 3: return -value1 + "," + value2 + " ";	// draw from right to left reversed
		case 4: return -value2 + "," + value1 + " ";	// draw from top to bottom
		case 5: return value2 + "," + value1 + " ";	// draw from top to bottom reversed
		case 6: return value2 + "," + -value1 + " ";	// draw from bottom to top
		case 7: return -value2 + "," + -value1 + " ";	// draw from bottom to top reversed
		default: return scheme;
	}
}

// function that check the form parameters
// print to the screen a error message if an error is found with those parameters and return -1
// else way it return a positive number, which represents the svg case we are in
// svg cases : 1 is the best, every coponents are bounds to the rest by the edges.
// svg cases : 2 is a bit less good, etc...
function check_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box) {
	// case 1 : all bounds
	var case1_length = ( height_box * 2 + depth_box * 2 - wooden_plate_thickness * 3 < wooden_plate_length );
	var case1_width  = ( height_box * 2 + width_box                                  < wooden_plate_width  );
	if( case1_length && case1_width ) return 1;
	// case 2 : all bounds - 1 depth side
	var case2_length = ( height_box * 2 + depth_box * 2 - wooden_plate_thickness * 3 < wooden_plate_length );
	var case2_width  = ( height_box     + width_box                                  < wooden_plate_width  );
	if( case2_length && case2_width ) return 2;
	// case 3 : all bounds - 2 depth side == back, top, both width side
	var case3_length = ( height_box * 2 + depth_box * 2 - wooden_plate_thickness * 3 < wooden_plate_length );
	var case3_width  = (                  width_box                                  < wooden_plate_width  );
	if( case3_length && case3_width ) return 3;
	// case 4 : back, top, one width side
	var case4_length = ( height_box * 2 + depth_box     - wooden_plate_thickness * 2 < wooden_plate_length );
	var case4_width  = (                  width_box                                  < wooden_plate_width  );
	if( case4_length && case4_width ) return 4;
	// case 5 : back, top
	var case5_length = ( height_box     + depth_box     - wooden_plate_thickness     < wooden_plate_length );
	var case5_width  = (                  width_box                                  < wooden_plate_width  );
	if( case5_length && case5_width ) return 5;
	// default : all component separated
	return -1;
}

function tests() {
	wooden_plate_width = 100;
	wooden_plate_length = 100;
	wooden_plate_thickness = 5;
	width_box = 200;
	depth_box = 50;
	height_box = 50;
	
	// draw_path(wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y, translate_x, translate_y);
	// part 1
	draw_path(wooden_plate_thickness, width_box, 1, height_box, 0);
	draw_path(wooden_plate_thickness, height_box, 4, height_box + width_box, 0);
	draw_path(wooden_plate_thickness, width_box, 3, height_box + width_box, height_box);
	draw_path(wooden_plate_thickness, height_box, 6, height_box, height_box);
	// part 2
	draw_path(wooden_plate_thickness, depth_box, 4, height_box + width_box, height_box);
	draw_path(wooden_plate_thickness, width_box, 2, height_box + width_box, height_box + depth_box);
	draw_path(wooden_plate_thickness, depth_box, 6, height_box, height_box + depth_box);
	// part 3
	draw_path(wooden_plate_thickness, height_box, 4, height_box + width_box, height_box + depth_box);
	draw_path(wooden_plate_thickness, width_box, 3, height_box + width_box, height_box + depth_box + height_box);
	draw_path(wooden_plate_thickness, height_box, 6, height_box, height_box + depth_box + height_box);
	// part 4
	draw_path(wooden_plate_thickness, height_box, 3, height_box, height_box - wooden_plate_thickness + depth_box);
	draw_path(wooden_plate_thickness, depth_box - 2 * wooden_plate_thickness, 7, 0, height_box - wooden_plate_thickness + depth_box);
	draw_path(wooden_plate_thickness, height_box, 1, 0, height_box + wooden_plate_thickness);
	// part 5
	draw_path(wooden_plate_thickness, height_box, 1, height_box + width_box, height_box + wooden_plate_thickness);
	draw_path(wooden_plate_thickness, depth_box - 2 * wooden_plate_thickness, 5, height_box * 2 + width_box, height_box + wooden_plate_thickness);
	draw_path(wooden_plate_thickness, height_box, 3, height_box * 2 + width_box, height_box + depth_box - wooden_plate_thickness);
	// path 6
	draw_line(height_box + width_box, height_box * 2 + depth_box, 0, wooden_plate_thickness); // paddng
	draw_path(wooden_plate_thickness, depth_box - wooden_plate_thickness * 2, 4, height_box + width_box, height_box * 2 + depth_box + wooden_plate_thickness);
	draw_line(height_box + width_box, height_box * 2 + depth_box * 2 - wooden_plate_thickness, 0, wooden_plate_thickness); // paddng 
	draw_path(wooden_plate_thickness, width_box, 2, height_box + width_box, height_box * 2 + depth_box * 2);
	draw_line(height_box, height_box * 2 + depth_box * 2, 0, -wooden_plate_thickness); // paddng
	draw_path(wooden_plate_thickness, depth_box - wooden_plate_thickness * 2, 6, height_box, height_box * 2 + depth_box * 2 - wooden_plate_thickness);
	draw_line(height_box, height_box * 2 + depth_box + wooden_plate_thickness , 0, - wooden_plate_thickness); // paddng 
	
}