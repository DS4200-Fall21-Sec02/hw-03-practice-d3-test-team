// write your javascript code here.
// feel free to change the preset attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// first visualization
// https://www.d3-graph-gallery.com/graph/barplot_grouped_basicWide.html 
let svg1 = d3.select('#vis1')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

//read in data 
let data1 = d3.csv("data/grouped_bar_data.csv", function(row){
   //console.log(row);
   return {
    year: row.Year,
    Graduates: +row.Graduates,
    Undergraduates: +row.Undergraduates
   }
}).then(function(data) {
  //console.log(data)

  // subgroups = individual bars 
  let subgroups = data.columns.slice(1,3); 
  //console.log(subgroups); 

  //groups = groups on x-axis
  let groups = [];
  data.forEach(function(d) {
    groups.push(d.year); 
  });
  //console.log(groups);

  //Add Y axis 
  let maxG = d3.max(data, function(d) { return d.Graduates; } );
  let maxU = d3.max(data, function(d) { return d.Undergraduates; } );
  let maxY = Math.max(maxG, maxU); 
  //console.log(maxY); 

  let yScale = d3.scaleLinear()
                  .domain([0, maxY + 500])
                  .range([height, 0]);
  svg1.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(yScale)); 

  //Add X axis 
  let xScale = d3.scaleBand()
                  .domain(groups)
                  .range([0, width])
                  .padding([0.2]);
  svg1.append("g")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
      .call(d3.axisBottom(xScale).tickSize(0)); 

  //Add second X axis for subgroups
  let xSubScale = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, xScale.bandwidth()])
                    .padding([0.05]); 

  //Set a color pallet 
  let color1 = d3.scaleOrdinal()
                  .domain(subgroups)
                  .range(['#377eb8','#4daf4a']); 

  //add tooltip
  const tooltip = d3.select("#vis1")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip");

  //needed functions 
  const mouseover = function(event, d) {
    const subgroupName = d3.select(this).datum().key;
    const subgroupValue = d3.select(this).datum().value;
    tooltip.html("Subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
            .style("opacity", 1); 
  }

  const mousemove = function(event, d) {
    tooltip.style("left", (event.x)+"px")
            .style("top", (event.y + 170)+"px"); 
  }

  const mouseleave = function(event, d) {
    tooltip.style("opacity", 0); 
  }

  //Add bars
  svg1.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("transform", function(d) {
          return "translate(" + xScale(d.year) + ",0)";
        })
      .selectAll("rect")
      .data(function(d) {
        return subgroups.map(function(key) {
                return {key: key, value: d[key]};
        });
      })
      .enter()
      .append("rect")
        .attr("x", function(d) { return margin.left + xSubScale(d.key); })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("width", xSubScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.value); })
        .attr("fill", function(d) { return color1(d.key); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave); 
});

// second visualization
let svg2 = d3.select('#vis2')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '));

//read in data 
let data2 = d3.csv("data/line_data.csv", function(row){
   //console.log(row);

   return {
    label: row.Year,
    year: d3.timeParse("%Y")(row.Year.substring(0,4)),
    Undergraduates: +row.Undergraduates
   }
}).then(function(data) {
  console.log(data);

  //Add Y axis 
  let maxY = d3.max(data, function(d) { return d.Undergraduates; } ) 
  //console.log(maxY); 

  let yScale = d3.scaleLinear()
                  .domain([0, maxY + 500])
                  .range([height, 0]);
  svg2.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(yScale)); 

  //Add X axis 
  let xScale = d3.scaleTime()
                  .domain(d3.extent(data, d => d.year))
                  .range([0, width]);
  svg2.append("g")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
      .call(d3.axisBottom(xScale).ticks(4).tickSizeOuter(0)); 

  //add tooltip
  const tooltip2 = d3.select("#vis2")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip");

  //needed functions 
  const mouseover2 = function(event, d) {
    const key = d.label;
    const val = d.Undergraduates;
    tooltip2.html("Year: " + key + "<br>" + "Value: " + val)
            .style("opacity", 1); 
  }

  const mousemove2 = function(event, d) { 
    tooltip2.style("left", (event.x)+"px")
            .style("top", (event.y + 600)+"px"); 
  }

  const mouseleave2 = function(event, d) {
    tooltip2.style("opacity", 0); 
  }

  //Add points 
  svg2.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("r", 5)
          .attr("cx", function(d) { return margin.left + xScale(d.year);} )
          .attr("cy", function(d) { return yScale(d.Undergraduates); } )
          .attr("fill", "#377eb8")
          .on("mouseover", mouseover2)
          .on("mousemove", mousemove2)
          .on("mouseleave", mouseleave2); 
});

