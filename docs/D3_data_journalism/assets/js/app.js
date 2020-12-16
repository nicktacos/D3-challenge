// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 620;

let margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

var chart = d3.select('#scatter')
    .append('div')
    .classed('chart', true);

var svg = chart.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

let chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

var YAxis = 'healthcare';
var XAxis = 'poverty';

function xScale(data, XAxis){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[XAxis]) * 0.8,
            d3.max(data, d => d[XAxis]) * 1.2])
        .range([0, width]);
    return xLinearScale;
}

function yScale(data, YAxis){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[YAxis]) * 0.8,
            d3.max(data, d => d[YAxis]) * 1.2])
        .range([height, 0]);
    return yLinearScale;
}

function renderXaxis(exScale, xAxis){
    var bottomAxis = d3.axisBottom(exScale);
    xAxis.transition()
        .duration(2000)
        .call(bottomAxis);
    return xAxis;
}

function renderYaxis(eyScale, yAxis){
    var leftAxis = d3.axisLeft(eyScale);
    yAxis.transition()
        .duration(2000)
        .call(leftAxis);
    return yAxis;
}

function renderCircles(circlesGroup, exScale, XAxis, eyScale, YAxis){
    circlesGroup.transition()
        .duration(2000)
        .attr('cx', data => exScale(data[XAxis]))
        .attr('cy', data => eyScale(data[YAxis]))
    return circlesGroup;
}

function renderLabels(labelGroup, exScale, XAxis, eyScale, YAxis){
    labelGroup.transition()
        .duration(2000)
        .attr('x', d => exScale(d[XAxis]))
        .attr('y', d => eyScale(d[YAxis]))
    return labelGroup
}

function styleX(value, XAxis){
    if (XAxis === 'poverty'){
        return `${value}`;
    }
    else if (XAxis === 'income'){
        return `${value}`;
    }
    else{
        return `${value}`;
    }
}

function updateToolTip(XAxis, YAxis, circlesGroup){
    if (XAxis === 'poverty'){
        var xLabel = 'Poverty:';
    }
    else if (XAxis === 'income'){
        var xLabel = 'Median Income:';
    }
    else {
        var xLabel = 'Age:';
    }
    if (YAxis === 'healthcare'){
        var yLabel = 'No Healthcare:';
    }
    else if (YAxis ==='obesity'){
        var yLabel = 'Obesity:';
    }
    else {
        var yLabel = 'Smokers:';
    }
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0])
        .html(function(d){
            return(`${d.state}<br>${xLabel} ${styleX(d[XAxis], XAxis)}<br>${yLabel} ${d[YAxis]}%`);
    });
    circlesGroup.call(toolTip);
    
    circlesGroup.on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);
        return circlesGroup;
}

d3.csv('./assets/data/data.csv').then(function(censusData){
    console.log(censusData);
    censusData.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    var xLinearScale = xScale(censusData, XAxis);
    var yLinearScale = yScale(censusData, YAxis);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .call(leftAxis);
    var circlesGroup = chartGroup.selectAll('circle')
        .data(censusData)
        .enter()
        .append('circle')
        .classed('stateCircle', true)
        .attr('cx', d => xLinearScale(d[XAxis]))
        .attr('cy', d => yLinearScale(d[YAxis]))
        .attr('r', 14)
        .attr('opacity', 0.5);
    var labelGroup = chartGroup.selectAll('.stateText')
        .data(censusData)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[XAxis]))
        .attr('y', d=> yLinearScale(d[YAxis]))
        .attr('dy', 3)
        .attr('font-size', '10px')
        .text(function(d){return d.abbr});
    var xLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);
    var povertyLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('active', true)
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .text('In Poverty (%)');
    var ageLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age')
        .text('Age (Median)');
    var incomeLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'income')
        .text('Household Income (Median)');
    
    var yLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);
    var healthcareLabel = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed('active', true)
        .attr('x', 0)
        .attr('y', 0 - 20)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'healthcare')
        .text('Without Healthcare (%)');
    var smokesLabel = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 0 - 40)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'smokes')
        .text('Smoker (%)');
    var obesityLabel = yLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 0 - 60)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'obesity')
        .text('Obese (%)');    
    var circlesGroup = updateToolTip(XAxis, YAxis, circlesGroup);
    xLabelsGroup.selectAll('text')
        .on('click', function(){
            var value = d3.select(this).attr('value');
            if (value != XAxis) {
                XAxis = value;
                xLinearScale = xScale(censusData, XAxis);
                xAxis = renderXaxis(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, XAxis, yLinearScale, YAxis);
                labelGroup = renderLabels(labelGroup, xLinearScale, XAxis, yLinearScale, YAxis);
                circlesGroup = updateToolTip(XAxis, YAxis, circlesGroup);

                if(XAxis === 'poverty'){
                    povertyLabel.classed('active', true).classed('inactive', false);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', false).classed('inactive', true);
                }
                else if(XAxis === 'age'){
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', true).classed('inactive', false);
                    incomeLabel.classed('active', false).classed('inactive', true);
                }
                else {
                    povertyLabel.classed('active', false).classed('inactive', true);
                    ageLabel.classed('active', false).classed('inactive', true);
                    incomeLabel.classed('active', true).classed('inactive', false);
                }
            }
        });
    yLabelsGroup.selectAll('text')
        .on('click', function(){
            var value = d3.select(this).attr('value');
            if (value !=YAxis) {
                YAxis = value;
                yLinearScale = yScale(censusData, YAxis);
                yAxis = renderYaxis(yLinearScale, yAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, XAxis, yLinearScale, YAxis);
                labelGroup = renderLabels(labelGroup, xLinearScale, XAxis, yLinearScale, YAxis);
                circlesGroup = updateToolTip(XAxis, YAxis, circlesGroup);
                if (YAxis === 'obesity'){
                    obesityLabel.classed('active', true).classed('inacitve', false);
                    smokesLabel.classed('active', false).classed('inacitve', true);
                    healthcareLabel.classed('active', false).classed('inacitve', true);
                }
                else if(YAxis === 'smokes'){
                    obesityLabel.classed('active', false).classed('inacitve', true);
                    smokesLabel.classed('active', true).classed('inacitve', false);
                    healthcareLabel.classed('active', false).classed('inacitve', true);
                }
                else {
                    obesityLabel.classed('active', false).classed('inacitve', true);
                    smokesLabel.classed('active', false).classed('inacitve', true);
                    healthcareLabel.classed('active', true).classed('inacitve', false);
                }
            } 
        });
    
    
});
