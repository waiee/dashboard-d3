// Set the dimensions and margins of the graph
const margin = {top: 50, right: 80, bottom: 70, left: 80},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data.csv").then(function(data) {
  // Format the data
  data.forEach(d => {
    d.total_affected = +d.total_affected;
    d.cpi = +d.cpi;
  });

  // X axis
  const x = d3.scaleBand()
    .domain(data.map(d => d.region))
    .range([0, width])
    .padding(1);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis for total affected
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total_affected)])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a second Y axis for CPI
  const y2 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.cpi)])
    .range([height, 0]);
  svg.append("g")
    .attr("transform", `translate(${width}, 0)`)
    .call(d3.axisRight(y2));

  // Line generator for total affected
  const line = d3.line()
    .x(d => x(d.region))
    .y(d => y(d.total_affected));

  // Line generator for CPI
  const line2 = d3.line()
    .x(d => x(d.region))
    .y(d => y2(d.cpi));

  // Add the line for total affected
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add the line for CPI
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", line2);

  // Add dots for total affected
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.region))
      .attr("cy", d => y(d.total_affected))
      .attr("r", 5)
      .attr("fill", "steelblue");

  // Add dots for CPI
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.region) - 5)
      .attr("y", d => y2(d.cpi) - 5)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "red");

  // Add titles and labels
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text("Region");

  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height / 2 + 20)
      .text("Total Affected");

  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", width + margin.right - 20)
      .attr("x", -margin.top - height / 2 + 20)
      .text("CPI");
}).catch(function(error){
    console.log(error);
});
