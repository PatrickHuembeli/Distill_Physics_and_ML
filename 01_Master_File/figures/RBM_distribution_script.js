const RBM_distribution = "#RBM_distribution_id" // This defines in which div we write into

// Defaults
var h_units = 2
var v_units = 3

var width = 700;
var height = 400;
var radius = 20.0
var space = 70.0

var margin_x = 80.0

var nodes_colors = ["blue", "orange"]
ypos1 = 50
ypos2 = 200


// Add the space where it draws the RBM
var svg_RBM_dist = d3.select(RBM_distribution)
    .append("svg")
    .attr("id", "RBM_sampler")
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.


// Define Global Variables
// ----------------------------------------------------------------------------
var connection_data_RBMd = []
// Initialize connection Data 
for(var i=0; i<h_units; i++) {
    for(var j=0; j<v_units; j++) {
        connection_data_RBMd.push([i,j, -1]);}
} 
var spins = [[-1,-1,],[-1,-1,-1]]
var energy_text = svg_RBM_dist.append("text")
                        .attr("x", 20)
                        .attr("y", 20)
                        .attr("font-size", 20)
                        .text("Energy: "+energy_fct(spins))
// -------------------------------------------------------------
// Genearte the RBM Graph

generate_RBM_distribution = function(){

console.log(connection_data_RBMd)

var hidden_svg = svg_RBM_dist.append("svg")

var visible_svg = svg_RBM_dist.append("svg")

var weight_select_svg = svg_RBM_dist.append("svg")

var center_x = (width / 2);
var center_y = (height / 2);

var hpos_gen = function(d) {
    return margin_x + center_x - space*h_units/2 +  d * space ;
};

var vpos_gen = function(d) {
    return margin_x + center_x - space*v_units/2 +  d * space ;
};

// Same function for connections
// Hidden has index 0
var hpos_gen_connect = function(d) {
    return margin_x + center_x - space*h_units/2 +  d[0] * space ;
};

var vpos_gen_connect = function(d) {
    return margin_x + center_x - space*v_units/2 +  d[1] * space ;
};

var h_data = [0,1]
var v_data = [0,1,2]

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
                                energy_text.text("Energy: "+energy_fct(spins))
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
                                energy_text.text("Energy: "+energy_fct(spins))
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
 
d3.select("#RBM_sampler").selectAll()
    .data(connection_data_RBMd)
    .enter()
    .append("line")
    .attr("id", function(d){return 'weight_h' + d[0] + '_v' + d[1]})
//     .attr("class", "RBM_line")
    .attr("stroke","rgb(0,0,0,0.5)") //These attr are defined by class
    .attr("stroke-width", 4.0)
    .attr("x1", hpos_gen_connect)
    .attr("y1", ypos1+radius)
    .attr("x2", vpos_gen_connect)
    .attr("y2", ypos2-radius)
    .on("mouseover", function(d) {
        tooltip.text('weight h:' + d[0] + ' v:' + d[1]+ ' strength: '+d[2])
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
} 
// ============================================================================ 
// Until here is the generate RBM function
// ============================================================================
// Generate the actual graph
generate_RBM_distribution()
// ============================================================================

// ============================================================================
// Here we calculate the probabilities of the configurations
// ============================================================================

// Calculate Energy of Configuration
function energy_fct(spins){
    var energy = 0
//     console.log(spins)
    for (var i = 0; i<spins[0].length; i++) {
        for (var j = 0; j<spins[1].length; j++) {
        spin = spins[0][i]
        weight = connection_data_RBMd[i +j*2 ][2]
        energy += spins[0][i]*spins[1][j]*weight;}}
    return energy
}

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
}

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

visible_vecs = permutations_of_vector(v_units)
hidden_vecs = permutations_of_vector(h_units)

function generate_all_permutations(visible_vecs, hidden_vecs){
    all_permutations = []
    for (var j = 0; j<visible_vecs.length; j++){
        for (var k = 0; k<hidden_vecs.length; k++){
            all_permutations.push([hidden_vecs[k], visible_vecs[j]])
    }}
    return all_permutations
}


//This is the new one
function part_fct(visible_vecs, hidden_vecs){
    all_permutations = generate_all_permutations(visible_vecs, hidden_vecs)
    var Z = 0
//     console.log(all_permutations)
    for (var i = 0; i<all_permutations.length; i++) {
        energy_Z = energy_fct(all_permutations[i])
//         console.log(i, energy_Z, Math.exp(-energy_Z))
        Z += Math.exp(-energy_Z)
        }
        return Z
}

// Z = partition_fct(all_perm_test)
Z = part_fct(visible_vecs, hidden_vecs)
console.log(Z)

function all_configs_given_v(single_visible, hidden_vecs){
    all_permutations = []
    for (var k = 0; k<hidden_vecs.length; k++){
            all_permutations.push([hidden_vecs[k], single_visible])
    }
    return all_permutations
}

console.log(energy_fct(all_configs_given_v([-1,-1,-1], hidden_vecs)[0]))

// calculate probability of given visible configuration
function prob_of_v(single_visible, visible_vecs, hidden_vecs){
    Z = part_fct(visible_vecs, hidden_vecs)
    boltzmann_factor = 0
    all_conf = all_configs_given_v(single_visible, hidden_vecs)
    for (var a = 0; a<all_conf.length; a++) {
//         console.log(a)
        energy_v = energy_fct(all_conf[a]) 
        boltzmann_factor += Math.exp(-energy_v)
        };
    return (boltzmann_factor/Z)    
}

// console.log(prob_of_v(single_visible, hidden_vecs))
test = prob_of_v([1,-1,-1],visible_vecs, hidden_vecs)
console.log(test)

// This function calculates probability of single visible (index) to be 1
function p_individual_v(index, visible_vecs, hidden_vecs){
    prob = 0
    conjugate = 0
//     all_visible_configs = generate_all_permutations(visible_vecs, hidden_vecs)
    for (var i = 0; i<visible_vecs.length; i++) {
        if (visible_vecs[i][index] == 1){
//         console.log('index', index, visible_vecs[i])
        prob += prob_of_v(visible_vecs[i], visible_vecs, hidden_vecs)
//         console.log('prob: ', prob)
        }
        else { // this is only to test if conj + prob add up to 1
            conjugate += prob_of_v(visible_vecs[i], visible_vecs, hidden_vecs)
//             console.log('conj: ', conjugate)
        }
}
return prob, conjugate
}

// console.log(p_individual_v(1, visible_vecs, hidden_vecs))

// returns the individual probabilities of visible units to be 1
function p_total_v(visible_vecs, hidden_vecs){
    all_probs = []
    for (i=0; i<v_units; i++){
        all_probs.push(p_individual_v(i, visible_vecs, hidden_vecs))
    }
    return all_probs
    }
    
    
    
    
    
// ============================================================================
// All about the Slider
var slider_length = 200
var slider_weight = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, slider_length])
    .clamp(true); 

function append_slider(index){
    // -------------------------------------------------------------------------
    // Slider Appending
    // -------------------------------------------------
    var slider_RBM_dist = svg_RBM_dist.append("g") // slider for epoch
        .attr("class", "slider")
        .attr("transform", "translate(" + 20 + "," + 40*(1+index) + ")");
        // This defines slider position
    
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
                        slider_fct_RBM(argument, index);
    }))
        .on("mouseenter", function() {
                h = connection_data_RBMd[index][0]
                v = connection_data_RBMd[index][1]
                console.log('test')
                d3.select('#weight_h' + h + '_v' + v)         
                            .attr("stroke","rgb(0,0,0,1.0)");
  })
  
        .on("mouseleave", function() {
                h = connection_data_RBMd[index][0]
                v = connection_data_RBMd[index][1]
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
        .attr("id", function(d){return "handle" + index})
        .attr("r", 9)
        
    // Slider Function
    // -------------------------------------------------
    function slider_fct_RBM(h, index) {
      var arg = slider_weight(h)
            min = -1
            max = 1
      rescale = (arg/slider_length*(max - min) +min)
      d3.select("#handle"+index).attr("cx", slider_weight(h))
      connection_data_RBMd[index][2] = rescale
            energy_text.text("Energy: "+energy_fct(spins))    
      console.log(p_total_v(visible_vecs, hidden_vecs)) 
      histogram_data = p_total_v(visible_vecs, hidden_vecs)
      update_histogram(histogram_data)           
    }
    // ------------------------------------------------------------------------
}

for (i = 0; i<connection_data_RBMd.length; i++){
append_slider(i)
}

// ============================================================================
// HISTOGRAM FUNCTION
// ============================================================================
var histogram_data = p_total_v(visible_vecs, hidden_vecs) 
// set the ranges
var x_histogram = d3.scaleLinear()
          .range([0, 100]);
var y_histogram = d3.scaleLinear()
          .range([100, 0]);

var center_x = (width / 2);
var center_y = (height / 2);
var histo_width = 40
var histo_height = 100
var histo_y_pos = 250

var histo_pos_gen = function(d) {
    return margin_x + center_x - space*v_units/2 +  d * space -histo_width/2;
};

console.log('tets',x_histogram(0.5), histogram_data)
// set the parameters for the histogram
var histogram = d3.histogram()
    .value(function(d) { return d.date; })
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeMonth));

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
histogram_svg = svg_RBM_dist.append("g")

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

  // add the x Axis
//   histogram_svg.append("g")
//       .attr("transform", "translate(250," + 250 + ")")
//       .call(d3.axisBottom(x_histogram));

  // add the y Axis
  y_pos_histo_axis = histo_pos_gen(0)-20;
  x_pos_histo_axis = histo_y_pos;
  
  histogram_svg.append("g")
        .call(d3.axisLeft(y_histogram))
        .attr("transform", function(){return  "translate("+y_pos_histo_axis+"," + x_pos_histo_axis + ")";})

function update_histogram(histogram_data){
    for (i=0; i<histogram_data.length; i++) {
        d3.select("#histo"+i).attr("height", function(){return histogram_data[i]*histo_height})
                            .attr("y", function(){return histo_y_pos+(1-histogram_data[i])*histo_height}) 
    }
}

