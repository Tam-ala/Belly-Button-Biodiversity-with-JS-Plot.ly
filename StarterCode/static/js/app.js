// look at the data
var sampData = d3.json("samples.json").then((data) => {
    console.log(data)

});


// initializ page
function inti() {
    d3.json("samples.json").then((data) => {
        // create dropdown menu
        var dropdownMenu = d3.select("#selDataset");

        // use select.append to add options w/text and value
        dropdownMenu.select("select")
            .selectAll("option")
            .data(data)
            .enter()
            .append("option")
            .text(function (d) {
                return d;
            });

        // function to call metadata info
        function makeMetaDataCard() {
            // metadata
            var mData = d3.select("#sample-metadata")
            // chose 1st item
            mData.data.metadata[0]
            // selectedMetadata -->append something for each
            // Object.entries to iterate over selecedMetadata
            Object.entries(metadata).forEach(function([key,value]){
                console.log(data.metadata[0])
            })
        }

        // function to call charts
        function makeCharts() {
            // build charts and metadata for the first sample aka first"name" in names array
            // bar plot
            var sampValues = data.samples[0].sample_values;
            var otuIds = data.samples[0].otu_ids;
            var otuLables = data.samples[0].otu_lables;

            // get top 10 with sort, slice
            var sortedTesters = data.sort((a, b) => b.sampValues - a.sampValues);
            slicedData = sortedTesters.slice(0, 10);

            // use reverse to flip the chart so that the highest value at the top of the hbar chart
            reversedData = slicedData.reverse();

            // create barchart
            var barChart = {
                x: reversedData.map(object => object.sampValues),
                y: reversedData.map(object => object.otuIds),
                text: reversedData.map(object => object.otuLables),
                name: "Test Subjects",
                type: "bar",
                orientation: "h"
            };

            // data
            var barData = [barChart];

            // Apply the group bar mode to the layout
            var barLayout = {
                title: "Test Subject Data",
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100
                }
            };

            // Render the plot to the div tag with id "bar"   
            Plotly.newPlot("bar", barData, barLayout);

            // create bubble chart
            var bubbleChart = {
                x: otuIds,
                y: sampValues,
                text: otuLables,
                mode: 'markers',
                marker: {
                    color: otuIds,
                    size: sampValues
                }
            };

            //  data & layout
            var bubbleData = [bubbleChart];

            var bubbleLayout = {
                title: 'Test Subject and Bacteria Samples',
                showlegend: false,
                height: 600,
                width: 600
            };

            // Render the plot to the div tag with id "bubble" 
            Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        }

    })

    // make event to change data when new subject is picked
    d3.selectAll("#selDataset").on("change", optionChanged);


    //update page with new selected subject
    function optionChanged(selectValue) {
        d3.json("samples.json").then((data) => {
            // filter data by matching id for samples to the selectValue
            // update bar chart bases on that with div id="bar" 

            Plotly.restyle("bar")
            
            // create bubble plot based on that with div id="bubble"
            Plotly.restyle("bubble")

            // filter data by matching id for metadata to the selectValue
            // build metadata based on the filter

            var mData = d3.select("#sample-metadata")
            // filtered metadata
            // selectedMetadata -->append something for each
            // Display each key-value pair from the metadata JSON object somewhere on the page: Object.entries to iterate over selecedMetadata
            Object.entries(metadata)

            // Plotly.restyle("metadata")


        })
        
        // Call function to update the chart
        updatePlotly(data);
    }
    // Update the restyled plot's values
    function updatePlotly(newdata) {
        Plotly.restyle("bar", "values", [newdata]);
        Plotly.restyle("bubble", "values", [newdata]);
        // Plotly.restyle("sample-metadata", "values", [newdata]);

    }
    // Call metadata info
    makeMetaDataCard();

}



inti();

