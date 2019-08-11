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
    spinspan.classList.add('spinner-grow');
    spinspan.classList.add('ml-3');
    var btnz = document.getElementById('btnz');
    btnz.innerText = 'Submit';
    var btnone = document.getElementById('btnone');
    btnone.innerText = 'Submit';
    let btntwo = document.getElementById('btntwo');
    btntwo.innerText = 'Submit';
    let btnthree = document.getElementById('btnthree');
    btnthree.innerText = 'Click Here';

    /* 1. COUNTRY POPULATIONS */

    // FORM-ONE SUBMIT EVENT
    const formz = document.getElementById('formz');
    const c1id = document.getElementById("countriesOne");

    formz.addEventListener("submit", function (event) {

        const ulOne = document.getElementsByClassName("list-group-one")[0];

        // Add Loading spinner to button
        btnz.innerText = 'Loading...';
        btnz.appendChild(spinspan);
        btnz.classList.add('disabled');

        // Change label text
        document.getElementById('countriesOnelbl').innerText = 'Country';

        // Remove list items
        while (ulOne.firstChild) {
            ulOne.removeChild(ulOne.firstChild);
        }



        // Get Value from select option
        var cz = c1id.value;

        // If both select inputs aren't given a value
        if (cz == 'Choose a Country') {

            bootbox.alert("Please select a country!", function (result) {
                // window.location.reload();
                // enable sumit button
                btnz.innerText = 'submit';
                btnz.classList.remove('disabled');

            });
        }

        const urlz = `http://54.72.28.201:80/1.0/population/${cz}/${today}?format=json`;
        // Get data for Population Totals
        fetch(urlz)
            .then(response => response.json())
            .then(data => {
                for (let i of Object.keys(data)) {
                    let populationOne = data.total_population.population;
                    populationOne = populationOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let liOne = document.createElement("li");
                    ulOne.appendChild(liOne);
                    liOne.classList.add("list-group-item");
                    let c1f = cz.split("%20").join(" ");
                    liOne.appendChild(document.createTextNode(`Total Population of ${c1f} is ${populationOne}`));
                    // enable sumit button
                    btnz.innerText = 'submit';
                    btnz.classList.remove('disabled');
                }


            })
            .catch(error => console.log('Please Select a Country'));
        event.preventDefault();
    });

    /* Yearly Populations by Country and Age */

    document.getElementById("currentyear").appendChild(document.createTextNode(yyyy)); // Add current year to subtitle


    // Submit formone onsubmit
    const formone = document.getElementById('formone');
    formone.addEventListener("submit", function (event) {
        var pieCharts = document.getElementById('pieCharts')
        while (pieCharts.firstChild) {
            pieCharts.removeChild(pieCharts.firstChild);
        }

        // Add Loading spinner to button
        btnone.innerText = 'Please Wait ...';
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
        if (country == 'Country' || age == 'Age in Years') {

            bootbox.confirm("Please select both a country and an age!", function (result) {
                window.location.reload();
            });
        }

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


                                // Create div elements for each pie chart
                                var newDiv = document.createElement("div");

                                // Add the newly created div elements with an id into the DOM 
                                newDiv.setAttribute("id", 'piechart-' + k);
                                pieCharts.appendChild(newDiv);


                                function renderpiecharts(piearray, pieyear, country) {

                                    let id = 'piechart-' + k;
                                    google.charts.load('current', { 'packages': ['corechart'] });
                                    google.charts.setOnLoadCallback(drawChart);

                                    function drawChart() {

                                        var data = google.visualization.arrayToDataTable(piearray);

                                        var options = {
                                            title: country + ' ' + pieyear,
                                            is3D: true,
                                            sliceVisibilityThreshold: .2
                                        };

                                        var chart = new google.visualization.PieChart(document.getElementById(id));

                                        chart.draw(data, options);

                                        // enable sumit button
                                        btnone.innerText = 'submit';
                                        btnone.classList.remove('disabled');
                                    }
                                }
                                renderpiecharts(piearray, pieyear, country);

                            }

                        }


                    }

                })
                .catch(error => console.log('Form did not submit!'));
        }

        event.preventDefault();

    });

    /* Life Expectancies */


    /* submit form two onsubmit */
    const formtwo = document.getElementById('formtwo');
    formtwo.addEventListener("submit", function (event) {

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

    // Header Info 
    var headertwo = ['Country', 'Population'];

    /* submit form three onsubmit */
    const formthree = document.getElementById('formthree');
    formthree.addEventListener("submit", function (event) {


        // Add Loading spinner to button
        btnthree.innerText = 'Please Wait ...';
        btnthree.appendChild(spinspan);
        btnthree.classList.add('disabled');

        var countriesarray = [];
        var dataArray = [];
        let i;
        for (i = 0; i < countries.length; i++) {
            countriesarray.push(countries.options[i].value);
        }
        countriesarray.splice(0, 2);

        countriesarray.forEach(country => {
            country = country;
            const url2 = `http://54.72.28.201:80/1.0/population/${country}/${today}?format=json`;
            fetch(url2)
                .then(response => response.json())
                .then(data => {
                    for (let i of Object.keys(data)) {
                        var countryarray = [];
                        countryarray.push(country.split("%20").join(" "));
                        countryarray.push(data.total_population.population);
                        dataArray.push(countryarray);

                        let countrieslength = countries.length - 2;
                        let datalength = dataArray.length;

                        if (countrieslength == datalength) {

                            // Renable submit button
                            btnthree.innerText = 'submit';
                            btnthree.classList.remove('disabled');

                            // Remove Regions from dataArray
                            var indexRemove;
                            function findIndex(item) {
                                for (let i = 0; i < dataArray.length; i++) {
                                    for (let j = 0; j < 2; j++) {
                                        if (dataArray[i][j] === item) {
                                            indexRemove = i;
                                            dataArray.splice(indexRemove, 1);
                                        }
                                    }
                                }
                            }
                            findIndex('World');
                            findIndex('South America');
                            findIndex('Sub-Saharan Africa');

                            // Create new charts div elements
                            function newchartdivs(x) {
                                var newbarDiv = document.createElement('div');
                                var newhistoDiv = document.createElement('div');
                                newbarDiv.setAttribute("id", 'barchart-' + x);
                                document.getElementById('chartdata').appendChild(newbarDiv);
                                newbarDiv.classList.add('barchart');
                                newhistoDiv.setAttribute("id", 'histochart-' + x);
                                document.getElementById('chartdata').appendChild(newhistoDiv);
                                newhistoDiv.classList.add('histogram');
                            }



                            // Take sliced arrays from dataArray and render charts
                            var dataArrayLength = dataArray.length;

                            // Create arrays from slicing dataArray
                            for (var x = 0; x < dataArrayLength; x++) {
                                if (x == 10) {
                                    let da1 = dataArray.slice(0, x);
                                    da1.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da1, x);
                                    renderhistogram(da1, x);

                                }
                                if (x == 20) {
                                    let da2 = dataArray.slice(11, x);
                                    da2.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da2, x);
                                    renderhistogram(da2, x)
                                }
                                if (x == 30) {
                                    let da3 = dataArray.slice(21, x);
                                    da3.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da3, x);
                                    renderhistogram(da3, x)
                                }
                                if (x == 40) {
                                    let da4 = dataArray.slice(31, x);
                                    da4.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da4, x);
                                    renderhistogram(da4, x)
                                }
                                if (x == 50) {
                                    let da5 = dataArray.slice(41, x);
                                    da5.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da5, x);
                                    renderhistogram(da5, x)
                                }
                                if (x == 60) {
                                    let da6 = dataArray.slice(51, x);
                                    da6.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da6, x);
                                    renderhistogram(da6, x)
                                }
                                if (x == 70) {
                                    let da7 = dataArray.slice(61, x);
                                    da7.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da7, x);
                                    renderhistogram(da7, x)

                                }
                                if (x == 80) {
                                    let da8 = dataArray.slice(71, x);
                                    da8.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da8, x);
                                    renderhistogram(da8, x)

                                }
                                if (x == 90) {
                                    let da9 = dataArray.slice(81, x);
                                    da9.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da9, x);
                                    renderhistogram(da9, x)
                                }
                                if (x == 100) {
                                    let da10 = dataArray.slice(91, x);
                                    da10.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da10, x);
                                    renderhistogram(da10, x)

                                }
                                if (x == 110) {
                                    let da11 = dataArray.slice(101, x);
                                    da11.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da11, x);
                                    renderhistogram(da11, x)

                                }
                                if (x == 120) {
                                    let da12 = dataArray.slice(111, x);
                                    da12.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da12, x);
                                    renderhistogram(da12, x)

                                }
                                if (x == 130) {
                                    let da13 = dataArray.slice(121, x);
                                    da13.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da13, x);
                                    renderhistogram(da13, x)

                                }
                                if (x == 140) {
                                    let da14 = dataArray.slice(131, x);
                                    da14.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da14, x);
                                    renderhistogram(da14, x)

                                }
                                if (x == 150) {
                                    let da15 = dataArray.slice(141, x);
                                    da15.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da15, x);
                                    renderhistogram(da15, x)

                                }
                                if (x == 160) {
                                    let da16 = dataArray.slice(151, x);
                                    da16.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da16, x);
                                    renderhistogram(da16, x)

                                }
                                if (x == 170) {
                                    let da17 = dataArray.slice(161, x);
                                    da17.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da17, x);
                                    renderhistogram(da17, x)

                                }
                                if (x == 180) {
                                    let da18 = dataArray.slice(171, x);
                                    da18.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da18, x);
                                    renderhistogram(da18, x)

                                }
                                if (x == 190) {
                                    let da19 = dataArray.slice(181, x);
                                    da19.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da19, x);
                                    renderhistogram(da19, x)

                                }
                                if (x == 200) {
                                    let da20 = dataArray.slice(191, x);
                                    da20.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da20, x);
                                    renderhistogram(da20, x)

                                }
                                if (x == dataArrayLength - 1) {
                                    let da21 = dataArray.slice(201, dataArrayLength);
                                    da21.unshift(headertwo);
                                    newchartdivs(x);
                                    rendercharts(da21, x);
                                    renderhistogram(da21, x);

                                }
                            }

                            function rendercharts(da, x) {
                                // Google Charts - Bar Chart
                                google.charts.load('current', { packages: ['corechart', 'bar'] });
                                google.charts.setOnLoadCallback(drawBasic);

                                function drawBasic() {
                                    var data = google.visualization.arrayToDataTable(da);

                                    var options = {
                                        title: "Population of Countires",
                                        chartArea: { width: '100%' },
                                        hAxis: {
                                            title: 'Total Population',
                                            minValue: 0
                                        },
                                        vAxis: {
                                            title: 'Country'
                                        }
                                    };

                                    var chart = new google.visualization.BarChart(document.getElementById('barchart-' + x));

                                    chart.draw(data, options);
                                }

                            }

                            function renderhistogram(da, x) {

                                // Google charts - Histograms

                                google.charts.load("current", { packages: ["corechart"] });
                                google.charts.setOnLoadCallback(drawChart);
                                function drawChart() {
                                    var data = google.visualization.arrayToDataTable(da);

                                    var options = {
                                        title: "Population of Countires",
                                        legend: { position: 'none' },
                                    };

                                    var chart = new google.visualization.Histogram(document.getElementById('histochart-' + x));
                                    chart.draw(data, options);
                                }
                            }
                        }

                    }
                })
                .catch(error => alert('Please Select a Country'));
        });

        event.preventDefault();
    });

} // winow.onload


