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

d3.select("#RBM_sampler_histo"+IDENTIFIERXOR).append('image')
      .attr('id', 'teaser_main_img_big_id')
      .attr('xlink:href', "figures/CD_algorithm/histogram_labels3.png")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 100)
      .attr("height", 250)
      .attr("opacity", 1.0)
// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.

//==============================================================================
// Initialize Variables dependent on architecture
// ----------------------------------------------------------------------------

update_architecture(IDENTIFIERXOR) 

dictionary["weight_slider_index"+IDENTIFIERXOR] = 0
dictionary["bias_slider_index"+IDENTIFIERXOR] = 0
//background_rectangles_hidden_visible(IDENTIFIERXOR)

generate_histogram("histogram_pos_phase",80, IDENTIFIERXOR)
generate_histogram("histogram_neg_phase",300, IDENTIFIERXOR)

generate_RBM_nodes_new(IDENTIFIERXOR)
generate_RBM_biases_new(IDENTIFIERXOR)
generate_RBM_connections_new(IDENTIFIERXOR)
add_text_elements(IDENTIFIERXOR)
add_text_elements(IDENTIFIERXOR)

dictionary["configuration_to_learn"+IDENTIFIERXOR] = [[1,1,1,],[1,-1,1],[-1,1,-1],[-1,-1,-1],[-1,1,1],[-1,-1,1], [1,-1,-1], [1,1,-1]]
wanted_config = 'red'
unwanted_config = 'blue'
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(0), 4, 10, [1,1,1], wanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(1), 4, 10, [1,0,1], wanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(2), 4, 10, [0,1,0], wanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(3), 4, 10, [0,0,0], wanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(4), 4, 10, [1,1,0], unwanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(5), 4, 10, [1,0,0], unwanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(6), 4, 10, [0,1,1], unwanted_config,IDENTIFIERXOR)
//add_visible_configs_XOR(histo_label_x_pos, histo_pos_gen(7), 4, 10, [0,0,1], unwanted_config,IDENTIFIERXOR)

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

function generate_RBM_nodes_new(identifier){
 // Define tooltips for hovering information

 var colors_init = ['white','white', 'hsl(240, 100%, 84%)']
 var color_init_stroke = ['black','black', 'blue']
 //var hidden_colors = ['hsl(240, 100%, 84%)', 'hsl(0, 100%, 84%)'];
 //var hidden_colors_stroke = ["blue", "red"]
     // -------------------------------------------------------------------------
     // Draw nodes for the RBM
     // -------------------------------------------------------------------------
     d3.select("#RBM_complete_main_svg"+identifier).selectAll("circle")
         .data(dictionary["spins_data"+identifier])
         .enter()
         .append("circle")
         .style("fill", function(d,i){return colors_init[d]})
         .attr("stroke", function(d,i){return color_init_stroke[d]})
         //.attr('class', 'hidden_circle') // class is needed for style sheet
         .attr("cx", function(d,i){return pos_gen_x(d,i,identifier)})
         .attr("cy", function(d,i){return pos_gen_y(d,i,identifier)})
         .attr("r", radius)
         .attr('id', function(d,i){return "RBM_node"+d})
         .attr('index', function(d,i){return d})

//         .on("click", function(d) {var selection = d3.select(this)
//                                   var spins_new = dictionary["spins_new"+identifier]
//                                     spins_new = toggle_colors(selection, spins_new, d)
//                                     d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))
//                                     tooltip.text('h' + d +' = '+ spins_new[d])
//                                     dictionary["spins_new"+identifier] = spins_new;
//        })
//
//         .on("mouseover", function(d) {
//             var spins_new = dictionary["spins_new"+identifier]
//                  tooltip.text('h' + d +' = '+ spins_new[d])
//                         .style("visibility", "visible")
//       })
// 
//        .on("mousemove", function() {
//          tooltip.style("top", (event.pageY+10)+ "px") // event.pageX is mouse position
//                 .style("left", event.pageX+10 + "px");
//       })
//
//       .on("mouseout", function() {
//         return tooltip.style("visibility", "hidden");
//       })
 var dragHandler = d3.drag()
    .on("drag", function () {
          xpos = d3.event.x
          ypos = d3.event.y
          d3.select(this)
              .attr("cx", xpos)
              .attr("cy", ypos);
    	  index = d3.select(this).attr("index")
	  bias_value = -2*(ypos/svg_RBM_height - 1/2).toPrecision(2)  
		d3.select("#biastext"+index).text(function(){return "bias: "+bias_value})    
	    if (index<2){
   line_w = d3.select("#weight"+index)
	   line_w.attr("x1", xpos)
	   line_w.attr("y1", ypos)}
	    else { 
   line_w = d3.select("#weight0")
	   line_w.attr("x2", xpos)
	   line_w.attr("y2", ypos)
   line_w = d3.select("#weight1")
	   line_w.attr("x2", xpos)
	   line_w.attr("y2", ypos)}
		    
    })
	
    .on("end", function () {
          xpos = d3.event.x
          ypos = d3.event.y
          d3.select(this)
              .attr("cx", xpos)
              .attr("cy", ypos);
    	  index = d3.select(this).attr("index")
	  bias_value = -2*(ypos/svg_RBM_height - 1/2).toPrecision(2)  
	    if (index<2){
		 bias_fct_RBM_new(bias_value, index, identifier)   
		}
	    else { 
		 bias_fct_RBM_new(bias_value, index, identifier)   
	    } 
    })
    dragHandler(d3.select("#RBM_complete_main_svg"+identifier).selectAll("circle"))
 }

function generate_RBM_connections_new(identifier){
           histo_id1 = "histogram_data_pos_phase"
   d3.select("#RBM_sampler"+identifier).selectAll()
         .data(dictionary["connection_graph"+identifier])
         .enter()
         .append("line")
         .attr("id", function(d, i){return 'weight'+i})
	.attr("index", function(d,i){return i})
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

function bias_fct_RBM_new(h, index, identifier) {
        var spins_new = dictionary["spins_new"+identifier]
        var bias_slider_index = index
        var configuration_to_learn = dictionary["configuration_to_learn" + identifier]
        var hidden_vecs = dictionary["hidden_vecs"+identifier]
       dictionary["biases"+identifier][bias_slider_index] = h
        value = document.getElementById("bias_slider_value"+identifier)
        value.innerHTML =  h
        //d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))
          histogram_data = []
          for (j=0; j<configuration_to_learn.length; j++){
                histogram_data.push(prob_of_config(configuration_to_learn[j], identifier))}
          histo_data_neg = histogram_data
          histo_data_pos = histo_pos_phase(histogram_data)
          histo_id1 = "histogram_pos_phase"
          histo_id2 = "histogram_neg_phase"
          update_histogram(histo_data_pos, histo_id1, identifier) // pos phase
          update_histogram(histo_data_neg, histo_id2, identifier) // neg phase
        //d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))
        }

function slider_bias_just_text_new(h,index,identifier) {
        var spins_new = dictionary["spins_new"+identifier]
        var bias_slider_index = index
        dictionary["biases"+identifier][bias_slider_index] = h
        value = document.getElementById("bias_slider_value"+identifier)
        value.innerHTML =  h
        //d3.select("#energy_text"+identifier).text("Energy: "+energy_fct(spins_new, identifier))
        }

function generate_RBM_biases_new(identifier){
     d3.select("#RBM_complete_main_svg"+identifier).selectAll()
         .data(dictionary["spins_data"+identifier])
         .enter()
         .append("text")
         .attr("x",20)
         .attr("y", function(d,i){return 100+i*20})
	.text("bias: 0")
	.attr("id", function(d,i){return "biastext"+i})
//       .on("click", function(d){
//                line = d3.select(this)
//                    bias_idx = d
//                    arg = dictionary["biases"+identifier][bias_idx]
//                    document.getElementById("bias_slider_id"+identifier).value = arg
//                //text = d3.select("#biastext")
//                //text.text(function(){return "Bias: "+bias_idx })
//               text = document.getElementById("bias_slider_text"+identifier)
//                text.innerHTML = "Bias: "+ bias_idx
//               value = document.getElementById("bias_slider_value"+identifier)
//               value.innerHTML =  arg
//                dictionary["bias_slider_index"+identifier] = bias_idx
//       })
//
//         .on("mouseover", function(d) {
//                  tooltip.text('bias' + d +' = '+ dictionary["biases"+identifier][d])
//                         .style("visibility", "visible")
//       })
//
//        .on("mousemove", function() {
//          tooltip.style("top", (event.pageY+10)+ "px") // event.pageX is mouse position
//                 .style("left", event.pageX+10 + "px");
//       })
//
//       .on("mouseout", function() {
//         return tooltip.style("visibility", "hidden");
//       })
 }	

