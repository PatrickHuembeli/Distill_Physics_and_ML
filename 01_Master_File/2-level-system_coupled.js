const identity_test = "#test_figure_id"
// myFunction reads from slider and updates everything
// Fct of Slider 1

var init_temp = 0.5
var init_coupling = -1.0 

var x_temp = d3.scalePow()
    .exponent(5)
    .domain([0.001, 1])
    .range([0.1, 100])
    .clamp(true);   

document.getElementById("temperature_slider").style.borderRadius = "7px";
document.getElementById("coupling_strength").innerHTML = init_coupling
//document.getElementById("energy_slider").innerHTML = 0.5
document.getElementById("temperature_slider").innerHTML = Math.round(x_temp(init_temp))
document.getElementById("temperature_slider").style.backgroundColor = d3.rgb(init_temp*255, 0.0, (1-init_temp)*255 ,0.4)

document.getElementById("temp_slider_id").value= init_temp
document.getElementById("coupling_slider_id").value = init_coupling


function temp_slider(val) {
//   slider_text.style.backgroundColor = "yellow";
  //slider_element = document.getElementById("temp_slider_id")
//   slider_element.style.backgroundColor = "yellow"
  //energy = document.getElementById("energy_slider").innerHTML
  energy = 1.0
  coupling = document.getElementById("coupling_strength").innerHTML
	temp = x_temp(val)
	new_data = update_2L_probabilities(coupling,temp,energy)
	update_2L_histogram(new_data,twoL_histo_height, twoL_histo_y_pos)
	update_opacities(new_data)
  //update(x_temp(val)); THIS WAS FOR PLOT
}

function update_number_temp(val){
	slider_text = document.getElementById("temperature_slider")  	
	slider_text.innerHTML = x_temp(val).toPrecision(2)
	slider_text.style.backgroundColor = d3.rgb(val*255, 0.0, (1-val)*255 ,0.4)
}

function energy_slider(val){
	slider_text = document.getElementById("energy_slider")
	slider_text.innerHTML = val
	temperature = document.getElementById("temperature_slider").innerHTML
	coupling = document.getElementById("coupling_strength").innerHTML
	new_data = update_2L_probabilities(coupling, temperature,val)
	update_2L_histogram(new_data,twoL_histo_height, twoL_histo_y_pos)
	var y_pos = y0_systems - gap_systems*(val)
	d3.select("#system1circle2").attr("cy", y_pos)
	d3.select("#system1line2").attr("y1", y_pos)
					.attr("y2", y_pos)
	d3.select("#system2circle2").attr("cy", y_pos)
	d3.select("#system2line2").attr("y1", y_pos)
					.attr("y2", y_pos)
	update_opacities(new_data)
}

function update_opacities(new_data){
	opacity_low = new_data[0]+new_data[1]+new_data[2]
	opacity_high = new_data[3]+new_data[1]+new_data[2]
	d3.select("#system1circle1").attr("opacity", opacity_low)
	d3.select("#system2circle1").attr("opacity", opacity_low)
	d3.select("#system1circle2").attr("opacity", opacity_high)
	d3.select("#system2circle2").attr("opacity", opacity_high)
}

function coupling_slider(val) {
 	var temperature = document.getElementById("temperature_slider").innerHTML
	//var energy_gap = document.getElementById("energy_slider").innerHTML
	var new_data = update_2L_probabilities(val, temperature, energy_gap)
	update_2L_histogram(new_data,twoL_histo_height, twoL_histo_y_pos)
	update_opacities(new_data)
}

function update_number_e(val){
	document.getElementById("energy_slider").innerHTML=val
}

function update_number_coupling(val){
	document.getElementById("coupling_strength").innerHTML= val
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
    height_2level = 30
    height_2level_histo = 120
    distance_systems = 100

d3.select(identity_test)
    .append("svg")
    .attr("id", "two_level_histogram")
    .attr('class','figures')
    .attr("width", "100%") // use whole space given in article
    .attr("height", height_2level_histo); 

var svg2 = d3.select(identity_test)
    .append("svg")
    .attr('class','figures')
    .attr("width", "100%")
    .attr("height", height_2level);


var centre = width/2
    max_scale = 10 //max scale for x_e
    max_log_scale = 10000
    energy_gap = 10.0
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

function draw_2level_system(x0,y0,up,width,gap,radius,identity){
	svg2.append("line")
	    .attr("id", identity+"line1")
	    .attr("x1", x0)
	    .attr("x2", x0+width)
	    .attr("y1", y0)
	    .attr("y2", y0)
	    .style("stroke", "black");
	svg2.append("line")
	    .attr("id", identity+"line2")
	    .attr("x1", x0)
	    .attr("x2", x0+width)
	    .attr("y1", y0-gap)
	    .attr("y2", y0-gap)
	    .style("stroke", "black");
	var y_pos_circle = y0
	if (up==true){
		y_pos_circle = y0-gap}
	svg2.append("circle")
		     .attr("id", identity+"circle1")
	             .attr("cx", x0+width/2)
	             .attr("cy", y_pos_circle)
	             .attr("r", radius);
}

function draw_parity_systems(x0,y0,up,width,radius,identity){
        circle1_color = "red"
	if (up[0]==true){circle1_color = "blue"}
        circle2_color = "red"
	if (up[1]==true){circle2_color = "blue"}
	svg2.append("circle")
	    .attr("id", identity+"circle1")
	    .attr("cx", x0)
	    .attr("cy", y0)
	    .attr("r", radius)
	    .style("fill", circle1_color)
	    .style("opacity", 0.5)
        svg2.append("circle")
	    .attr("id", identity+"circle2")
	    .attr("cx", x0+width)
	    .attr("cy", y0)
	    .attr("r", radius)
	    .style("fill", circle2_color)
	    .style("opacity", 0.5)
}

function draw_arrow(x0, y0, arrow_width, arrow_height , distance,thick){
x1 = x0+arrow_width
y1 = y0-arrow_height
x2 = x1
y2 = y0-thick
x3 = x2+distance
y3 = y2
x4 = x3
y4 = y1
x5 = x3 + arrow_width
y5 = y0
x6 = x4
y6 = y0+arrow_height
x7 = x3
y7 = y0+thick
x8 = x1
y8 = y7
x9 = x1
y9 = y6

svg2.append("polygon")
.attr("points",`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5} ${x6},${y6} ${x7},${y7} ${x8},${y8} ${x9},${y9}`)
	.attr("fill", "red")
      .attr("stroke","black")
      .attr("stroke-width",2);
}

//draw_arrow(100,50,25,20, 70, 8)
//x0,y0,width,gap,radius,identity
// Generate Histogram
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


updown = [[false,false],[true,false],[false,true],[true,true]]
for (n=0;n<updown.length;n++){
draw_parity_systems(twoL_histo_pos_gen(n)+14,y0_systems,updown[n],10,radius_systems,"paritystate"+n)
//x_system1 = twoL_histo_pos_gen(n)
//x_system2 = x_system1 + system_distance
//draw_2level_system(x_system1,y0_systems,updown[n][0],line_width_systems,gap_systems,radius_systems,"h"+n+"system1")
//draw_2level_system(x_system2,y0_systems,updown[n][1],line_width_systems,gap_systems,radius_systems,"h"+n+"system2")
}

// ----------------------------------------------------------------------------

function twoL_histo_pos_gen(d) {
    return twoL_margin_x + twoL_center_x - twoL_space*3 +  d * twoL_space -twoL_histo_width/2;
};

function generate_histogram_2_level(){
	var twoL_histogram_data = [0.25,0.25,0.25,0.25]
	
	var x_histogram = d3.scaleLinear()
	          .range([0, 100]);
	var y_histogram = d3.scaleLinear()
			.domain([0,0.5])
	          .range([100, 0]);
	var y_axis_ticks = d3.scaleLinear().domain([0,0.5]).range([200,100])
	var histogram_svg = d3.select("#two_level_histogram").append("g")
	
	// append the bar rectangles to the svg element
	histogram_svg.selectAll("rect")
		.data(twoL_histogram_data)
		.enter().append("rect")
		.style("fill", "#4682b4")
		.style("opacity", 0.5)
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
	  
	  histogram_svg.append("g")
	        .call(d3.axisLeft(y_axis_ticks).ticks(5))
	        .attr("transform", function(){return  "translate("+x_pos_histo_axis+"," + y_pos_histo_axis + ")";})
}

//new_data = update_2L_probabilities(1,1,1)

coupling_slider(init_coupling)
temp_slider(init_temp)
