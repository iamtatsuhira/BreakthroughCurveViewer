import Plotly from 'plotly.js-dist'
import {setDeleteAllGraphsBtn} from './navbar'

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
                r: 40,
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


const drawingNewGraphs = (plotlyDataTime, plotlyDataPos, idTime, idPos) => {
        
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

export const reloadingGraphs = () => {
    const request = new XMLHttpRequest()
    request.open('POST', '/get-plot-data', false) // falseで同期通信

    let graphJson
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            // success!
            graphJson = JSON.parse(JSON.parse(request.response))
            const dataTimeVsVarList = graphJson[0]
            const dataPosVsVarList = graphJson[1]

            if (dataTimeVsVarList.length === dataPosVsVarList.length) {
                for (let i=0;i<dataTimeVsVarList.length;i++){
                    createNewGraphDOM(dataTimeVsVarList[i], dataPosVsVarList[i])
                }
            } else {
                console.error('横軸timeのグラフと横軸positionのグラフの数が違う（おかしい！）')
            }
        }
        else {
            // We reached our target server, but it returned an error
            console.error('we reached our target server, but it returned an error!')
        }
    }
    request.onerror = () => {
        // There was a conection error of some sort
        console.error('There was a conection error of some sort')
    }

    request.send(null)
}

export const createNewGraphDOM = (plotlyDataTime, plotlyDataPos) => {
    const graphFieldDiv = document.getElementById('main-graph-field')
    const childElementNum = graphFieldDiv.childElementCount
    const idTime = 'graph-t-' + (childElementNum + 1)
    const idPos = 'graph-z-' + (childElementNum + 1)
    const idDeleteBtn = `${childElementNum}`

    const newDeleteButton = document.createElement('button')
    newDeleteButton.classList.add('delete', 'is-medium')
    newDeleteButton.setAttribute('title', "remove these graphs")
    newDeleteButton.setAttribute('name', 'delete-btn')
    newDeleteButton.setAttribute('value', idDeleteBtn)
    newDeleteButton.addEventListener('click', () => {removeGraph(idDeleteBtn)})

    const newGraphField = document.createElement('div')
    newGraphField.classList.add('graph-field')

    const newColumnsDiv = document.createElement('div')
    newColumnsDiv.classList.add('columns')

    const newColumnTDiv = document.createElement('div')
    newColumnTDiv.classList.add('column')
    const newGraphAreaTDiv = document.createElement('div')
    newGraphAreaTDiv.classList.add('graph-area')
    newGraphAreaTDiv.setAttribute('id', idTime)

    const newColumnZDiv = document.createElement('div')
    newColumnZDiv.classList.add('column')
    const newGraphAreaZDiv = document.createElement('div')
    newGraphAreaZDiv.classList.add('graph-area')
    newGraphAreaZDiv.setAttribute('id', idPos)

    graphFieldDiv.appendChild(newGraphField)
    newGraphField.appendChild(newDeleteButton)
    newGraphField.appendChild(newColumnsDiv)
    newColumnsDiv.appendChild(newColumnTDiv)
    newColumnTDiv.appendChild(newGraphAreaTDiv)
    newColumnsDiv.appendChild(newColumnZDiv)
    newColumnZDiv.appendChild(newGraphAreaZDiv)

    drawingNewGraphs(plotlyDataTime, plotlyDataPos, idTime, idPos)
}

const removeGraph = (idDeleteBtn) => {
    const id = idDeleteBtn
    const request = new XMLHttpRequest()
    request.open('POST', '/remove-datum')

    request.onload = () => {
        if(request.status >=200 && request.status < 400) {
            // Success!
            const plotlyDataList = JSON.parse(JSON.parse(request.response))

            const dataTimeVsVarList = plotlyDataList[0]
            const dataPosVsVarList = plotlyDataList[1]

            if (dataTimeVsVarList.length === dataPosVsVarList.length) {
                cleanMainGraphField()
                for (let i=0;i<dataTimeVsVarList.length;i++){
                    createNewGraphDOM(dataTimeVsVarList[i], dataPosVsVarList[i])
                }
                setDeleteAllGraphsBtn()
            } else {
                console.error('横軸timeのグラフと横軸positionのグラフの数が違う（おかしい！）')
            }
        }
        else {
            // We reached our target server, but it returned an error
            console.error('we reached our target server, but it returned an error!')
        }
    }
    request.onerror = () => {
        // There was a conection error of some sort
        console.error('There was a conection error of some sort')
    }

    request.send(id)
}

const cleanMainGraphField = () => {
    const graphFieldDiv = document.getElementById('main-graph-field')
    while (graphFieldDiv.firstChild) graphFieldDiv.removeChild(graphFieldDiv.firstChild)
}

export const removeAllGraphs = () => {
    const request = new XMLHttpRequest()
    request.open('POST', '/remove-all-data')

    request.onload = () => {
        if(request.status >=200 && request.status < 400) {
            // Success!
            cleanMainGraphField()
            setDeleteAllGraphsBtn()
        }
        else {
            // We reached our target server, but it returned an error
            console.error('we reached our target server, but it returned an error!')
        }
    }
    request.onerror = () => {
        // There was a conection error of some sort
        console.error('There was a conection error of some sort')
    }

    request.send(null)
}