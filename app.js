// ==========================================
// ส่วนที่ 1: การเตรียมตัวแปร (DOM Elements)
// ==========================================
const hexCodeDisplay = document.getElementById('hex-code');
const rgbCodeDisplay = document.getElementById('rgb-code');
const generateBtn = document.getElementById('generate');
const saveBtn = document.getElementById('save');
const copyBtn = document.getElementById('copy');
const toggleModeBtn = document.getElementById('toggle-mode');

// ตั้งค่าเริ่มต้นของโหมดเป็น 'hex'
let currentMode = 'hex';
// ตัวแปรใหม่สำหรับจำรหัสสี Hex ปัจจุบันที่แสดงผลอยู่
let currentHexColor = '#ffffff'; // ค่าเริ่มต้น (กรณีหน้าเว็บเปิดมาเป็นสีขาว)

// ตะกร้าสำหรับ Named Colors (เพิ่มสีเข้าไปในนี้)
const namedColors = [
    { name: "Tomato", hex: "#ff6347" },
    { name: "SteelBlue", hex: "#4682b4" },
    { name: "RebeccaPurple", hex: "#663399" },
    { name: "MediumSeaGreen", hex: "#3cb371" },
    { name: "Gold", hex: "#ffd700" },
    { name: "Coral", hex: "#ff7f50" },
    { name: "CornflowerBlue", hex: "#6495ed" },
    { name: "Crimson", hex: "#dc143c" },
    { name: "Teal", hex: "#008080" },
    { name: "SlateBlue", hex: "#6a5acd" }
];

// ==========================================
// ส่วนที่ 2: ฟังก์ชันการทำงานหลัก (Main Functions)
// ==========================================

function getRandomHex() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return '#' + hex.padStart(6, '0');
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function getTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function flipColor() {
    let displayText = '';

    if (currentMode === 'hex') {
        currentHexColor = getRandomHex();
        displayText = currentHexColor;
    } else {
        const randomIndex = Math.floor(Math.random() * namedColors.length);
        const colorObj = namedColors[randomIndex];
        currentHexColor = colorObj.hex;
        displayText = colorObj.name;
    }

    // อัปเดตหน้าจอ
    document.body.style.backgroundColor = currentHexColor;
    hexCodeDisplay.textContent = displayText;
    rgbCodeDisplay.textContent = hexToRgb(currentHexColor);
    document.body.style.color = getTextColor(currentHexColor);
}

// ==========================================
// ส่วนที่ 3: การจัดการเหตุการณ์ (Event Listeners)
// ==========================================

// --- ปุ่ม Toggle: สลับโหมด ---
toggleModeBtn.addEventListener('click', () => {
    // สลับค่าตัวแปร
    currentMode = currentMode === 'hex' ? 'named' : 'hex';
    // อัปเดตข้อความบนปุ่ม
    toggleModeBtn.textContent = `Mode : ${currentMode === 'hex' ? 'Hex' : 'Named'}`;

    // อัปเดตเฉพาะข้อความ โดยใช้สีปัจจุบัน (currentHexColor)
    if (currentMode === 'named') {
        // ค้นหาว่าสีปัจจุบันมีชื่ออยู่ในตะกร้า namedColors หรือไม่ (ใช้ toLowerCase เพื่อป้องกันปัญหาตัวพิมพ์เล็ก-ใหญ่)
        const foundColor = namedColors.find(c => c.hex.toLowerCase() === currentHexColor.toLowerCase());

        // ถ้าเจอชื่อสีให้แสดงชื่อ ถ้าไม่เจอ(เป็นสีสุ่มจากโหมด Hex) ให้แสดงข้อความว่า Custom Color
        hexCodeDisplay.textContent = foundColor ? foundColor.name : "White";
    } else {
        // ถ้าเป็นโหมด Hex ก็แสดงรหัส Hex ปัจจุบันได้เลย
        hexCodeDisplay.textContent = currentHexColor;
    }
});

// --- ปุ่ม Generate: กดเพื่อสุ่มสีใหม่ ---
generateBtn.addEventListener('click', function () {
    flipColor();
    saveBtn.style.color = '#000000';
});

// --- ปุ่ม Copy: คัดลอกรหัสสีลง Clipboard ---
copyBtn.addEventListener('click', () => {
    // ในที่นี้จะคัดลอกค่าจากบรรทัดบนสุด หากเป็นโหมดชื่อสี ก็จะได้ชื่อสีไป
    const textToCopy = hexCodeDisplay.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 1500);
    });
});

// --- ปุ่ม Save: บันทึกสีโปรดลง LocalStorage ---
let count_save = 0;
saveBtn.addEventListener('click', function () {
    const currentColor = hexCodeDisplay.textContent;

    let savedColors = JSON.parse(localStorage.getItem('favoriteColors')) || [];

    if (savedColors.includes(currentColor)) {
        alert(`สี ${currentColor} นี้บันทึกไปแล้วครับ`);
        return;
    }

    savedColors.push(currentColor);
    localStorage.setItem('favoriteColors', JSON.stringify(savedColors));

    count_save++;
    saveBtn.style.color = '#FFFFFF';
    saveBtn.setAttribute('data-count', count_save);
    console.log("บันทึกสำเร็จ: " + currentColor);
});

// --- คีย์บอร์ด: กด Spacebar เพื่อสุ่มสีใหม่ ---
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        generateBtn.click();
    }
});