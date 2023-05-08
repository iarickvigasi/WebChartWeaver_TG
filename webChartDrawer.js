import { ChartJSNodeCanvas } from 'chartjs-node-canvas'


const capitalizeLabels = (labels) => {
    return labels.map(label => label.charAt(0).toUpperCase() + label.slice(1))
}

const valuesToInt = (values) => {
    return values.map(value => parseInt(value))
}

async function weaveRadarChart(data, name) {
    const width = 800
    const height = 800

    const labels = capitalizeLabels(Object.keys(data))
    const values = valuesToInt(Object.values(data))

    const configuration = {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: name,
                data: values,
                backgroundColor: "rgba(2, 181, 184, 0.33)",
                borderColor: "rgba(2, 181, 184, 0.33)",
                borderWidth: 1
            }]
        },
        options: {
            layout: {
                padding: 20
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    pointLabels: {
                        font: {
                            size: 16
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 12
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 24
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'background-colour',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        }]
    }

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.responsive = true;
        ChartJS.defaults.maintainAspectRatio = false;
    }

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback })

    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration)

    return buffer
}

async function weaveDoubleRadarChart(data1, name1, data2, name2) {
    const width = 800;
    const height = 800;

    const labels = capitalizeLabels(Object.keys(data1));
    const values1 = valuesToInt(Object.values(data1));
    const values2 = valuesToInt(Object.values(data2));

    const configuration = {
        type: 'radar',
        data: {
            labels,
            datasets: [
                {
                    label: name2,
                    data: values2,
                    backgroundColor: "rgba(204, 72, 67, 0.33)",
                    borderColor: "rgba(204, 72, 67, 0.33)",
                    borderWidth: 1,
                },
                {
                    label: name1,
                    data: values1,
                    backgroundColor: "rgba(2, 181, 184, 0.33)",
                    borderColor: "rgba(2, 181, 184, 0.33)",
                    borderWidth: 1,
                },
            ]
        },
        options: {
            layout: {
                padding: 20
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    pointLabels: {
                        font: {
                            size: 16
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 12
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 24
                        },
                        filter: (legendItem, chartData) => {
                            return legendItem.datasetIndex === 1;
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'background-colour',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
            }
        }]
    };

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.responsive = true;
        ChartJS.defaults.maintainAspectRatio = false;
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return buffer;
}

export {
    weaveRadarChart,
    weaveDoubleRadarChart
}