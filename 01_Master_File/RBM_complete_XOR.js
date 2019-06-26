const RBM_complete_XOR = "#RBM_complete_id_XOR" // This defines in which div we write into

var IDENTIFIERXOR = '_XOR'

// How to read out checkbox values
var select_hidden = document.getElementById("hidden_check"+IDENTIFIERXOR)
var select_restricted = document.getElementById("restricted_check"+IDENTIFIERXOR)

//select_hidden.checked = false
//var hidden_active = select_hidden.checked // Initialize selectors
//var restricted_active = select_restricted.checked

var slider_bias = document.getElementById("bias_slider_id"+IDENTIFIERXOR)
var slider_weight = document.getElementById("weight_slider_id"+IDENTIFIERXOR)

dictionary["h_units"+IDENTIFIERXOR] = 1
dictionary["v_units"+IDENTIFIERXOR] = 3
dictionary["total_spins"+IDENTIFIERXOR] = 4
dictionary["histogram_data_init"+IDENTIFIERXOR] = [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05]
dictionary["hidden_vecs"+IDENTIFIERXOR] = permutations_of_vector(dictionary["h_units"+IDENTIFIERXOR])
dictionary["bm_permutations"+IDENTIFIERXOR] = permutations_of_vector(dictionary["total_spins"+IDENTIFIERXOR])

// Default Variables
var h_units = 1
var v_units = 3
var total_spins = h_units + v_units

var width = 700;
var height = 250;
var radius = 15.0
var space = 50.0

var center_x = 200;
var center_y = 110;

var margin_x = 20

var nodes_colors = ["blue", "orange"]
var ypos1 = 50
var ypos2 = 200


//var tooltip = d3.select("body") //This is in body not svg
//  .append("div")
//  .attr('class', 'tooltip');

// Scaling for the positioning functions. Changes size of graph
var scaling = 80

var histo_width = 30
var histo_height = 200
var histo_y_pos = 10
// Add the space where it draws the RBM
d3.select(RBM_complete_XOR)
    .append("svg")
    .attr("id", "RBM_sampler"+IDENTIFIERXOR)
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

d3.select(RBM_complete_XOR)
    .append("svg")
    .attr("id", "RBM_sampler_histo"+IDENTIFIERXOR)
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'
// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.

//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

update_architecture(IDENTIFIERXOR) 

dictionary["weight_slider_index"+IDENTIFIERXOR] = 0
dictionary["bias_slider_index"+IDENTIFIERXOR] = 0
background_rectangles_hidden_visible(IDENTIFIERXOR)
generate_histogram(IDENTIFIERXOR)
generate_RBM_graph(IDENTIFIERXOR)   
//generate_RBM_biases(IDENTIFIERXOR)   
//generate_RBM_connections(IDENTIFIERXOR)   
add_text_elements(IDENTIFIERXOR)

dictionary["configuration_to_learn"+IDENTIFIERXOR] = [[1,1,1,],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1], [-1,-1,1], [-1,-1,-1]]
wanted_config = 'red'
unwanted_config = 'blue'
add_visible_configs_XOR(histo_pos_gen(4), histo_y_pos, 4, 10, [1,1,1], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(0), histo_y_pos, 4, 10, [1,1,0], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(1), histo_y_pos, 4, 10, [1,0,1], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(7), histo_y_pos, 4, 10, [1,0,0], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(2), histo_y_pos, 4, 10, [0,1,1], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(5), histo_y_pos, 4, 10, [0,1,0], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(6), histo_y_pos, 4, 10, [0,0,1], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_pos_gen(3), histo_y_pos, 4, 10, [0,0,0], wanted_config,IDENTIFIERXOR)

function add_visible_configs_XOR(x_pos, y_pos, radius, margin, config,color,identifier){
         d3.select("#RBM_sampler_histo"+identifier).append("rect")
                 .attr("x",0.9*x_pos-2*radius)
                 .attr("y",y_pos-2*radius)
                 .attr("rx", 5)
                 .attr("width", 40)
                 .attr("height", 35)
                 .attr("fill", color)
                 .attr("opacity", 0.1)
         d3.select("#RBM_sampler_histo"+identifier).selectAll()
                 .data(config)
                 .enter().append("circle")
                 .attr("cx", function(d,i){
                         return 0.9*x_pos+i*(1.0*radius+margin)})
                 .attr("cy", function(d,i){return y_pos + i%2*(2*radius+margin) })
                 .attr("r", radius)
                 .attr("fill", function(d){
                         return nodes_colors[d]})

}
