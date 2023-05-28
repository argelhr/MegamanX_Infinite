
let keys = new Array;

function keyDownUp(element) {
    element.addEventListener('keydown', addKey)
    element.addEventListener('keyup', removeKey)
}

const hasKey = (searchKey) => keys.find(key => searchKey === key)


function addKey(event) {
    !hasKey(event.code) && keys.push(event.code)
    // console.log(keys)
}

function removeKey(event) {
    keys = keys.filter(key => key != event.code)
    // console.log(keys)
}

const getKeys = () => keys



export { keyDownUp, hasKey, getKeys }