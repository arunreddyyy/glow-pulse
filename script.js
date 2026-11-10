const cv = document.getElementById('c'),
g = cv.getContext('2d');

let W, H, dpr;

function fit() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', fit);
fit();

const rings = [];

let hue = Math.random() * 360;

cv.addEventListener('pointerdown', e => {
    hue = (hue + 47 + Math.random() * 40) % 360;
    for (let k = 0; k < 1; k++) {
        rings.push({ x: e.clientX, y: e.clientY, r: 4 - k * 28, h: (hue + k * 70) % 360 });
    }
});


function frame() {
    g.clearRect(0, 0, W, H);
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += 4;
        const a = 1 - r.r / (Math.max(W, H) * 0.9);
        if (a <= 0) {
            rings.splice(i, 1);
            continue; 
        }
        if (r.r < 1) continue;
        g.strokeStyle = `hsla(${r.h},100%,65%,${a * 0.8})`;
        g.lineWidth = 3;
        g.shadowColor = `hsl(${r.h} 100% 60%)`;
        g.shadowBlur = 18;
        g.beginPath();
        g.arc(r.x, r.y, r.r, 0, 6.283);
        g.stroke();
    }
    g.restore();
    requestAnimationFrame(frame);
}
frame();