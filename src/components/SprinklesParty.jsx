export function createSprinklesEffect() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
  
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999'; // Ensure it appears on top
    canvas.style.pointerEvents = 'none';
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const colors = [
      '#FF6F61', '#FFB400', '#FFD700', '#FF1493',
      '#00FFFF', '#7CFC00', '#FF69B4', '#FFA500',
      '#1E90FF', '#32CD32', '#FF4500', '#9400D3'
    ];
    let sprinkles = [];
    let sprinkleCount = 200; // Initial number of sprinkles
    let isEnding = false; // Flag to determine if sprinkles should fade out
  
    class Sprinkle {
      constructor(x, y, color, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.size = Math.random() * 15 + 10;
        this.speed = Math.random() * 6 + 9;
        this.gravity = 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.opacity = 1; // Start fully visible
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed * -1;
      }
  
      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        this.rotation += 0.1;
  
        // Fade out over time if the effect is ending
        if (isEnding) {
          this.opacity -= 0.02; // Gradually decrease opacity
          if (this.opacity <= 0) {
            this.opacity = 0; // Ensure it doesn't go negative
          }
        }
  
        // Reset sprinkle position only if not ending
        if (!isEnding && (this.y > canvas.height || this.x < 0 || this.x > canvas.width)) {
          this.x = canvas.width / 2;
          this.y = canvas.height;
          const angle = Math.random() * Math.PI * 2;
          this.velocityX = Math.cos(angle) * this.speed;
          this.velocityY = Math.sin(angle) * this.speed * -1;
        }
      }
  
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity; // Apply opacity
        ctx.fillStyle = this.color;
        ctx.fillRect(
          -this.size / 2,
          -this.size / 5,
          this.size,
          this.size / 3
        );
        ctx.restore();
      }
    }
  
    const createSprinkles = () => {
      for (let i = 0; i < sprinkleCount; i++) {
        const angle = Math.random() * Math.PI - Math.PI / 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        sprinkles.push(new Sprinkle(canvas.width / 2, canvas.height, color, angle));
      }
    };
  
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      sprinkles.forEach((sprinkle, index) => {
        sprinkle.update();
        sprinkle.draw();
  
        // Remove sprinkles that are fully transparent
        if (sprinkle.opacity === 0) {
          sprinkles.splice(index, 1);
        }
      });
  
      if (sprinkles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        // Cleanup when animation ends
        document.body.removeChild(canvas);
      }
    };
  
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sprinkles = [];
      createSprinkles();
    };
  
    const startFadeOut = () => {
      isEnding = true; // Trigger the fade-out phase
    };
  
    createSprinkles();
    animate();
  
    // Automatically trigger fade-out after 3 seconds
    setTimeout(startFadeOut, 3000);
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      startFadeOut();
    };
  }
  