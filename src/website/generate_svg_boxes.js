// the default size of a notch
var NOTCH_SIZE_DEFAULT = 10;
var NOTCH_SIZE = 10;

// it create the tag elements necessary and put them inside the svg tag using the tab_coordinate values.
function create_path(tab_coordinate) {
	var svg = document.getElementById("svginfo");
	var newpath = document.createElementNS(svg.namespaceURI,"path");  
	newpath.setAttribute("d", tab_coordinate);  
	svg.appendChild(newpath);
}

// clear the svg tag so that it will be up for new parameters/shapes to be drawn in
function clear_svg(){
	var svg = document.getElementById("svginfo");
	var parentElement = svg.parentElement;
    var emptySvg = svg.cloneNode(false);
    parentElement.removeChild(svg);
    parentElement.appendChild(emptySvg);
}

// function that draws a simple line from a (x,y) to b (x,y)
function draw_line(Ax, Ay, Bx, By) {
	var tab_coordinate = "m " + Ax + "," + Ay + " " + Bx + "," + By + " "; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
	create_path(tab_coordinate);
}

// function that create a string containing the value of the path depending on a (x,y) origin and using rotation eventually.
// return the tab_coordinate which contains all the cuple (x,y) to draw a path
// @param draw_origin_x, draw_origin_x 	are the (x,y) position where we start the drawing.
// @param translate_x, translate_y 		are the (x,y) position where we move our drawing to.
function draw_path(wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y) {
	var tab_coordinate = draw_side(wooden_plate_thickness, size); 							// gets the good values to draw
	tab_coordinate = rotate_path(tab_coordinate, rotate_case) 								// rotate them if need be
	tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
	create_path(tab_coordinate);
}

// function that do the same as draw_path, but change the total size to make it able to be used for the left and right piece of the box which are tinier on the sides
function draw_path_right_left_correction(wooden_plate_thickness, size, rotate_case, draw_origin_x, draw_origin_y) {
	var tab_coordinate = draw_side(wooden_plate_thickness, size); 							// gets the good values to draw
	tab_coordinate = rotate_path(tab_coordinate, rotate_case) 								// rotate them if need be
	tab_coordinate = "m " + draw_origin_x + "," + draw_origin_y + " " + tab_coordinate; // just put the relative mod for svg path "m" and take start drawing at (draw_origin_x, draw_origin_y)
	tab_coordinate = tab_coordinate.split(" ");
	tab_coordinate[3] = ""; tab_coordinate[tab_coordinate.length - 2] = "";
	create_path(tab_coordinate.join(' '));
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
	tab_coordinate.push([0          + "," + wooden_plate_thickness 	+ " "]);
	tab_coordinate.push([NOTCH_SIZE + "," + 0 						+ " "]);
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
		case 5: return value2 + "," + value1 + " ";		// draw from top to bottom reversed
		case 6: return value2 + "," + -value1 + " ";	// draw from bottom to top
		case 7: return -value2 + "," + -value1 + " ";	// draw from bottom to top reversed
		default: return scheme;
	}
}

var Box_with_top = {
	
	// function that draws at a (x,y) position the basic scheme ( 3 pieces bounds perfecly ) which is the best
	// to economize both wood and laser path.
	// @boolean_duplicate_right, boolean_duplicate_bottom are boolean values which tell us wether a side mustnt be drawn to avoid duplicate
	economize_laser_and_wood_basic_scheme: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, boolean_duplicate_right, boolean_duplicate_bottom) {
		// part 1 == part 3
		draw_path(wooden_plate_thickness, width_box, 1, origin_x , origin_y);
		draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y);
		draw_path(wooden_plate_thickness, width_box, 3, origin_x + width_box, origin_y + height_box);
		draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box);
		// part 2 == part 6
		draw_path(wooden_plate_thickness, depth_box, 4, origin_x + width_box, origin_y + height_box);
		if(!boolean_duplicate_bottom) { draw_path(wooden_plate_thickness, width_box, 2, origin_x + width_box, origin_y + height_box + depth_box); }
		draw_path(wooden_plate_thickness, depth_box, 6, origin_x, origin_y + height_box + depth_box);
		// part 5 == part 4
		draw_path(wooden_plate_thickness, height_box, 1, origin_x + width_box, origin_y + height_box + wooden_plate_thickness);
		if(!boolean_duplicate_right) { draw_path_right_left_correction(wooden_plate_thickness, depth_box, 5, origin_x + height_box + width_box, origin_y + height_box + wooden_plate_thickness); }
		draw_path(wooden_plate_thickness, height_box, 3, origin_x + height_box + width_box, origin_y + height_box + depth_box - wooden_plate_thickness);
		define_attributes_box(width_box + height_box + 10, depth_box + height_box + 10);
	},
	
	// draws at a (x,y) position the line model which is the best to economize both wood and laser path
	// line model means it use the basic scheme 2 times in line.
	economize_laser_and_wood_line_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		define_attributes_box(width_box * 2 + height_box * 2 + 10, depth_box + height_box + 10);
	},

	// draws at a (x,y) position the column model which is the best to economize both wood and laser path
	// column model means it use the basic scheme 2 times in column.
	economize_laser_and_wood_column_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		define_attributes_box(width_box + height_box + 10, depth_box * 2 + height_box * 2 + 10);
	},

	// draws at (x,y) position 4 basic scheme which is the best to economize both wood and laser path
	// this is of couse used to draw two boxes, and have them inside the same svg.
	economize_laser_and_wood_square_model: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, true, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y, wooden_plate_thickness, width_box, depth_box, height_box, false, true);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, true, false);
		Box_with_top.economize_laser_and_wood_basic_scheme(origin_x + width_box + height_box, origin_y + height_box + depth_box, wooden_plate_thickness, width_box, depth_box, height_box, false, false);
		define_attributes_box(width_box * 2 + height_box * 2 + 10, depth_box * 2 + height_box * 2 + 10);
	}
};


// function that draws at a (x,y) position the box without top which is the best to economize both wood and laser path.
var Box_without_top = {
	economize_laser_and_wood_one_box: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		// part 1
		draw_line(origin_x, origin_y, width_box, 0);
		draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y);
		draw_path(wooden_plate_thickness, width_box, 3, origin_x + width_box, origin_y + height_box);
		draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box);
		// part 2
		draw_path(wooden_plate_thickness, depth_box, 4, origin_x + width_box, origin_y + height_box);
		draw_path(wooden_plate_thickness, width_box, 2, origin_x + width_box, origin_y + height_box + depth_box);
		draw_path(wooden_plate_thickness, depth_box, 6, origin_x, origin_y + height_box + depth_box);
		// part 3
		draw_path(wooden_plate_thickness, height_box, 4, origin_x + width_box, origin_y + height_box + depth_box);
		draw_line(origin_x + width_box, origin_y + height_box * 2 + depth_box, -width_box, 0);
		draw_path(wooden_plate_thickness, height_box, 6, origin_x, origin_y + height_box * 2 + depth_box);
		// part 4		
		draw_line(origin_x + width_box, origin_y, depth_box - wooden_plate_thickness * 2, 0);
		draw_path(wooden_plate_thickness, height_box, 5, origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y);
		draw_path_right_left_correction(wooden_plate_thickness, depth_box, 3, origin_x + depth_box - wooden_plate_thickness * 2 + width_box, origin_y + height_box);
		// part 5
		draw_path_right_left_correction(wooden_plate_thickness, depth_box, 1, origin_x + width_box, origin_y + depth_box + height_box);
		draw_path(wooden_plate_thickness, height_box, 5, origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y + depth_box + height_box);
		draw_line(origin_x + width_box + depth_box - wooden_plate_thickness * 2, origin_y + depth_box + height_box * 2, - depth_box + wooden_plate_thickness * 2, 0);
		define_attributes_box(width_box + depth_box + 10, height_box * 2 + depth_box + 10);
	},
	
	economize_laser_and_wood_two_boxes: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_without_top.economize_laser_and_wood_one_box(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box);
		Box_without_top.economize_laser_and_wood_one_box(origin_x + depth_box + width_box - wooden_plate_thickness * 2, origin_y, wooden_plate_thickness, width_box, depth_box, height_box);
		define_attributes_box(width_box * 2 + depth_box * 2 + 10, height_box * 2 + depth_box + 10);		
	},
	
	economize_laser_and_wood_four_boxes: function (origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box) {
		Box_without_top.economize_laser_and_wood_two_boxes(origin_x, origin_y, wooden_plate_thickness, width_box, depth_box, height_box);
		Box_without_top.economize_laser_and_wood_two_boxes(origin_x, origin_y + height_box * 2 +  depth_box, wooden_plate_thickness, width_box, depth_box, height_box);
		define_attributes_box(width_box * 2 + depth_box * 2 + 10, height_box * 4 + depth_box *2 + 10);		
	}
};

// function that check is the constraint of our initial parameters are respected or not, return a value depending on the error, 0 is no error.
function check_parameters_constraint(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, notch_size) {
	if( width_box < depth_box ){ return 1; } // width_box is the actually the length, and depth_box is the width, which means length must be >= than depth_box
	if( !(wooden_plate_thickness <= ( 0.20 * Math.min(depth_box, height_box)) ) ){ return 2; } // thickness too big
	if( wooden_plate_thickness < 1 ) { return 3; } // thickness < 1 milimeter
}

// function that check the mod selected, and return a value depending on the error, 0 if no error.
function check_mod() {
	// a simple piece
	// basic scheme
	// line_model
	// column_model
	// square_model
}

function tests(wooden_plate_thickness, width_box, depth_box, height_box) {
	document.getElementById("previsualisation").click();
	clear_svg();
	wooden_plate_width = selectPlanche[indexSelection].width;
	wooden_plate_length = selectPlanche[indexSelection].height;
	wooden_plate_thickness = selectPlanche[indexSelection].thickness; // = 5;
	console.log(wooden_plate_length + " " + wooden_plate_thickness + " " + wooden_plate_width);
	width_box = Number(document.getElementById("longueur").value); // = 200;
	depth_box = Number(document.getElementById("largeur").value); // = 50;
	height_box = Number(document.getElementById("hauteur").value); // = 50;
	var notch_size = Number(document.getElementById("encoche").value); // = 10;
	
	height_box = height_box - wooden_plate_thickness * 2; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness ! )
	if( !( notch_size >= 3 ) || !( notch_size < ( 0.40 * Math.min(depth_box, height_box)) ) ) { NOTCH_SIZE = NOTCH_SIZE_DEFAULT; } // to correct the value if the notch size given isnt good
	else { NOTCH_SIZE = notch_size; }
	
	var error_id = check_parameters_constraint(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, notch_size)
		switch( error_id ) {
			case 1 : 	console.log("erreur : la largeur est supérieur à la longueur !"); 
						return;
			case 2 : 	console.log("erreur : l'épaisseur est trop grande"); 
						return;
			case 3 : 	console.log("erreur : l'épaisseur est trop petite ( < 3 milimètres )"); 
						return;
			default : 	console.log("pas de problème, y'a point S");
		}
		
	if( document.getElementById("formCheck-1").checked ) { Box_with_top.economize_laser_and_wood_line_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box); }
	else { Box_without_top.economize_laser_and_wood_one_box(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box); }
	  
	
	// box with top :
		//Box_with_top.economize_laser_and_wood_basic_scheme(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_with_top.economize_laser_and_wood_line_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_with_top.economize_laser_and_wood_column_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_with_top.economize_laser_and_wood_square_model(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
	
	// box without top :
		//Box_without_top.economize_laser_and_wood_one_box(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_without_top.economize_laser_and_wood_two_boxes(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		//Box_without_top.economize_laser_and_wood_four_boxes(wooden_plate_thickness, wooden_plate_thickness, wooden_plate_thickness, width_box, depth_box, height_box);
		
	generate_svg_file();
	
	// on retire la viewBox pour que notre affichage sur le site reste visible avec des proportions correctes
	var svg = document.getElementById("svg");
	svg.removeAttribute("transform");
}

// function that defines properly the width, height and the viewbox of the final svg object depending on the box the user choose
// it allows the svg file to be consider with the units 'mm' milimeters.
function define_attributes_box(width, height) {
	var svg = document.getElementById("svg");
	svg.setAttribute("width",width);
	svg.setAttribute("height",height);
	var stringViewBox = "0 0 " + width + " " + height; 	//var stringViewBox = "0 0 " + Number(svg.getAttribute("width").replace(/[^\d]/g, "")) + " " + Number(svg.getAttribute("height").replace(/[^\d]/g, ""));
	svg.setAttribute("viewBox",stringViewBox);
	var stringTranslate = "translate(" + ( width / 2.7 ) + " " + ( height / 2.7 ) + ")";
	svg.setAttribute("transform","scale(3.779528)" + stringTranslate); // dpi problems, scale px in mm
}

// encode the data from the svg tag into URI data, and then set those information directly to the a tag.
// then we use the magic function click that simulate a human click on this a tag, which open the download yes/no window.
function generate_svg_file() {
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
}