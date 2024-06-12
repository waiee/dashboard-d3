const data = [
    { category: "A", value1: 20, value2: 30 },
    { category: "B", value1: 40, value2: 25 },
    { category: "C", value1: 35, value2: 40 },
    { category: "D", value1: 50, value2: 20 },
    { category: "E", value1: 30, value2: 35 }
];

const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)
    .domain(data.map(d => d.category));

const x1 = d3.scaleLinear()
    .rangeRound([0, x0.bandwidth() / 2])
    .domain([0, d3.max(data, d => Math.max(d.value1, d.value2))]);

const x2 = d3.scaleLinear()
    .rangeRound([0, x0.bandwidth() / 2])
    .domain([0, d3.max(data, d => Math.max(d.value1, d.value2))]);

const y = d3.scaleBand()
    .rangeRound([height, 0])
    .padding(0.1)
    .domain(data.map(d => d.category));

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y));

g.selectAll(".bar-left")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar-left")
    .attr("y", d => y(d.category))
    .attr("height", y.bandwidth())
    .attr("x", d => x0(d.category) - x1(d.value1))
    .attr("width", d => x1(d.value1));

g.selectAll(".bar-right")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar-right")
    .attr("y", d => y(d.category))
    .attr("height", y.bandwidth())
    .attr("x", d => x0(d.category) + x0.bandwidth() / 2)
    .attr("width", d => x2(d.value2));

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0));
