/* 
    Author: Daniel Parsons
    Email: danielmparsons@gmail.com
*/

window.onload = function () {

    /* GLOBALS */

    // Get and format today's date

    const d = new Date();
    const yyyy = d.getFullYear(); // Current Year
    let mm = d.getMonth() + 1;  // Current Month
    let dd = d.getDate(); // Current Day of the month
    if (dd < 10) { dd = `0${dd}`; }
    if (mm < 10) { mm = `0${mm}`; }
    const today = `${yyyy}-${mm}-${dd}`;

    // Submit buttons for forms
    const spinspan = document.createElement('span');
    spinspan.classList.add('spinner-border');
    spinspan.classList.add('spinner-border-sm');
    var btnone = document.getElementById('btnone');
    btnone.innerText = 'Submit';
    let btntwo = document.getElementById('btntwo');
    btntwo.innerText = 'Submit';
    let btnthree = document.getElementById('btnthree');
    btnthree.innerText = 'Click Here';

    /* Yearly Populations by Country and Age */



    document.getElementById("currentyear").appendChild(document.createTextNode(yyyy)); // Add current year to subtitle


    // Submit formone onsubmit
    const formone = document.getElementById('formone');
    formone.addEventListener("submit", function (event) {
        console.log('form');

        // Add Loading spinner to button
        btnone.innerText = 'Loading...';
        btnone.appendChild(spinspan);
        btnone.classList.add('disabled');

        // Input fields
        const countries = document.getElementById("countries");
        const ages = document.getElementById("ages");

        // Value containers
        let country = countries.value;
        let age = ages.value;

        // // Change label text
        document.getElementById('countrieslbl').innerText = 'Country';
        document.getElementById('ageslbl').innerText = 'Age';


        // If both select inputs aren't given a value
        if (country == 'Country of Birth' || age == 'Age in Years') {
            // if (bootbox.alert('')) { }
            // window.location.reload();

            bootbox.confirm("Please select both a country and an age!", function (result) {
                window.location.reload();
            });
        }

        // var k; // Have you read Kafka?

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
            const url1 = `http://54.72.28.201:80/1.0/population/${y4}/${country}/${age}/?format=json`;
            fetch(url1)
                .then(response => response.json())

                .then(data => {
                    for (let i of Object.keys(data)) {
                        females.push(data[i].females);
                        males.push(data[i].males);
                        totals.push(data[i].total);
                        datayear.push(data[i].year);

                        /* The amount of values in the females and male arrays 
                           are equal to the number of years in the api data */
                        if (females.length == years && males.length == years) {

                            for (let k = 0; k <= years - 1; k++) {

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
                                        btnone.innerText = 'submit';
                                        btnone.classList.remove('disabled');
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

    /* Life Expectancies */


    /* submit form two onsubmit */
    const formtwo = document.getElementById('formtwo');
    formtwo.addEventListener("submit", function (event) {
        console.log('formtwo');

        // Add Loading spinner to button
        btntwo.innerText = 'Loading...';
        btntwo.appendChild(spinspan);
        btntwo.classList.add('disabled');

        const countriestwo = document.getElementById("countriestwo");
        const agestwo = document.getElementById("agestwo");
        const monthstwo = document.getElementById("monthstwo");
        const gendertwo = document.getElementById("gendertwo");
        const ultwo = document.getElementsByClassName("list-group-two")[0];

        // Change label text
        document.getElementById('countriestwolbl').innerText = 'Country of Birth';
        document.getElementById('agestwolbl').innerText = 'Age';
        document.getElementById('monthstwolbl').innerText = 'Birth Month';
        document.getElementById('gendertwolbl').innerText = 'Gender';


        // Remove list items
        while (ultwo.firstChild) {
            ultwo.removeChild(ultwo.firstChild);
        }

        // Get Values from select option
        let c2 = countriestwo.value;
        let a2 = agestwo.value;
        let m2 = monthstwo.value;
        const ym2 = `${a2}y${m2}m`;
        let g2 = gendertwo.value;


        if (c2 == 'Country of Birth' || a2 == 'Age in Years' || m2 == 'Month of Birth' || g2 == 'Choose Gender') {
            bootbox.alert('Please provide a country, an age, a month of Birth, and a gender.');
        }

        const url2 = `http://54.72.28.201:80/1.0/life-expectancy/remaining/${g2}/${c2}/${today}/${ym2}/`;
        fetch(url2)
            .then(response => response.json())
            .then(data => {
                for (let i of Object.keys(data)) {
                    var rle = Math.round(data.remaining_life_expectancy);
                    var le = parseInt(a2) + rle;
                }
                for (let j = 0; j <= 1; j++) {
                    let litwo = document.createElement("li");
                    ultwo.appendChild(litwo);
                    litwo.classList.add("list-group-item");

                    if (j == 0) {
                        litwo.appendChild(document.createTextNode(`Life Expectancy is ${le} years.`));
                    } else {
                        litwo.appendChild(document.createTextNode(`Remaining Life Expectancy is ${rle} years.`));
                    }
                }
                if (c2 == 'Country of Birth' || a2 == 'Age in Years' || m2 == 'Month of Birth' || g2 == 'Choose Gender') {
                    console.log(ultwo.firstChild);
                    ultwo.removeChild(ultwo.firstChild);
                    ultwo.removeChild(ultwo.firstChild);
                }

                // Renable submit button
                btntwo.innerText = 'submit';
                btntwo.classList.remove('disabled');
            })
            .catch(error => bootbox.alert("Sorry, something went wrong!"));

        event.preventDefault();
    });

    /* Population Totals - All Countries */


    /* submit form three onsubmit */
    const formthree = document.getElementById('formthree');
    formthree.addEventListener("submit", function (event) {
        console.log('formthree');

        // Add Loading spinner to button
        btnthree.innerText = 'Loading...';
        btnthree.appendChild(spinspan);
        btnthree.classList.add('disabled');

        event.preventDefault();
    });

} // winow.onload


