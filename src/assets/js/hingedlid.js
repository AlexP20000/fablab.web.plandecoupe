
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
	 *	@param {int} number_part the number of the part
	 *	@param {int} g_tag_id the id of the g tag containing the box piece. Used for referencing the box piece with svg_builder.set_attribute_g_tag()
	 *	@see <a href="#svg_builder.set_attribute_g_tag()" >svg_builder.set_attribute_g_tag()</a>
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y  its the y (ordinate) origin of the drawing of this part
	 *	@param {boolean} bool_top if true the top side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_right if true the right side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_bot if true the bot side of this part will be drawn, else way it wont
	 *	@param {boolean} bool_left if true the left side of this part will be drawn, else way it wont
	 */
	draw_single_part: function (number_part, g_tag_id, origin_x, origin_y, bool_top, bool_right, bool_bot, bool_left) {
		svg_builder.create_g_tag(g_tag_id);
		if( (number_part == 4) || (number_part == 5) ){ // side plate parts
			// the number_part 5 is the same as the 4 but with a miror flip, so we just scale(-1,1) its g tag
			if(number_part == 5)	svg_builder.set_attribute_g_tag(g_tag_id,"scale(-1,1)","translate(-"+(this.depth_box)+",0)","rotate(0,0,0)");
			// top line
			svg_builder.draw_line(origin_x, origin_y, this.depth_box - (this.wooden_plate_thickness * 2) - (this.clutch_diameter_top_part * 2), 0, 0, g_tag_id);
			svg_builder.draw_path_half_circle(this.clutch_diameter_top_part * 2, 0, origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - (this.clutch_diameter_top_part * 2), origin_y - this.wooden_plate_thickness, true, g_tag_id);
			svg_builder.draw_line(origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - (this.clutch_diameter_top_part * 2), origin_y, 0, - this.wooden_plate_thickness, 0, g_tag_id);
			svg_builder.draw_path_circle(this.clutch_diameter_top_part + this.wooden_plate_thickness, 0, origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - (this.wooden_plate_thickness/2) - this.clutch_diameter_top_part - this.clutch_radius_top_part, origin_y - this.wooden_plate_thickness, g_tag_id);
			svg_builder.draw_line(origin_x + this.depth_box - (this.wooden_plate_thickness * 2), origin_y - this.wooden_plate_thickness, 0, this.wooden_plate_thickness, 0, g_tag_id);
			var tempo = NOTCH_SIZE;	NOTCH_SIZE = this.wooden_plate_thickness; // we draw a notch with a wooden thickness size
			svg_builder.draw_path_rectangle_tight(this.wooden_plate_thickness,this.clutch_diameter_top_part, 0, origin_x + this.depth_box - (this.wooden_plate_thickness * 2) - this.clutch_diameter_top_part - this.clutch_radius_top_part, origin_y - this.wooden_plate_thickness, g_tag_id);
			NOTCH_SIZE = tempo; // we reset it as previously
			// right, bot, left lines/path
			if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box - (this.wooden_plate_thickness * 2), origin_y, 0, g_tag_id);
	 		if(bool_bot) svg_builder.draw_path_right_left_correction(this.wooden_plate_thickness, this.depth_box, 3, origin_x + this.depth_box - (this.wooden_plate_thickness * 2), origin_y + this.height_box, g_tag_id);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.depth_box, this.height_box + this.clutch_diameter_top_part*2 + this.wooden_plate_thickness*2);
		} else if( (number_part == 1) || (number_part == 3) ) { // front & back side plate parts
	 		if(bool_top) svg_builder.draw_line(origin_x, origin_y, this.width_box, 0, 0, g_tag_id);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 3, origin_x + this.width_box, origin_y + this.height_box, 0, g_tag_id);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 6, origin_x, origin_y + this.height_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box, this.height_box + this.wooden_plate_thickness);
	 	} else if( (number_part == 2) ) { // floor plate part
	 		if(bool_top) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 0, origin_x, origin_y, 0, g_tag_id);
	 		if(bool_right) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 4, origin_x + this.width_box, origin_y, 0, g_tag_id);
	 		if(bool_bot) svg_builder.draw_path(this.wooden_plate_thickness, this.width_box, 2, origin_x + this.width_box, origin_y + this.depth_box, 0, g_tag_id);
	 		if(bool_left) svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 6, origin_x, origin_y + this.depth_box, 0, g_tag_id);
	 		svg_builder.define_box_width_and_length(this.width_box, this.depth_box);
		} else if( number_part == 6 ) { // cover plate part
			if(bool_top) svg_builder.draw_line(origin_x, origin_y, this.width_box, 0, 0, g_tag_id); // top side
			if(bool_right) {
				svg_builder.draw_line(origin_x + this.width_box, origin_y, 0, this.depth_box - this.wooden_plate_thickness - this.clutch_diameter_top_part*2 - this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x + this.width_box, origin_y + this.depth_box - this.wooden_plate_thickness*2 - this.clutch_diameter_top_part*2, -this.wooden_plate_thickness, 0, 0, g_tag_id);
				svg_builder.draw_line(origin_x - this.wooden_plate_thickness + this.width_box, origin_y + this.depth_box - this.wooden_plate_thickness * 2 - this.clutch_diameter_top_part*2, 0, this.clutch_radius_top_part + this.wooden_plate_thickness, 0, g_tag_id);
				var tempo = NOTCH_SIZE;	NOTCH_SIZE = this.wooden_plate_thickness; // we draw a notch with a wooden thickness size
				svg_builder.draw_path_tight(this.wooden_plate_thickness,this.clutch_diameter_top_part, 5, origin_x - this.wooden_plate_thickness + this.width_box, origin_y + this.depth_box - (this.wooden_plate_thickness * 1) - this.clutch_diameter_top_part - this.clutch_radius_top_part, 0, g_tag_id);
				NOTCH_SIZE = tempo; // we reset it as previously
				svg_builder.draw_line(origin_x + this.width_box - this.wooden_plate_thickness, origin_y + (this.depth_box - (this.wooden_plate_thickness * 1) - this.clutch_radius_top_part), 0, this.clutch_radius_top_part, 0, g_tag_id);
			}
			if(bool_left) {
				svg_builder.draw_line(origin_x, origin_y, 0, this.depth_box - this.wooden_plate_thickness - this.clutch_diameter_top_part*2 - this.wooden_plate_thickness, 0, g_tag_id);
				svg_builder.draw_line(origin_x, origin_y + this.depth_box - this.wooden_plate_thickness*2 - this.clutch_diameter_top_part*2, this.wooden_plate_thickness, 0, 0, g_tag_id);
				svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - this.wooden_plate_thickness*2 - this.clutch_diameter_top_part*2, 0, this.clutch_radius_top_part + this.wooden_plate_thickness, 0, g_tag_id);
				var tempo = NOTCH_SIZE;	NOTCH_SIZE = this.wooden_plate_thickness; // we draw a notch with a wooden thickness size
				svg_builder.draw_path_tight(this.wooden_plate_thickness,this.clutch_diameter_top_part, 4, origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - (this.wooden_plate_thickness * 1) - this.clutch_diameter_top_part - this.clutch_radius_top_part, 0, g_tag_id);
				NOTCH_SIZE = tempo; // we reset it as previously
				svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y + (this.depth_box - this.wooden_plate_thickness - this.clutch_radius_top_part), 0, this.clutch_radius_top_part, 0, g_tag_id);
			}
			if(bool_bot) svg_builder.draw_line(origin_x + this.wooden_plate_thickness, origin_y + this.depth_box - this.wooden_plate_thickness, this.width_box - this.wooden_plate_thickness*2, 0, 0, g_tag_id); // top side
			svg_builder.define_box_width_and_length(this.width_box, this.depth_box);
		}
	},
		
	/** 
	 *	function that draws at a (x,y) position the line model 1 which is the best to economize both wood and laser path
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 */
	 economize_laser_and_wood_line_model_1: function (origin_x, origin_y) {
	 	this.draw_single_part(3, "g_tag_id_3", origin_x, origin_y, true, true, true, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y, true, true, true, false);
	 	this.draw_single_part(1, "g_tag_id_1", origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(5, "g_tag_id_5", origin_x - this.width_box*2 - this.depth_box + this.wooden_plate_thickness*2, origin_y, true, false, true, true);
	 	this.draw_single_part(2, "g_tag_id_2", origin_x + this.width_box*2 + this.depth_box*2 - this.wooden_plate_thickness*2.5, origin_y, true, true, true, true);
		this.draw_single_part(6, "g_tag_id_6", origin_x + this.width_box*3 + this.depth_box*2 - this.wooden_plate_thickness*2, origin_y, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box*4 + this.depth_box*2 + this.wooden_plate_thickness + 10, Math.max(this.depth_box, this.height_box) + this.wooden_plate_thickness*6 + 10);
	 },

	/**
	 *	function that draws at a (x,y) position the line model 2 which is the best to economize both wood and laser path
	 *	@param {int} origin_x its the x (abscissa) origin of the drawing of this part
	 *	@param {int} origin_y its the y (ordinate) origin of the drawing of this part
	 */
	economize_laser_and_wood_line_model_2: function (origin_x, origin_y) {
	 	this.draw_single_part(3, "g_tag_id_3", origin_x, origin_y, true, true, false, true);
		this.draw_single_part(4, "g_tag_id_4", origin_x + this.width_box, origin_y, true, true, true, false);
	 	this.draw_single_part(1, "g_tag_id_1", origin_x + this.width_box + this.depth_box - this.wooden_plate_thickness*2, origin_y, true, true, true, false);
		this.draw_single_part(5, "g_tag_id_5", origin_x - this.width_box*2 - this.depth_box + this.wooden_plate_thickness*2, origin_y, true, false, true, true);
	 	this.draw_single_part(2, "g_tag_id_2", origin_x, origin_y + this.height_box, true, true, true, true);
		this.draw_single_part(6, "g_tag_id_6", origin_x + this.width_box + this.wooden_plate_thickness*0.5, origin_y + this.height_box + this.wooden_plate_thickness*1.5, true, true, true, true);
		svg_builder.define_box_width_and_length(this.width_box*2 + this.depth_box*2 + 10, this.depth_box + this.height_box + this.wooden_plate_thickness*6 + 10);
	 },

	/**
	 *	function that draws the box/part which is selected in the option listStyleType
	 */
	draw_selected_item: function () {
		svg_builder.remove_all_tag_by_class_name("g_tag_piece_box"); // to remove all the box pieces already drawn
		switch( Number(selectedModel()) ) {
			case 1 : 	this.draw_single_part(1, "g_tag_id_1", 0, 0, true, true, true, true);
						break;
			case 2 : 	this.draw_single_part(2, "g_tag_id_2", 0, 0, true, true, true, true);
						break;
			case 3 : 	this.draw_single_part(3, "g_tag_id_3", 0, 0, true, true, true, true);
						break;
			case 4 : 	this.draw_single_part(4, "g_tag_id_4", this.wooden_plate_thickness, this.wooden_plate_thickness * 6, true, true, true, true);
						break;			
			case 5 : 	this.draw_single_part(5, "g_tag_id_5", this.wooden_plate_thickness, this.wooden_plate_thickness * 6, true, true, true, true);
						break;
			case 6 : 	this.draw_single_part(6, "g_tag_id_6", 0, 0, true, true, true, true);
						break;
			case 7 :	this.economize_laser_and_wood_line_model_1(this.wooden_plate_thickness, this.wooden_plate_thickness * 6);
						break;
			case 8 : 	this.economize_laser_and_wood_line_model_2(this.wooden_plate_thickness, this.wooden_plate_thickness * 6);
						break;
			default : 	
		}
	}
};


/**
 *  function used by the fourth application which creates a "hinged lid box".
 *	@param {boolean} download indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app4_hinged_lid_box(download) {
	
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
	file_name = "hingedLidBox-"+width_box/10+"x"+depth_box/10+"cm_"+wooden_plate_thickness+"mm.svg"; 
	
	height_box = height_box - wooden_plate_thickness*2; // to correct the height lack ( its the fact that we must count the wooden_plate_thickness once and the cover part of the box )
	
	var app4_hinged_lid_box = Object.create(Box_hinged_lid);
	app4_hinged_lid_box.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box);
	
	// we initialize the parameters and check them if error / invalid values are found
	if( !checkValue("longueur","largeur","hauteur","encoche") ) {
		console.log("error parameters, there is not only positive integer" );
		return;
	}
	else if( app4_hinged_lid_box.check_parameters() != 0 ) { 
		console.log("error, to detail : " + app4_hinged_lid_box.check_parameters()); 
		alert("Erreur dans les paramètres, vérifiez que la valeur d'encoche soit bien supérieur à l'épaisseur du matérielle");
		return;
	}
	
	app4_hinged_lid_box.draw_selected_item();
	
	if( download == true ) svg_builder.generate_svg_file(file_name); // if download is true, it will be downloadable by the user 
	svg_builder.show_layer2();								// to show the result in the good scale
}
