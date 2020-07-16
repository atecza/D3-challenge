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
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity"

// function used for updating x-scale var upon click on axis label

function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
  
    return xLinearScale;
  
}

function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
        ])
        .range([0, height]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
    return xAxis;
}

function renderYAxes(newYScale, yAxis) {

    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))
        
    return circlesGroup;

}

// function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty (%):";
    }
    if (chosenXAxis === "age") {
        xlabel = "Age:";
    }
    if (chosenXAxis === "income") {
        xlabel = "Household Income:";
    }
    else {
      xlabel = ":";
    }

    var ylabel;
  
    if (chosenYAxis === "obesity") {
      ylabel = "Obesity:";
    }
    if (chosenYAxis === "smokes") {
        ylabel = "Smokes:";
    }
    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Healthcare:";
    }
    else {
      ylabel = ":";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${ylabel}: ${d[chosenYAxis]}<br>${xlabel}: ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


// Retrieve data from the CSV file and execute everything below
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
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(healthData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
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
        .attr("fill", "pink")
        .attr("opacity", ".5");
  
    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty");

    // Create group for three y-axis labels

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height/2})`);

    var obesityLabel = ylabelsGroup.append("text")
      .attr("x", 0) //not sure what this should be
      .attr("y", 0)
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obesity");
  

  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x & y axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
        chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);
  
          // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
  
          // changes classes to change bold text
        if (chosenXAxis === "poverty") {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);

            ageLabel
                .classed("active", false)
                .classed("inactive", true);

            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        if (chosenXAxis === "age") {
            ageLabel
                .classed("active", true)
                .classed("inactive", false);

            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            }
        }
    });
}).catch(function(error) {
    console.log(error);
});