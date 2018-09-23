
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
	 *	@param {int} wooden_plate_width the width of the wooden plate
	 *	@param {int} wooden_plate_length the length of the wooden plate
	 *	@param {int} wooden_plate_thickness the thickness of the wooden plate
	 *	@param {int} width_box the width of the box
	 *	@param {int} depth_box the depth of the box
	 *	@param {int} height_box the height of the box
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
		if( this.width_box < 40 ) return 3; // the width_box must be minimum 5cm
		if( this.depth_box < 40 ) return 4; // the depth_box must be minimum 8cm
		if( this.height_box < 40 ) return 5; // the height_box must be minimum 5cm
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		if( NOTCH_SIZE*2 > Math.min(this.width_box,Math.min(this.depth_box,this.height_box)) ) return 2; // if the notch_size is too big
		return 0; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_with_top
	 *	@param {int} number_part the number of the part of the Box_with_top
	 *	@param {int} g_tag_id the id of the g tag containing the box piece. Used for referencing the box piece with svg_builder.set_attribute_g_tag()
	 *	@see <a href="#svg_builder.set_attribute_g_tag()" >svg_builder.set_attribute_g_tag()</a>
	 *	@param {int} origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y {int} its the y (ordinate) origin of the drawing of this part
	 *	@param {boolean} bool_top if true the top side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_right if true the right side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_bot if true the bot side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_left if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, g_tag_id, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		svg_builder.create_g_tag(g_tag_id);
		if( (number_part == 1) || (number_part == 3) ) {
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 1, origin_x , origin_y, 0, g_tag_id);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box, 0, g_tag_id);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box, this.height_box + this.wooden_plate_thickness*2);
	 	} else if( (number_part == 2) || (number_part == 6) ) {
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 0, origin_x, origin_y, 0, g_tag_id);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 2, origin_x + this.width_box, origin_y + this.depth_box, 0, g_tag_id);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 6, origin_x, origin_y + this.depth_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box, this.depth_box + this.wooden_plate_thickness*2);
	 	} else if( (number_part == 5) || (number_part == 4) ) {
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 1, origin_x, origin_y + this.wooden_plate_thickness, 0, g_tag_id);
	 		if(bool_right) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 5, origin_x + this.height_box, origin_y + this.wooden_plate_thickness, g_tag_id);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 3, origin_x + this.height_box, origin_y + this.depth_box - this.wooden_plate_thickness, 0, g_tag_id);
	 		if(bool_left) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 7, origin_x, origin_y + this.depth_box - this.wooden_plate_thickness, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.height_box + this.wooden_plate_thickness*2, this.depth_box + this.wooden_plate_thickness*2);
	 	}
	 },

	/** 
	 *	function that draws at a (x,y) position the box with top in the model 1
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 */
	economize_laser_and_wood_model_1: function (origin_x, origin_y) {
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y, true, false, true, false);
		this.draw_single_part(6, "g_tag_id_6", origin_x + this.width_box + this.height_box, origin_y, true, true, true, true);
		this.draw_single_part(5, "g_tag_id_5", origin_x + this.width_box*2 + this.height_box, origin_y, true, true, true, false);
		this.draw_single_part(1, "g_tag_id_1", origin_x + this.width_box*2 + this.height_box*2 + this.wooden_plate_thickness*1.5, origin_y + this.wooden_plate_thickness, true, true, true, true);
		this.draw_single_part(3, "g_tag_id_3", origin_x + this.width_box*3 + this.height_box*2 + this.wooden_plate_thickness*2, origin_y + this.wooden_plate_thickness, true, true, true, true);
	 	svg_builder.define_box_width_and_length(this.width_box*4 + this.height_box*2 + this.wooden_plate_thickness*4, Math.max(this.depth_box,this.height_box) + this.wooden_plate_thickness);
	 },

	/**
	 *	function that draws at a (x,y) position the box with top in the model 2
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 */
	 economize_laser_and_wood_model_2: function (origin_x, origin_y) {
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y, true, false, true, false);
		this.draw_single_part(6, "g_tag_id_6", origin_x + this.width_box + this.height_box, origin_y, true, true, true, true);
		this.draw_single_part(5, "g_tag_id_5", origin_x + this.width_box*2 + this.height_box, origin_y, true, true, true, false);
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y + this.depth_box, false, true, true, true);
		this.draw_single_part(3, "g_tag_id_3", origin_x + this.width_box + this.wooden_plate_thickness/2, origin_y + this.depth_box + this.wooden_plate_thickness*1.5, true, true, true, true);
	 	svg_builder.define_box_width_and_length(this.width_box*2 + this.height_box*2, this.depth_box + this.height_box + this.wooden_plate_thickness*4);
	 },

	/**
	 *	function that draws at (x,y) position the box with top in the model 3
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 */
	economize_laser_and_wood_model_3: function (origin_x, origin_y) {
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x, origin_y, false, true, true, true);
		svg_builder.set_attribute_g_tag("g_tag_id_4","scale(1,1)","translate("+(this.width_box-this.wooden_plate_thickness)+","+(this.height_box+this.wooden_plate_thickness*2)+")","rotate(270,0,0)");
		this.draw_single_part(3, "g_tag_id_3", origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(5, "g_tag_id_5", origin_x, origin_y, false, true, true, true);
		svg_builder.set_attribute_g_tag("g_tag_id_5","scale(1,1)","translate("+(this.width_box*2 + this.depth_box - this.wooden_plate_thickness*3)+","+(this.height_box+this.wooden_plate_thickness*2)+")","rotate(270,0,0)");
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(6, "g_tag_id_6", origin_x + this.width_box + this.wooden_plate_thickness/2, origin_y + this.height_box + this.wooden_plate_thickness*1.5, true, true, true, true);
	 	svg_builder.define_box_width_and_length(this.width_box*2 + this.depth_box*2, this.depth_box + this.height_box + this.wooden_plate_thickness*2);
	},
	
	/**
	 *	function that draws the box/part which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		svg_builder.remove_all_tag_by_class_name("g_tag_piece_box"); // to remove all the box pieces already drawn
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1, "g_tag_id_1", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2, "g_tag_id_2", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3, "g_tag_id_3", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4, "g_tag_id_4", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5, "g_tag_id_5", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 6 : 	this.draw_single_part(6, "g_tag_id_6", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
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
	 *	@param {int} wooden_plate_width the width of the wooden plate
	 *	@param {int} wooden_plate_length the length of the wooden plate
	 *	@param {int} wooden_plate_thickness the thickness of the wooden plate
	 *	@param {int} width_box the width of the box
	 *	@param {int} depth_box the depth of the box
	 *	@param {int} height_box the height of the box
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
console.log( this ) ;
		if( this.width_box < 40 ) return 3; // the width_box must be minimum 4cm
		if( this.depth_box < 40 ) return 4; // the depth_box must be minimum 4cm
		if( this.height_box < 40 ) return 5; // the height_box must be minimum 4cm - thikness
		if( NOTCH_SIZE < 5 ) return 1; // if the notch_size is too tiny, below 5 milimeters
		if( NOTCH_SIZE*2 > Math.min(this.width_box,Math.min(this.depth_box,this.height_box)) ) return 2; // if the notch_size is too big
		return 100; // no problem
	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_without_top
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
	 	if(number_part == 1) {
	 		if(bool_top)	svg_builder.draw_line(origin_x, origin_y, this.width_box, 0, 0, g_tag_id);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box, 0, g_tag_id);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness*2, this.height_box + this.wooden_plate_thickness*2);
	 	} else if(number_part == 2) {
	 		if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 0, origin_x, origin_y, 0, g_tag_id);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 2, origin_x + this.width_box, origin_y + this.depth_box, 0, g_tag_id);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 6, origin_x, origin_y + this.depth_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness*2, this.depth_box + this.wooden_plate_thickness*2);
	 	} else if(number_part == 3) {
	 		if(bool_top) 	svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 1, origin_x, origin_y, 0, g_tag_id);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) 	svg_builder.draw_line(origin_x + this.width_box, origin_y + this.height_box, -this.width_box, 0, 0, g_tag_id);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness*2, this.height_box + this.wooden_plate_thickness*2);
	 	} else if(number_part == 4) {
	 		if(bool_top) 	svg_builder.draw_line(origin_x, origin_y, this.depth_box - this.wooden_plate_thickness * 2, 0, 0, g_tag_id);
	 		if(bool_right)	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box - this.wooden_plate_thickness * 2, origin_y, 0, g_tag_id);
	 		if(bool_bot) 	svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 3, origin_x + this.depth_box - this.wooden_plate_thickness * 2, origin_y + this.height_box, g_tag_id);
	 		if(bool_left) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.depth_box + this.wooden_plate_thickness*2, this.height_box + this.wooden_plate_thickness*2);
	 	} else if(number_part == 5) {
	 		if(bool_top)	svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 1, origin_x, origin_y, g_tag_id);
	 		if(bool_right) 	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x  + this.depth_box - this.wooden_plate_thickness * 2, origin_y, 0, g_tag_id);
	 		if(bool_bot) 	svg_builder.draw_line(origin_x + this.depth_box - this.wooden_plate_thickness * 2, origin_y + this.height_box, - this.depth_box + this.wooden_plate_thickness * 2, 0, 0, g_tag_id);
	 		if(bool_left)	svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.depth_box + this.wooden_plate_thickness*2, this.height_box + this.wooden_plate_thickness*2);
	 	}
	 },

	/**
	 *	function that draws at a (x,y) position the box without top in the model 1
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a> to get the parameters informations
	 */
	economize_laser_and_wood_model_1: function (origin_x, origin_y) {
		this.draw_single_part(3, "g_tag_id_3", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(5, "g_tag_id_5", origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y + this.height_box, false, true, true, false);
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y, true, true, true, true);
		svg_builder.set_attribute_g_tag("g_tag_id_2","scale(1,1)","translate("+(this.width_box + this.depth_box - this.wooden_plate_thickness/2)+","+(this.width_box+this.wooden_plate_thickness)+")","rotate(270,0,0)");
		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness + this.depth_box*2 + 10, Math.max(this.height_box*2, this.width_box) + 10);		
	},

	/**
	 *	function that draws at a (x,y) position the box  without top in the model 3
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	 economize_laser_and_wood_model_2: function (origin_x, origin_y) {
		this.draw_single_part(3, "g_tag_id_3", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(5, "g_tag_id_5", origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y + this.height_box, false, true, true, false);
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y + this.height_box*2, false, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness + this.depth_box + 10, this.height_box*2 + this.depth_box + 10);	
	 },
	
	/**
	 *	function that draws at a (x,y) position the box without top in the model 2
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (ordinate) origin of the drawing of this part
	 * 	@see <a href="#.draw_single_part" >draw_single_part()</a>
	 */
	economize_laser_and_wood_model_3: function (origin_x, origin_y) {
		this.draw_single_part(3, "g_tag_id_3", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(5, "g_tag_id_5", origin_x + this.width_box, origin_y, true, true, true, false);
		this.draw_single_part(1, "g_tag_id_1", origin_x, origin_y + this.height_box, false, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y + this.height_box, false, true, false, false);
		this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y, true, true, true, true);
		svg_builder.set_attribute_g_tag("g_tag_id_2","scale(1,1)","translate("+(this.width_box-this.wooden_plate_thickness)+","+(this.height_box*2+this.width_box+this.wooden_plate_thickness*2)+")","rotate(270,0,0)");
		svg_builder.define_box_width_and_length(this.width_box + this.wooden_plate_thickness + this.depth_box + 10, this.height_box*2 + this.width_box + 10);	
	 },

	/**
	 *	function that draws the box/part which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		svg_builder.remove_all_tag_by_class_name("g_tag_piece_box"); // to remove all the box pieces already drawn
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1, "g_tag_id_1", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2, "g_tag_id_2", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3, "g_tag_id_3", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4, "g_tag_id_4", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5, "g_tag_id_5", this.wooden_plate_thickness, this.wooden_plate_thickness, true, true, true, true);
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
 *  function used by the first application which creates a closed or openned box
 *	@param {boolean} download indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app1_closed_or_openned_box(download) {
	
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

	file_name = "boiteRectangulaire-"+width_box/10+"x"+depth_box/10+"cm_"+wooden_plate_thickness+"mm.svg"; 
	
	// we create our object, depending on whether the checkbox is checked or not
	var app1_closed_or_openned_box;
	if ( document.getElementById("formCheck-1").checked ) {
		height_box = height_box - wooden_plate_thickness * 2; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness )
		app1_closed_or_openned_box = Object.create(Box_with_top);
	} else {
		height_box = height_box - wooden_plate_thickness; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness )
		app1_closed_or_openned_box = Object.create(Box_without_top);
	}
	
	// we initialize the parameters and check them if error / invalid values are found
	app1_closed_or_openned_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box);
	if( !checkValue("longueur","largeur","hauteur","encoche") ) {
		DisplayError("Problème de saisie", "Les mesures doivent être positives.");
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app1_closed_or_openned_box.check_parameters() != 0 ) { 
		var result = app1_closed_or_openned_box.check_parameters();
		//console.log("error, to detail : " + result);
		// Display error in error message box
		switch (result) {
			case 1: DisplayError("Erreur de paramètrage", "Dimension des entailles trop petite (doit être > 5 mm )"); break;
			case 2: DisplayError("Erreur de paramètrage", "Dimension des entailles trop grande."); break;
			case 3: DisplayError("Erreur de paramètrage", "La longueur de la boite doit être au minimum de 40 mm."); break;
			case 4: DisplayError("Erreur de paramètrage", "La largeur de la boite doit être au minimum de 40 mm."); break;
			case 5: DisplayError("Erreur de paramètrage", "La hauteur de la boite doit être au minimum de 45 mm - epaisseur."); break;
			
			default:
				$('.alert').hide();		// Hide the dialog box
		}
		
		return;
	}
	
	// whether it is checked, we draw the corresponding with/without top box
	if ( document.getElementById("formCheck-1").checked ) { // the closed boxes ( with top )
		app1_closed_or_openned_box.draw_selected_item();
	} else { // the openned boxes ( without top )
		app1_closed_or_openned_box.draw_selected_item();
	}
	
	if( download == true ) svg_builder.generate_svg_file(file_name); // if download is true, it will be downloadable by the user 
	svg_builder.show_layer2();	// to show the result in the good scale
}


function onCheckboxChange(){
  //console.log("checkChanged");
 // console.log(document.getElementById("formCheck-1").checked);
  if(document.getElementById("formCheck-1").checked){
    document.getElementById("groupWithoutTop").style.display = "none";
    document.getElementById("groupWithTop").style.display = "block";
    document.getElementById("img_shema_boite_ouverte").style.display = "none";
	document.getElementById("img_shema_boite_ferme").style.display = "block";
	document.getElementById("groupWithTop_selected").selected = "selected";
  }
  else{
    document.getElementById("groupWithTop").style.display = "none";
    document.getElementById("groupWithoutTop").style.display = "block";
    document.getElementById("img_shema_boite_ferme").style.display = "none";
	document.getElementById("img_shema_boite_ouverte").style.display = "block";
	document.getElementById("groupWithoutTop_selected").selected = "selected";
  }
}


onCheckboxChange();
