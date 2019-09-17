const RBM_complete_XOR = "#CD_figure1_id" // This defines in which div we write into

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
dictionary["v_units"+IDENTIFIERXOR] = 2
dictionary["total_spins"+IDENTIFIERXOR] = 3
dictionary["histogram_data"+IDENTIFIERXOR] = [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.0]
dictionary["hidden_vecs"+IDENTIFIERXOR] = permutations_of_vector(dictionary["h_units"+IDENTIFIERXOR])
dictionary["bm_permutations"+IDENTIFIERXOR] = permutations_of_vector(dictionary["total_spins"+IDENTIFIERXOR])


// Add the space where it draws the RBM
d3.select(RBM_complete_XOR)
    .append("svg")
    .attr("id", "RBM_sampler"+IDENTIFIERXOR)
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", svg_RBM_height); // This is height of figure without 'selectors'

d3.select(RBM_complete_XOR)
    .append("svg")
    .attr("id", "RBM_sampler_histo"+IDENTIFIERXOR)
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", svg_histo_height); // This is height of figure without 'selectors'

test = d3.select("#RBM_sampler_histo"+IDENTIFIERXOR)
	.append("svg")
	.attr("width", 100)
	.attr("height", 100)
	.attr("x", 200)
	.attr("y", 100)
// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.

//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

update_architecture(IDENTIFIERXOR) 

dictionary["weight_slider_index"+IDENTIFIERXOR] = 0
dictionary["bias_slider_index"+IDENTIFIERXOR] = 0
//background_rectangles_hidden_visible(IDENTIFIERXOR)

generate_histogram("histogram_pos_phase",50, IDENTIFIERXOR)
generate_histogram("histogram_neg_phase",300, IDENTIFIERXOR)

generate_RBM_nodes(IDENTIFIERXOR)
generate_RBM_biases(IDENTIFIERXOR)
generate_RBM_connections(IDENTIFIERXOR)
add_text_elements(IDENTIFIERXOR)
add_text_elements(IDENTIFIERXOR)

dictionary["configuration_to_learn"+IDENTIFIERXOR] = [[1,1,1,],[1,-1,1],[-1,1,-1],[-1,-1,-1],[-1,1,1],[-1,-1,1], [1,-1,-1], [1,1,-1]]
wanted_config = 'red'
unwanted_config = 'blue'
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(0), 4, 10, [1,1,1], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(1), 4, 10, [1,0,1], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(2), 4, 10, [0,1,0], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(3), 4, 10, [0,0,0], wanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(4), 4, 10, [1,1,0], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(5), 4, 10, [1,0,0], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(6), 4, 10, [0,1,1], unwanted_config,IDENTIFIERXOR)
add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(7), 4, 10, [0,0,1], unwanted_config,IDENTIFIERXOR)

slider_bias_fct_RBM(0, IDENTIFIERXOR)
slider_fct_RBM(0, IDENTIFIERXOR)

console.log(dictionary["spins_data"+IDENTIFIERXOR] )
function add_visible_configs_XOR(x_pos, y_pos, radius, margin, config,color,identifier){
         d3.select("#RBM_sampler_histo"+identifier).append("rect")
                 .attr("x",0.9*x_pos-2*radius+2)
                 .attr("y",y_pos-2*radius+4)
                 .attr("rx", 5)
                 .attr("width", 40)
                 .attr("height", 31)
                 .attr("fill", "white")
		.attr("stroke", "black")
                 .attr("opacity", 0.5)
         d3.select("#RBM_sampler_histo"+identifier).selectAll()
                 .data(config)
                 .enter().append("circle")
                 .attr("cx", function(d,i){
                         return 0.9*x_pos+i*(1.0*radius+margin)})
                 .attr("cy", function(d,i){return 20+ y_pos - i%2*(2*radius+margin) })
                 .attr("r", radius)
                 .attr("fill", function(d,i){
                         return nodes_colors[i][d]})
		.attr("stroke", function(d,i){return stroke_colors[i][d]})

}
