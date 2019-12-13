const identity_test = "#test_figure_id"

// Variables

// Size of 2D slider
var param_width = 100, //width of slider rectangle
    param_height = 100 // heigh
    param_margin_x = 50; // distance of text with values

var slider_2D_rx = 10, //Corner radius of histo and slider
    histo_rx = 3;

// Histogram Variables
var y0_systems = 13, //y position of parity blobs inside svg
histo_label_pos_y = 120, // y position of the svg of histo parity labels 
radius_systems = 5, // Radius of Parity Blobs
node_distance_parity = 12, // How far are the blobs separated in the parity
parity_blobs_shift_left = 8 // how much 1st blob is shifted from center of histo bar
twoL_histo_y_pos = 110, //These values are relative to SVG container of histo
twoL_histo_height = 200, //This scales the whole histogram height
twoL_margin_x = 20, // margin to the left to have space for Probability text
twoL_center_x = 200, //center of the histograms wrt svg
twoL_space = 35, //space between left corner of histo bars
twoL_histo_width = 25; //size of histo bars

// Define SVG Histogram
common_svg = d3.select(identity_test)
	.append("svg")
	.attr("id", "fig1_histo_SVG")

// SVG for bars
common_svg.append("svg")
    .attr("id", "two_level_histogram")
    .attr('class','figures')
    .attr("y", 0); 

// SVG for parity labels
common_svg.append("svg")
	.attr("id", "SVG_fig1_histo")
    .attr('class','figures')
    .attr("y", histo_label_pos_y);

// Define scales for temp and coupling
var temp_scale = d3.scalePow()
    .exponent(5)
    .domain([0, 100])
    .range([0.1, 100])
    .clamp(true);   
var couple_scale = d3.scaleLinear()
    .domain([param_margin_x, param_width+param_margin_x])
    .range([-1, 1])
    .clamp(true);   

// initialize the 2D SVGs
initialize_2D_slider_fig1()

// Define drag Handler
var dragHandler_fig1 = d3.drag()
    .on("drag", function () {
	xpos = d3.event.x
	ypos = d3.event.y
	if (xpos<param_margin_x){xpos = param_margin_x}
	if (xpos>param_width+param_margin_x){xpos=param_width+param_margin_x} 
	if (ypos<0){ypos = 0}
	if (ypos>param_height){ypos=param_height}
	twoD_slider(xpos,ypos)    
        d3.select(this)
            .attr("cx", xpos)
            .attr("cy", ypos);
    });

dragHandler_fig1(d3.select("#param_circle1"));


// End 2D param selection

// =============================================================
// 2D Histogram

d3.select("#two_level_histogram").append("text")
     .text("Probability")
     .attr("class", "general_text")
    .attr("transform", "translate(90,100),rotate(-90)")
    .style("fill", c_text_histogram)

    max_scale = 10 //max scale for x_e
    max_log_scale = 10000
    y_line1 = 50 // y position of 2-level lines
    y_line2 = 250 
    xplot = 50 // position of plot
    yplot = y_line1
    width_plot = 200 // Size plot
    hight_plot = 200
    x_2level = 310 // 2level sys position
    x_text_prob = 280
    variable = 0
    plot_steps = 500

    
generate_histogram_2_level()

d3.select("#SVG_fig1_histo").append("text")
     .text("Parity")
     .attr("class", "general_text")
     .attr("x", 245)
    .attr("y", 20)
    .style("fill", c_text_histogram)
updown = [[false,false],[true,false],[false,true],[true,true]]
for (n=0;n<updown.length;n++){
draw_parity_systems(twoL_histo_pos_gen(n)+14,y0_systems,updown[n],node_distance_parity,radius_systems,"paritystate"+n)
}

// FUNCTIONS FOR 2D SLIDER

// =================================================
// INITIALIZE 2D SLIDER
function initialize_2D_slider_fig1(){
var svg = d3.select(identity_test).append("svg")
    .attr("y", 0)
    .attr("x",0);

var gradient = svg.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", c2_2D_slider)
    .attr("stop-opacity", 0.8);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", c1_2D_slider)
    .attr("stop-opacity", 0.8);


svg.append("rect")
    .attr("width", param_width)
    .attr("height", param_height)
    .attr("x", param_margin_x)
    .attr("y",0)
	.attr("rx", slider_2D_rx)	
    .style("fill", "url(#gradient)");


svg.append("line")
	.attr("id", "param_line_y")
	.attr("x1", param_margin_x)
	.attr("x2", param_margin_x+param_width)
	.attr("y1", 50)
	.attr("y2", 50)
	.style("stroke", c_stroke_2D_slider)
svg.append("line")
	.attr("id", "param_line_x")
	.attr("x1", 100)
	.attr("x2", 100)
	.attr("y1", 0)
	.attr("y2", param_height)
	.style("stroke", c_stroke_2D_slider)

svg.append("circle")
	.attr("id", "param_circle1")
       .attr("cx", 100)
      .attr("cy", 50)
      .attr("r", 8)
      .attr("fill", c_handle_2D_slider)

svg.append("text")
	.text(function(){return "w="+couple_scale(100).toPrecision(2)})
	.attr("id", "para_text_coupl")
     	.attr("class", "general_text")
	.attr("x", 70-param_margin_x)
	.attr("y", 120)
    	.style("fill", c_text_slider)

svg.append("text")
	.text(function(){return "T="+ temp_scale(50).toPrecision(2)})
	.attr("id", "para_text_temp")
	.attr("class", "general_text")
	.attr("x", 0)
	.attr("y", 20)
    	.style("fill", c_text_slider)
}
// ==========================================================
// END INIT 2D SLIDER

function twoD_slider(xpos, ypos) {
  energy = 1.0
  coupling = couple_scale(xpos)
	temp = temp_scale(ypos)
	new_data = update_2L_probabilities(coupling,temp,energy)
	update_2L_histogram(new_data,twoL_histo_height, twoL_histo_y_pos)
	d3.select("#param_line_y").attr("y1", ypos).attr("y2", ypos)    
	d3.select("#param_line_x").attr("x1", xpos).attr("x2", xpos)
	d3.select("#para_text_temp").attr("y", ypos+10)
		.text(function(){return "T="+ temp_scale(ypos).toPrecision(2)})
	d3.select("#para_text_coupl").attr("x", xpos-param_margin_x)
		.text(function(){return "w="+ couple_scale(xpos).toPrecision(2)})
}


// FUNCTIONS TO GENERATE HISTO

function draw_parity_systems(x0,y0,up,width,radius,identity){
	circle1_color = c_hid_node1
	circle2_color = c_hid_node1
	circle1_color_stroke = c_hid_node1_stroke		
	circle2_color_stroke = c_hid_node1_stroke		
	if (up[0]==true){circle1_color = c_hid_node2
			circle1_color_stroke = c_hid_node2_stroke		
	}
	if (up[1]==true){circle2_color = c_hid_node2
			circle2_color_stroke = c_hid_node2_stroke		
	}
	d3.select("#SVG_fig1_histo").append("circle")
	    .attr("id", identity+"circle1")
	    .attr("cx", x0-parity_blobs_shift_left)
	    .attr("cy", y0)
	    .attr("r", radius)
	    .style("fill", circle1_color)
	    //.style("opacity", 0.5)
	    .style("stroke", circle1_color_stroke)
        d3.select("#SVG_fig1_histo").append("circle")
	    .attr("id", identity+"circle2")
	    .attr("cx", x0-parity_blobs_shift_left+width)
	    .attr("cy", y0)
	    .attr("r", radius)
	    .style("fill", circle2_color)
	    //.style("opacity", 0.5)
	    .style("stroke", circle2_color_stroke)
}

function twoL_histo_pos_gen(d) {
    return twoL_margin_x + twoL_center_x - twoL_space*3 +  d * twoL_space -twoL_histo_width/2;
};

function generate_histogram_2_level(){
	var twoL_histogram_data = [0.25,0.25,0.25,0.25]
	
	var y_axis_ticks = d3.scaleLinear().domain([0,0.5]).range([200,100])
	var histogram_svg = d3.select("#two_level_histogram").append("g")
	
	histogram_svg.selectAll("rect")
		.data(twoL_histogram_data)
		.enter().append("rect")
		.style("fill", c_histo_bars)
		.style("opacity", 0.8)
		.attr("id", function(d,i){return "twolevel_histo"+i})
		.attr("x", 0) // margin left
		.attr("y", function(d){return twoL_histo_y_pos-twoL_histo_height+(1-d)*twoL_histo_height}) // margin left
		.attr("rx", histo_rx)
		.attr("transform", function(d,i) {
			  return "translate(" + twoL_histo_pos_gen(i) + ")"; })
		.attr("width", function(d,i) { return twoL_histo_width ; })
		//       .attr("width", function(d,i) { console.log(d) ; })
		.attr("height", function(d) { return d*twoL_histo_height; });
	  x_pos_histo_axis = twoL_histo_pos_gen(0)-20;
	  y_pos_histo_axis = twoL_histo_y_pos-twoL_histo_height;
}

// Probability FUnctions Histogram
function energy_2L_system(weight, x1, x2, gap) {
	return -gap*x1*x2*weight //+ gap*x1 + gap*x2
}

function probability_2_level(weight, x1, x2, gap, temperature){
	var normalization = 0
	var all_configs = [[-1,-1], [1,-1], [-1,1], [1,1]]
	for(i=0; i<all_configs.length;i++){
		normalization += Math.exp(-energy_2L_system(weight, all_configs[i][0], all_configs[i][1], gap)/temperature)	
	} 
	return 	Math.exp(-energy_2L_system(weight,x1,x2,gap)/temperature)/normalization
}

function update_2L_probabilities(weight,temp,gap){
	var data = []
	var all_configs = [[-1,-1], [1,-1], [-1,1],[1,1]]
	for(j=0; j<all_configs.length;j++){
		data.push(probability_2_level(weight, all_configs[j][0], all_configs[j][1], gap, temp))
	}
	return data
}

function update_2L_histogram(new_data, histo_height, twoL_histo_y_pos){
    for (i=0; i<new_data.length; i++) {
        d3.select("#twolevel_histo"+i).attr("height", function(){return new_data[i]*histo_height})
                            .attr("y", function(){return twoL_histo_y_pos-histo_height+(1-new_data[i])*histo_height})
    }
}
