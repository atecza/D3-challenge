var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 40,
  right: 40,
  bottom: 100,
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
      .domain([d3.max(healthData, d => d[chosenYAxis]), d3.min(healthData, d => d[chosenYAxis])])
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


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`X: ${d[chosenXAxis]}<br> Y: ${d[chosenYAxis]}`);
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

// Initial Param

var chosenYAxis = "obesity";
var chosenXAxis = "poverty";

//      GET DATA AND CREATE THE GRAPH   

d3.csv("data.csv").then(function(healthData, err) {
    if (err) throw err;

    console.log(`x & y: ${chosenXAxis},${chosenYAxis}`)
  
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
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5")

        console.log(circlesGroup)
    
        //not working
    chartGroup.selectAll("text").exit()
        .data(healthData)  
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)
        .attr("class","stateAbbr");
    
    
    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .classed("inactive", false)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-80,${height/2})`);
    
    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0) //this should be the outer most lable
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .classed("inactive", false)
        .text("Obese (%)");
    
    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", 0)
        .attr("value", "smokes") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Smokes (%)");
    
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", 0)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");
    
    
    
    // updateToolTip 
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // axis labels event listener
    xlabelsGroup.selectAll("text").on("click", function() {

        // get value of selection
        var valueX = d3.select(this).attr("value");


        if (valueX !== chosenXAxis) { //for homework change this to if value in...

            // replaces chosenXAxis with value
            chosenXAxis = valueX;

            console.log(`chosenX: ${chosenXAxis}`)
            console.log(`chosenY: ${chosenYAxis}`)

            // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenXAxis === "age"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenXAxis === "income"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            
        } 

    });

    ylabelsGroup.selectAll("text").on('click', function(){

        // get value of selection
        var valueY = d3.select(this).attr("value");


        if (valueY !== chosenYAxis){
        
            // replaces chosenXAxis with value
            chosenYAxis = valueY;

            console.log(`chosenY: ${chosenYAxis}`)
            console.log(`chosenX: ${chosenXAxis}`)

            // updates x scale for new data
            yLinearScale = yScale(healthData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenYAxis === "smokes"){
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenYAxis === "healthcare"){
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });

}).catch(function(error) {
        console.log(error);
});
