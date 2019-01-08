import Plotly from 'plotly.js-dist'

class Layout {
    constructor() {
        this.icon = {
            'grid': {
                'width': 300,
                'path': 'M244.5,55.5V0h-15v55.5h-72V0h-15v55.5h-72V0h-15v55.5H0v15h55.5v72H0v15h55.5v72H0v15h55.5V300h15v-55.5h72V300h15v-55.5\
                h72V300h15v-55.5H300v-15h-55.5v-72H300v-15h-55.5v-72H300v-15H244.5z M142.5,142.5h-72v-72h72V142.5z M142.5,157.5v72h-72v-72\
                H142.5z M157.5,157.5h72v72h-72V157.5z M157.5,142.5v-72h72v72H157.5z',
                'ascent': 300,
                'descent': 0
            }
        }
        this.layout = {
            font: {
                size: 16
            },
            paper_bgcolor: 'rgba(255,255,255,0)',
            plot_bgcolor: 'rgba(255,255,255,0)',
            showlegend: false,
            xaxis: {
                title: 'XXX',
                showgrid: true,
                zeroline: false,
                showline: true,
                mirror: 'ticks',
                ticks: 'inside',
                linecolor: '#323232',
                linewidth: 1,
                rangemode: 'nonnegative',
                exponentformat: "power"
            },
            yaxis: {
                title: 'YYY',
                showgrid: true,
                zeroline: false,
                showline: true,
                mirror: 'ticks',
                ticks: 'inside',
                linecolor: '#323232',
                linewidth: 1,
                rangemode: 'nonnegative',
                exponentformat: "power"
            },
            margin: {
                l: 85,
                r: 5,
                b: 60,
                t: 30,
                pad: 0
            },
            modebar: {
                bgcolor: 'rgba(255,255,255,0)',
                color: '#2d2d2d',
                activecolor: '#2052e4'
            },
            hovermode: false,
            // c_normalized: false,
            // c_offset: false
            sliders: [{
                pad: {t: 80},
                currentvalue: {
                    xanchor: 'right',
                    prefix: 'XXX',
                    font: {
                        size: 16
                    }
                },
                steps:[]
            }]
        }

        this.customButtons = [
            {
                name: 'show/hide grid',
                icon: this.icon.grid,
                click: (gd) => {
                    const boolShowGrid = !gd.layout.xaxis.showgrid
                    const update = {
                        'xaxis.showgrid': boolShowGrid,
                        'yaxis.showgrid': boolShowGrid
                    }
                    Plotly.relayout(gd, update)
                }
            }
        ]

        this.modebarButtons = [this.customButtons,["zoom2d", "pan2d", "autoScale2d", "resetScale2d", "toImage"]]

        this.option = {
            responsive: true,
            scrollZoom: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtons: this.modebarButtons
        }
    }
    setTitle(title) {
        this.layout.xaxis.title = title
    }

    setSliderSteps(prefix, plotData) {
        this.layout.sliders[0].currentvalue.prefix = prefix

        const visibleArray = []
        for (const i of plotData){
            visibleArray.push(false)
        }

        let i = 0
        const steps = []
        for (const datum of plotData){
            const step = {
                label: datum.name,
                method: 'restyle',
                value: "",
                args: ['visible', visibleArray.slice(0, visibleArray.length)]
            }
            step.args[1][i] = true
            steps.push(step)
            i += 1
        }
        
        this.layout.sliders[0].steps = steps
    }
}

const layoutTimeGraph = new Layout()
layoutTimeGraph.setTitle('time [h]')
const layoutPosGraph = new Layout()
layoutPosGraph.setTitle('position [m]')


export const drawingNewGraphs = (plotlyDataTime, plotlyDataPos, idTime, idPos) => {
        
    const dataListTime = []    
    for (const datum of plotlyDataTime) {
        dataListTime.push(datum)
    }
    dataListTime[0].visible = true // 最初の一つだけ見えるようにしておく
    layoutTimeGraph.setSliderSteps('position [m] = ', plotlyDataTime)

    const dataListPos = []
    for (const datum of plotlyDataPos) {
        dataListPos.push(datum)
    }
    dataListPos[0].visible = true // 最初の一つだけ見えるようにしておく
    layoutPosGraph.setSliderSteps('time [h] = ', plotlyDataPos)

    Plotly.react(idTime, dataListTime, layoutTimeGraph.layout, layoutTimeGraph.option)
    Plotly.react(idPos, dataListPos, layoutPosGraph.layout, layoutPosGraph.option)
    
}