// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var length = 101 // This is length of data
var x = d3.scaleLinear() 
            .range([0, width]) // define x width on website
            .domain([0, length-1]); //define x-axis range
var y = d3.scaleLinear().range([height, 0]); // define y-axis size on web site

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          
//------------------------------------------------------------------------------
// INITIALIZE THE PLOT          
// -----------------------------------------------------------------------------
function initialize_plot(obj_number) {

// define the area
var area = d3.area() // define function for area
    .x(function(d,i) { return x(i); })
    .y0(height)
    .y1(function(d) { return y(d[obj_number]); });

// define the line
var valueline = d3.line() // define function for line plot
    .x(function(d, i) { return x(i); })
    .y(function(d) {return y( d[obj_number] ); });

// get the data
d3.csv("data_set.csv", function(error, data) {

// var filter = data.filter(function (d) { return d.key = = = 'obj1' })
// console.log(filter)

  if (error) throw error;
  // format the data
//   data.forEach(function(d) {
//         //console.log(d.key == object)
//         //console.log(d3.keys(d))
//         // console.log(d.get("obj1")); // gives out the data of a certain value.
//         // Not relevant for this code!!!!!!!!!
//   }); 

  // scale the range of the data
  x.domain(d3.extent(data, function(d, i) { return i; }));
  y.domain([0, 0.5]);

  // add the area
  area_plt =   svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

  // add the valueline path.
  line_plot = svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
}

initialize_plot("obj0") // initialize plot

// -----------------------------------------------------------------------------
// FUNCTION TO UPDATE PLOT
// -----------------------------------------------------------------------------
function update_plot(obj_number){

// define the area
var area = d3.area() // define function for area
    .x(function(d,i) { return x(i); })
    .y0(height)
    .y1(function(d) { return y(d[obj_number]); });

// define the line
var valueline = d3.line() // define function for line plot
    .x(function(d, i) { return x(i); })
    .y(function(d) {return y( d[obj_number] ); });

d3.csv("data_set.csv", function(error, data) {

// var filter = data.filter(function (d) { return d.key = = = 'obj1' })
// console.log(filter)

  if (error) throw error;
  
  line_plot.data([data])
      .attr("class", "line")
      .attr("d", valueline);
      
      
    // add the area
  area_plt.data([data])
       .attr("class", "area")
       .attr("d", area);    
  
  })
}

// -----------------------------------------------------------------------------
// EPOCH SLIDER
// -----------------------------------------------------------------------------
slider_y_pos = 10
max_scale = 100

var x_slider = d3.scaleLinear()
    .domain([0.1, max_scale])
    .range([0, width-2*margin.right])
    .clamp(true); 

var slider = svg.append("g") // slider for temp
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + slider_y_pos + ")");
    // This defines slider position
    
//console.log(x_slider.ticks(3))
slider.append("line")
    .attr("class", "track")
    .attr("x1", x_slider.range()[0])
    .attr("x2", x_slider.range()[1]) 

    // This defines from where to where the slider goes
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); }) // this is the function that makes the slider movable
        .on("start drag", function() { argh1 = x_slider.invert(d3.event.x)
                                       handler1(argh1);
}));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")") // position of ticks
  .selectAll("text")
  .data(x_slider.ticks(4))
  .enter().append("text")
    .attr("x", x_slider)
    .attr("text-anchor", "middle")
    .text(function(d) { return d ; });

// Here we can change the style of the handle
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // When html started it moves a bit
    .duration(500)
    .tween("hue", function() {
      var i = d3.interpolate(100, 10);
      return function(t) { handler1(i(t)); };
    });    

// -----------------------------------------------------------------------------
// Handler Function
// -----------------------------------------------------------------------------
function handler1(hh) {
  console.log(hh);
  handle.attr("cx", x_slider(hh));
  object_number = "obj"+Math.round(hh)
  update_plot(object_number)
}
