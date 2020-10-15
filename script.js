d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    console.log('data', data);
    const margin = ({top: 20, right: 20, bottom: 20, left: 20});
    const width = 700 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;
    const svg = d3.select('.chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    let incomeArray = [];
    let lifeExpectancyArray = [];
    let populationArray = [];

    for (let step = 0; step < 188; step++) { // in this block we're creating new arrays with every income value and every life expectancy val
        incomeArray.push(data[step].Income);
        lifeExpectancyArray.push(data[step].LifeExpectancy);
        populationArray.push(data[step].Population);
    };

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(incomeArray))
        .range([0, 700])

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(lifeExpectancyArray))
        .range([550, 0])
    
    const uniqueRegions = ["East Asia & Pacific", "South Asia", "America", "Sub-Saharan Africa", "Europe & Central Asia", "Middle East & North Africa"];

    const colorScale = d3
        .scaleOrdinal()
        .domain(uniqueRegions)
        .range(d3.schemeSet2)

    const tooltip = d3.select('.tooltip')
        .attr('position', 'fixed')
        .html("Tooltip in action")

    

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", d=>xScale(d.Income))
            .attr("cy", d=>yScale(d.LifeExpectancy))
            .attr("r", function (d) { 
                if (d.Population < 1000000) {
                    return 2;
                }
                else if (d.Population < 100000000) {
                    return 4;
                } else if (d.Population < 1000000000) {
                    return 8;
                } else {
                    return 12;
                }
            })
            .on("mouseenter", (event, d) => {
                // show the tooltip
                console.log('entered')
                console.log(d3.pointer(event, window))
                tooltip.style("top", (d3.pointer(event, window)[1])+"px").style("left",(d3.pointer(event, window)[0])+"px")
            })
            .on("mouseleave", (event, d) => {
                // hide the tooltip
            })
            .style("fill", d=>colorScale(d.Region));

    
    const xAxis = d3.axisBottom()
        .scale(xScale)

    // drawing the x-axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    const yAxis = d3.axisLeft()
        .scale(yScale)

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(0, 0)`)
        .call(yAxis);

    svg.append("text")
        .attr('x', 600)
        .attr('y', 500)
        .text("Income");

    svg.append("text")
        .attr('x', 10)
        .attr('y', 0)
        .attr('writing-mode', 'vertical-lr')
        .text("Life Expectancy");
    
    svg.append("g")
            .selectAll("boxes")
            .data(uniqueRegions)
            .enter()
            .append("rect")
                .attr("x", 400)
                .attr("y", function(d, i){ return 300 + i*25})
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", d=>colorScale(d));

    svg.append("g")
        .selectAll("mylabels")
        .data(uniqueRegions)
        .enter()
        .append("text")
            .attr("x", 420)
            .attr("y", function(d,i){ return 300 + i*25})
            .style("fill", d=>colorScale(d))
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            
    
})