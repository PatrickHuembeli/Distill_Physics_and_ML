const identity_test = "#test_figure_id"

histo_margin = 10
height_2level = 30
height_2level_histo = 110
common_height = histo_margin + height_2level+height_2level_histo

function update_opacities(new_data){
	opacity_low = new_data[0]+new_data[1]+new_data[2]
	opacity_high = new_data[3]+new_data[1]+new_data[2]
	d3.select("#system1circle1").attr("opacity", opacity_low)
	d3.select("#system2circle1").attr("opacity", opacity_low)
	d3.select("#system1circle2").attr("opacity", opacity_high)
	d3.select("#system2circle2").attr("opacity", opacity_high)
}



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

var margin = {right: 0, left: 0}, // position of slider in color field
    width = 700
    distance_systems = 100


// Add the 2D parameter selection
var param_width = 100,
    param_height = 100
    param_margin_x = 50;
var temp_scale = d3.scalePow()
    .exponent(5)
    .domain([0, 100])
    .range([0.1, 100])
    .clamp(true);   
var couple_scale = d3.scaleLinear()
    .domain([param_margin_x, param_width+param_margin_x])
    .range([-1, 1])
    .clamp(true);   

var svg = d3.select(identity_test).append("svg")
    .attr("width", param_width+param_margin_x)
    .attr("height", common_height)
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
    .attr("stop-color", "blue")
    .attr("stop-opacity", 0.8);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 0.8);


svg.append("rect")
    .attr("width", param_width)
    .attr("height", param_height)
    .attr("x", param_margin_x)
    .attr("y",0)
    .style("fill", "url(#gradient)");

svg.append("circle")
       .attr("cx", 70)
      .attr("cy", 20)
      .attr("r", 5)
      .attr("fill", "white")

svg.append("line")
	.attr("id", "param_line_y")
	.attr("x1", param_margin_x)
	.attr("x2", param_margin_x+param_width)
	.attr("y1", 20)
	.attr("y2", 20)
	.style("stroke", "white")
svg.append("line")
	.attr("id", "param_line_x")
	.attr("x1", 70)
	.attr("x2", 70)
	.attr("y1", 0)
	.attr("y2", param_height)
	.style("stroke", "white")

svg.append("text")
	.text(function(){return "W="+couple_scale(70).toPrecision(2)})
	.attr("id", "para_text_coupl")
     	.attr("class", "general_text")
	.attr("x", 70-param_margin_x)
	.attr("y", 120)
    	.style("fill", "#004669")

svg.append("text")
	.text(function(){return "T="+ temp_scale(20).toPrecision(2)})
	.attr("id", "para_text_temp")
	.attr("class", "general_text")
	.attr("x", 0)
	.attr("y", 20)
    	.style("fill", "#004669")


var dragHandler = d3.drag()
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

dragHandler(svg.selectAll("circle"));

function twoD_slider(xpos, ypos) {
  energy = 1.0
  coupling = couple_scale(xpos)
	temp = temp_scale(ypos)
	new_data = update_2L_probabilities(coupling,temp,energy)
	update_2L_histogram(new_data,twoL_histo_height, twoL_histo_y_pos)
	remove_cubes()
	draw_3d_histo(new_data)
	update_opacities(new_data)
	d3.select("#param_line_y").attr("y1", ypos).attr("y2", ypos)    
	d3.select("#param_line_x").attr("x1", xpos).attr("x2", xpos)
	d3.select("#para_text_temp").attr("y", ypos+10)
		.text(function(){return "T="+ temp_scale(ypos).toPrecision(2)})
	d3.select("#para_text_coupl").attr("x", xpos-param_margin_x)
		.text(function(){return "W="+ couple_scale(xpos).toPrecision(2)})
}

// End 2D param selection

// cubes instead of 2d histo
    var origin = [480, 300], scale = 20, j = 10, cubesData = [], alpha = 0, beta = 0, startAngle = Math.PI/6;
    var cubes_test = d3.select(identity_test).append("svg").attr("width", 250).attr("height", 200)

var rect3d = cubes_test.append('g')
    .attr("transform", "translate (50,50)")
;

var rw = 30, rd = 30, ang=45;

function draw_cube(ident, spacing, max_height, percentage){
yy = max_height*(1-percentage/100)
rh = max_height*percentage/100		

rect3d.append("rect")
	.attr("class", "forward")
  .attr("id", "rect_forward"+ident)
  .attr("x", ident*spacing)
  .attr("y", yy)
  .attr("width", rw)
  .attr("height", rh)
  ;
  
  rect3d.append("rect")
	.attr("class", "top")
   .attr("id", "rect_top"+ident)
  .attr("x", ident*spacing)
  .attr("y", yy)
  .attr("width", rw)
  .attr("height", rd/2)
  .attr ("transform", "translate ("+(-rd/2-yy)+","+(-rd/2)+") skewX("+ang+")")

  rect3d.append("rect")
	.attr("class", "side")
   .attr("id", "rect_side"+ident)
   .attr("x", ident*spacing)
  .attr("y", yy)
  .attr("width", rd/2)
  .attr("height", rh)
	  .attr ("transform", "translate ("+(-rd/2)+","+(-rd/2-ident*(spacing))+") skewY("+ang+")")
}
max_height = 100
percentage = 100
draw_cube(3, 50, max_height, percentage)
draw_cube(2, 50, max_height, percentage)
draw_cube(1, 50, max_height, percentage)
draw_cube(0, 50, max_height, percentage)

function remove_cubes(){
for (i=0;i<4;i++){	
document.getElementById("rect_side"+i).remove()
document.getElementById("rect_top"+i).remove()
document.getElementById("rect_forward"+i).remove()
}}

function draw_3d_histo(stats){i
for (i=0;i<4;i++){
perce = Math.round(stats[3-i]*100)
draw_cube(3-i, 50, max_height, perce)}
}
// ------------------------------------------------------
common_svg = d3.select(identity_test)
	.append("svg")
	.attr("width", 300)
	.attr("height", common_height)

svg_histo = common_svg.append("svg")
    .attr("id", "two_level_histogram")
    .attr('class','figures')
    .attr("width", 300) 
    .attr("height", height_2level_histo)
    .attr("y", 0); 

svg_histo.append("text")
     .text("Probability")
     .attr("class", "general_text")
    .attr("transform", "translate(40,100),rotate(-90)")
    .style("fill", "#004669")

var centre = width/2
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

    
      
var x_e = d3.scaleLinear() // x for energy gap
    .domain([0, max_scale]) // x-axis values
    .range([0, 10]) // width is the svg width minus the margins
    .clamp(true);    

function draw_parity_systems(x0,y0,up,width,radius,identity){
        color1 = "rgb(255,0,0,0.5)"
	color2 = "rgb(0,0,255,0.5)"
	stroke_color = "rgb(0,0,0,1.0)"
	circle1_color = color1
	center_shift = 5
	if (up[0]==true){circle1_color = color2}
        circle2_color = color1
	if (up[1]==true){circle2_color = color2}
	svg2.append("circle")
	    .attr("id", identity+"circle1")
	    .attr("cx", x0-center_shift)
	    .attr("cy", y0)
	    .attr("r", radius)
	    .style("fill", circle1_color)
	    //.style("opacity", 0.5)
	    .style("stroke", circle1_color)
	    .style("stroke-opacity", 1.0)
        svg2.append("circle")
	    .attr("id", identity+"circle2")
	    .attr("cx", x0-center_shift+width)
	    .attr("cy", y0)
	    .attr("r", radius)
	    .style("fill", circle2_color)
	    //.style("opacity", 0.5)
	    .style("stroke", circle2_color)
	    .style("stroke-opacity", 1.0)
}


twoL_histo_y_pos = 110 //These values are relative to SVG container of histo
twoL_histo_height = 200
twoL_margin_x = 20
twoL_center_x = 200
twoL_space = 50
var twoL_histo_width = 40
generate_histogram_2_level()


x_system1 = 10
x_system2 = 30
system_distance = 20
y0_systems = 13
line_width_systems = 10
gap_systems = 10
radius_systems = 10


// ----------------------------------------------------------------------------

function twoL_histo_pos_gen(d) {
    return twoL_margin_x + twoL_center_x - twoL_space*3 +  d * twoL_space -twoL_histo_width/2;
};

function generate_histogram_2_level(){
	var twoL_histogram_data = [0.25,0.25,0.25,0.25]
	
	//var x_histogram = d3.scaleLinear()
	//          .range([0, 200]);
	//var y_histogram = d3.scaleLinear()
	//		.domain([0,0.5])
	//          .range([100, 0]);
	var y_axis_ticks = d3.scaleLinear().domain([0,0.5]).range([200,100])
	var histogram_svg = d3.select("#two_level_histogram").append("g")
	
	// append the bar rectangles to the svg element
	histogram_svg.selectAll("rect")
		.data(twoL_histogram_data)
		.enter().append("rect")
		.style("fill", "#4682b4")
		.style("opacity", 0.8)
		.attr("id", function(d,i){return "twolevel_histo"+i})
		.attr("x", 0) // margin left
		.attr("y", function(d){return twoL_histo_y_pos-twoL_histo_height+(1-d)*twoL_histo_height}) // margin left
		.attr("transform", function(d,i) {
			  return "translate(" + twoL_histo_pos_gen(i) + ")"; })
		.attr("width", function(d,i) { return twoL_histo_width ; })
		//       .attr("width", function(d,i) { console.log(d) ; })
		.attr("height", function(d) { return d*twoL_histo_height; });
	  x_pos_histo_axis = twoL_histo_pos_gen(0)-20;
	  y_pos_histo_axis = twoL_histo_y_pos-twoL_histo_height;
}

var svg2 = common_svg.append("svg")
    .attr('class','figures')
    .attr("width", 300)
    .attr("height", height_2level)
    .attr("y", height_2level_histo+histo_margin);



svg2.append("text")
     .text("Parity")
     .attr("class", "general_text")
     .attr("x", 245)
    .attr("y", 20)
    .style("fill", "#004669")
updown = [[false,false],[true,false],[false,true],[true,true]]
for (n=0;n<updown.length;n++){
draw_parity_systems(twoL_histo_pos_gen(n)+14,y0_systems,updown[n],23,radius_systems,"paritystate"+n)
}

