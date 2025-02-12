// <<<<<<< HEAD
// // URL to the Excel file
// const excelUrl = 'C:/Users/user/Downloads/projects/dashboard-d3/dataset/1900_2021_DISASTERS.xlsx ';

// // Fetch and process the Excel file
// fetch(excelUrl)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.arrayBuffer();
//     })
//     .then(data => {
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         console.log('Worksheet data:', worksheet);  // Debug: log the loaded data

//         processData(worksheet);
//     })
//     .catch(error => console.error('Error fetching the Excel file:', error));


// // Process data to create a butterfly chart
// function processData(data) {
//     const regions = [...new Set(data.map(d => d.Region))];
//     populateRegionFilter(regions);

//     const regionSelect = document.getElementById('region');
//     regionSelect.addEventListener('change', () => {
//         const selectedRegion = regionSelect.value;
//         const filteredData = data.filter(d => d.Region === selectedRegion);
//         console.log('Filtered data for region:', filteredData);  // Debug: log the filtered data
//         createButterflyChart(filteredData);
//     });

//     // Initial chart creation with the first region
//     if (regions.length > 0) {
//         createButterflyChart(data.filter(d => d.Region === regions[0]));
//     }
// }

// // Populate region filter dropdown
// function populateRegionFilter(regions) {
//     const regionSelect = document.getElementById('region');
//     regions.forEach(region => {
//         const option = document.createElement('option');
//         option.value = region;
//         option.text = region;
//         regionSelect.appendChild(option);
//     });
// }

// // Create butterfly chart
// function createButterflyChart(data) {
//     const margin = { top: 20, right: 30, bottom: 40, left: 40 },
//           width = 900 - margin.left - margin.right,
//           height = 500 - margin.top - margin.bottom;

//     d3.select("#chart").selectAll("*").remove();

//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     const countries = [...new Set(data.map(d => d.Country))];

//     const x0 = d3.scaleBand()
//         .rangeRound([0, width])
//         .paddingInner(0.1)
//         .domain(countries);

//     const x1 = d3.scaleLinear()
//         .rangeRound([0, x0.bandwidth() / 2])
//         .domain([0, d3.max(data, d => d['Total Affected'])]);

//     const x2 = d3.scaleLinear()
//         .rangeRound([0, x0.bandwidth() / 2])
//         .domain([0, d3.max(data, d => d.CPI)]);

//     const y = d3.scaleBand()
//         .rangeRound([height, 0])
//         .padding(0.1)
//         .domain(countries);

//     const g = svg.append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     g.append("g")
//         .attr("class", "axis axis--y")
//         .call(d3.axisLeft(y));

//     g.selectAll(".bar-left")
//         .data(data)
//         .enter()
//         .append("rect")
//         .attr("class", "bar-left")
//         .attr("y", d => y(d.Country))
//         .attr("height", y.bandwidth())
//         .attr("x", d => x0(d.Country) - x1(d['Total Affected']))
//         .attr("width", d => x1(d['Total Affected']));

//     g.selectAll(".bar-right")
//         .data(data)
//         .enter()
//         .append("rect")
//         .attr("class", "bar-right")
//         .attr("y", d => y(d.Country))
//         .attr("height", y.bandwidth())
//         .attr("x", d => x0(d.Country) + x0.bandwidth() / 2)
//         .attr("width", d => x2(d.CPI));

//     g.append("g")
//         .attr("class", "axis axis--x")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x0));
// }
// =======
// // Set the dimensions and margins of the graph
// const margin = {top: 50, right: 80, bottom: 70, left: 80},
//       width = 960 - margin.left - margin.right,
//       height = 500 - margin.top - margin.bottom;

// // Append the svg object to the body of the page
// const svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// // Parse the Data
// d3.csv("data.csv").then(function(data) {
//   // Format the data
//   data.forEach(d => {
//     d.total_affected = +d.total_affected;
//     d.cpi = +d.cpi;
//   });

//   // X axis
//   const x = d3.scaleBand()
//     .domain(data.map(d => d.region))
//     .range([0, width])
//     .padding(1);
//   svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");

//   // Add Y axis for total affected
//   const y = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.total_affected)])
//     .range([height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Add a second Y axis for CPI
//   const y2 = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.cpi)])
//     .range([height, 0]);
//   svg.append("g")
//     .attr("transform", `translate(${width}, 0)`)
//     .call(d3.axisRight(y2));

//   // Line generator for total affected
//   const line = d3.line()
//     .x(d => x(d.region))
//     .y(d => y(d.total_affected));

//   // Line generator for CPI
//   const line2 = d3.line()
//     .x(d => x(d.region))
//     .y(d => y2(d.cpi));

//   // Add the line for total affected
//   svg.append("path")
//     .datum(data)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 2)
//     .attr("d", line);

//   // Add the line for CPI
//   svg.append("path")
//     .datum(data)
//     .attr("fill", "none")
//     .attr("stroke", "red")
//     .attr("stroke-width", 2)
//     .attr("d", line2);

//   // Add dots for total affected
//   svg.selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("cx", d => x(d.region))
//       .attr("cy", d => y(d.total_affected))
//       .attr("r", 5)
//       .attr("fill", "steelblue");

//   // Add dots for CPI
//   svg.selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//       .attr("x", d => x(d.region) - 5)
//       .attr("y", d => y2(d.cpi) - 5)
//       .attr("width", 10)
//       .attr("height", 10)
//       .attr("fill", "red");

//   // Add titles and labels
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width / 2 + margin.left)
//       .attr("y", height + margin.top + 20)
//       .text("Region");

//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -margin.left + 20)
//       .attr("x", -margin.top - height / 2 + 20)
//       .text("Total Affected");

//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("transform", "rotate(-90)")
//       .attr("y", width + margin.right - 20)
//       .attr("x", -margin.top - height / 2 + 20)
//       .text("CPI");
// }).catch(function(error){
//     console.log(error);
// });
// >>>>>>> 9fb0af8ea34f33775a62656e8cacb9dba50dbdff
