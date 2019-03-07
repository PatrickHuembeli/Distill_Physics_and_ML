const RBM_distribution = "#RBM_distribution_id" // This defines in which div we write into

// Defaults
var h_units = 2
var v_units = 3

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
var svg = d3.select(RBM_distribution)
    .append("svg")
    .attr("id", "RBM_sampler")
    .attr('class','figures')
    .attr("width", width) // use whole space given in article
    .attr("height", height); // This is height of figure without 'selectors'

// VERY IMPORTANT WE WILL HAVE TO CHANGE THIS WIDTH PARAMETER TO 100% TO ADAPT FIGURE SIZE FOR DIFFERENT DEVICES.


// Add the dropdown menus to choose the number of hidden and visible
// ----------------------------------------------------------------------------
var connection_data

// -------------------------------------------------------------
// Genearte the RBM Graph

generate = function(){

var spins = [[-1,-1,],[-1,-1,-1]]

cut_spinlist(spins, h_units, v_units)


// Initialize connection Data
connection_data = []    
for(var i=0; i<h_units; i++) {
for(var j=0; j<v_units; j++) {
    connection_data.push([i,j, 1]);}
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
 
console.log(connection_data) 
d3.select("#RBM_sampler").selectAll()
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

var energy_fct = function(spins){
    var energy = 0
//     console.log(spins)
    for (var i = 0; i<spins[0].length; i++) {
        for (var j = 0; j<spins[1].length; j++) {
        spin = spins[0][i]
        weight = connection_data[i +j ][2]
        energy += spins[0][i]*spins[1][j]*weight;}}
    return energy
}



function permute_spins(){
    all_permutations = []
//     console.log('test')
    for (var i = 0; i<2**(h_units*v_units); i++) {
        var spin = [[-1,-1],[-1,-1,-1]]
        idx = i
        if (idx%2 > 0){spin[0][0] = 1,
                        idx -= 1    }
        idx = idx/2
        if (idx%2 > 0){spin[0][1] = 1,
                        idx -= 1  }
        idx = idx/2
        if (idx%2 > 0){spin[1][0] = 1
                         idx -= 1 }
        idx = idx/2                    
        if (idx%2 > 0){spin[1][1] = 1
                         idx -= 1 }
        idx = idx/2                 
        if (idx%2 > 0){spin[1][2] = 1}
        all_permutations.push(spin)
        }
        return all_permutations
}
all_perm_test = permute_spins()
// console.log(all_perm_test)

function partition_fct(all_permutations){
    var Z = 0
    for (var i = 0; i<all_permutations.length; i++) {
        energy = energy_fct(all_permutations[i])
        Z += Math.exp(-energy)
        }
        return Z
}

function p_v()

generate() // generates the RBM when the sites is loaded first with default values.
