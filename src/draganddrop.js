import {createNewGraphDOM} from './graph'
import {setDeleteAllGraphsBtn} from './navbar'
const maxFileSize = 1 * 1024 * 1024
const elDrop = document.getElementById('dropzone')

elDrop.addEventListener('dragover', (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    showDropping()
})

elDrop.addEventListener('dragleave', () => {
    hideDropping()
})

elDrop.addEventListener('drop', (event) => {
    event.stopPropagation()
    event.preventDefault()
    hideDropping()

    const files = event.dataTransfer.files;
    handleDrop(files)
})

const showDropping = () => {
    elDrop.classList.add('dropover')
}

const hideDropping = () => {
    elDrop.classList.remove('dropover')
}

const handleDrop = (files) => {

    let acceptedFileList = checkFileSize(files)
    acceptedFileList = checkFileType(acceptedFileList)

    upload_to_server(acceptedFileList)
}

const checkFileSize = (files) => {
    const acceptedFileList = []
    for (const file of files){
        if (file.size >= maxFileSize){
            alertFileSize(file)
            continue;
        } else {
            acceptedFileList.push(file)
        }
    }
    return acceptedFileList
}

const checkFileType = (files) => {
    const acceptedFileList = []
    for (const file of files){
        var type = file.type
        if (type !== 'text/plain' && type !== ''){ // .dat has no type ('')
            alertFileType(file)
            continue;
        } else {
            acceptedFileList.push(file)
        }
    }
    return acceptedFileList
}


const upload_to_server = (files) => {
    
    const request = new XMLHttpRequest()
    request.open('POST', '/add-data')

    var fd = new FormData();
    // add files to FormData
    let i = 0
    for (const file of files){
        let dataKey = 'datafile' + (i+1)
        fd.append(dataKey, file)
        i += 1
    }

    request.onload = () => {
        if(request.status >=200 && request.status < 400) {
            // Success!
            const plotlyDataList = JSON.parse(JSON.parse(request.response))

            const dataTimeVsVarList = plotlyDataList[0]
            const dataPosVsVarList = plotlyDataList[1]

            if (dataTimeVsVarList.length === dataPosVsVarList.length) {
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

    request.send(fd)

}

const alertFileType = (file) => {
    const fileName = file.name
    alert('Cannot upload! ("' + fileName + '" is not text/plain type)')
}

const alertFileSize = (file) => {
    const fileName = file.name
    alert('Cannot upload! (The file size of "' + fileName + '" is greater than the limited value (' + maxFileSize/(1024*1024) + ') MB)')
}