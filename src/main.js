import { init } from './game.js'

// window.addEventListener("load", init, false)
let botao = document.querySelector("#start")
botao.addEventListener('click', init,false)