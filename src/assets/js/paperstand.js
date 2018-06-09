

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
	 *	@param {int} wooden_plate_width the width of the wooden plate the user is using
	 *	@param {int} wooden_plate_length the length of the wooden plate the user is using
	 *	@param {int} wooden_plate_thickness the thickness of the wooden plate the user is using
	 *	@param {int} width_box the width of the box
	 *	@param {int} depth_box the depth of the box
	 *	@param {int} height_box the height of the box
	 *	@param {int} size_stand_front_part the size of the front part of a stand
	 *	@param {int} size_between_stand the size between stands
	 *	@param {int} stand_number the number of stands
	 *	@param {int} angle_degre the angle of inclination of each stands
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
			this.depth_box += (wooden_plate_thickness * 2);
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
		if( (number_part == 1) || (number_part == 2) ){ // side parts
			// the number_part 2 is the same as the 1 but with a miror flip, so we just scale(-1,1) its g tag
			if(number_part == 2)	svg_builder.set_attribute_g_tag(g_tag_id,"scale(-1,1)","translate(-"+(this.depth_box)+",0)","rotate(0,0,0)");
			if(bool_top)	svg_builder.draw_line(origin_x, origin_y, this.depth_box, 0, 0, g_tag_id);
			if(bool_right)	svg_builder.draw_line(origin_x + this.depth_box, origin_y, 0, this.height_box, 0, g_tag_id);
			if(bool_bot)	svg_builder.draw_line(origin_x + this.depth_box, origin_y + this.height_box, -this.depth_box, 0, 0, g_tag_id);
			if(bool_left)	svg_builder.draw_line(origin_x, origin_y + this.height_box, 0, -this.height_box, 0, g_tag_id);
			// we draw as much as we need stands
			for(var i = 0 ; i < this.stand_number ; i++ ) {
				svg_builder.draw_path_rectangle(this.wooden_plate_thickness,this.triangle_hypotenuse_side, 180 + this.angle_degre, origin_x + this.triangle_adjacent_side , origin_y + this.height_box - this.wooden_plate_thickness - ( i * this.size_between_stand), g_tag_id);
				svg_builder.draw_path_rectangle(this.wooden_plate_thickness,this.size_stand_front_part, 270 + this.angle_degre, origin_x + this.triangle_adjacent_side, origin_y + this.height_box - this.wooden_plate_thickness - ( i * this.size_between_stand), g_tag_id);
			}
			svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box + 10);
		} else if(number_part == 3) { // stand main part
			if(bool_top) 	svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y, this.width_box - (2 * this.wooden_plate_thickness), 0, 0, g_tag_id);
			if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.triangle_hypotenuse_side, 5, origin_x + this.width_box - this.wooden_plate_thickness, origin_y, 0, g_tag_id);
			if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box  - (2 * this.wooden_plate_thickness), 3, origin_x + this.width_box - this.wooden_plate_thickness, origin_y + this.triangle_hypotenuse_side, 0, g_tag_id);
			if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.triangle_hypotenuse_side, 7, origin_x + this.wooden_plate_thickness, origin_y + this.triangle_hypotenuse_side, 0, g_tag_id);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.triangle_hypotenuse_side + 10);
		} else if(number_part == 4) { // front part of a stand
			if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box - (2 * this.wooden_plate_thickness), 0, origin_x + this.wooden_plate_thickness, origin_y, 0, g_tag_id);
			if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.size_stand_front_part, 5, origin_x + this.width_box - this.wooden_plate_thickness, origin_y, 0, g_tag_id);
			if(bool_bot) 	svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness, origin_y + this.size_stand_front_part, -this.width_box + (2 * this.wooden_plate_thickness), 0, 0, g_tag_id);
			if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.size_stand_front_part, 7, origin_x + this.wooden_plate_thickness, origin_y + this.size_stand_front_part, 0, g_tag_id);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.size_stand_front_part + 10);
		}
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand side parts in a line model which is the best to economize both wood and laser path.
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_side_parts_line: function (origin_x, origin_y) {
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(2, "g_tag_id_2", origin_x - this.depth_box, origin_y, true, false, true, true);
		svg_builder.define_box_width_and_length((this.depth_box * 2) + 10, this.height_box + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand side parts in a column model which is the best to economize both wood and laser path.
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_side_parts_column: function (origin_x, origin_y) {
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y + this.height_box, false, true, true, true);	
		svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box * 2 + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a line model with one line which is the best to economize both wood and laser path.
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_one_line: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_line(origin_x,origin_y);
		// we draw as much as we need stands
		for(var i = 0 ; i < this.stand_number ; i++ ) {
			this.draw_single_part(3, "g_tag_id_3_copy_"+(i+1), origin_x + (this.depth_box * 2) + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y, true, true, true, true);
			this.draw_single_part(4, "g_tag_id_4_copy_"+(i+1), origin_x + (this.depth_box * 2) + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y + (this.triangle_hypotenuse_side), false, true, true, true);
		}
		svg_builder.define_box_width_and_length((this.depth_box * 2) + (this.width_box * i) + 10, Math.max(this.height_box, (this.triangle_hypotenuse_side) + (this.size_stand_front_part))  + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a line model with two line which is the best to economize both wood and laser path.
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_two_line: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_column(origin_x,origin_y);
		// we draw as much as we need stands
		var is_pair = ( (this.stand_number % 2) == 0 ) ? 1 : 0; // 1 pair, 0 impair
		var todo = Math.floor(this.stand_number/2);
		for( var i = 0 ; i < todo ; i++ ) {
			this.draw_single_part(3, "g_tag_id_3_copy_"+((i*2)+1), origin_x + this.depth_box + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y, true, true, true, true);
			this.draw_single_part(4, "g_tag_id_4_copy_"+((i*2)+1), origin_x + this.depth_box + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y + this.triangle_hypotenuse_side, false, true, true, true);
			this.draw_single_part(3, "g_tag_id_3_copy_"+((i*2)+2), origin_x + this.depth_box + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y + this.triangle_hypotenuse_side + this.size_stand_front_part, false, true, true, true);
			this.draw_single_part(4, "g_tag_id_4_copy_"+((i*2)+2), origin_x + this.depth_box + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y + (2 * this.triangle_hypotenuse_side) + this.size_stand_front_part, false, true, true, true);
		} 
		if(is_pair == 0) { // if impair 
			this.draw_single_part(3, "g_tag_id_3_copy_"+((i*2)+1), origin_x + this.depth_box + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y, true, true, true, true);
			this.draw_single_part(4, "g_tag_id_4_copy_"+((i*2)+1), origin_x + this.depth_box + (i * this.width_box) + (((i+1)*this.wooden_plate_thickness)/2), origin_y + this.triangle_hypotenuse_side, false, true, true, true);
		}
		var width_all_items =  ((this.stand_number % 2) == 0 ) ? this.depth_box + ((Math.floor(this.stand_number/2)) * this.width_box) : this.depth_box + ((Math.floor(this.stand_number/2) + 1) * this.width_box);
		var height_all_items = Math.max((this.height_box * 2), ((this.triangle_hypotenuse_side + this.size_stand_front_part) * 2));	
		svg_builder.define_box_width_and_length(width_all_items + 10, height_all_items + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a column model with one column which is the best to economize both wood and laser path.
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_one_column_model_1: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_column(origin_x,origin_y);
		// we draw as much as we need stands
		for(var i = 0 ; i < this.stand_number ; i++ ) {
			if(i == 0) { // to avoid drawing the top part in duplicate
				this.draw_single_part(3, "g_tag_id_3_copy_"+(i+1), origin_x, origin_y + (this.height_box * 2), true, true, true, true);
				this.draw_single_part(4, "g_tag_id_4_copy_"+(i+1), origin_x, origin_y + (this.triangle_hypotenuse_side) + (this.height_box * 2), false, true, true, true);
			} else {
				this.draw_single_part(3, "g_tag_id_3_copy_"+(i+1), origin_x, origin_y + (this.height_box * 2) + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4, "g_tag_id_4_copy_"+(i+1), origin_x, origin_y + (this.triangle_hypotenuse_side) + (this.height_box * 2) + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
			}
		}
		svg_builder.define_box_width_and_length(Math.max(this.depth_box, this.width_box) + 10, (this.height_box * 2) + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part))  + 10);
	},
	
	/**
	 *	function that draws at a (x,y) position the Box_paper_stand in a column model with two column which is the best to economize both wood and laser path.
	 *	-> perfect for the form ( length 300, width 150, height 350 ) and dynamically (  length 150, width 150, height 350 )
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_all_parts_one_column_model_2: function (origin_x, origin_y) {
		this.economize_laser_and_wood_side_parts_line(origin_x,origin_y);
		// we draw the stands in 1 column
		if( this.depth_box < this.width_box ) {
			// we draw as much as we need stands
			for( var i = 0 ; i < this.stand_number ; i++ ) {
				this.draw_single_part(3, "g_tag_id_3_copy_"+(i+1), origin_x, origin_y + this.height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4, "g_tag_id_4_copy_"+(i+1), origin_x, origin_y + this.height_box + (i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + (this.triangle_hypotenuse_side), false, true, true, true);
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
				this.draw_single_part(3, "g_tag_id_3_copy_"+((i*2)+1), origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4, "g_tag_id_4_copy_"+((i*2)+1), origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + this.triangle_hypotenuse_side, false, true, true, true);
				this.draw_single_part(3, "g_tag_id_3_copy_"+((i*2)+2), origin_x + this.width_box + (this.wooden_plate_thickness/2), origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4, "g_tag_id_4_copy_"+((i*2)+2), origin_x + this.width_box + (this.wooden_plate_thickness/2), origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + this.triangle_hypotenuse_side, false, true, true, true);
			} 
			if(is_pair == 0) { // if impair 
				this.draw_single_part(3, "g_tag_id_3_copy_"+((i*2)+1), origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)), false, true, true, true);
				this.draw_single_part(4, "g_tag_id_4_copy_"+((i*2)+1), origin_x, origin_y + this.height_box + ( i * (this.triangle_hypotenuse_side + this.size_stand_front_part)) + this.triangle_hypotenuse_side, false, true, true, true);
			}
			var width_all_items =  Math.max(this.depth_box * 2, this.width_box);
			var height_all_items = this.height_box + ((Math.ceil(this.stand_number/2)) * (this.triangle_hypotenuse_side + this.size_stand_front_part))// Math.max((this.height_box * 2), ((this.triangle_hypotenuse_side + this.size_stand_front_part) * 2));	
			svg_builder.define_box_width_and_length(width_all_items + 10, height_all_items + 10);
		}
	},
	
	/**
	 *	function that draws the box/part which is selected in the option listStyleType
	 */
	draw_selected_item: function() {
		svg_builder.remove_all_tag_by_class_name("g_tag_piece_box"); // to remove all the box pieces already drawn
		switch( selectedModel() ) {
			case "1" : 	this.draw_single_part(1, "g_tag_id_1", 0, 0, true, true, true, true);
						break;
			case "2" : 	this.draw_single_part(2, "g_tag_id_2", 0, 0, true, true, true, true);
						break;
			case "3" : 	this.draw_single_part(3, "g_tag_id_3", 0, 0, true, true, true, true);
						break;
			case "4" : 	this.draw_single_part(4, "g_tag_id_4", 0, 0, true, true, true, true);
						break;
			case "5" : 	this.economize_laser_and_wood_all_parts_one_line(0, 0);
						break;
			case "6" : 	this.economize_laser_and_wood_all_parts_two_line(0, 0);
						break;
			case "7" : 	this.economize_laser_and_wood_all_parts_one_column_model_1(0, 0);
						break;
			case "8" : 	this.economize_laser_and_wood_all_parts_one_column_model_2(0, 0);
						break;
			default : 	console.log("pas de problème, y'a point S");
		}
	}
};

/**
 *  function used by the third application which creates a paper stand
 *	@param {boolean} download indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app3_paper_stand(download) {
	
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
	NOTCH_SIZE = notch_size;
	THICKNESS = wooden_plate_thickness;
	file_name = "presentoir-"+width_box/10+"cmx"+depth_box/10+"cm_"+wooden_plate_thickness+"mm.svg"; 
	
	var size_stand_front_part = Number(document.getElementById("hauteurPartieAvant").value);
	var size_between_stand = Number(document.getElementById("hauteurSeparation").value);		// 12 cm minimum
	var stand_number = Number(document.getElementById("nombreEtage").value);					// at least 1 please
	var angle_degre = Number(document.getElementById("angle").value);							// the angle of rotation for each stands

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
	
	if( download == true ) svg_builder.generate_svg_file(file_name); // if download is true, it will be downloadable by the user 
	svg_builder.show_layer2();								// to show the result in the good scale
}