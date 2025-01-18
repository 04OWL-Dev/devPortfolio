// Función para obtener los colores del gráfico desde los atributos data
function getChartColorsArray(e) {
    if (document.getElementById(e) !== null) {
        var r = document.getElementById(e).getAttribute("data-colors");
        return (r = JSON.parse(r)).map(function(e) {
            var r = e.replace(" ", "");
            if (r.indexOf(",") === -1) {
                var t = getComputedStyle(document.documentElement).getPropertyValue(r);
                return t || r;
            }
            var a = e.split(",");
            return a.length !== 2 ? r : "rgba(" + getComputedStyle(document.documentElement).getPropertyValue(a[0]) + "," + a[1] + ")";
        });
    }
}

/* // Configuración y renderización del gráfico de líneas pequeño (mini-1)
var chartBarColors = getChartColorsArray("mini-1");
var options = {
    series: [{ data: [2, 36, 22, 30, 12, 50] }],
    chart: { type: "line", width: 180, height: 55, sparkline: { enabled: true } },
    colors: chartBarColors,
    stroke: { curve: "smooth", width: 2.5 },
    tooltip: {
        fixed: { enabled: false },
        x: { show: false },
        y: { title: { formatter: function(e) { return ""; } } },
        marker: { show: false }
    }
};
var chart = new ApexCharts(document.querySelector("#mini-1"), options);
chart.render(); */

// Configuración y renderización del gráfico de área
options = {
    chart: { height: 159, type: "area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    series: [{ name: "Previous", data: [55, 36, 61, 40, 58] }],
    colors: chartBarColors = getChartColorsArray("chart-area"),
    legend: { show: false },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100]
        }
    },
    yaxis: { show: false },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] }
};
chart = new ApexCharts(document.querySelector("#chart-area"), options);
chart.render();

/* // Configuración y renderización del gráfico de barras (column_chart)
options = {
    chart: { height: 410, type: "bar", toolbar: { show: false } },
    plotOptions: {
        bar: { borderRadius: 3, horizontal: false, columnWidth: "64%", endingShape: "rounded" }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    series: [
        { name: "Net Profit", data: [45, 40, 73, 60, 51, 37, 30] },
        { name: "Revenue", data: [75, 40, 53, 44, 37, 26, 23] }
    ],
    colors: chartBarColors = getChartColorsArray("column_chart"),
    xaxis: { categories: ["Januaryyyy", "Feb", "Mar", "Apr", "May", "June", "July"] },
    grid: { borderColor: "#f1f1f1" },
    fill: { opacity: 1 },
    legend: { show: false },
    tooltip: { y: { formatter: function(e) { return "$ " + e + " thousands"; } } }
};
chart = new ApexCharts(document.querySelector("#column_chart"), options);
chart.render(); */

// Configuración y renderización del gráfico de dona (chart-donut)
options = {
    chart: { height: 287, type: "donut" },
    plotOptions: { pie: { donut: { size: "75%" } } },
    dataLabels: { enabled: false },
    series: [60, 15, 8],
    labels: ["Completed", "Processing", "Cancel"],
    colors: chartBarColors = getChartColorsArray("chart-donut"),
    legend: { show: false }
};
chart = new ApexCharts(document.querySelector("#chart-donut"), options);
chart.render();

// Configuración y renderización de los gráficos de línea (sparkline)
var sparklineOptions = [
    {
        element: "#chart-sparkline1",
        data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54, 84]
    },
    {
        element: "#chart-sparkline2",
        data: [50, 15, 35, 62, 23, 56, 44, 12, 36, 9, 54, 23]
    },
    {
        element: "#chart-sparkline3",
        data: [25, 35, 35, 89, 63, 25, 44, 12, 36, 9, 54, 25]
    },
    {
        element: "#chart-sparkline4",
        data: [50, 15, 35, 34, 23, 56, 65, 41, 36, 41, 32, 25]
    },
    {
        element: "#chart-sparkline5",
        data: [45, 53, 24, 89, 63, 60, 36, 50, 36, 32, 54, 63]
    }
];

sparklineOptions.forEach(function(spark) {
    var sparkOptions = {
        series: [{ data: spark.data }],
        chart: { type: "area", width: 120, height: 40, sparkline: { enabled: true } },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        stroke: { curve: "smooth", width: 2 },
        colors: chartBarColors = getChartColorsArray(spark.element.slice(1)),
        tooltip: {
            fixed: { enabled: false },
            x: { show: false },
            y: { title: { formatter: function(e) { return ""; } } },
            marker: { show: false }
        }
    };
    var sparklineChart = new ApexCharts(document.querySelector(spark.element), sparkOptions);
    sparklineChart.render();
});

// Configuración y renderización del gráfico de barras horizontales (sales-countries)
options = {
    series: [{ data: [1040, 1320, 1560, 1280, 1480] }],
    chart: { type: "bar", height: 234, toolbar: { show: false } },
    labels: ["Canada", "Russia", "Brazil", "United States", "Egypt"],
    colors: ["#776acf"],
    plotOptions: { bar: { borderRadius: 3, horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Canada", "Russia", "Brazil", "US", "Egypt"] }
};
chart = new ApexCharts(document.querySelector("#sales-countries"), options);
chart.render();

// Configuración y renderización del mapa con marcadores (world-map-markers)
var map = new jsVectorMap({
    map: "world_merc",
    selector: "#world-map-markers",
    zoomOnScroll: false,
    zoomButtons: false,
    opacity: 1,
    regionStyle: { initial: { fill: "#f0f2f3" } },
    markerStyle: {
        initial: { fill: "#3cbf87" },
        selected: { fill: "#3cbf87" }
    },
    markers: [
        { name: "Canada", coords: [56.1304, -106.3468] },
        { name: "Brazil", coords: [-14.235, -51.9253] },
        { name: "Egypt", coords: [26.8206, 30.8025] },
        { name: "Russia", coords: [61, 105] },
        { name: "United States", coords: [37.0902, -95.7129] }
    ],
    lines: [
        { from: "Canada", to: "Egypt" },
        { from: "Russia", to: "Egypt" },
        { from: "Brazil", to: "Egypt" },
        { from: "United States", to: "Egypt" }
    ],
    lineStyle: { animation: true, strokeDasharray: "6 3 6" }
});

// Configuración y renderización del slider (swiper-container)
var swiper = new Swiper(".swiper-container", {
    spaceBetween: 10,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    breakpoints: {
        576: { slidesPerView: 1, spaceBetween: 30 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1500: { slidesPerView: 2, spaceBetween: 30 }
    }
});
