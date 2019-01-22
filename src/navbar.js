const elDeleteAllGraphsBtn = document.getElementById('delete-all-graphs-btn')

export const setDeleteAllGraphsBtn = () => {
    const request = new XMLHttpRequest()
    request.open('GET', '/get-is-data-empty', false) // falseで同期通信

    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            // success!
            const isDataEmpty = JSON.parse(request.response)

            // if isDataEmpty is true, then server has no data -> Deactivate "Delete all graphs" button.
            // else, then server has data -> activate "Delete all graphs" button
            elDeleteAllGraphsBtn.disabled = isDataEmpty
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

export const activateDeleteAllGraphsBtn = () => {
    elDeleteAllGraphsBtn.disabled = false
}

export const deactivateDeleteAllGraphsBtn = () => {
    elDeleteAllGraphsBtn.disabled = true
}