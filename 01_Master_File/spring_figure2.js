const identity_spring2 = "#spring_figure_id2"

// Define SVG Histogram
spring_svg2 = d3.select(identity_spring2)
	.append("svg")
	.attr("id", "fig4_SVG2")
	.attr("x", 0)

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
	.attr("fill", "blue")
spring_svg2.append("circle")
	.attr("id", "node2")
	.attr("cx", center_x_spring)
	.attr("cy", 100)
	.attr("r", 20)
	.attr("fill", "red")
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

function spring_slider2(value){
	val = (1-value)+0.1
	console.log(value)
	d3.select("#spring_fig_coupling").attr("stroke-width", val*5)
	d3.select("#spring_fig_coupling").attr("opacity", val)
}


