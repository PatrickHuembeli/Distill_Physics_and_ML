const identity_spring2 = "#spring_figure_id2"

// Define SVG Histogram
spring_svg2 = d3.select(identity_spring2)
	.append("svg")
	.attr("id", "fig4_SVG2")
	.attr("x", 0)

node1_color = "blue"
node2_color = "red"

spring_svg2.append("line")
	.attr("id", "spring_fig_coupling")
	.attr("x1", center_x_spring)
	.attr("x2", center_x_spring)
	.attr("y1", 20)
	.attr("y2", 100)
	.attr("stroke", "black")
spring_svg2.append("circle")
	.attr("id", "node1")
	.attr("cx", center_x_spring)
	.attr("cy", 20)
	.attr("r", 20)
	.attr("fill", node1_color)
spring_svg2.append("circle")
	.attr("id", "node2")
	.attr("cx", center_x_spring)
	.attr("cy", 100)
	.attr("r", 20)
	.attr("fill", node2_color)
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

function draw_bracket_left(x1, y1, x2, y2){
x_ch_br = 10
bracket_height = Math.abs(y1-y2)
center = y1 + bracket_height/2	
 var string = String(x1)+" "+String(y1)+" "+String(x1-x_ch_br)+" "+String(center)+" "+String(x2)+" "+String(y2)

 spring_svg2.append("polyline")
         .attr("class", "bracket")
         .attr("points", string)
         .attr("stroke", bracket_color)
         .attr("stroke-width", bracket_stroke)
         .attr("stroke-linejoin", "round")
         .attr("stroke-linecap", "round")
         .attr("fill", "none")
 }
function draw_bracket_right(x1, y1, x2, y2){
x_ch_br = 10
bracket_height = Math.abs(y1-y2)
center = y1 + bracket_height/2	
 var string = String(x1)+" "+String(y1)+" "+String(x1+x_ch_br)+" "+String(center)+" "+String(x2)+" "+String(y2)

 spring_svg2.append("polyline")
         .attr("class", "bracket")
         .attr("points", string)
         .attr("stroke", bracket_color)
         .attr("stroke-width", bracket_stroke)
         .attr("stroke-linejoin", "round")
         .attr("stroke-linecap", "round")
         .attr("fill", "none")
return center	
 }

function draw_expectation(x,y, Text_string){
bracket_color = "black"
bracket_stroke = 2
bracket_height = 40	
bracket_width = 40	
bracket_margin = 5	
center = draw_bracket_left(x, y, x, y+bracket_height)
center = draw_bracket_right(x+bracket_width, y, x+bracket_width, y+bracket_height)

spring_svg2.append("circle")
	.attr("id", "node1")
	.attr("cx", x+bracket_margin)
	.attr("cy", center)
	.attr("r", 10)
	.attr("fill", node1_color)
spring_svg2.append("circle")
	.attr("id", "node2")
	.attr("cx", x+bracket_width-bracket_margin)
	.attr("cy", center)
	.attr("r", 10)
	.attr("fill", node2_color)
spring_svg2.append("text")
	.text(Text_string)
	.attr("x", x+bracket_width+6)
	.attr("y", y+bracket_height)
}

draw_expectation(90, 10, "Model")
draw_expectation(90, 100, "Data")

function spring_slider2(value){
	val = (1-value)+0.1
	console.log(value)
	d3.select("#spring_fig_coupling").attr("stroke-width", val*5)
	d3.select("#spring_fig_coupling").attr("opacity", val)
}


