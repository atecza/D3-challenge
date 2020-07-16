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

function getLabel(chosenAxis) {
    switch(chosenAxis) {
        case 'Smokes (%)':
            return 'smokes';
        case 'Obese (%)':
            return 'obesity';
        case 'Lacks Healthcare (%)':
            return 'healthcare';
        case 'In Poverty (%)':
            return 'poverty';
        case 'Age (Median)':
            return 'age';
        case 'Household Income (Median)':
            return 'income';
        default:
            return 'id';
    }
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, chosenXAxis, circlesGroup) {
    
    var label1 = getLabel(chosenYAxis)
    var label2 = getLabel(chosenXAxis);
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${label1}: ${d[chosenYAxis]}<br>${label2}: ${d[chosenXAxis]}`);
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