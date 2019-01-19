// Defaults
var h_units = 2
var v_units = 2

var width = 700;
var height = 250;
// var hidden_units = 8
// var visible_units = 8
var radius = 20.0
var space = 70.0

ypos1 = 50
ypos2 = 200

// Add the space where it draws the RBM
var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height);


// Add the dropdown menus to choose the number of hidden and visible
// ----------------------------------------------------------------------------
var data1 = [1, 2, 3, 4, 5, 6, 7, 8];

var select_h = d3.select('body')
  .append("text")
//    .append("textPath") //append a textPath to the text element
//     .attr("xlink:href", "#wavy") //place the ID of the path here
//     .style("text-anchor","left") //place the text halfway on the arc
    .text("Number of hidden units: ")
  .append('select')
  	.attr('class','select')
    .on('change',onchange)
    

var options_h = select_h
  .selectAll('option')
	.data(data1).enter()
	.append('option')
		.text(function (d) { return d; });
	
select_h.attr('selected', '3')	

var select_v = d3.select('body')
  .append("text")
//    .append("textPath") //append a textPath to the text element
//     .attr("xlink:href", "#wavy") //place the ID of the path here
//     .style("text-anchor","middle") //place the text halfway on the arc
//     .attr("startOffset", "50%")
    .text(" Number of visible units: ")
  .append('select')
  	.attr('class','select')
    .on('change',onchange)

var options_v = select_v
  .selectAll('option')
	.data(data1).enter()
	.append('option')
		.text(function (d) { return d; });

function onchange() {
	h_Value = select_h.property('value')
	v_Value = select_v.property('value')
	h_units = h_Value
	v_units = v_Value
// 	d3.select('body')
// 		.append('p')
// 		.text(selectValue + ' is the last selected option.')
    svg.selectAll('*').remove()
    generate()    
};
// -------------------------------------------------------------



// Genearte the RBM Graph

generate = function(){

var center_x = (width / 2);
var center_y = (height / 2);

var hpos_gen = function(d) {
    return center_x - space*h_units/2 +  d * space ;
};

var vpos_gen = function(d) {
    return center_x - space*v_units/2 +  d * space ;
};


function HisBigEnough(value) {
  return value < h_units;
};

function VisBigEnough(value) {
  return value < v_units;
}; 

var data = [0,1,2,3,4,5,6,7]

var h_data = data.filter(HisBigEnough);
var v_data = data.filter(VisBigEnough);


// Define tooltips for hovering information
var tooltip = d3.select("body")
  .append("div")
  .attr('class', 'tooltip');
  
tooltip.style({"position": "absolute",
        "z-index": "10",
        "visibility": "hidden",
        "background-color": "lightblue",
        "text-align": "center",
        "padding": "4px",
        "border-radius": "4px",
        "font-weight": "bold",
        "color": "orange"})


svg.selectAll("hidden")
    .data(h_data)
    .enter().append("circle")
    .attr("cx", hpos_gen)
    .attr("cy", ypos1) 
    .attr("r", radius)
    .attr('id', "hidden")
    
    .on("mouseover", function(d) {
    return tooltip.style("visibility", "visible").text('hidden node info' + d);
  })
  
   .on("mousemove", function() {
     return tooltip.style("top", (event.pageY - 30) + "px")
      .style("left", event.pageX + "px");
  })
  
  .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })
    .style("opacity", 0.5)
    .style("fill", "red")
    .style("stroke", "blue")
    .style("stroke-width", 2)


svg.selectAll("visible")
    .data(v_data)
    .enter().append("circle")
    .attr("cx", vpos_gen)
    .attr("cy", ypos2) 
    .attr("r", radius)
    .attr('id', "visible")
    .on("mouseover", function(d) {
    return tooltip.style("visibility", "visible").text('visible node info' + d);
  })
  
   .on("mousemove", function() {
     return tooltip.style("top", (event.pageY - 30) + "px")
      .style("left", event.pageX + "px");
  })
  
  .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })
    .style("opacity", 0.5)
    .style("fill", "blue");;

for (var pos in h_data){
svg.selectAll("hidden")
    .data(v_data)
    .enter().append("line")
    .attr("x1", hpos_gen(pos))
    .attr("y1", ypos1+radius)
    .attr("x2", vpos_gen)
    .attr("y2", ypos2-radius);
    }

d3.select("#visible-count").on('change', function() {
    v_units = this.value;
}); 

d3.select("#hidden-count").on('change', function() {
    h_units = this.value;
}); 
}

generate() // generates the RBM when the sites is loaded first with default values.
