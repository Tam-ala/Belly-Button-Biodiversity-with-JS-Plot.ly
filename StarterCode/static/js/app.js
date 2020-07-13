// this is correct!!
d3.json("samples.json").then(function (data) {
    console.log(data)
 
});

// IS THIS NEEDED????
// submit dropdown handler
function handleSubmit() {
    // Prevent the page from refreshing
    // it’s a built-in function
    d3.event.preventDefault();

    // Select the dropdown value from the form
    var stock = d3.select("#selDataset").node().value; //value is a built-in...something
    console.log(stock);

    // clear the dropdown value
    d3.select("#sample-metadata").node().value = ""; // dblquotes with nothing inside clears everything

    // Build the plot with the new test subject
    buildBar(stock);
}


// FOR METADATA
// Display the sample metadata, i.e., an individual's demographic information.
// Display each key-value pair from the metadata JSON object somewhere on the page.

d3.json("samples.json").then(function (metadata) {
    var metadata = metadata.metadata
    // var sampValues = data.samples[0].sample_values;
    // var otuIds = data.samples[0].otu_ids;
    // var otuLables = data.samples[0].otu_lables;

    // create dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    var data = d3.select("#sample-metadata")
    data.html("")

    // THIS SHOWS KEY, VALUE AS [object, Object] in dropdown
    // Object.entries(metadata).forEach(([key, value]) => {
    //     console.log(key, value)
    // })

    // THIS SHOWS THE SAME ISSUE BUT NOW IN THE PANEL SECTION...ALL OF THEM
    Object.entries(metadata).forEach(function ([key, value]) {
        var row = data.append("p");
        row.text(`${key} : ${value}`)
        console.log(key, value) //THIS SHOWS THE INFO NEEDED INSIDE THE DEMOGRAPHICS PANEL
    })

    // // THIS SHOWS KEY, VALUE AS [object, Object] in dropdown
    // Object.keys(metadata).forEach((key) => {
    //     console.log(key)
    // })
    // use select.append to add options w/text and value
    dropdownMenu.selectAll("option")
        .data(metadata)
        .enter()
        .append("option")
        .text(function (info) {
            return info;
        })
})

//FOR BAR CHART
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs 
// found in that individual:
// sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.
function buildBar() {
    d3.json("samples.json").then((data) => {

        var sampValues = data.samples.sample_values;
        var otuIds = data.samples[0].otu_ids;
        var otuLables = data.samples[0].otu_lables;

        // get top 10 with sort, slice
        data.sort((a, b) => b.sample_values - a.sample_values);
        // console.log(sortData)
        data = data.slice(0, 10);
        console.log(data);

        // use reverse to flip the chart so that the highest value at the top of the hbar chart
        data = data.reverse();

        // create barchart
        var trace = {
            x: sampValues,
            y: otuIds,
            text: otuLables,
            name: "Test Subjects",
            orientation: "h",
            type: "bar"
        };

        // data array
        var data = [trace];

        // Apply the group bar mode to the layout
        var layout = {
            title: "Test Subject Data",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "bar"   
        Plotly.newPlot("bar", data, layout);

    });
}
buildBar();

// BUBBLE CHART ---- IT WORKS...MARKERS ARE THE SAME SIZE THOUGH...
// Create a bubble chart that displays each sample:
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.
function buildBubble() {
    d3.json("samples.json").then((data) => {

        var sampValues = data.samples.sample_values;
        var otuIds = data.samples[0].otu_ids;
        var otuLables = data.samples[0].otu_lables;

        var trace = {
            x: otuIds,
            y: sampValues,
            text: otuLables,
            mode: 'markers',
            name: "OTU_ID",
            marker: {
                color: otuIds,
                size: sampValues
            }
        };

        //  data & layout
        var data = [trace];

        var layout = {
            title: 'Test Subject and Bacteria Samples',
            showlegend: false,
            height: 1000,
            width: 1500
        };

        // Render the plot to the div tag with id "bubble" 
        Plotly.newPlot("bubble", data, layout);
    });

}

buildBubble();


// FOR NEW DATA
// Update all of the plots any time that a new sample is selected.
d3.selectAll("#selDataset").on("change", optionChanged);



// }

// init(); //for when everything is done