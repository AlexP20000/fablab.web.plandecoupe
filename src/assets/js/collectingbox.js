
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
	 *	@param {int} wooden_plate_width the width of the wooden plate the user is using
	 *	@param {int} wooden_plate_length the length of the wooden plate the user is using
	 *	@param {int} wooden_plate_thickness the thickness of the wooden plate the user is using
	 *	@param {int} width_box the width of the box
	 *	@param {int} depth_box the depth of the box
	 *	@param {int} height_box the height of the box
	 *	@param {int} angle_degre the angle of the front part of the box
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
	 *	@param {int} number_part the number of the part
	 *	@param {int} g_tag_id the id of the g tag containing the box piece. Used for referencing the box piece with svg_builder.set_attribute_g_tag()
	 *	@see <a href="#svg_builder.set_attribute_g_tag()" >svg_builder.set_attribute_g_tag()</a>
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 *	@param {boolean} bool_top if true the top side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_right if true the right side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_bot if true the bot side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_left if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, g_tag_id, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		svg_builder.create_g_tag(g_tag_id);
		if( number_part == 1) { // front plate part
			if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 1, origin_x, origin_y + this.wooden_plate_thickness, 0, g_tag_id);
	 		if(bool_right)	svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y + this.wooden_plate_thickness, g_tag_id);
	 		if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box - this.wooden_plate_thickness, 0, g_tag_id);
	 		if(bool_left) 	svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box - this.wooden_plate_thickness, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box, this.height_box);
		}
		else if( (number_part == 2 ) || (number_part == 6) ) { // ceilling and floor plate part 
			// the number_part 6 is the same as the 2 but with a miror flip, so we just scale(-1,1) its g tag
			if(number_part == 6)	svg_builder.set_attribute_g_tag(g_tag_id,"scale(1,1)","translate(0,0)","rotate(180,"+(this.width_box/2-this.wooden_plate_thickness)+","+(this.depth_box/2)+")");
			if(bool_top) svg_builder.draw_path_tight(this.wooden_plate_thickness, this.width_box - this.wooden_plate_thickness*2, 0, origin_x, origin_y, 0, g_tag_id);
			var parts_side = (this.depth_box - this.wooden_plate_thickness*2)/5;
			if(bool_right) { 
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y, 0, this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 5, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side + this.wooden_plate_thickness, 0, parts_side, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 5, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side*2 + this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side*3 + this.wooden_plate_thickness, 0, parts_side, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 5, origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + parts_side*4 + this.wooden_plate_thickness, 0, g_tag_id);
			}
	 		if(bool_bot) svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness*2, origin_y + this.depth_box - this.wooden_plate_thickness, - this.width_box + this.wooden_plate_thickness*2, 0, 0, g_tag_id);
			if(bool_left) {
				svg_builder.draw_line(origin_x, origin_y, 0, this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 4, origin_x, origin_y + this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x, origin_y + parts_side + this.wooden_plate_thickness, 0, parts_side, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 4, origin_x, origin_y + parts_side*2 + this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x, origin_y + parts_side*3 + this.wooden_plate_thickness, 0, parts_side, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 4, origin_x, origin_y + parts_side*4 + this.wooden_plate_thickness, 0, g_tag_id);
			}
	 		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness*2, this.depth_box + this.wooden_plate_thickness);
		}
		else if( number_part == 3 ) { // back plate part
			if(bool_top) svg_builder.draw_line(origin_x, origin_y, this.width_box, 0, 0, g_tag_id);
	 		if(bool_right) {
				svg_builder.draw_line(origin_x + this.width_box, origin_y, 0, this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_path_tight(this.wooden_plate_thickness, this.hypotenuse_2 - this.wooden_plate_thickness*2, 4, origin_x + this.width_box, origin_y + this.wooden_plate_thickness, 0, g_tag_id);
			}
	 		if(bool_bot) svg_builder.draw_line(origin_x + this.width_box, origin_y + this.hypotenuse_2 - this.wooden_plate_thickness, -this.width_box, 0, 0, g_tag_id);
	 		if(bool_left) {
				svg_builder.draw_path_tight(this.wooden_plate_thickness, this.hypotenuse_2 - this.wooden_plate_thickness*2, 6, origin_x, origin_y + this.hypotenuse_2 - this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x, origin_y + this.wooden_plate_thickness, 0, - this.wooden_plate_thickness, 0, g_tag_id);
			 }
	 		svg_builder.define_box_width_and_length(this.width_box, this.hypotenuse_2);
	 	} 
		else if( (number_part == 4) || (number_part == 5) ){ // side plate parts
			// the number_part 5 is the same as the 4 but with a miror flip, so we just scale(-1,1) its g tag
			if(number_part == 5)	svg_builder.set_attribute_g_tag(g_tag_id,"scale(-1,1)","translate(-"+(this.depth_box+this.opposite)+",0)","rotate(0,0,0)");
			var parts_side = (this.depth_box - this.wooden_plate_thickness*2)/5;
			if(bool_top) { 
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 0, origin_x, origin_y, 0, g_tag_id);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side, origin_y, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 0, origin_x + parts_side*2, origin_y, 0, g_tag_id);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side*3, origin_y, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 0, origin_x + parts_side*4, origin_y, 0, g_tag_id);
			}
			if(bool_right) {
				svg_builder.draw_line(origin_x + this.depth_box - this.wooden_plate_thickness*2, origin_y, this.opposite, this.adjacent_1, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, this.hypotenuse_2, 0, origin_x + this.depth_box - this.wooden_plate_thickness*2, origin_y + this.height_box, -90+this.angle_degre, g_tag_id); // in javascript the angle are reversed from maths ( 90 goes to the bot, -90 goes to the top direction )
			}
			if(bool_bot) {
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 1, origin_x, origin_y + this.height_box, 0, g_tag_id);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side, origin_y + this.height_box, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 1, origin_x + parts_side*2, origin_y + this.height_box, 0, g_tag_id);
				svg_builder.draw_path_tight(this.big_notch_depth, parts_side, 1, origin_x + parts_side*3, origin_y + this.height_box, 0, g_tag_id);
				svg_builder.draw_path(this.wooden_plate_thickness, parts_side, 1, origin_x + parts_side*4, origin_y + this.height_box, 0, g_tag_id);
			}
			if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x, origin_y, 0, g_tag_id);
			svg_builder.define_box_width_and_length(this.depth_box + this.opposite, this.height_box + this.big_notch_depth);
		}
	},
		
	/** 
	 *	function that draws at a (x,y) position the line model 1 which is the best to economize both wood and laser path
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 */
	 economize_laser_and_wood_all_part: function (origin_x, origin_y) {
		this.draw_single_part(2, "g_tag_id_2", origin_x + this.wooden_plate_thickness, origin_y, true, true, true, true);
		this.draw_single_part(6, "g_tag_id_6", origin_x - this.wooden_plate_thickness, origin_y - this.depth_box - this.wooden_plate_thickness*2, false, true, false, true);
		this.draw_single_part(4, "g_tag_id_4",origin_x + this.width_box + this.wooden_plate_thickness*1.5, origin_y + this.big_notch_depth, true, true, true, true);
		this.draw_single_part(5, "g_tag_id_5",origin_x, origin_y, true, true, true, true);
		svg_builder.set_attribute_g_tag("g_tag_id_5","scale(-1,1)","translate(-"+(this.width_box+this.wooden_plate_thickness*1.5)+","+((this.height_box*2)+(this.big_notch_depth*3)+this.wooden_plate_thickness*0.5)+")","rotate(180,0,0)");
		this.draw_single_part(1, "g_tag_id_1",origin_x, origin_y + this.depth_box*2 - this.wooden_plate_thickness*3, true, true, true, true);
		this.draw_single_part(3, "g_tag_id_3",origin_x, origin_y + this.depth_box*2 + this.height_box - this.wooden_plate_thickness*2.5, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box + this.depth_box + this.opposite + 10, Math.max(this.depth_box*2, this.height_box) + this.hypotenuse_2 + this.height_box + this.big_notch_depth + 10);
	 },

	/**
	 *	function that draws the box/part which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		svg_builder.remove_all_tag_by_class_name("g_tag_piece_box"); // to remove all the box pieces already drawn
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1, "g_tag_id_1", 0, 0, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2, "g_tag_id_2",  this.wooden_plate_thickness,  this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3, "g_tag_id_3", 0, 0, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4, "g_tag_id_4", this.wooden_plate_thickness, this.big_notch_depth, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5, "g_tag_id_5", this.wooden_plate_thickness, this.big_notch_depth, true, true, true, true);
						break;
			case 6 : 	this.draw_single_part(6, "g_tag_id_6", -this.wooden_plate_thickness, -this.wooden_plate_thickness, true, true, true, true);
						break;
			case 7 :	this.economize_laser_and_wood_all_part(0,this.big_notch_depth);
						break;
			default : 	
		}
	}
};

/**
 *  function used by the fourth application which creates a "collecting box".
 *	@param {boolean} download indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app5_collecting_box(download) {
	
	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("wooden_plate_layer");
	
	// parameters from the form
	var wooden_plate_width = selectPlanche[indexSelection].width;
	var wooden_plate_length = selectPlanche[indexSelection].length;
	var wooden_plate_thickness = selectPlanche[indexSelection].thickness;
	var width_box = Number(document.getElementById("longueur").value);
	var depth_box = Number(document.getElementById("largeur").value);
	var height_box = Number(document.getElementById("hauteur").value);
	var notch_size = Number(document.getElementById("encoche").value);
	var angle_degre = Number(document.getElementById("angle").value);
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	file_name = "collectingBox-"+width_box/10+"x"+depth_box/10+"cm_"+wooden_plate_thickness+"mm.svg"; 
	var big_notch_depth = wooden_plate_thickness*2;
	
	var app5_collecting_box = Object.create(Collecting_box);
	app5_collecting_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, angle_degre, big_notch_depth);
	
	// to correct the height,width,depth lack ( its the fact that we must count the wooden_plate_thickness ), it depends on the way we choose to build our Collecting_box object, it could be simplified later on of course.
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
	
	if( download == true ) svg_builder.generate_svg_file(file_name); 	// if download is true, it will be downloadable by the user 
	svg_builder.show_layer2();											// to show the result in the good scale
}
