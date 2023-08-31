const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1244;
canvas.height = 1244;

class Line {
  constructor(x, y, angle, length, curvature) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.curvature = curvature;
  }

  update(lines, cells) {
    const newX = this.x + Math.cos(this.angle) * this.length;
    const newY = this.y + Math.sin(this.angle) * this.length;

    const collidedCell = this.checkCollision(lines, cells);

    this.x = newX;
    this.y = newY;
    this.angle += this.curvature;

    if (this.curvature === 0.01) {
      this.reproduce(lines);
    }

    if (collidedCell) {
      const index = cells.indexOf(collidedCell);
      if (index !== -1) {
        cells.splice(index, 1);
      }
    }
  }

  checkCollision(lines, cells) {
    for (const line of lines) {
      if (line !== this) {
        const dx = this.x - line.x;
        const dy = this.y - line.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.length) {
          this.curvature += 0.01;
          line.curvature += 0.01;

          // Calculate the cell's position in the grid
          const cellX = Math.floor(this.x / 6) * 6;
          const cellY = Math.floor(this.y / 6) * 6;

          // Check if a cell already exists at the position
          for (const cell of cells) {
            if (cell.x === cellX && cell.y === cellY) {
              return cell; // Return the cell to be replaced
            }
          }

          // Create a new cell at the collision point
          const newCell = new Cell(cellX, cellY);
          cells.push(newCell);
        }
      }
    }
    return null;
  }

  reproduce(lines) {
    const newLine = new Line(this.x + this.length, this.y, this.angle, this.length, this.curvature);
    lines.push(newLine);
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 6, 6);
  }
}

const lines = [];
const cells = [];

function setup() {
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const angle = Math.random() * Math.PI * 2;
    const length = Math.random() * 20 + 5;
    const curvature = (Math.random() - 0.5) * 0.1;

    lines.push(new Line(x, y, angle, length, curvature));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const line of lines) {
    line.update(lines, cells);
  }

  for (const cell of cells) {
    cell.draw();
  }
}

setup();
animate();