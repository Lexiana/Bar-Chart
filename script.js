//set dimensions
const width = 800,
    height = 400,
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    
// create svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width )
    .attr("height", height );

// load data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(data => {
        //set title
        const title = data.name.split(",")[0];
        const titleText = document.querySelector("#title");
        titleText.innerHTML = title;

        const dataset = data.data;

        // parse dates and GPD
        const parseTime = d3.timeParse("%Y-%m-%d");
        dataset.forEach(d => {
            d[0] = parseTime(d[0]);
            d[1] = +d[1];
        })

        // create scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(dataset, d => d[0]))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .range([height - margin.bottom, margin.top]);
        
        const bandScale = d3.scaleBand()
            .domain(dataset.map(d => d[0]))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        // create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // append axes
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        
        // append data
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", bandScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d[1]))
            .attr("fill", "steelblue")
            .attr("class", "bar")
            .attr("data-date", d => d3.timeFormat("%Y-%m-%d")(d[0]))
            .attr("data-gdp", d => d[1]);
    });

