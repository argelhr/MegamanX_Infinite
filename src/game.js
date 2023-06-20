import { loadAudio, loadImage, loadVideo } from "./loadAssets"
import { getKeys, hasKey, keyDownUp } from "./keyboard"
import Hero from "./model/Hero"
import Rect from "./model/Rect"
import Enemy from "./model/Enemy"
import Image from "./model/Image"
import Projetil from "./model/Projetil"


let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')

let bgImage
let bgImage2
let bgImage3
let texto
let barra
let video
let ready
let animeReqReference


let boundaries = {
    width: canvas.width,
    height: canvas.height - 73
}

let megaman//heroi
let heart//item coletavel
let projetil // imagem do projetil da buster
let tiro // tiro
let tiros = [] // lista de tiros

let bola1, bola2, bola3, bola4//frames que aparece na morte

// sons do game
let theme
let som_buster
let som_item
let som_dano // dano no megaman
let som_dano_inimigo //dano no inimigo
let death



// lista de plataforma
let blocos = []
let plataforma1 = new Rect(0, 225, 169, 30, 'black')
let plataforma2 = new Rect(238, 143, 320, 30, 'black')
let plataforma3 = new Rect(563, 222, 137, 30, 'black')
blocos.push(plataforma1)
blocos.push(plataforma2)
blocos.push(plataforma3)


let enemyLEFT = Array.from({ length: 3 }) //inimigos que vão da direita para a esquerda <=
let enemyRIGTH = Array.from({ length: 3 })//inimigos que vão da esquerda para a direita =>
let gameover = false

const init = async () => {

    console.log('clicou')
    document.getElementById('musica').play()
    document.getElementById('home').pause()

    setTimeout(() => {
        console.log('atirando no menu')
    }, 1)
    // gambiarra pro som do tiro ficar sincronizado

    let blaster = document.getElementById('blaster')

    blaster.style.opacity = 1
    blaster.classList.add('animacao-tiro')

    document.getElementById('movendo-tiro').classList.add('movimento-tiro')

    setTimeout(() => {
        let start = document.getElementById("start")
        start.style.opacity = 0
        blaster.style.opacity = 0
        let container = document.getElementById("container")
        container.style.display = "none"
    }, 500)
    canvas.style.display = 'block'
    document.querySelector("#to_capcom").style.display = 'block'

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    console.log("Iniciando game...")


    bgImage = await loadImage('img/background3.png') //background da catarata
    // pattern = ctx.createPattern(bgImage, 'repeat') //obsoleto
    bgImage2 = await loadImage('img/background2.png') //background de onde o megaman anda
    projetil = await loadImage('img/buster.png') //carregando a imagem do tiro
    barra = await loadImage('img/vida.png')

    // sons do jogo
    theme = await loadAudio('audio/fase.mp3')
    theme.volume = .5

    som_dano = await loadAudio('audio/dano_megaman.mp3')
    som_buster = await loadAudio('audio/buster.mp3')

    som_dano_inimigo = await loadAudio('audio/explosion_old.mp3')
    som_dano_inimigo.volume = .3
    death = await loadAudio('audio/death.mp3')
    som_item = await loadAudio('audio/heart.mp3')

    video = await loadVideo('video/back.mp4') //backgound em video da catarata

    //instanciando os personagens e item
    megaman = new Hero(canvas.width / 2, canvas.height, 25, 10, 38, 38, 'img/X.png')
    heart = new Image(100, 243, 15, 0, 'red', 'img/item.png', 3, 30, 15, 16)


    ready = new Image(canvas.width / 2 + 40, canvas.height / 2 - 50, 0, 3, 'red', 'img/ready.png', 14, 60, 40, 14)
    bola1 = new Image(0, 0, 0, 5, 'red', 'img/bola.png', 13, 120, 41, 39)
    bola2 = new Image(0, 0, 0, 5, 'red', 'img/bola.png', 13, 120, 41, 39)
    bola3 = new Image(0, 0, 0, 5, 'red', 'img/bola.png', 13, 120, 41, 39)
    bola4 = new Image(0, 0, 0, 5, 'red', 'img/bola.png', 13, 120, 41, 39)

    enemyLEFT = enemyLEFT.map(e => new Enemy(canvas.width, (Math.random() * canvas.height), 25, 10, 'red', 'img/enemy.png', 1))
    enemyRIGTH = enemyRIGTH.map(e => new Enemy(canvas.width, Math.random() * canvas.height, 25, 10, 'red', 'img/enemy.png', 0))

    console.log("Game iniciado com sucesso!")
    theme.play()
    video.currentTime = 0
    video.play()

    keyDownUp(window)
    pre_loop()


}
let aux = 0
const pre_loop = () => {
    setTimeout(() => {



        aux++

        //se o video tiver carregado ele desenha o video
        if (video)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        ctx.drawImage(bgImage2, 0, 0)//plataformas


        ready.draaw(ctx)//o ready inicial



        //texto para ensinar os comandos

        let textSize = 22;
        ctx.font = `bold ${textSize}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "darkblue";
        texto = `"A" or "D" to move,`

        ctx.shadowColor = "#333";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 2;


        ctx.fillText(
            texto,
            30,
            10
        )
        texto = `"Enter" to shoot,`
        ctx.fillText(
            texto,
            30,
            40
        )
        texto = `"Space" to jump.`
        ctx.fillText(
            texto,
            30,
            70
        )


        // contagem para começar o jogo
        if (aux === 180) {
            cancelAnimationFrame(pre_loop)
            requestAnimationFrame(loop)
        }
        else animeReqReference = requestAnimationFrame(pre_loop)




    }, 1000 / 40);
}

const loop = () => {
    setTimeout(() => {



        // desenhando o background em video
        if (video)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        if (video.paused) {
            video.currentTime = 0
            video.play()
        }
        //background das plataformas
        ctx.drawImage(bgImage2, 0, 0)

        //imagem da barra de vida
        ctx.drawImage(barra, 1, 1, 15, 85, 20, 20, 30, 160)
        ctx.fillStyle = 'black'
        ctx.fillRect(26, 26, 16, megaman.vida * 12.2)

        //foreach do inimigo <=
        enemyLEFT.forEach(e => {

            //movimenta inimigo e redesenha
            e.moveEsquerda(boundaries)
            e.draaw(ctx)

            //verifica colisão com o hero
            if (e.hit.colide(megaman.hit)) {
                e.respawn(boundaries)
                som_dano.currentTime = 0
                som_dano.play()
                megaman.vida++
            }

            tiros.forEach(t => {

                //verifica colisão com os tiros
                if (t.colide(e.hit)) {
                    e.respawn(boundaries) // se colidir inimigo reapare no final do canvas
                    som_dano_inimigo.currentTime = 0
                    som_dano_inimigo.play()

                    t.y += 700

                    megaman.pontos++//pontuação soma 1

                }
            })
        })

        enemyRIGTH.forEach(e => {

            //movimenta o inimigo e redesenha
            e.move(boundaries)
            e.draaw(ctx)

            //verifica colisão com o megaman
            if (e.hit.colide(megaman.hit)) {
                e.respawn(boundaries)
                megaman.vida++
                som_dano.currentTime = 0
                som_dano.play()
            }

            tiros.forEach(t => {
                // verifica colisão com os tiros
                if (e.hit.colide(t)) {
                    t.y += 700
                    som_dano_inimigo.currentTime = 0
                    som_dano_inimigo.play()
                    e.respawn(boundaries)
                    megaman.pontos++
                }
            })

        })

        //para escrever a pontuação do jogo
        let textSize = 24;
        ctx.font = `bold ${textSize}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "#fff";
        texto = `Pontos: ${megaman.pontos}`
        let tam = ctx.measureText(texto)
        ctx.fillText(
            texto,
            canvas.width - tam.width - 10,
            textSize / 3
        )

        //quando clica pra atirar, cria apenas um tiro
        if (megaman.atirando) {
            tiro = new Projetil(megaman.x, megaman.y - 80, 15, 13, 'red', projetil)
            if (!megaman.libera_tiro) {
                som_buster.currentTime = 0
                som_buster.play()
                megaman.buster(tiros, tiro)
            }
        }
        else
            megaman.libera_tiro = false


        //calculo de movimento e sprites do heroi
        megaman.move(boundaries, blocos)
        megaman.draw(ctx)

        //movimenta os tiros pelo canvas
        tiros.forEach(t => {
            t.move()
            t.drawb(ctx)

        })

        //desenha o item coletavel
        heart.draaw(ctx)// heart.hit.draw(ctx)

        //verifica se o hero coletou o item e soma 10 na pontuação
        if (heart.hit.colide(megaman.hit)) {
            heart.respawn(boundaries)
            megaman.pontos += 10
            som_item.currentTime = 0
            som_item.play()
        }

        //verifica se o hero colidiu 10 vezes com os inimugos
        gameover = megaman.vida >= 10 ? true : false

        //gameover, carrega o loop de morte
        if (gameover) {
            console.error('DEAD!!!')
            bola1.x = bola2.x = bola3.x = bola4.x = megaman.x
            bola1.y = bola2.y = bola3.y = bola4.y = megaman.y
            theme.pause()
            death.currentTime = 0.5
            death.play()
            requestAnimationFrame(morte)
        } else animeReqReference = requestAnimationFrame(loop)

    }, 1000 / 30)
}

const morte = () => {

    setTimeout(() => {

        if (video)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        if (video.paused) {
            video.currentTime = 0
            video.play()
        }
        ctx.drawImage(bgImage2, 0, 0)//plataformas
        ctx.drawImage(barra, 1, 1, 15, 85, 20, 20, 30, 160)//barra de vida
        ctx.fillStyle = 'black'
        ctx.fillRect(26, 26, 16, megaman.vida * 12.2)

        //desenho das esferas ao hero morrer
        bola1.draaw(ctx)
        bola2.draaw(ctx)
        bola3.draaw(ctx)
        bola4.draaw(ctx)

        //movimento das esferas ao hero morrer
        bola1.moveX()
        bola2.moveX2()
        bola3.moveY()
        bola4.moveY2()

        //pontuação continua
        let textSize = 24;
        ctx.font = `bold ${textSize}px sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "#fff";
        texto = `Pontos: ${megaman.pontos}`
        let tam = ctx.measureText(texto)
        ctx.fillText(
            texto,
            canvas.width - tam.width - 10,
            textSize / 3
        )

        texto = `Press "F5" to restart`
        ctx.fillText(
            texto,
            canvas.width / 3,
            textSize / 3
        )


        requestAnimationFrame(morte)

    }, 1000 / 60)
}

export { init }