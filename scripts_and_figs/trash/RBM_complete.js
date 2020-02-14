const RBM_complete = "#RBM_complete_id" // This defines in which div we write into

// Default Variables
var h_units = 2
var v_units = 4
var total_spins = h_units + v_units

var width = 700;
var height = 400;
var radius = 20.0
var space = 70.0

var center_x = (width / 2);
var center_y = (height / 2);

var margin_x = 80.0

var nodes_colors = ["blue", "orange"]
var ypos1 = 50
var ypos2 = 200

var hidden_active = "yes" // Initialize selectors
var restricted_active = "no"

// Scaling for the positioning functions. Changes size of graph
var scaling = 100

// Add the space where it draws the RBM
var svg_RBMcomplete = d3.select(RBM_complete)
    .append("svg")
    .attr("id", "RBM_sampler")
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.

//==============================================================================
// Define selections
select = svg_RBMcomplete.append("svg")
select2 = svg_RBMcomplete.append("g")
//----------------------------------------------------------------------------
var sel_hid_active = d3.select(RBM_complete)
   .insert("text")
    .text("Activate hidden units: ")
    .attr("font-size", 10)
   .insert('select', 'svg')
  	.attr('class','select')
    .on('change', update_select)

sel_hid_active.selectAll("option")
            .data(["no","yes"])
                  .enter().append("option")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d;
                    });


var sel_rest_active = d3.select(RBM_complete)
   .append("text")
    .text(" Make BM restricted: ")
    .attr("font-size", 10)
   .insert('select')
  	.attr('class','select')
    .on('change',update_select)

sel_rest_active.selectAll("option")
            .data(["no","yes"])
                  .enter().append("option")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d;
                    });

//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

var all_connections, connection_graph, weight_matrix, spins_data, spins_new, biases, nodes_svg, visible_svg, weight_select_svg, energy_text

function update_architecture(){
all_connections = make_connection_new()
connection_graph = all_connections[0]
weight_matrix = all_connections[1]

spins_data = []
spins_new = []
biases = []
for (var i = 0; i < total_spins; i++) {
    spins_data.push(i);
    spins_new.push(-1); 
    biases.push(-1);	
}

energy_text = svg_RBMcomplete.append("text")
                        .attr("x", 20)
                        .attr("y", 20)
                        .attr("font-size", 20)
                        .text("Energy: "+energy_fct(spins_new))

nodes_svg = svg_RBMcomplete.append("svg")
visible_svg = svg_RBMcomplete.append("svg")
weight_select_svg = svg_RBMcomplete.append("svg")


// Generate the actual graph
generate_RBM_distribution()
// Initialize variables for probabilities
visible_vecs = permutations_of_vector(v_units)
hidden_vecs = permutations_of_vector(h_units)
bm_permutations = permutations_of_vector(total_spins)
// The input is an array of the length of the visible units
// input = Array(v_units).fill(-1)
}

update_architecture()
  
// ============================================================================
// All about the Slider
var slider_length = 200
var slider_weight = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, slider_length])
    .clamp(true); 

// --------------------------------------------------------------------------
// SLIDER Initialize indices
// // ----------------------------------------------------------------------
var weight_slider_index = 0
var bias_slider_index = 0

// Append weight sliders
for (i = 0; i<1; i++){
append_weight_slider(i, "weight", 20)
}

// Append bias sliders
for (i = 0; i<1; i++){
append_bias_slider(i, "bias", 350)
}

// ============================================================================
// HISTOGRAM
// ============================================================================
var histogram_data = p_total_v(visible_vecs, hidden_vecs) 

var x_histogram = d3.scaleLinear()
          .range([0, 100]);
var y_histogram = d3.scaleLinear()
          .range([100, 0]);

var center_x = width/4-50;
var center_y = (height / 2);
var histo_width = 40
var histo_height = 100
var histo_y_pos = 250

histogram_svg = svg_RBMcomplete.append("g")

// append the bar rectangles to the svg element
histogram_svg.selectAll("rect")
	.data(histogram_data)
	.enter().append("rect")
	.style("fill", "#4682b4")
	.style("opacity", 0.5)
	.attr("id", function(d,i){return "histo"+i})
	.attr("x", 0) // margin left
	.attr("y", function(d){return histo_y_pos+(1-d)*histo_height}) // margin left
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

// =============================================================================
// =============================================================================
// DEFINE ALL FUNCTIONS
// =============================================================================


// -----------------------------------------------------------------------------
// General Connection Matrix function
// -----------------------------------------------------------------------------
function make_connection_new(){
	total_nodes = total_spins
	if (hidden_active== "no"){
		total_nodes = total_spins - h_units
	}
	var weight_matrix = []
	var connection_graph = []
	// Initialize connection Data
    	for(var j=0; j< total_nodes; j++) {
		row = Array(total_nodes).fill(-1.0);
        	weight_matrix.push(row);	
		for (i=0; i< total_nodes; i++){
			if (j>=i){}
			else{
			     if(restricted_active=="no"){
		    	       connection_graph.push([j,i])}
			     else{ 
                               if((j<v_units && i<v_units)||(j>=v_units && i>=v_units)){}
			       else{connection_graph.push([j,i])} }
			}
		}};

	// Connection graph has to be adapted as well
	if(restricted_active == "yes"){
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
function pos_gen_x(d,i){
	angle = 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling + center_x
	return x
};


function pos_gen_x_rect(d,i){
	angle = 2*Math.PI/total_spins*i
	x = Math.cos(angle)*scaling + center_x
	return x+20
};

function pos_gen_y(d,i){
	angle = 2*Math.PI/total_spins*i
	y = Math.sin(angle)*scaling + center_y
	return y
};

// The input data here is the connection_graph [[0,1],[0,2],...[5,6]]
function line_pos_gen_x1(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	x_1 = Math.cos(angle_1)*(scaling-radius) + center_x
	return Math.round(x_1)
};

function line_pos_gen_x2(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	x_2 = Math.cos(angle_2)*(scaling-radius) + center_x
	return Math.round(x_2)};

function line_pos_gen_y1(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	y_1 = Math.sin(angle_1)*(scaling-radius) + center_y
	return Math.round(y_1)
};

function line_pos_gen_y2(d){
	angle_1 = 2*Math.PI/total_spins*d[0]
	angle_2 = 2*Math.PI/total_spins*d[1]
	y_2 = Math.sin(angle_2)*(scaling-radius) + center_y
	return Math.round(y_2)
};

// =============================================================================
// Genearte the RBM Graph
// =============================================================================

function generate_RBM_distribution(){

// Define tooltips for hovering information
var tooltip = d3.select("body") //This is in body not svg
  .append("div")
  .attr('class', 'tooltip');

    // -------------------------------------------------------------------------
    // Draw nodes for the RBM 
    // -------------------------------------------------------------------------
    nodes_svg.selectAll("circle")
        .data(spins_data)
        .enter()
        .append("circle")
        .style("fill", nodes_colors[0])
        .attr('class', 'hidden_circle') // class is needed for style sheet
        .attr("cx", pos_gen_x)
        .attr("cy", pos_gen_y) 
        .attr("r", radius)
        .attr('id', "hidden")
    
        .on("click", function(d) {selection = d3.select(this)
                                    spins_new = toggle_colors(selection, spins_new, d)
                                    energy_text.text("Energy: "+energy_fct(spins_new))
                                    tooltip.text('h' + d +' = '+ spins_new[d]) ;
       }) 
   
        .on("mouseover", function(d) {
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
    nodes_svg.selectAll()
        .data(spins_data)
        .enter()	
        .append("rect")
        .attr("x",pos_gen_x_rect)
        .attr("y", pos_gen_y)
        .attr("width", 10)
        .attr("height", 20)
        .style("fill", "red")
    
      .on("click", function(d){
               line = d3.select(this)
                   bias_idx = d
                   arg = biases[bias_idx]
                   slider = d3.select("#biashandle0").attr("cx", slider_weight(arg))
               text = d3.select("#biastext")
               text.text(function(){return "Bias: "+bias_idx })
               bias_slider_index = bias_idx
      })	
   
        .on("mouseover", function(d) {
                 tooltip.text('bias' + d +' = '+ biases[d])   
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
    d3.select("#RBM_sampler").selectAll()
        .data(connection_graph)
        .enter()
        .append("line")
        .attr("id", function(d){return 'weight_h' + d[0] + '' + d[1]})
    //     .attr("class", "RBM_line")
        .attr("stroke","rgb(0,0,0,0.5)") //These attr are defined by class
        .attr("stroke-width", 4.0)
        .attr("x1", line_pos_gen_x1)
        .attr("y1", line_pos_gen_y1)
        .attr("x2", line_pos_gen_x2)
        .attr("y2", line_pos_gen_y2)
        .on("mouseover", function(d) {
            tooltip.text('Coupling:' + d[0] +',' + d[1]+ ' Strength: '+ weight_matrix[d[0]][d[1]])
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
                   idx1 = connection_graph[index][0]	
                   idx2 = connection_graph[index][1]	    
                   arg = weight_matrix[idx1][idx2]
                   slider = d3.select("#weighthandle0").attr("cx", slider_weight(arg))
               text = d3.select("#weighttext")
               text.text(function(){return "Weight: ("+ idx1+', ' + idx2+')'})
               weight_slider_index = index
      })	
    } 
    
// -----------------------------------------------------------------------------
// EVERYTHING ABOUT PROBABILITIES OF BM
// -----------------------------------------------------------------------------

// ============================================================================
// Here we calculate the probabilities of the configurations
// ============================================================================
function energy_fct(spins_vec){
	var energy = 0
	for (var i = 0; i<connection_graph.length; i++){
		kk = connection_graph[i][0]
		ll = connection_graph[i][1]
		energy += spins_vec[kk]*spins_vec[ll]*weight_matrix[kk][ll]
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
function part_fct(all_permutations){
       var Z = 0
    for (var i = 0; i<all_permutations.length; i++) {
        energy_Z = energy_fct(all_permutations[i])
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
function prob_of_v(single_visible, hidden_permutations){
    Z = part_fct(bm_permutations)
    boltzmann_factor = 0
    all_conf = all_configs_given_v(single_visible, hidden_permutations)
    for (var a = 0; a<all_conf.length; a++) {
        energy_v = energy_fct(all_conf[a]) 
        boltzmann_factor += Math.exp(-energy_v)
        };
    return (boltzmann_factor/Z)    
}

// =============================================================================
// This function calculates probability of single visible (index) to be 1
// =============================================================================
function p_individual_v(index, visible_permutations, hidden_permutations){
    prob = 0
    conjugate = 0
    for (var i = 0; i<visible_permutations.length; i++) {
        if (visible_permutations[i][index] == 1){
        prob += prob_of_v(visible_permutations[i],  hidden_permutations)
        }
        else { // this is only to test if conj + prob add up to 1
            conjugate += prob_of_v(visible_permutations[i],  hidden_permutations)
        }
}
return prob
}

// =============================================================================
// returns the individual probabilities of visible units to be 1
// =============================================================================
function p_total_v(visible_vecs, hidden_vecs){
    all_probs = []
    for (i=0; i<v_units; i++){
        all_probs.push(p_individual_v(i, visible_vecs, hidden_vecs))
    }
    return all_probs
    }

// =============================================================================
// EVERYTHING FOR SLIDERS    
    // =========================================================================
    // Weight Slider
    // ========================================================================= 
    function append_weight_slider(index, name, y_pos){
        var slider_RBM_dist = svg_RBMcomplete.append("g") // slider for epoch
        .attr("class", "slider")
            .attr("transform", "translate(" + y_pos + "," + 40*(1+index) + ")")
            .attr("opacity", 1)
        .attr("id", function(){return name+index});
        // -------------------------------------------------
        slider_RBM_dist.append("line")
            .attr("class", "track")
            .attr("id", function(d){return "slider" + index})
            .attr("x1", 0)
            .attr("x2", slider_length) 

            // This defines from where to where the slider goes
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function() { 
                            slider_img.interrupt(); })
                .on("start drag", function() { 
                            argument = slider_weight.invert(d3.event.x)
                            slider_fct_RBM(argument, weight_slider_index);
        }))
            .on("mouseenter", function() {
                    h = connection_graph[index][0]
                    v = connection_graph[index][1]
                    d3.select('#weight_h' + h + '_v' + v)         
                                .attr("stroke","rgb(0,0,0,1.0)");
      })
  
            .on("mouseleave", function() {
                    h = connection_graph[index][0]
                    v = connection_graph[index][1]
                    d3.select('#weight_h' + h + '_v' + v)         
                                .attr("stroke","rgb(0,0,0,0.5)");
      })


        slider_RBM_dist.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")") // position of ticks
          .selectAll("text")
          .data(slider_weight.ticks(4))
          .enter().append("text")
            .attr("x", slider_weight)
            .attr("text-anchor", "middle")
            .text(function(d) { return d ; });

        // Here we can change the style of the handle
        var handle_RBM_dist = slider_RBM_dist.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("id", function(d){return "weighthandle" + index})
            .attr("r", 9)
        
        slider_RBM_dist.append("text")
        .text(function(d){return "Weight: (" + connection_graph[index][0]+', '+connection_graph[index][1]+')'})
        .attr("transform", "translate(0,40)")
        .attr("id", function(){return name + "text"})
    }
    // -------------------------------------------------------------------------
    // Weight Slider Function
    // -------------------------------------------------------------------------
    function slider_fct_RBM(h, index) {
          var arg = slider_weight(h)
        min = -1
            max = 1
          rescale = (arg/slider_length*(max - min) +min)
          d3.select("#weighthandle0").attr("cx", slider_weight(h))
          idx1 = connection_graph[index][0]	
          idx2 = connection_graph[index][1]	    
          weight_matrix[idx1][idx2] = rescale
                energy_text.text("Energy: "+energy_fct(spins_new))    
          histogram_data = p_total_v(visible_vecs, hidden_vecs)
          update_histogram(histogram_data)           
        } 
        
    // -------------------------------------------------------------------------
    // BIAS SLIDER
    // -------------------------------------------------------------------------
    function append_bias_slider(index, name, y_pos){
        var slider_RBM_dist = svg_RBMcomplete.append("g")
        .attr("class", "slider")
            .attr("transform", "translate(" + y_pos + "," + 40*(1+index) + ")")
            .attr("opacity", 1)
        .attr("id", function(){return name+index});
        // -------------------------------------------------
        slider_RBM_dist.append("line")
            .attr("class", "track")
            .attr("id", function(d){return "slider" + index})
            .attr("x1", 0)
            .attr("x2", slider_length) 

            // This defines from where to where the slider goes
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function() { 
                            slider_img.interrupt(); })
                .on("start drag", function() { 
                            argument = slider_weight.invert(d3.event.x)
                            slider_bias_fct_RBM(argument, bias_slider_index);
        }))
            .on("mouseenter", function() {
                    h = connection_graph[index][0]
                    v = connection_graph[index][1]
                    d3.select('#weight_h' + h + '_v' + v)         
                                .attr("stroke","rgb(0,0,0,1.0)");
      })
  
            .on("mouseleave", function() {
                    b = biases[index]
                    d3.select('#bias' +index)         
                                .attr("stroke","rgb(0,0,0,0.5)");
      })


        slider_RBM_dist.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")") // position of ticks
          .selectAll("text")
          .data(slider_weight.ticks(4))
          .enter().append("text")
            .attr("x", slider_weight)
            .attr("text-anchor", "middle")
            .text(function(d) { return d ; });

        // Here we can change the style of the handle
        var handle_RBM_dist = slider_RBM_dist.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("id", function(d){return "biashandle" + index})
            .attr("r", 9)
        
        slider_RBM_dist.append("text")
        .text(function(d){return "Bias: " + index })
        .attr("transform", "translate(0,40)")
        .attr("id", "biastext")
    
    }
    // -------------------------------------------------------------------------
    // Bias Slider Function
    // -------------------------------------------------------------------------
    function slider_bias_fct_RBM(h, index) {
        var arg = slider_weight(h)
            min = -1
            max = 1
        rescale = (arg/slider_length*(max - min) +min)
        d3.select("#biashandle0").attr("cx", slider_weight(h))
        biases[bias_slider_index] = rescale
            energy_text.text("Energy: "+energy_fct(spins_new))    
        histogram_data = p_total_v(visible_vecs, hidden_vecs)
        update_histogram(histogram_data)           
        }
        
// =============================================================================
// Histogram functions
// =============================================================================

function histo_pos_gen(d) {
    return margin_x + center_x - space*v_units/2 +  d * space -histo_width/2;
};

function update_histogram(histogram_data){
    for (i=0; i<histogram_data.length; i++) {
        d3.select("#histo"+i).attr("height", function(){return histogram_data[i]*histo_height})
                            .attr("y", function(){return histo_y_pos+(1-histogram_data[i])*histo_height}) 
    }
}                       