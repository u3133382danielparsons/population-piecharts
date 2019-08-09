/* 
    Author: Daniel Parsons
    Email: danielmparsons@gmail.com
*/

window.onload = function () {

    /* GLOBALS */

    // Get and format today's date

    const d = new Date();
    const yyyy = d.getFullYear(); // Current Year
    // let mm = d.getMonth() + 1;  // Current Month
    // let dd = d.getDate(); // Current Day of the month
    // if (dd < 10) { dd = `0${dd}`; }
    // if (mm < 10) { mm = `0${mm}`; }
    // const today = `${yyyy}-${mm}-${dd}`;

    /* Yearly Populations by Country and Age */

    let btnpies = document.getElementById('btnpies');
    btnpies.innerText = 'submit';

    document.getElementById("currentyear").appendChild(document.createTextNode(yyyy)); // Add current year to subtitle


    // Submit form onsubmit
    const form = document.getElementById('form');
    form.addEventListener("submit", function (event) {
        console.log('form');
        // Loading spinner
        //         <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        //   Loading...


        btnpies.innerText = 'Loading . . .';
        btnpies.classList.add('disabled');

        // Input fields
        const countries = document.getElementById("countries");
        const ages = document.getElementById("ages");

        // Value containers
        let country = countries.value;
        let age = ages.value;

        // // Change label text
        // // Change label text
        document.getElementById('countrieslbl').innerText = 'Country';
        document.getElementById('ageslbl').innerText = 'Age';


        // Delete Table
        if (country == 'Country of Birth' || age == 'Age in Years') {
            bootbox.alert('Please select both a country and an age.')
        }

        var k; // Have you read Kafka?

        // Initialise arrays for pie charts
        var piedata = [];
        var datayear = [];
        var females = [];
        var males = [];
        var totals = [];
        var header = ['gender', 'population'];

        // variables in for loop
        let years = yyyy - 1949;
        let y4 = yyyy;

        // Loop through each year from 1950 to the present year (population.io data begins at 1950)...
        for (y4; y4 >= 1950; y4--) {

            // fetch yearly populations for any given country from the population.io api.
            const url4 = `http://54.72.28.201:80/1.0/population/${y4}/${country}/${age}/?format=json`;
            fetch(url4)
                .then(response => response.json())

                .then(data => {
                    for (let i of Object.keys(data)) {
                        females.push(data[i].females);
                        males.push(data[i].males);
                        totals.push(data[i].total);
                        datayear.push(data[i].year);

                        // console.log(JSON.stringify(data));
                        /* The amount of values in the females and male arrays 
                           are equal to the number of years in the api data */
                        if (females.length == years && males.length == years) {

                            for (k = 0; k <= years - 1; k++) {

                                // Create the array for each year to be passed to each chart
                                piedata[k] = [].concat([header], [['females', females[k]]], [['males', males[k]]]);
                                var piearray = piedata[k];

                                var pieyear = datayear[k];

                                var listtotal = totals[k];
                                console.log(listtotal);


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
                                        btnpies.innerText = 'submit';
                                        btnpies.classList.remove('disabled');
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

    /* Population Totals - All Countries */

    let btnhbars = document.getElementById('btnhbars');
    btnhbars.innerText('Click Here');
    /* submit form two onsubmit */
    const formtwo = document.getElementById('formtwo');
    formtwo.addEventListener("submit", function (event) {
        console.log('formtwo');



        event.preventDefault();
    });

} // winow.onload


