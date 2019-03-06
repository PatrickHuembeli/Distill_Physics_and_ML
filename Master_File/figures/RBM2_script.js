const identity_RBM = "#RBM_graph_id" // This defines in which div we write into

// Defaults
var h_units = 2
var v_units = 2
var weight_select = 'all positive'

var width = 700;
var height = 250;
// var hidden_units = 8
// var visible_units = 8
var radius = 20.0
var space = 70.0

var nodes_colors = ["blue", "orange"]
ypos1 = 50
ypos2 = 200


// Add the space where it draws the RBM
var svg = d3.select(identity_RBM)
    .append("svg")
    .attr("id", "RBM_container")
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.


// Add the dropdown menus to choose the number of hidden and visible
// ----------------------------------------------------------------------------
var data1 = [2, 3, 4, 5, 6, 7, 8];
var weight_select_data = ['all positive', 'all negative', 'random']
var connection_data


// LATEX as an image
// var latex_raw = "E = \\sum_i \\sigma_i \\sigma_j";
// var latex_render_url = "http://latex.codecogs.com/gif.latex?";
// var latex_query = encodeURI(latex_raw);
// console.log(svg)
// var latex = svg.append("foreignObject")
//             .attr("x", 100)
//             .attr("y", 100)
//             .attr("width", 250)
//             .attr("height", 250)
//             .attr("requiredFeatures", "http://www.w3.org/TR/SVG11/feature#Extensibility")
//      // .attr({
// //          "x": 100,
// //          "y": 60,
// //          "width": 400,
// //          "height": 200,
// //          "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility"})
//          console.log(latex)
//      latex.append("xhtml:body")
//             .attr("margin", 0)
//             .attr("padding", 0)
//             .attr("width", 400)
//             .attr("height", 400)
//      .append("img").attr(
//          "src", latex_render_url + latex_query);



var select_h = d3.select(identity_RBM) // Define selector
  .append("text")
    .text("Number of hidden units: ")
  .append('select')
  	.attr('class','select')
    .on('change',onchange)
    
// var formula = d3.select("#RBM_graph_formula")
//                 .text("<d-math block> \sigma </d-math> ")   


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

// Inittialize Weight selecter
// ------------------------------------------
var select_weight = d3.select(identity_RBM)
  .append("text")
    .text(" Weights: ")
  .append('select')
  	.attr('class','select')
    .on('change', onchange)

var options_weight = select_weight
  .selectAll('option')
	.data(weight_select_data).enter()
	.append('option')
		.text(function (d) { return d; });		
// -----------------------------------------
function onchange() {
	h_units = select_h.property('value')
	v_units = select_v.property('value')
	weight_select = select_weight.property('value')
    svg.selectAll('*').remove()
    generate()    
};
// -------------------------------------------------------------
// Genearte the RBM Graph

generate = function(){

var spins = [[-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1]]

cut_spinlist(spins, h_units, v_units)


// Define connection Data
connection_data = []    
for(var i=0; i<h_units; i++) {
for(var j=0; j<v_units; j++) {
    console.log(weight_select)
    if (weight_select == 'random'){
        weight_value = getRandomInt(5)}
    else if (weight_select == 'all positive') {weight_value = 1}
    else {weight_value = -1}
    connection_data.push([i,j, weight_value]);}
}

var hidden_svg = svg.append("svg")

var visible_svg = svg.append("svg")

var weight_select_svg = svg.append("svg")

var energy_text = svg.append("text")
                        .attr("x", 20)
                        .attr("y", 20)
                        .attr("font-size", 20)
                        .text("Energy: "+calc_energy(spins))
                        

var center_x = (width / 2);
var center_y = (height / 2);

var hpos_gen = function(d) {
    return center_x - space*h_units/2 +  d * space ;
};

var vpos_gen = function(d) {
    return center_x - space*v_units/2 +  d * space ;
};

// Same function for connections
// Hidden has index 0
var hpos_gen_connect = function(d) {
    return center_x - space*h_units/2 +  d[0] * space ;
};

var vpos_gen_connect = function(d) {
    return center_x - space*v_units/2 +  d[1] * space ;
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

hidden_svg.selectAll("circle")
    .data(h_data)
    .enter()
    .append("circle")
    .style("fill", nodes_colors[0])
    .attr('class', 'hidden_circle') // class is needed for style sheet
    .attr("cx", hpos_gen)
    .attr("cy", ypos1) 
    .attr("r", radius)
    .attr('id', "hidden")
    
    .on("click", function(d) {selection = d3.select(this)
                                toggle_color(selection, spins, 0, d)
                                energy_text.text("Energy: "+calc_energy(spins))
                                tooltip.text('h' + d +' = '+ spins[0][d]) ;
   }) 
   
    .on("mouseover", function(d) {
             tooltip.text('h' + d +' = '+ spins[0][d])   
                    .style("visibility", "visible")
  })
  
   .on("mousemove", function() {
     tooltip.style("top", (event.pageY+10)+ "px") // event.pageX is mouse position
            .style("left", event.pageX+10 + "px");
  })
  
  .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })


visible_svg.selectAll("circle")
    .data(v_data)
    .enter()
    .append("circle")
    .style("fill", nodes_colors[0])
    .attr('class', 'visible_circle')
    .attr("cx", vpos_gen)
    .attr("cy", ypos2) 
    .attr("r", radius)
    .attr('id', "visible")
    .on("click", function(d) {selection = d3.select(this)
                                toggle_color(selection, spins, 1, d)
                                energy_text.text("Energy: "+calc_energy(spins))
                                tooltip.text('v' + d +' = '+ spins[1][d]);
   }) 
    
    .on("mouseover", function(d) {
        tooltip.text('v' + d +' = '+ spins[1][d])
                .style("visibility", "visible");
  })
  
   .on("mousemove", function(d) {
        tooltip.style("top", (event.pageY+10)+ "px")
        .style("left", event.pageX+10 + "px");
  })
  
  .on("mouseout", function() {tooltip.style("visibility", "hidden");
  })
 
d3.select("#RBM_container").selectAll()
    .data(connection_data)
    .enter()
    .append("line")
    .attr('class', 'RBM_line') // give it a class
    .attr("x1", hpos_gen_connect)
    .attr("y1", ypos1+radius)
    .attr("x2", vpos_gen_connect)
    .attr("y2", ypos2-radius)
    .on("mouseover", function(d) {
        tooltip.text('weight h:' + d[0] + ' v:' + d[1]+ ' strength: '+d[2])
                .style("visibility", "visible");
  })
  
   .on("mousemove", function(d) {
        tooltip.style("top", (event.pageY+10)+ "px")
        .style("left", event.pageX+10 + "px");
  })
  
  .on("mouseout", function() {tooltip.style("visibility", "hidden");
  })
    
}  
  
// Draw lines of weights

// for (var pos in h_data){
// console.log('pos', pos)
// d3.select("#RBM_container").selectAll()
//     .data(v_data)
//     .enter()
//     .append("line")
//     .attr('class', 'RBM_line') // give it a class
//     .attr("x1", hpos_gen(pos))
//     .attr("y1", ypos1+radius)
//     .attr("x2", vpos_gen)
//     .attr("y2", ypos2-radius)
//     .on("mouseover", function(d) {
//         tooltip.text('weight' + d + ' ' + pos)
//                 .style("visibility", "visible");
//   })
//   
//    .on("mousemove", function(d) {
//         tooltip.style("top", (event.pageY+10)+ "px")
//         .style("left", event.pageX+10 + "px");
//   })
//   
//   .on("mouseout", function() {tooltip.style("visibility", "hidden");
//   })
//     
//     }
// }

// Toggle function
var toggle_color = function(selection, spins, index, d){
current_color = selection.style("fill")
// console.log(current_color)
if(current_color == "blue"){current_color = nodes_colors[1]
                            spins[index][d]= 1}
else {current_color = nodes_colors[0]
        spins[index][d]= -1}
selection.transition()
selection.style("fill", current_color)
}

// hidden units have index 0
var cut_spinlist = function(spins, hunits, vunits){
for(var i=hunits; i<spins[0].length; i++) {
    spins[0][i] = 0;
}
for(var i=vunits; i<spins[1].length; i++) {
    spins[1][i] = 0;
}
}

var calc_energy = function(spins){
    var energy = 0
    for (var i = 0; i<spins[0].length; i++) {
        for (var j = 0; j<spins[1].length; j++) {
        spin = spins[0][i]
//         console.log(connection_data, i*(2-1) +j)
        if (spins[0][i] == 0 || spins[1][j] == 0){weight = 0}
        else {weight = connection_data[i*(2-1) +j ][2]}
        energy += spins[0][i]*spins[1][j]*weight;}}
//     console.log(energy)
//     console.log(spins)
    return energy
}

// Generate Data for the connections
// Generate random weights
function getRandomInt(max) {
  return (Math.floor(Math.random() * Math.floor(max))*2-max+1)/2;
}

generate() // generates the RBM when the sites is loaded first with default values.
