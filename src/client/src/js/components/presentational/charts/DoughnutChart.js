import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';

var randomColor = require('randomcolor');

export function DoughnutChart(props) {
    let data = {
        datasets: [{
            backgroundColor: [],
            hoverBackgroundColor: []
        }]
    };

    let options = {
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    let total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    let currentValue = dataset.data[tooltipItem.index];
                    let percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                    return percentage + "%";
                }
            }
        }
    }

    data.labels = props.dataLabels;
    data.datasets[0].data = props.dataPoints;

    for (let i = 0; i < props.dataLabels.length; i++) {
        data.datasets[0].backgroundColor.push(randomColor());
        data.datasets[0].hoverBackgroundColor.push(randomColor());
    }

    return (
        <Doughnut data={data} options={options}/>
    );
}