export default class Circle {

	constructor(x, y, size, speed = 10, color) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.speed = speed;
		this.color = color;
		this.line = 3
	}

	draw(ctx) {
		this.circ(ctx,
			this.x,
			this.y,
			this.size,
			this.line = 0,
			this.color = 'rgba(0,0,255,0.8')
	}

	circ(ctx, pos_x, pos_y, radius, line, color, fill = false) {
		ctx.lineWidth = line;
		ctx.strokeStyle = color
		ctx.beginPath();
		ctx.arc(pos_x, pos_y, radius, 0, Math.PI * 2);
		ctx.stroke();
		if (fill) {
			ctx.fillStyle = fill
			ctx.fill()
		}
	}

	colide(circ) {
		// console.log(circ.x)
		return Math.abs(Math.sqrt((circ.x - this.x) ** 2 + (circ.y - this.y) ** 2)) <= this.size + circ.size;
	}
}