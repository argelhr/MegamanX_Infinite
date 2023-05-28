
export default class Rect {
	constructor(x, y, xf, yf, color = "#00f") {
		this.x = x;
		this.y = y;
		this.xf = xf
		this.yf = yf;
		this.color = color;
	}
	pinta(ctx) {
		ctx.lineWidth = 5;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.xf, this.yf);
	}

	colide(hero) {
		if (hero.x < this.x + this.xf - 20 && hero.x + hero.largura > this.x &&
			hero.y + hero.altura < this.y + this.yf && hero.y + hero.altura > this.y) {
			hero.y = this.y - hero.altura;
			hero.chao = true
		}

	}



}