const identity_RBM = "#RBM_graph_id" // This defines in which div we write into

// Defaults
var h_units = 2
var v_units = 2

var width = 750;
var height = 250;
// var hidden_units = 8
// var visible_units = 8
var radius = 20.0
var space = 70.0

ypos1 = 50
ypos2 = 200


// Add the space where it draws the RBM
var svg = d3.select(identity_RBM)
    .append("svg")
    .attr('class','figures')
    .attr("width", "100%") // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

// Add the dropdown menus to choose the number of hidden and visible
// ----------------------------------------------------------------------------
var data1 = [2, 3, 4, 5, 6, 7, 8];

var select_h = d3.select(identity_RBM) // Define selector
  .append("text")
    .text("Number of hidden units: ")
  .append('select')
  	.attr('class','select')
    .on('change',onchange)
    

var options_h = select_h // Define options in drop-down menu
  .selectAll('option')
	.data(data1).enter()
	.append('option')
		.text(function (d) { return d; });
	

var select_v = d3.select(identity_RBM)
  .append("text")
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
var tooltip = d3.select("body") //This is in body not svg
  .append("div")
  .attr('class', 'tooltip');

svg.selectAll()
    .data(h_data)
    .enter()
    .append("circle")
    .attr('class', 'hidden_circle')
    .attr("cx", hpos_gen)
    .attr("cy", ypos1) 
    .attr("r", radius)
    .attr('id', "hidden")
    
    .on("mouseover", function(d) {
             tooltip.text('hidden node info' + d)   
                    .style("visibility", "visible")
  })
  
   .on("mousemove", function() {
     tooltip.style("top", (event.pageY+10)+ "px") // event.pageX is mouse position
            .style("left", event.pageX+10 + "px");
  })
  
  .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })


svg.selectAll()
    .data(v_data)
    .enter()
    .append("circle")
    .attr('class', 'visible_circle')
    .attr("cx", vpos_gen)
    .attr("cy", ypos2) 
    .attr("r", radius)
    //.attr('id', "visible")
    .on("mouseover", function(d) {
        tooltip.text('visible node info' + d)
                .style("visibility", "visible");
  })
  
   .on("mousemove", function(d) {
        tooltip.style("top", (event.pageY+10)+ "px")
        .style("left", event.pageX+10 + "px");
  })
  
  .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })

for (var pos in h_data){
svg.selectAll("hidden")
    .data(v_data)
    .enter()
    .append("line")
    .attr('class', 'RBM_line') // give it a class
    .attr("x1", hpos_gen(pos))
    .attr("y1", ypos1+radius)
    .attr("x2", vpos_gen)
    .attr("y2", ypos2-radius);
    }
}

generate() // generates the RBM when the sites is loaded first with default values.
