// Read Excel file and process data
function processExcel(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        processData(worksheet);
    };
    reader.readAsArrayBuffer(file);
}

// Process data to create a butterfly chart
function processData(data) {
    const regions = [...new Set(data.map(d => d.Region))];
    populateRegionFilter(regions);

    const regionSelect = document.getElementById('region');
    regionSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        const filteredData = data.filter(d => d.Region === selectedRegion);
        createButterflyChart(filteredData);
    });

    // Initial chart creation with the first region
    createButterflyChart(data.filter(d => d.Region === regions[0]));
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
        .domain([0, d3.max(data, d => d.TotalAffected)]);

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
        .attr("x", d => x0(d.Country) - x1(d.TotalAffected))
        .attr("width", d => x1(d.TotalAffected));

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

// Example of loading the file (you can replace this with actual file input handling)
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.xlsx';
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        processExcel(file);
    }
});
document.body.appendChild(fileInput);
