import { loadImage } from "../loadAssets";
import Circle from "./Circle";

export default class Image extends Circle {
    constructor(x, y, size, speed = 10, color, imgURL, total_frame, FRAMES = 60, w, h) {
        super(x, y, size, speed, color)
        this.imgURL = imgURL
        loadImage(this.imgURL)
            .then(img => {
                this.img = img
            })
        this.line = 1
        this.width = w
        this.height = h

        this.total_frame = total_frame
        this.FRAMES = FRAMES


        this.spriteSpeed = 3

        this.frameX = 0

        this.hit = new Circle(
            this.x,
            this.y,
            this.size,
            this.speed,
            20, "rgba(255,0,0,1)"
        )
        this.animeSprite(FRAMES)



    }

    moveX() {
        this.x += this.speed
    }
    moveX2() {
        this.x -= this.speed
    }
    moveY() {
        this.y += this.speed
    }
    moveY2() {
        this.y -= this.speed
    }

    draaw(CTX) {
        if(!this.img) return;
        CTX.drawImage(
            this.img,
            this.frameX * this.width, 0,
            this.width, this.height,
            this.x - this.width, this.y - this.height,
            this.width * 2, this.height * 2
        )

        this.updateHit()
        // this.hit.draw(CTX)
    }

    updateHit() {
        this.hit.x = this.x
        this.hit.y = this.y
    }



    respawn(limits) {
        let aux = Math.random()
        if (aux > 0.75) {
            this.y = limits.height + this.height
            this.x = limits.width * Math.random()
        } else if (aux > 0.5) {
            this.y = 252 - this.height + 5
            this.x = 169 * Math.random()

        } else if (aux > 0.25) {
            this.y = 252 - this.height + 5
            this.x = Math.random() * 137 + 563
        }
        else {
            this.y = 176 - this.height
            this.x = 238 + 320 * Math.random()
        }
    }


    animeSprite(FRAMES) { //Controla a animacao do sprite
        setInterval(() => {
            this.frameX = this.frameX < this.total_frame
                ? this.frameX + 1
                : 0;
        }, 1000 / (FRAMES * this.spriteSpeed / 9))
    }






}
