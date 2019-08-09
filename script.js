window.onload = function () {

    /* GLOBALS */

    // Get and format today's date
    // function currentdate() {

    // }
    const d = new Date();
    const yyyy = d.getFullYear(); // Current Year
    let mm = d.getMonth() + 1;  // Current Month
    let dd = d.getDate(); // Current Day of the month
    if (dd < 10) { dd = `0${dd}`; }
    if (mm < 10) { mm = `0${mm}`; }
    const today = `${yyyy}-${mm}-${dd}`;
    // Submit form onsubmit
    const form = document.getElementById('form');
    form.addEventListener("submit", function (event) {
        console.log('form');

        // Input fields
        const countries = document.getElementById("countries");
        const ages = document.getElementById("ages");

        let country = countries.value;
        let age = ages.value;

        // Delete Table
        if (country == 'Country of Birth' || age == 'Age in Years') {
            bootbox.alert('Please select both a country and an age.')
        }
        var k;
        // Initialise arrays for pie charts
        var piedata = [];
        var datayear = [];
        var females = [];
        var males = [];
        var header = ['gender', 'population'];
        // piedata.push(header);
        let years = yyyy - 1949;
        let y4 = yyyy;
        // let arrlen = (yyyy - 1949) * 2;

        for (y4; y4 >= 1950; y4--) {

            const url4 = `http://54.72.28.201:80/1.0/population/${y4}/${country}/${age}/?format=json`;
            fetch(url4)
                .then(response => response.json())

                .then(data => {
                    for (let i of Object.keys(data)) {
                        females.push(data[i].females);
                        males.push(data[i].males);
                        datayear.push(data[i].year);

                        console.log(JSON.stringify(data));
                        /* The amount of values in the females and male arrays 
                           are equal to the number of years in the api data */
                        if (females.length == years && males.length == years) {

                            for (k = 0; k <= years - 1; k++) {

                                // Create the array for each year to be passed to each chart
                                piedata[k] = [].concat([header], [['females', females[k]]], [['males', males[k]]]);
                                var piearray = piedata[k];

                                var pieyear = datayear[k];


                                // Create div elements for each pie chart
                                var newDiv = document.createElement("div");

                                // Add the newly created div elements with an id into the DOM 
                                newDiv.setAttribute("id", 'piechart-' + k);
                                document.getElementById('pie-charts').appendChild(newDiv);


                                function renderpiecharts(piearray, pieyear) {

                                    let id = 'piechart-' + k;
                                    console.log(pieyear);
                                    google.charts.load('current', { 'packages': ['corechart'] });
                                    google.charts.setOnLoadCallback(drawChart);

                                    function drawChart() {

                                        var data = google.visualization.arrayToDataTable(piearray);

                                        var options = {
                                            title: pieyear,
                                            is3D: true,
                                            sliceVisibilityThreshold: .2
                                        };

                                        var chart = new google.visualization.PieChart(document.getElementById(id));

                                        chart.draw(data, options);
                                    }
                                }
                                console.log(JSON.stringify(piearray));
                                renderpiecharts(piearray, pieyear);


                            }

                        }


                    }

                })
                .catch(error => console.log('There is an error in the code, again!'));
        }

        event.preventDefault();

    });

} // winow.onload


