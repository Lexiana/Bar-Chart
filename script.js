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
    .attr("width", width)
    .attr("height", height);

// create div for tooltip
const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

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
        const datasetTime = data.data;
        datasetTime.forEach(d => {
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
            .call(xAxis)
            .attr("id", "x-axis");
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis)
            .attr("id", "y-axis");

        // define colors
        const defaultColor = "steelblue";
        const hoverColor = "orange";

        // set bar width
        const barWidth = bandScale.bandwidth();
        // create bars
        const bars = svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("z-index", 1)
            .attr("width", barWidth)
            .attr("height", d => height - margin.bottom - yScale(d[1]))
            .style("fill", defaultColor)
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1]);

        // create overlay
        const overlay = svg
            .append("svg")
            .attr("class", "overlay")
            .append("rect")
            .attr("fill", hoverColor)
            .style('opacity', 0);

        // add event listeners
        bars.on("mouseover", (event, d) => {

            // mouse position
            const [x, y] = d3.pointer(event, this);

            // show overlay
            overlay
                .transition()
                .duration(0)
                .style("opacity", 1)
                .attr("x", xScale(d[0]))
                .attr("y", yScale(d[1]))
                .attr("z-index", 2)
                .attr("width", barWidth * 2)
                .attr("height", height - margin.bottom - yScale(d[1]))

            // show and place tooltip
            tooltip.style("opacity", .8)
                .transition()
                .duration(0);
            tooltip.html("Date: " + d3.timeFormat("%Y-%m-%d")(d[0]) + "<br>GDP: $" + d[1].toFixed(2) + " Billion")
                .attr("data-date", d3.timeFormat("%Y-%m-%d")(d[0]))
                .style("left", (x + 10) + "px")
                .style("top", (y - 28) + "px");

        })
            .on("mouseout", d => {
                tooltip.transition().duration(200).style("opacity", 0);
                overlay.transition().duration(200).style('opacity', 0);
            });
    });

