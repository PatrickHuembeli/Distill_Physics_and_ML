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

var object = "obj0"

// define the area
var area = d3.area() // define function for area
    .x(function(d,i) { return x(i); })
    .y0(height)
    .y1(function(d) { return y(d[object]); });

// define the line
var valueline = d3.line() // define function for line plot
    .x(function(d, i) { return x(i); })
    .y(function(d) {return y( d[object] ); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          
          
          

// get the data
d3.csv("header.csv", function(error, data) {

// var filter = data.filter(function (d) { return d.key = = = 'obj1' })
// console.log(filter)

  if (error) throw error;
  // format the data
  data.forEach(function(d) {
        console.log(d.key == "obj1")
        console.log(d3.keys(d))
        // console.log(d.get("obj1")); // gives out the data of a certain value.
        // Not relevant for this code!!!!!!!!!
  }); 

  // scale the range of the data
  x.domain(d3.extent(data, function(d, i) { return i; }));
  y.domain([0, 0.5]);

  // add the area
    svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

  // add the valueline path.
  svg.append("path")
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