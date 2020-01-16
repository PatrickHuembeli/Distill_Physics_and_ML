const identity_spring = "#spring_figure_id1"

// Define SVG Histogram
spring_svg = d3.select(identity_spring)
	.append("svg")
	.attr("id", "fig4_SVG")
	.attr("x", 0)
	.attr("height", 200)


function draw_arrow_up(x1, y1, x2, y2){
spring_svg.append("line")
		.attr("class", "up_arrow")
             .attr("x1",x1)  
             .attr("y1",y1)  
             .attr("x2",x2)  
             .attr("y2",y2)  
             .attr("stroke",arrow_color)  
             .attr("stroke-width",arrow_stroke)  

var string = String(x1-x_change)+" "+String(y1+y_change)+" "+String(x1)+" "+String(y1)+" "+String(x1+x_change)+" "+String(y1+y_change)

spring_svg.append("polyline")
	.attr("class", "up_arrow")
	.attr("points", string)
	.attr("stroke", arrow_color)
	.attr("stroke-width", arrow_stroke)
	.attr("fill", "none")
}

function draw_arrow_down(x1, y1, x2, y2){
spring_svg.append("line")
		.attr("class", "down_arrow")
             .attr("x1",x1)  
             .attr("y1",y1)  
             .attr("x2",x2)  
             .attr("y2",y2)  
             .attr("stroke",arrow_color)  
             .attr("stroke-width",arrow_stroke)  

var string = String(x2-x_change)+" "+String(y2-y_change)+" "+String(x2)+" "+String(y2)+" "+String(x2+x_change)+" "+String(y2-y_change)

spring_svg.append("polyline")
	.attr("class", "down_arrow")
	.attr("points", string)
	.attr("stroke", arrow_color)
	.attr("stroke-width", arrow_stroke)
	.attr("fill", "none")
}

function draw_spring(center_x, center_y, width,  nr_of_kinks, descent){
	start_length = 20
	y_pos = center_y+start_length
	spring_svg.append("line")
		.attr("class", "spring_line")
		.attr("x1", center_x)
		.attr("x2", center_x)
		.attr("y1", center_y)
		.attr("y2", y_pos)
		.attr("stroke", "red")
	spring_svg.append("line")
		.attr("class", "spring_line")
		.attr("x1", center_x)
		.attr("x2", center_x+width/2)
		.attr("y1", y_pos)
		.attr("y2", y_pos + descent)
		.attr("stroke", "red")
	y_pos = y_pos + descent
	x_pos = center_x + width/2		
	for (i=1; i<=nr_of_kinks; i++){
	spring_svg.append("line")	
		.attr("class", "spring_line")
		.attr("x1", x_pos)
		.attr("x2", x_pos + (-1)**i*width)
		.attr("y1", y_pos)
		.attr("y2", y_pos + descent)
		.attr("stroke", "red")
	x_pos = x_pos + (-1)**i*width
	y_pos = y_pos + descent		
	}
	spring_svg.append("line")
		.attr("class", "spring_line")
		.attr("x1", x_pos)
		.attr("x2", center_x)
		.attr("y1", y_pos)
		.attr("y2", y_pos +descent/2)
		.attr("stroke", "red")
	y_pos = y_pos + descent/2
	spring_svg.append("line")
		.attr("class", "spring_line")
		.attr("x1", center_x)
		.attr("x2", center_x)
		.attr("y1", y_pos)
		.attr("y2", y_pos+start_length)
		.attr("stroke", "red")
	return y_pos + start_length
}

arrow_color = "blue"
arrow_stroke = 10
x_change = 20
y_change = 20
x_pos_arrows = 100
down_arrow_length = 60
margin_between_arrows = 10

draw_arrow_up(x_pos_arrows, 10, x_pos_arrows, 100)
draw_arrow_down(x_pos_arrows, 120, x_pos_arrows, 180)

center_x_spring = 50
y_start = 0
y_pos_final = draw_spring(center_x_spring, y_start, 40, 10, 5)

rect_height = 40
rect_width = 40
spring_svg.append("rect")
	.attr("id", "spring_weight")
	.attr("x", center_x_spring-rect_width/2)
	.attr("y", y_pos_final)
	.attr("height", rect_height)
	.attr("width", rect_width)
	.attr("fill", "blue")
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

function spring_slider(value){
	val = (1-value) 
	d3.selectAll(".spring_line").remove()
	d3.selectAll(".down_arrow").remove()
	d3.selectAll(".up_arrow").remove()
	y_pos_final = draw_spring(center_x_spring, y_start, 40, 10, val*7)
	draw_arrow_down(x_pos_arrows, y_pos_final, x_pos_arrows, y_pos_final+down_arrow_length)	
	draw_arrow_up(x_pos_arrows, y_pos_final-val*100, x_pos_arrows, y_pos_final-margin_between_arrows)
	d3.select("#spring_weight").attr("y", y_pos_final)
}

spring_slider(0.0)

