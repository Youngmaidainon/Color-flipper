// app.js
function getRandomHex() { // ฟังก์ชันสุ่มสี
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return '#' + hex.padStart(6, '0');  // padStart ป้องกัน hex สั้นกว่า 6 ตัว
}

// ฟังก์ชันคำนวณสีตัวอักษร
function getTextColor(hex) {
    // แปลง hex → RGB แล้วคำนวณความสว่าง
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function applyColor(color) { // [เพิ่มใหม่] ฟังก์ชันสำหรับเปลี่ยนสีหน้าเว็บ และ "เซฟลง localStorage"
    document.body.style.backgroundColor = color;
    document.getElementById('hex-code').textContent = color;
    document.body.style.color = getTextColor(color);
    localStorage.setItem('myColor', color); // โดยตั้งชื่อ Key ว่า 'myColor' และ Value คือรหัสสี
}
function flipColor() { // ฟังก์ชันเมื่อกดปุ่ม Generate
    const newColor = getRandomHex(); // // สุ่มสีใหม่
    applyColor(newColor); // เรียกใช้ฟังก์ชันเปลี่ยนสีและเซฟ
}

// ผูก Event ให้ปุ่มกด
document.getElementById('generate').addEventListener('click', flipColor);

document.getElementById('copy').addEventListener('click', () => {
    const hex = document.getElementById('hex-code').textContent;
    navigator.clipboard.writeText(hex).then(() => {
        const btn = document.getElementById('copy');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
    });
});

// ลองดึง Value จาก Key ที่ชื่อว่า 'myColor' มาดูก่อน
const saved = localStorage.getItem('myColor');
if (saved) {
    applyColor(saved); // ถ้ามีสีเดิมเซฟไว้อยู่ (Value ไม่ใช่ null) ให้แสดงสีนั้นเลย
} else {
    flipColor(); // ถ้าเพิ่งเปิดเว็บครั้งแรกสุดๆ ยังไม่มีข้อมูลเซฟไว้ ให้สุ่มสีใหม่ขึ้นมา
};