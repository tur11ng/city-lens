import React from 'react';
import {Bar} from 'react-chartjs-2';
import 'chartjs-plugin-annotation';

export function BarChart(props) {
    let data = {
        datasets: [
            {
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
            }
        ]
    };

    data.datasets[0].label = props.datasetLabel;
    data.datasets[0].data = props.dataPoints;
    data.labels = props.dataLabels;

    let options = props.options;

    return (
        <Bar data={data} options={options}/>
    )
}