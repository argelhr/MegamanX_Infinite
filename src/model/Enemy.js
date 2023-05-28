import { loadImage } from "../loadAssets";
import Circle from "./Circle";

export default class Enemy extends Circle {
	constructor(x, y, size, speed = 10, color, imgURL, frame) {
		super(x, y, size, speed, color)
		this.imgURL = imgURL
		loadImage(this.imgURL)
			.then(img => {
				this.img = img
			})
		this.line = 1
		this.width = 47
		this.height = 39


		this.spriteSpeed = 2

		this.frameY = frame
		this.frameX = 0

		this.hit = new Circle(
			this.x + this.width,
			this.y + this.height,
			this.size,
			this.speed,
			10, "rgba(255,0,0,1)"
		)
		this.animeSprite(30)
	}

	draaw(CTX) {

		CTX.drawImage(
			this.img,
			this.frameX * this.width, this.frameY * this.height,
			this.width, this.height,
			this.x, this.y,
			this.width * 2, this.height * 2
		)

		this.updateHit()
		// this.draw(CTX)
		// this.hit.draw(CTX)
	}

	move(limits) {
		this.x += this.speed
		this.limits(limits)
	}
	moveEsquerda(limits) {
		this.x -= this.speed
		this.limits(limits)

	}
	updateHit() {
		this.hit.x = this.x + this.width
		this.hit.y = this.y + this.height
	}


	limits(limits) {

		if (this.x < -70 && Math.random() > 0.9755) {
			// this.trocaCor()
			this.frameX = 0
			this.y = Math.random() * limits.height
			this.x = limits.width + 70
		}
		if (this.x > limits.width && Math.random() > 0.9755) {
			// this.trocaCor()
			this.frameX = 0
			this.y = Math.random() * limits.height
			this.x = -70
		}
	}

	respawn(limits) {
		// this.frameX = 0
		this.y = Math.random() * limits.height
		this.x = limits.width + 70

	}

	animeSprite(FRAMES) { //Controla a animacao do sprite
		setInterval(() => {
			this.frameX = this.frameX < 10
				? this.frameX + 1
				: 0;
		}, 1000 / (40 * this.spriteSpeed / 10))
	}
}







