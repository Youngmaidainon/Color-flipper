// app.js
function getRandomHex() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return '#' + hex.padStart(6, '0');  // padStart ป้องกัน hex สั้นกว่า 6 ตัว
}

function getTextColor(hex) {
    // แปลง hex → RGB แล้วคำนวณความสว่าง
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function flipColor() {
    const color = getRandomHex();
    document.body.style.backgroundColor = color;
    document.getElementById('hex-code').textContent = color;
    document.body.style.color = getTextColor(color);
}

document.getElementById('generate').addEventListener('click', flipColor);

document.getElementById('copy').addEventListener('click', () => {
    const hex = document.getElementById('hex-code').textContent;
    navigator.clipboard.writeText(hex).then(() => {
        const btn = document.getElementById('copy');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
    });
});

// โหลดครั้งแรกให้สุ่มสีเลย
flipColor();