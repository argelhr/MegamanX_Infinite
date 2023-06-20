
import Circle from "./Circle";
import { loadImage } from "../loadAssets";
import { getKeys, hasKey } from "../keyboard";

export default class Hero extends Circle {

	constructor(x, y, size, speed = 15, width, height, imgUrl) {
		super(x, y, size, speed)
		this.imgUrl = imgUrl
		loadImage(this.imgUrl)
			.then(img => {
				this.img = img
			})

		this.lado = 'right' //lado padrão do megaman
		this.parado = true //estado de em movimento ou parado

		this.atirando = false // estado de estiver atirando ou nao
		this.pulando = false // estado de verificar se foi clicado para pular

		this.libera_tiro = false // estado para liberar apenas um tiro ao clicar enter

		this.chao = true // estado para dizer o hero esta no chao/plataforma ou no ar
		this.velocidadeY = 12 //gravidade do jogo

		//frame inicial do megaman sempre começa parado
		this.frameX = 0 
		this.frameY = 0
		this.atirando = false // estado para ajudar a mudar o frame do megaman pra quando está atirando

		this.altura = 38 //altura do heroi
		this.largura = 38 // largura do heroi
		this.pontos = 0 //pontuação
		this.vida = 0 //quantidade de vezes que o hero colidiu com os inimigos

		this.width = width
		this.height = height

		this.hit = new Circle(
			this.x + this.width,
			this.y + this.height,
			this.size,
			this.speed
		)

	}

	draw(CTX) {

		
		CTX.drawImage(
			this.img,
			this.frameX * this.largura, this.frameY * this.altura,
			this.largura, this.altura,
			this.x, this.y,
			this.largura * 2, this.altura * 2
		)

		// this.hit.draw(CTX)
	}

	buster(tiros, tiro) {//metodo do tiro da buster
		if (!this.libera_tiro) {

			tiro.x = this.x + this.largura + 15//coloca o tiro na altura da buster do megaman
			tiro.y = this.y + this.altura / 2 + 5

			if (this.lado == 'left') {//coloca o tiro no lado esquerdo e modifica a speed do tiro
				tiro.x = this.x
				tiro.speed = -15

			}

			this.libera_tiro = true
			tiros.push(tiro)//adiciona o tiro em uma lista para facilitar o movimento do tiro no game.js

		}
	}



	move(limits, plataformas) {


		this.parado = hasKey('KeyA') || hasKey('KeyD') ? false : true // se o A ou D nao estiver clicado o 
		this.atirando = hasKey('Enter') ? true : false // se o Enter estiver clicado, auxilia no calculo da sprite do buster

		if (!this.parado)//em movimento, atualiza o sprite para o lado que estiver clicando
			if (hasKey('KeyA') && !hasKey('KeyD')) { this.lado = 'left' }
			else if (hasKey('KeyD') && !hasKey('keyA')) this.lado = 'right'


		if (this.chao) {//se estiver no chao, calculo de movimento e sprites
			if (!this.parado) {//se estiver em movimento

				this.frameX += 1//incrementando a posição da sprite
				if (this.frameX > 11)// se chegar na sprite 11, retorna para a 2 para manter o movimento natural do megaman
					this.frameX = 2

				if (this.lado === 'left') {//megaman virado para esquerda
					this.x -= this.speed
					if (this.atirando)//se estiver atitando a altura do sprite é uma, se nao estiver é outra
						this.frameY = 3
					else
						this.frameY = 2

				} else {
					if (this.lado === 'right') {//megaman virado para a direita
						this.x += this.speed
						if (this.atirando)
							this.frameY = 1
						else
							this.frameY = 0
					}
				}
			}
			else {//megaman parado

				this.frameX = 0 //megaman parado é sempre o frame 0

				if (this.lado === 'right') {//virado para a direita
					this.frameY = this.atirando ? 1 : 0//se estiver atirando : senao estiver atirando
				} else if (this.lado === 'left') {//virado para a esquerda
					this.frameY = this.atirando ? 3 : 2//se estiver atirando : senao estiver atirando
				}
			}
		}

		if (hasKey('Space') && this.chao) {//quando clica no espaço começa o pulo
			this.velocidadeY = 0
			this.chao = false
		}
		else {
			this.y += this.velocidadeY //hero começa a pular com velocidade maior e depois cai com velocidade igual
			if (!this.chao) {

				this.frameX = 0 // pulando o frame é sempre o primeiro

				if (this.velocidadeY <= 12) {//quando a velocidade chega em 12 começa a cair , como se fosse
					this.y -= 15
					this.velocidadeY += 1
				}

				if (hasKey('KeyD')) {//se o D estiver sendo clicado vai para a direita durante o pulo
					this.x += this.speed
				}
				else if (hasKey('KeyA')) {//se o A estiver sendo clicado vai para a esquerda durante o pulo
					this.x -= this.speed
				}

				if (this.lado === 'right')//verifica o lado para colocar o frame do pulo atirando ou não
					this.frameY = this.atirando ? 5 : 4
				else
					this.frameY = this.atirando ? 7 : 6

			}
			else
				this.velocidadeY = 12 //velocidadeY funciona como se fosse a gravidade do jogo
		}


		

		this.updateHit()//atualiza o circulo de colisão do megaman para o calculo de colisão com os inimigos
		this.limits(limits) //nao deixa o heroi sair do retangulo do canvas

		plataformas.forEach(plat => { //verifica se o herou esta em cima das plataformas
			plat.colide(this)
		})


	}

	limits(limits) {//calculo de limites do espaço que o heroi pode andar
		if (this.x < 0)
			this.x = 0
		if (this.y < 0)
			this.y = 0
		if (this.x + this.largura * 2 >= limits.width)
			this.x = limits.width - this.largura * 2
		if (this.y + this.altura > limits.height) {
			this.y = limits.height - this.altura
			this.chao = true
		}

	}

	updateHit() {//atualiza zona de hit do megaman
		this.hit.x = this.x + this.width
		this.hit.y = this.y + this.height
	}
}