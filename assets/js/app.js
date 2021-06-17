// Set the svg height and width params

var svgHeight = 550;
var svgWidth = 800; 

// Set the margins for the svg 
var margin = {
    top: 40,
    bottom: 110,
    right: 80,
    left: 140
};

//Create the width and height from the margins so that the plot fits in the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create the svg wrapper 
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Using the transform, translate attribute, create a chart group to hold the data 
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

//import the data file 
d3.csv("assets/data/data.csv").then(successHandle, errorHandle);

//Function to alert the instance of an error when importing the data file 
function errorHandle(error) {
    throw err;
}

//Function to parse through the data and create the graph if importing is successful 
function successHandle(data){
    data.map(function(data){
        data.abbr = +data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcareLow = +data.healthcareLow
    });

    //Create a scale function to set the min and max of the x axis 
    var xLinearScale = d3.scaleLinear()
        .domain([29, d3.max(data, d => d.age)])
        .range([0, width]);
    
    //Create a scale function to set the min and max of the y axis 
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(data, d => d.smokes)])
        .range([height, 0]);

    //Create the axis functions
    var xAxis = d3.axisBottom(xLinearScale).ticks(10);
    var yAxis = d3.axisLeft(yLinearScale);

    //Add the both of the axes to the chart group 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    //Add the circular data markers to the chart 
    var markers = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "13")
        .attr("fill", "purple")
        .attr("opacity", ".60")
        .attr("r", 15)

    //Add labels to the chart 
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 -(height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokes")
    
    chartGroup.append("text")
        .attr("transform", `translate(${width /2}, ${height + margin.top +30})`)
        .attr("class", "axisText")
        .text("Age")

    // Add labels to the markers 
    var markers = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style('fill', "white")
        .text(d => (d.smokes));
}