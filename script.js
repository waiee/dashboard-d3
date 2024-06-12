// URL to the Excel file
const excelUrl = 'C:/Users/user/Downloads/projects/dashboard-d3/1900_2021_DISASTERS.xlsx ';

// Fetch and process the Excel file
fetch(excelUrl)
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log('Worksheet data:', worksheet);  // Debug: log the loaded data

        processData(worksheet);
    })
    .catch(error => console.error('Error fetching the Excel file:', error));

// Process data to create a butterfly chart
function processData(data) {
    const regions = [...new Set(data.map(d => d.Region))];
    populateRegionFilter(regions);

    const regionSelect = document.getElementById('region');
    regionSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        const filteredData = data.filter(d => d.Region === selectedRegion);
        console.log('Filtered data for region:', filteredData);  // Debug: log the filtered data
        createButterflyChart(filteredData);
    });

    // Initial chart creation with the first region
    if (regions.length > 0) {
        createButterflyChart(data.filter(d => d.Region === regions[0]));
    }
}

// Populate region filter dropdown
function populateRegionFilter(regions) {
    const regionSelect = document.getElementById('region');
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.text = region;
        regionSelect.appendChild(option);
    });
}

// Create butterfly chart
function createButterflyChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
          width = 900 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    d3.select("#chart").selectAll("*").remove();

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const countries = [...new Set(data.map(d => d.Country))];

    const x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
        .domain(countries);

    const x1 = d3.scaleLinear()
        .rangeRound([0, x0.bandwidth() / 2])
        .domain([0, d3.max(data, d => d['Total Affected'])]);

    const x2 = d3.scaleLinear()
        .rangeRound([0, x0.bandwidth() / 2])
        .domain([0, d3.max(data, d => d.CPI)]);

    const y = d3.scaleBand()
        .rangeRound([height, 0])
        .padding(0.1)
        .domain(countries);

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
        .attr("y", d => y(d.Country))
        .attr("height", y.bandwidth())
        .attr("x", d => x0(d.Country) - x1(d['Total Affected']))
        .attr("width", d => x1(d['Total Affected']));

    g.selectAll(".bar-right")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-right")
        .attr("y", d => y(d.Country))
        .attr("height", y.bandwidth())
        .attr("x", d => x0(d.Country) + x0.bandwidth() / 2)
        .attr("width", d => x2(d.CPI));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));
}
