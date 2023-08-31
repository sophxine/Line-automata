const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Line {
  constructor(x, y, angle, length, curvature) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.curvature = curvature;
    this.collisions = 0; // Counter for collisions
    this.offshoots = []; // Array to store offshoot lines
  }

  update(lines) {
    const newX = this.x + Math.cos(this.angle) * this.length;
    const newY = this.y + Math.sin(this.angle) * this.length;
    
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    
    this.checkCollision(lines);
    
    this.x = newX;
    this.y = newY;
    this.angle += this.curvature;

    if (this.curvature === 0.12) {
      this.reproduce(lines);
    }

    if (this.collisions >= 595) {
      this.die(lines);
    }
    
    for (const offshoot of this.offshoots) {
      offshoot.update(lines);
    }
  }

  checkCollision(lines) {
    for (const line of lines) {
      if (line !== this) {
        const dx = this.x - line.x;
        const dy = this.y - line.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.length) {
          this.curvature += 0.02;
          line.curvature += 0.02;
          this.collisions += 1;
          line.collisions += 1;

          if (Math.random() < 0.1) { // Chance of mutation
            const offshootAngle = Math.random() * Math.PI * 2;
            const offshootLength = this.length * 0.7; // Adjust offshoot length
            const offshootCurvature = (Math.random() - 0.5) * 0.1;
            this.offshoots.push(new Line(this.x, this.y, offshootAngle, offshootLength, offshootCurvature));
          }
        }
      }
    }
  }

  reproduce(lines) {
    const newLine = new Line(this.x + this.length, this.y, this.angle, this.length, this.curvature);
    lines.push(newLine);
  }

  die(lines) {
    const index = lines.indexOf(this);
    if (index !== -1) {
      lines.splice(index, 1);
    }
  }
}

const lines = [];

function setup() {
  for (let i = 0; i < 250; i++) {
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
    line.update(lines);
  }
}

setup();
animate();