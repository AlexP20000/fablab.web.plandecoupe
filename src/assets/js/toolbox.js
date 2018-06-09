
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
		
		svg_builder.create_path(tab_coordinate, angle, draw_origin_x, draw_origin_y, "toolBoxLayer");
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
		svg_builder.create_path(tab_coordinate.join(' '), angle, draw_origin_x, draw_origin_y, "toolBoxLayer");
	},


	/**
	 *	Function to draw the top side of the piece 1
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (ordinate) origin of the drawing of this part
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
				svg_builder.draw_line(l_origin_x, l_origin_y, sizeBigNotch, 0, 0, "toolBoxLayer");
				l_origin_x = l_origin_x + sizeBigNotch;
			}
			else{
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(wooden_plate_thickness, sizeBetweenBigNotch, 1, l_origin_x, origin_y, 0, "toolBoxLayer");
				//svg_builder.draw_line(l_origin_x, l_origin_y,sizeBetweenBigNotch, 0)
				l_origin_x = l_origin_x + sizeBetweenBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}				
		}
	},

	/**
	 *	Function to draw the bot side of the piece 1
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (ordinate) origin of the drawing of this part
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
				svg_builder.draw_line(l_origin_x2, l_origin_y2 + depth_box,sizeBigNotch, 0, 0, "toolBoxLayer");
				l_origin_x2 = l_origin_x2 + sizeBigNotch;
				total += sizeBetweenBigNotch;
			}
			else{
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(wooden_plate_thickness, sizeBetweenBigNotch, 0, l_origin_x2, origin_y + depth_box, 0, "toolBoxLayer");
				l_origin_x2 = l_origin_x2 + sizeBetweenBigNotch;
				total += sizeBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}
		}
	},
	
	/**
	 *	function that's draw the top side of the piece 2 and 6 of the Toolbox
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (ordinate) origin of the drawing of this part
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
				svg_builder.draw_line(l_origin_x, l_origin_y,sizeBetweenBigNotch, 0, 0, "toolBoxLayer")
				l_origin_x = l_origin_x + sizeBetweenBigNotch;
			}
			else{ // big
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(this.wooden_plate_thickness, sizeBigNotch, rotate, l_origin_x, l_origin_y, 0, "toolBoxLayer");
				l_origin_x = l_origin_x + sizeBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}
		}
	},
	
	/**
	 *	function that's draw the bot side of the piece 2 and 6 of the Toolbox
	 *	@param origin_x {int} it's the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} it's the y (ordinate) origin of the drawing of this part
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
				svg_builder.draw_path(wooden_plate_thickness, sizeBetweenBigNotch, rotate, l_origin_x, origin_y -(height_box-nose)/2, 0, "toolBoxLayer");
				l_origin_x = l_origin_x - sizeBetweenBigNotch;
			}
			else{
				NOTCH_SIZE = NOTCH_SIZE * 2;
				svg_builder.draw_path(wooden_plate_thickness, sizeBigNotch, rotate, l_origin_x, origin_y -(height_box-nose)/2, 0, "toolBoxLayer");
				l_origin_x = l_origin_x - sizeBigNotch;
				NOTCH_SIZE = NOTCH_SIZE / 2;
			}
		}

	},
	
	/**
	 *	function that draws the part 'number_part' of the Box_without_top
	 *	@param number_part {int} the number of the part of the Box_without_top
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (ordinate) origin of the drawing of this part
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
			if(bool_right)   svg_builder.draw_line(origin_x + (this.width_box - this.oppose) - this.wooden_plate_thickness, origin_y, 0, this.depth_box, 0, "toolBoxLayer");
			if(bool_bot)   Toolbox.draw_base_side2(origin_x, origin_y, nbNotch, this.height_box, this.width_box - this.wooden_plate_thickness, this.nose, this.depth_box);
			if(bool_left)  svg_builder.draw_line(origin_x, origin_y, 0, this.depth_box, 0, "toolBoxLayer");   
			svg_builder.define_box_width_and_length(this.width_box, this.depth_box + this.height_box/2 + 50);
		} else if(number_part == 6) {
			Toolbox.draw_path2(this.wooden_plate_thickness, this.hypothenuse,0, origin_x, origin_y,-45);
			if(bool_top)  Toolbox.draw_bot(origin_x + this.width_box, origin_y, nbNotch, this.height_box, this.width_box, this.nose,3);
			if(bool_right)   svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y -(this.height_box-this.nose)/2, 0, "toolBoxLayer");
			if(bool_bot)   Toolbox.draw_top(origin_x, origin_y + this.height_box, nbNotch, this.height_box, this.width_box, this.nose,0);
			if(bool_left)   svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 5, origin_x, origin_y, 0, "toolBoxLayer");
			svg_builder.draw_line(origin_x, origin_y + this.nose, this.oppose, (this.height_box-this.nose)/2, 0, "toolBoxLayer");
			svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + 10);
		} else if(number_part == 2) {
			svg_builder.draw_line(origin_x, origin_y, this.oppose, -(this.height_box-this.nose)/2, 0, "toolBoxLayer");
			if(bool_top)  Toolbox.draw_top(origin_x, origin_y, nbNotch, this.height_box, this.width_box, this.nose,1);
			if(bool_right)   svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 4, origin_x + this.width_box, origin_y -(this.height_box-this.nose)/2, 0, "toolBoxLayer");
			if(bool_bot)   Toolbox.draw_bot(origin_x + width_box, origin_y + this.height_box, nbNotch, this.height_box, this.width_box, this.nose,2);
			if(bool_left)   svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 5, origin_x, origin_y, 0, "toolBoxLayer");
			Toolbox.draw_path2(this.wooden_plate_thickness, this.hypothenuse,1,origin_x, origin_y+this.nose,45);
			svg_builder.define_box_width_and_length(this.width_box + 10, this.height_box + this.height_box/2 + 10);
		} else if(number_part == 3) {
			if(bool_top)  svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 1, origin_x, origin_y, 0, "toolBoxLayer");
			if(bool_right)  svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 5, origin_x + this.depth_box, origin_y, 0, "toolBoxLayer");
			if(bool_bot)   svg_builder.draw_path(this.wooden_plate_thickness, this.depth_box, 2, origin_x + this.depth_box, origin_y + this.height_box, 0, "toolBoxLayer");
			if(bool_left)   svg_builder.draw_path(this.wooden_plate_thickness, this.height_box, 7, origin_x, origin_y + this.height_box, 0, "toolBoxLayer");
			/*
			else{
				if(bool_top)	svg_builder.draw_path(wooden_plate_thickness, height_box, 1, origin_x, origin_y, 0, "toolBoxLayer");
				if(bool_right)	svg_builder.draw_path(wooden_plate_thickness, depth_box, 5, origin_x+height_box, origin_y, 0, "toolBoxLayer");
				if(bool_bot) 	svg_builder.draw_path(wooden_plate_thickness, height_box, 3, origin_x+height_box, origin_y+depth_box, 0, "toolBoxLayer");
				if(bool_left) 	svg_builder.draw_path(wooden_plate_thickness, depth_box, 7, origin_x, origin_y+depth_box, 0, "toolBoxLayer");
			}*/
			svg_builder.define_box_width_and_length(this.hypothenuse + 10, this.depth_box + this.height_box + 10);
		} else if(number_part == 4) {
			if(bool_top)   /*svg_builder.draw_line(origin_x, origin_y, this.depth_box, 0, 0, "toolBoxLayer");*/svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 1, origin_x, origin_y, 0, "toolBoxLayer");
			if(bool_right)  /*svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 5, origin_x+this.depth_box, origin_y, 0, "toolBoxLayer");*/svg_builder.draw_line(origin_x + this.nose, origin_y, 0, this.depth_box, 0, "toolBoxLayer");
			if(bool_bot)   /*svg_builder.draw_line(origin_x, origin_y + nose, depth_box,0, 0, "toolBoxLayer");*/svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 3, origin_x + this.nose, origin_y + this.depth_box, 0, "toolBoxLayer");
			if(bool_left)  /*svg_builder.draw_path(this.wooden_plate_thickness, this.nose, 7, origin_x, origin_y+this.nose, 0, "toolBoxLayer");*/svg_builder.draw_line(origin_x, origin_y + this.depth_box, 0, -this.depth_box, 0, "toolBoxLayer");
			svg_builder.define_box_width_and_length(this.nose + 10, this.depth_box  + this.height_box);
		} else if(number_part == 5) {
			if(bool_top)  /*svg_builder.draw_line(origin_x, origin_y, depth_box, 0, 0, "toolBoxLayer");*/Toolbox.draw_path_right_left_correction2(this.wooden_plate_thickness, this.hypothenuse, 1, origin_x, origin_y);
			if(bool_right)   /*svg_builder.draw_path(wooden_plate_thickness, hypothenuse, 5, origin_x+depth_box, origin_y, 0, "toolBoxLayer");*/svg_builder.draw_line(origin_x + this.hypothenuse - 2* this.wooden_plate_thickness, origin_y, 0, this.depth_box, 0, "toolBoxLayer");
			if(bool_bot)   /*svg_builder.draw_line(origin_x, origin_y + hypothenuse, depth_box,0, 0, "toolBoxLayer");*/Toolbox.draw_path_right_left_correction2(this.wooden_plate_thickness, this.hypothenuse, 3, origin_x + this.hypothenuse - 2* this.wooden_plate_thickness, origin_y + this.depth_box);
			if(bool_left)  /*svg_builder.draw_path(wooden_plate_thickness, hypothenuse, 7, origin_x, origin_y+hypothenuse, 0, "toolBoxLayer");*/svg_builder.draw_line(origin_x, origin_y + this.depth_box, 0, -this.depth_box, 0, "toolBoxLayer");
			svg_builder.define_box_width_and_length(this.depth_box + 10, this.height_box*2 + 10);
		}
	},

	/**
	 *	function to add missing line on all face drawing when we assemble piece 2 and piece 1 together and piece 6 and piece 1
	 *	@param origin_x {int} its the x (abscissa) origin of the drawing of this part
	 *	@param origin_y {int} its the y (ordinate) origin of the drawing of this part
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
				svg_builder.draw_line(l_origin_x, l_origin_y,sizeBigNotch, 0, 0, "toolBoxLayer")
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
	 *	@param origin_y {int} its the y (ordinate) origin of the drawing of this part
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
 *  function used by the second application which creates a tool box
 *	@param download {boolean} indicates whether we want to download the svg tag as a file, or not, if not it will simply draws out what needs to be done
 */
function app2_toolbox(download){

	document.getElementById("previsualisation").click();
	svg_builder.clear_svg("toolBoxLayer");
	svg_builder.clear_svg("wooden_plate_layer");
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
	file_name = "boiteOutils-"+width_box/10+"x"+depth_box/10+"cm_"+wooden_plate_thickness+"mm.svg"; 

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
	}/*
	else if( Toolbox.check_parameters() != 0 ) { 
		console.log("error, to detail : " + Toolbox.check_parameters()); 
		return;
	}*/

	Toolbox.init_parameters(wooden_plate_width, wooden_plate_length, wooden_plate_thickness, width_box, depth_box, height_box, nose);
	Toolbox.init_geometry_parameters();
	Toolbox.draw_selected_item();

	if( download == true ) svg_builder.generate_svg_file(file_name); // if download is true, it will be downloadable by the user 
	svg_builder.show_layer2();
}

