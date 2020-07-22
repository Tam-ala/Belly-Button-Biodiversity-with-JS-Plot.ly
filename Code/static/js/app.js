// verify that data shows up
d3.json("../Data/samples.json").then(function (data) {
    console.log(data)
});

// initialize plots, metadata, and dropdown when webpage opens
function init() {
    d3.json("../Data/samples.json").then(function (data) {
        console.log(data)

        // define variables
        var metadata = data.metadata
        // console.log(metadata)
        var name = data.names
        // console.log(name)
        var dropdown = d3.select("#selDataset");
        // console.log(dropdownMenu)
        var info = d3.select("#sample-metadata")
        // console.log(info)

        name.forEach(function(info) {
            dropdown.append("option").text(info).property("value");
        }); 
    });

    optionChanged();
}
init();

// make function to change plots when dropdown changes
function optionChanged() {
    d3.selectAll("#selDataset").on("change", optionChanged);
    buildDemoInfo();
    buildPlots();
}

// make function for demographic panel
function buildDemoInfo() {
    d3.json("../Data/samples.json").then(function (data) {
        console.log(data)

        // define variables
        var metadata = data.metadata
        var info = d3.select("#sample-metadata")
        // console.log(info)

        info.html("")

        // filter test subjects by their id
        var selectId = metadata.filter(info => info.id === info.id)
        console.log(selectId)

        // pick selected as the first index
        Object.entries(selectId[1]).forEach(function ([key, value]) {
            var row = info.append("p");
            row.text(`${key} : ${value}`)
            console.log(key, value)
        })
    });
};

// make function for plots
function buildPlots() {
    d3.json("../Data/samples.json").then((data) => {

        // define variables for the selected dropdown
        var sampValues = data.samples[1].sample_values;
        var otuIds = data.samples[1].otu_ids;
        var otuLables = data.samples[1].otu_lables;

        // -------------------------------------------------------------------------------

        // FOR BUBBLE PLOT
        // 1. Create a bubble chart that displays each sample:
        // 2. Use otu_ids for the x values.
        // 3. Use sample_values for the y values.
        // 4. Use sample_values for the marker size.
        // 5. Use otu_ids for the marker colors.
        // 6. Use otu_labels for the text values.

        // define trace
        var trace = {
            x: otuIds,
            y: sampValues,
            text: otuLables,
            mode: 'markers',
            marker: {
                color: otuIds,
                size: sampValues
            }
        };

        //  define data & layout for plots
        var bubbledata = [trace];
        var bubblelayout = {
            title: 'Total OTUs by Test Subject',
            showlegend: false,
            height: 1000,
            width: 1500
        };

        // -------------------------------------------------------------------------------

        // FOR BAR PLOT
        // 1. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs 
        // 2. found in that individual:
        // 3. sample_values as the values for the bar chart.
        // 4. Use otu_ids as the labels for the bar chart.
        // 5. Use otu_labels as the hovertext for the chart.

        // slice & reverse data since it's already sorted by looking at samples.json's sample_values
        var sliceValues = sampValues.slice(0, 11).reverse();
        console.log(sliceValues);
        var sliceIds = otuIds.slice(0, 11).reverse();
        console.log(sliceIds);
        var otuIDlabel = sliceIds.map(d => "OTU " + d);
        console.log(`OTU IDS: ${otuIDlabel}`);

        // define trace
        var trace = {
            x: sliceValues,
            y: otuIDlabel,
            // text: otuLables,
            name: "Test Subjects",
            orientation: "h",
            type: "bar"
        };

        // define data array and layout
        var bardata = [trace];
        var barlayout = {
            title: "Top 10 OTUs by Test Subject",
            height: 500,
            width: 500
        };

        // Render the plot to the div tag with id "bubble" 
        Plotly.newPlot("bubble", bubbledata, bubblelayout);
        Plotly.newPlot("bar", bardata, barlayout);
    });

}