const RBM_complete = "#RBM_complete_id" // This defines in which div we write into

var IDENTIFIER = ''

// How to read out checkbox values
var select_hidden = document.getElementById("hidden_check"+IDENTIFIER)
var select_restricted = document.getElementById("restricted_check"+IDENTIFIER)

dictionary = {}
//select_hidden.checked = false
//var hidden_active = select_hidden.checked // Initialize selectors
//var restricted_active = select_restricted.checked


// Default Variables
dictionary["h_units"+IDENTIFIER] = 2
dictionary["v_units"+IDENTIFIER] = 4
dictionary["total_spins"+IDENTIFIER] = 6
var width = 700;
var height = 250;
var radius = 15.0
var space = 50.0

var center_x = 200;
var center_y = 110;

var margin_x = 10

var nodes_colors = ["blue", "orange"]
var ypos1 = 50
var ypos2 = 200


var tooltip = d3.select("body") //This is in body not svg
  .append("div")
  .attr('class', 'tooltip');

// Scaling for the positioning functions. Changes size of graph
var scaling = 100

var histo_width = 30
var histo_height = 200
var histo_y_pos = 10
// Add the space where it draws the RBM
d3.select(RBM_complete)
    .append("svg")
    .attr("id", "RBM_sampler"+IDENTIFIER)
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

d3.select(RBM_complete)
    .append("svg")
    .attr("id", "RBM_sampler_histo"+IDENTIFIER)
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'
// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.

//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

update_architecture(IDENTIFIER) 

dictionary["weight_slider_index"+IDENTIFIER] = 0
dictionary["bias_slider_index"+IDENTIFIER] = 0
background_rectangles_hidden_visible(IDENTIFIER)
generate_histogram(IDENTIFIER)
generate_RBM_graph(IDENTIFIER)   
add_text_elements(IDENTIFIER)

dictionary["configuration_to_learn"+IDENTIFIER] = [[-1,-1,1,1],[1,-1,-1,1],[1,1,-1,-1],[-1,1,1,-1],[-1,-1,-1,-1],[1,1,1,1]]
add_visible_configs(histo_pos_gen(0), histo_y_pos, 4, 10, [0,0,1,1])
add_visible_configs(histo_pos_gen(1), histo_y_pos, 4, 10, [1,0,1,0])
add_visible_configs(histo_pos_gen(2), histo_y_pos, 4, 10, [1,1,0,0])
add_visible_configs(histo_pos_gen(3), histo_y_pos, 4, 10, [0,1,0,1])
add_visible_configs(histo_pos_gen(4), histo_y_pos, 4, 10, [1,1,1,1])
add_visible_configs(histo_pos_gen(5), histo_y_pos, 4, 10, [0,0,0,0])

function background_rectangles_hidden_visible(identifier){
	vis_background_rect_width = 250
	vis_background_rect_height = 130
	hid_background_rect_height = 100
	hid_background_rect_width = 150
	visible_background_rect_x = center_x-vis_background_rect_width/2 
	visible_background_rect_y = center_y-radius*1.5 
	d3.select("#RBM_complete_main_svg"+identifier).append("rect")
		.attr("x", visible_background_rect_x)
		.attr("y", visible_background_rect_y)
		.attr("height", vis_background_rect_height)
		.attr("width", vis_background_rect_width)
		.attr("fill", "blue")
		.attr("opacity", 0.1)
		.attr("rx", 10)
	
	d3.select("#RBM_complete_main_svg"+identifier).append("rect")
		.attr("x", visible_background_rect_x+(vis_background_rect_width-hid_background_rect_width)/2)
		.attr("y", visible_background_rect_y-hid_background_rect_height)
		.attr("height", hid_background_rect_height)
		.attr("width", hid_background_rect_width)
		.attr("fill", "red")
		.attr("opacity", 0.1)
		.attr("rx", 10)
		}


function update_architecture(identifier){
	var h_units = dictionary["h_units"+identifier]
	var v_units = dictionary["v_units"+identifier]
	var total_spins = dictionary["total_spins"+identifier]
	all_connections = make_connection_new(identifier)
	dictionary["connection_graph"+identifier] = all_connections[0]
	dictionary["weight_matrix"+identifier] = all_connections[1]
	// console.log(dictionary["weight_matrix"])	
	var spins_data = []
	var spins_new = []
	var biases = []
	for (var i = 0; i < total_spins; i++) {
	    spins_data.push(i);
	    spins_new.push(-1); 
	    biases.push(0);	
	}
	dictionary["biases"+identifier] = biases
	dictionary["spins_data"+identifier] = spins_data
	dictionary["spins_new"+identifier] = spins_new

	d3.select("#RBM_sampler"+identifier).append("text")
			.attr("id", "energy_text"+identifier)
                        .attr("x", 20)
                        .attr("y", 20)
                        .attr("font-size", 20)
                        .text("Energy: "+energy_fct(spins_new, identifier))

	d3.select("#RBM_sampler"+identifier).append("svg")
			.attr("id", "RBM_complete_main_svg"+identifier)

	background_rectangles_hidden_visible()
	visible_vecs = permutations_of_vector(v_units)
	hidden_vecs = permutations_of_vector(h_units)
	bm_permutations = permutations_of_vector(total_spins)
}

function generate_histogram(identifier){
var histogram_data = [0.05,0.05,0.05,0.05,0.05,0.05] 

var x_histogram = d3.scaleLinear()
          .range([0, 100]);
var y_histogram = d3.scaleLinear()
		.domain([0,0.5])
          .range([100, 0]);

histogram_svg = d3.select("#RBM_sampler_histo"+identifier).append("g")

// append the bar rectangles to the svg element
histogram_svg.selectAll("rect")
	.data(histogram_data)
	.enter().append("rect")
	.style("fill", "#4682b4")
	.style("opacity", 0.5)
	.attr("id", function(d,i){return "histo"+identifier+i})
	.attr("x", 0) // margin left
	.attr("y", function(d){return histo_y_pos-100+(1-d)*histo_height}) // margin left
	.attr("transform", function(d,i) {
		  return "translate(" + histo_pos_gen(i) + ")"; })
	.attr("width", function(d,i) { return histo_width ; })
	//       .attr("width", function(d,i) { console.log(d) ; })
	.attr("height", function(d) { return d*histo_height; });
  y_pos_histo_axis = histo_pos_gen(0)-20;
  x_pos_histo_axis = histo_y_pos;
  
  histogram_svg.append("g")
        .call(d3.axisLeft(y_histogram))
        .attr("transform", function(){return  "translate("+y_pos_histo_axis+"," + x_pos_histo_axis + ")";})
}

// =============================================================================
// =============================================================================
// DEFINE ALL FUNCTIONS
// =============================================================================


// -----------------------------------------------------------------------------
// General Connection Matrix function
// -----------------------------------------------------------------------------
function make_connection_new(identifier){
	var h_units = dictionary["h_units"+identifier]
	var v_units = dictionary["v_units"+identifier]
	var total_spins = dictionary["total_spins"+identifier]
	var total_nodes = total_spins
	stringer = "hidden_check"+identifier
	console.log("hidden_check"+identifier, stringer)
	hidden_active = document.getElementById("hidden_check"+identifier).checked 
	restricted_active = document.getElementById("restricted_check"+identifier).checked 
	if (hidden_active== false){
		total_nodes = total_spins - h_units
	}
	var weight_matrix = []
	var connection_graph = []
	// Initialize connection Data
    	for(var j=0; j< total_nodes; j++) {
		row = Array(total_nodes).fill(0.0);
        	weight_matrix.push(row);	
		for (i=0; i< total_nodes; i++){
			if (j>=i){}
			else{
			     if(restricted_active==false){
		    	       connection_graph.push([j,i])}
			     else{ 
                               if((j<v_units && i<v_units)||(j>=v_units && i>=v_units)){}
			       else{connection_graph.push([j,i])} }
			}
		}};

	// Connection graph has to be adapted as well
	if(restricted_active){
		for(var j=0; j< v_units; j++) {
    			for(var i=0; i< v_units; i++) {
			weight_matrix[j][i] = 0;}

		}
		for(var j=v_units; j< h_units + v_units; j++) {
    			for(var i=v_units; i< h_units + v_units; i++) {
        		weight_matrix[j][i] = 0}
	}
}
return [connection_graph, weight_matrix]};

// -----------------------------------------------------------------------------
// Toggle function for spin color and value
// -----------------------------------------------------------------------------
function toggle_colors(selection, spins_vec,  d){
	current_color = selection.style("fill")
	if(current_color == "blue"){current_color = nodes_colors[1]
	                            spins_vec[d]= 1}
	else {current_color = nodes_colors[0]
	        spins_vec[d]= -1}
	selection.transition()
	selection.style("fill", current_color)
		return spins_vec
	}

// -----------------------------------------------------------------------------
// Update function for selectors hidden active and restricted active
// -----------------------------------------------------------------------------
function update_select(){
	hidden_activate = sel_hid_active.property('value')
	restricted_activate = sel_rest_active.property("value")
	console.log(hidden_activate)
};

// -----------------------------------------------------------------------------
// Functions for position generation for nodes and weights
// -----------------------------------------------------------------------------
function pos_gen_x(d,i,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle = 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling + center_x
	return x
};


function pos_gen_x_rect(d,i,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle = 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling + center_x
	return x+20
};

function pos_gen_y(d,i,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle = 2*Math.PI/total_spins*i
	y = Math.sin(angle)*scaling + center_y
	return y
};

// The input data here is the connection_graph [[0,1],[0,2],...[5,6]]
function line_pos_gen_x1(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	x_1 = Math.cos(angle_1)*(scaling-radius) + center_x
	return Math.round(x_1)
};

function line_pos_gen_x2(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	x_2 = Math.cos(angle_2)*(scaling-radius) + center_x
	return Math.round(x_2)};

function line_pos_gen_y1(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	y_1 = Math.sin(angle_1)*(scaling-radius) + center_y
	return Math.round(y_1)
};

function line_pos_gen_y2(d,identifier){
	var total_spins = dictionary["total_spins"+identifier]
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	y_2 = Math.sin(angle_2)*(scaling-radius) + center_y
	return Math.round(y_2)
};

//console.log(weight_matrix)
// =============================================================================
// Genearte the RBM Graph
// =============================================================================

function generate_RBM_graph(identifier){
// Define tooltips for hovering information

    // -------------------------------------------------------------------------
    // Draw nodes for the RBM 
    // -------------------------------------------------------------------------
    d3.select("#RBM_complete_main_svg"+identifier).selectAll("circle")
        .data(dictionary["spins_data"+identifier])
        .enter()
        .append("circle")
        .style("fill", nodes_colors[0])
        .attr('class', 'hidden_circle') // class is needed for style sheet
        .attr("cx", function(d,i){return pos_gen_x(d,i,identifier)})
        .attr("cy", function(d,i){return pos_gen_y(d,i,identifier)}) 
        .attr("r", radius)
        .attr('id', "hidden")
    
        .on("click", function(d) {var selection = d3.select(this)
			   	  var spins_new = dictionary["spins_new"+identifier]
                                    spins_new = toggle_colors(selection, spins_new, d)
                                    d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))
                                    tooltip.text('h' + d +' = '+ spins_new[d]) 
				    dictionary["spins_new"+identifier] = spins_new;
       }) 
   
        .on("mouseover", function(d) {
       	    var spins_new = dictionary["spins_new"+identifier]
                 tooltip.text('h' + d +' = '+ spins_new[d])   
                        .style("visibility", "visible")
      })
  
       .on("mousemove", function() {
         tooltip.style("top", (event.pageY+10)+ "px") // event.pageX is mouse position
                .style("left", event.pageX+10 + "px");
      })
  
      .on("mouseout", function() {
        return tooltip.style("visibility", "hidden");
      })

    // -------------------------------------------------------------------------
    // Draw bias rectangles for the RBM 
    // -------------------------------------------------------------------------
    d3.select("#RBM_complete_main_svg"+identifier).selectAll()
        .data(dictionary["spins_data"+identifier])
        .enter()	
        .append("rect")
        .attr("x",function(d,i){return pos_gen_x_rect(d,i,identifier)})
        .attr("y", function(d,i){return pos_gen_y(d,i,identifier)})
        .attr("width", 10)
        .attr("height", 20)
        .style("fill", "red")
    
      .on("click", function(d){
               line = d3.select(this)
                   bias_idx = d
                   arg = dictionary["biases"+identifier][bias_idx]
	           document.getElementById("bias_slider_id"+identifier).value = arg
               //text = d3.select("#biastext")
               //text.text(function(){return "Bias: "+bias_idx })
	      text = document.getElementById("bias_slider_text"+identifier)
	       text.innerHTML = "Bias: "+ bias_idx
	      value = document.getElementById("bias_slider_value"+identifier)
	      value.innerHTML =  arg	
               dictionary["bias_slider_index"+identifier] = bias_idx
      })	
   
        .on("mouseover", function(d) {
                 tooltip.text('bias' + d +' = '+ dictionary["biases"+identifier][d])   
                        .style("visibility", "visible")
      })
  
       .on("mousemove", function() {
         tooltip.style("top", (event.pageY+10)+ "px") // event.pageX is mouse position
                .style("left", event.pageX+10 + "px");
      })
  
      .on("mouseout", function() {
        return tooltip.style("visibility", "hidden");
      })

    // -------------------------------------------------------------------------
    // Draw lines for the RBM 
    // -------------------------------------------------------------------------
    d3.select("#RBM_sampler"+identifier).selectAll()
        .data(dictionary["connection_graph"+identifier])
        .enter()
        .append("line")
        .attr("id", function(d){return 'weight_h'+identifier + d[0] + '' + d[1]})
    //     .attr("class", "RBM_line")
        .attr("stroke","rgb(0,0,0,0.5)") //These attr are defined by class
        .attr("stroke-width", 4.0)
        .attr("x1", function(d){return line_pos_gen_x1(d,identifier)})
        .attr("y1", function(d){return line_pos_gen_y1(d,identifier)})
        .attr("x2", function(d){return line_pos_gen_x2(d,identifier)})
        .attr("y2", function(d){return line_pos_gen_y2(d,identifier)})
        .on("mouseover", function(d) {
            tooltip.text('Coupling:' + d[0] +',' + d[1]+ ' Strength: '+ dictionary["weight_matrix"+identifier][d[0]][d[1]])
                    .style("visibility", "visible")
         d3.select(this).attr("stroke","rgb(0,0,0,1.0)")           ;
      })
  
       .on("mousemove", function(d) {
            tooltip.style("top", (event.pageY+10)+ "px")
            .style("left", event.pageX+10 + "px")
            d3.select(this).attr("stroke","rgb(0,0,0,1.0)");
      })
  
      .on("mouseout", function() {tooltip.style("visibility", "hidden")
      d3.select(this).attr("stroke","rgb(0,0,0,0.5)");
      })
      .on("click", function(d){
               line = d3.select(this)
                   coupling = d
               index = dictionary["connection_graph"+identifier].indexOf(coupling)
                   var idx1 = dictionary["connection_graph"+identifier][index][0]	
                   var idx2 = dictionary["connection_graph"+identifier][index][1]	    
                   arg = dictionary["weight_matrix"+identifier][idx1][idx2]
	           document.getElementById("weight_slider_id"+identifier).value = arg
               //text = d3.select("#weighttext")
               //text.text(function(){return "Weight: ("+ idx1+', ' + idx2+')'})
	      text = document.getElementById("weight_slider_text"+identifier)
	      text.innerHTML =  "Weight: ("+ idx1+", "+idx2+")"	
	      value = document.getElementById("weight_slider_value"+identifier)
	      value.innerHTML =  arg	
               dictionary["weight_slider_index"+identifier] = index
      })	
} 
// -----------------------------------------------------------------------------
// EVERYTHING ABOUT PROBABILITIES OF BM
// -----------------------------------------------------------------------------

// ============================================================================
// Here we calculate the probabilities of the configurations
// ============================================================================
function energy_fct(spins_vec, identifier){
	var total_spins = dictionary["total_spins"+identifier]
	var connection_graph = dictionary["connection_graph"+identifier]
	var biases = dictionary["biases"+identifier]
	var energy = 0
	for (var i = 0; i<connection_graph.length; i++){
		kk = connection_graph[i][0]
		ll = connection_graph[i][1]
		energy += spins_vec[kk]*spins_vec[ll]*dictionary["weight_matrix"+identifier][kk][ll]
		}	
	for (var j = 0; j<total_spins; j++){
		energy+= spins_vec[j]*biases[j]}	
        return energy
};

// =============================================================================
// WRITE a proper permutation function
// =============================================================================
// Function to define length of string
function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
};

function permutations_of_vector(vector_length){
    all_permutations = []
    for (i=0; i<2**vector_length; i++){
        var binary_string = FormatNumberLength(Number(i).toString(2), vector_length);
        (arr = []).length = vector_length; 
        arr.fill(-1);
        for (j=0; j<binary_string.length; j++){
            var res = binary_string.charAt(j)
            if (res == 1){
            arr[j] = 1
            }};
        all_permutations.push(arr)
    } return all_permutations
}

// =============================================================================
// Partition function
// =============================================================================
function part_fct(all_permuts, identifier){  
     var Z = 0
    for (var i = 0; i<all_permuts.length; i++) {
        energy_Z = energy_fct(all_permuts[i], identifier)
        Z += Math.exp(-energy_Z)
        }
        return Z
}

// =============================================================================
// Calc all configurations given a single visible
// =============================================================================
function all_configs_given_v(single_visible, hidden_permutations){
    all_permutations = []
    for (var k = 0; k<hidden_permutations.length; k++){
            all_permutations.push([single_visible, hidden_permutations[k]].flat())
    }
    return all_permutations
}

// =============================================================================
// calculate probability of given visible configuration
// =============================================================================
function prob_of_v(single_visible, hidden_permutations, identifier){
    Z = part_fct(bm_permutations, identifier)
    boltzmann_factor = 0
    all_conf = all_configs_given_v(single_visible, hidden_permutations)
    for (var a = 0; a<all_conf.length; a++) {
        energy_v = energy_fct(all_conf[a], identifier) 
        boltzmann_factor += Math.exp(-energy_v)
        };
    return (boltzmann_factor/Z)    
}

// =============================================================================
// This function calculates probability of single visible (index) to be 1
// =============================================================================
function p_individual_v(index, visible_permutations, hidden_permutations, identifier){
    prob = 0
    conjugate = 0
    for (var i = 0; i<visible_permutations.length; i++) {
        if (visible_permutations[i][index] == 1){
        prob += prob_of_v(visible_permutations[i],  hidden_permutations, identifier)
        }
        else { // this is only to test if conj + prob add up to 1
            conjugate += prob_of_v(visible_permutations[i],  hidden_permutations, identifier)
        }
}
return prob
}

// =============================================================================
// returns the individual probabilities of visible units to be 1
// =============================================================================
function p_total_v(visible_vecs, hidden_vecs, identifier){
    var v_units = dictionary["v_units"+identifier]
    all_probs = []
    for (i=0; i<v_units; i++){
        all_probs.push(p_individual_v(i, visible_vecs, hidden_vecs))
    }
    return all_probs
    }

// -------------------------------------------------------------------------
// Weight and Bias TEXT
// -------------------------------------------------------------------------
//var slider_RBM_dist = d3.select("#RBM_sampler").append("g")

function add_text_elements(identifier){
	var weight_slider_index = dictionary["weight_slider_index"+identifier]
	var bias_slider_index = dictionary["bias_slider_index"+identifier]
	var connection_graph = dictionary["connection_graph"+identifier]
	var biases = dictionary["biases"+identifier]
	text = document.getElementById("bias_slider_text"+identifier)
	text.innerHTML = "Bias: "+bias_slider_index
	text = document.getElementById("weight_slider_text"+identifier)
	text.innerHTML = "Weight: (" + connection_graph[weight_slider_index][0]+', '+connection_graph[weight_slider_index][1]+')'
	value = document.getElementById("bias_slider_value"+identifier)
	value.innerHTML =biases[bias_slider_index]
	value = document.getElementById("weight_slider_value"+identifier)
	value.innerHTML = dictionary["weight_matrix"+identifier][ connection_graph[weight_slider_index][0]][connection_graph[weight_slider_index][1]] 
	}



// -------------------------------------------------------------------------
// Slider Function
// -------------------------------------------------------------------------

function slider_bias_fct_RBM(h, identifier) {
	var spins_new = dictionary["spins_new"+identifier]
	var bias_slider_index = dictionary["bias_slider_index"+identifier]
	var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
       dictionary["biases"+identifier][bias_slider_index] = h
	value = document.getElementById("bias_slider_value"+identifier)
	value.innerHTML =  h
        d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))    
	  histogram_data = []  
	  for (j=0; j<configuration_to_learn.length; j++){
	  	histogram_data.push(prob_of_v(configuration_to_learn[j], hidden_vecs, identifier))}
          update_histogram(histogram_data, identifier)          
        }

function slider_bias_just_text(h,identifier) {
	var spins_new = dictionary["spins_new"+identifier]
	var bias_slider_index = dictionary["bias_slider_index"+identifier]
        dictionary["biases"+identifier][bias_slider_index] = h
	value = document.getElementById("bias_slider_value"+identifier)
	value.innerHTML =  h	
        d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))    
        }

function slider_fct_RBM(h,identifier) {
	  var connection_graph = dictionary["connection_graph"+identifier]
	  var weight_matrix = dictionary["weight_matrix"+identifier]
	  var spins_new = dictionary["spins_new"+identifier]
	  var weight_slider_index = dictionary["weight_slider_index"+identifier]
	  var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
          idx1 = connection_graph[weight_slider_index][0]	
          idx2 = connection_graph[weight_slider_index][1]	    
          weight_matrix[idx1][idx2] = h 
	  value = document.getElementById("weight_slider_value"+identifier)
	  value.innerHTML =  h	
          d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))    
	  histogram_data = []  
	  for (j=0; j<configuration_to_learn.length; j++){
	  	histogram_data.push(prob_of_v(configuration_to_learn[j], hidden_vecs, identifier))}
          update_histogram(histogram_data, identifier)         
        } 

// =============================================================================
// Histogram functions
// =============================================================================

function histo_pos_gen(d) {
    return margin_x + center_x - space*3 +  d * space -histo_width/2;
};

function update_histogram(histogram_data, identifier){
    for (i=0; i<histogram_data.length; i++) {
        d3.select("#histo"+identifier+i).attr("height", function(){return histogram_data[i]*histo_height})
                            .attr("y", function(){return histo_y_pos-100+(1-histogram_data[i])*histo_height}) 
    }
}

// ============================================================================
// Add configurations that have to be trained
// ============================================================================

function add_visible_configs(x_pos, y_pos, radius, margin, config){
	small_shift_for_top_row_x = 6
	histogram_svg.append("rect")
		.attr("x",5+x_pos-small_shift_for_top_row_x-2*radius)
		.attr("y",y_pos-2*radius)
		.attr("rx", 5)
		.attr("width", 45)
		.attr("height", 35)
		.attr("fill", "grey")
		.attr("opacity", 0.2)
	histogram_svg.selectAll()
		.data(config)
		.enter().append("circle")
		.attr("cx", function(d,i){
			return 5+x_pos+Math.floor(i/2)*(2*radius+margin) + 2*(-0.5 + Math.floor(i/2))*(1-i%2)*small_shift_for_top_row_x})
		.attr("cy", function(d,i){return y_pos + i%2*(2*radius+margin) })
		.attr("r", radius)
		.attr("fill", function(d){
			return nodes_colors[d]})
	
}

function change_layout_hidden(identifier){
	hidden_active = document.getElementById("hidden_check"+identifier).checked
	restricted_active = document.getElementById("restricted_check"+identifier).checked 
	
	if (hidden_active == false){
		if (restricted_active){ console.log("forbidden")
		document.getElementById("hidden_check"+identifier).checked  = true
		window.alert("You cannot make a spin system restricted without hidden units.");
		return	
		}	
	}
	change_layout(identifier)
	}

function change_layout_restricted(identifier){ 
	hidden_active = document.getElementById("hidden_check"+identifier).checked 
	restricted_active = document.getElementById("restricted_check"+identifier).checked 
	
	if (hidden_active == false){
		if (restricted_active){ console.log("geht nicht !!!")
		document.getElementById("restricted_check"+identifier).checked = false
		window.alert("You cannot make a spin system restricted without hidden units.");
		return	
		}	
	}
	change_layout(identifier)
	}

// Selectors update function
function change_layout(identifier){
	document.getElementById("weight_slider_id"+identifier).value = 0.0 
	var weight_slider_index = 0
	dictionary["weight_slider_index"+identifier] = weight_slider_index	
	var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
	all_connections = make_connection_new(identifier)
	connection_graph = all_connections[0]
	dictionary["connection_graph"+identifier] = connection_graph
	dictionary["weight_matrix"+identifier] = all_connections[1]
	
	idx1 = connection_graph[weight_slider_index][0]	
	idx2 = connection_graph[weight_slider_index][1]	    
	text = document.getElementById("weight_slider_text"+identifier)
	text.innerHTML =  "Weight: ("+ idx1+", "+idx2+")"	
	d3.select("#energy_text"+identifier).text("Energy: 0")    
	//histogram_data = p_total_v(visible_vecs, hidden_vecs)
	histogram_data = []  
	for (j=0; j<configuration_to_learn.length; j++){
		histogram_data.push(prob_of_v(configuration_to_learn[j], hidden_vecs, identifier))}
	update_histogram(histogram_data)         
	
	
	value = document.getElementById("weight_slider_value"+identifier)
	value.innerHTML =  0	
		
	d3.select("#RBM_sampler"+identifier).selectAll("line").remove() 
	d3.select("#RBM_sampler"+identifier).selectAll("line")
	        .data(connection_graph)
	        .enter()
	        .append("line")
	        .attr("id", function(d){return 'weight_h'+identifier+ d[0] + '' + d[1]})
	    //     .attr("class", "RBM_line")
	        .attr("stroke","rgb(0,0,0,0.5)") //These attr are defined by class
	        .attr("stroke-width", 4.0)
	        .attr("x1", function(d){return line_pos_gen_x1(d,identifier)})
	        .attr("y1", function(d){return line_pos_gen_y1(d,identifier)})
	        .attr("x2", function(d){return line_pos_gen_x2(d,identifier)})
	        .attr("y2", function(d){return line_pos_gen_y2(d,identifier)})
	        .on("mouseover", function(d) {
	            tooltip.text('Coupling:' + d[0] +',' + d[1]+ ' Strength: '+ dictionary["weight_matrix"+identifier][d[0]][d[1]])
	                    .style("visibility", "visible")
	         d3.select(this).attr("stroke","rgb(0,0,0,1.0)")           ;
	      })
	  
	       .on("mousemove", function(d) {
	            tooltip.style("top", (event.pageY+10)+ "px")
	            .style("left", event.pageX+10 + "px")
	            d3.select(this).attr("stroke","rgb(0,0,0,1.0)");
	      })
	  
	      .on("mouseout", function() {tooltip.style("visibility", "hidden")
	      d3.select(this).attr("stroke","rgb(0,0,0,0.5)");
	      })
	      .on("click", function(d){
	               line = d3.select(this)
	                   coupling = d
	               index = connection_graph.indexOf(coupling)
	                   var idx1 = connection_graph[index][0]	
	                   var idx2 = connection_graph[index][1]	    
	                   arg = dictionary["weight_matrix"+identifier][idx1][idx2]
		           document.getElementById("weight_slider_id"+identifier).value = arg
	               //text = d3.select("#weighttext")
	               //text.text(function(){return "Weight: ("+ idx1+', ' + idx2+')'})
		      text = document.getElementById("weight_slider_text"+identifier)
		      text.innerHTML =  "Weight: ("+ idx1+", "+idx2+")"	
		      value = document.getElementById("weight_slider_value"+identifier)
		      value.innerHTML =  arg	
	              dictionary["weight_slider_index"+identifier] = index
      })	

}

