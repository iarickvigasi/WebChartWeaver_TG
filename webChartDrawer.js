import { ChartJSNodeCanvas} from 'chartjs-node-canvas'

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
                backgroundColor: "#02B5B8",
                borderColor: "#02B5B8",
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
                    suggestedMin: 0,
                    suggestedMax: 12
                }
            },
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

export {
    weaveRadarChart
}