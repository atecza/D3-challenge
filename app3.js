var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "obesity";
var chosenYAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]), d3.max(healthData, d => d[chosenXAxis])])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]), d3.max(healthData, d => d[chosenYAxis])])
      .range([0, height]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(xLinearScale, xAxis) {
    var bottomAxis = d3.axisBottom(xLinearScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis; //returns the newly formatted x axis
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(yLinearScale, yAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis; //returns the newly formatted y axis
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
    
    return circlesGroup;

}

d3.csv("data.csv").then(function(healthData, err) {
    if (err) throw err;
  
    // parse data
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    console.log(healthData)

    // create x scale
    var xLinearScale = xScale(healthData, chosenXAxis);
  
    // Create y scale 
    var yLinearScale = yScale(healthData, chosenYAxis);
  
    // Create initial x axis 
    var bottomAxis = d3.axisBottom(xLinearScale);

    // Create initial y axis 
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis",true)
        .call(leftAxis);
    
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");
    
}).catch(function(error) {
        console.log(error);
});