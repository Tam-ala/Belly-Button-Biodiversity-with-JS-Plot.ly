// verify that data shows up
d3.json("../Data/samples.json").then(function (data) {
    console.log(data)
});

// define initialize function to diplay plots and metadata when webpage opens
function init() {
    d3.json("../Data/samples.json").then((data) => {
        console.log(data)

        // save select element to dropdown variable
        var dropdown = d3.select("#selDataset");

        // create for-loop to select test subject by index and then by id
        data.samples.forEach((test, index) => {
            dropdown.append("option").text(test.id).property("value",index);
        });

        // call function to display 1st test subject
        optionChanged(0);

    });

}

// define optionChanged function, include value argument to match html file
function optionChanged(value) {
    d3.json("../Data/samples.json").then(function (data) {
        console.log(data)

        // define variables for metadata & plots
        var metadata = data.metadata;
        var sampValues = data.samples[value].sample_values;
        var otuIds = data.samples[value].otu_ids;
        var otuLables = data.samples[value].otu_lables;
        var sampleinfo = d3.select("#sample-metadata");

        // -------------------------------------------------------------------------------

        // FOR METADATA
        // clear previous test subject 
        sampleinfo.html("");

        // display new test subject
        selectId = Object.entries(metadata[value]).forEach(function ([key, value]) {
            var row = sampleinfo.append("p");
            row.text(`${key} : ${value}`);
            console.log(key, value);
        });

        // -------------------------------------------------------------------------------

        // FOR BUBBLE PLOT
        //Create a bubble chart that displays each sample:
        // 1. Use otu_ids for the x values.
        // 2. Use sample_values for the y values.
        // 3. Use sample_values for the marker size.
        // 4. Use otu_ids for the marker colors.
        // 5. Use otu_labels for the text values.

        // define trace
        var bubbletrace = {
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
        var bubbledata = [bubbletrace];
        var bubblelayout = {
            title: 'Total OTUs',
            showlegend: false,
            height: 1000,
            width: 1500
        };

        // -------------------------------------------------------------------------------

        // FOR BAR PLOT
        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual:
        // 1. sample_values as the values for the bar chart.
        // 2. Use otu_ids as the labels for the bar chart.
        // 3. Use otu_labels as the hovertext for the chart.

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
            name: "Test Subjects",
            orientation: "h",
            type: "bar"
        };

        // define data array and layout
        var bardata = [trace];
        var barlayout = {
            title: "Top 10 OTUs",
            height: 500,
            width: 500
        };

        // Render the plot to the div tag with id "bubble" 
        Plotly.newPlot("bubble", bubbledata, bubblelayout);
        Plotly.newPlot("bar", bardata, barlayout);

    });

};

init();