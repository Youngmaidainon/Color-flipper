// app.js

// ==========================================
// ส่วนที่ 1: การเตรียมตัวแปร (DOM Elements)
// ดึงแท็กต่างๆ จาก HTML มาเก็บไว้ในตัวแปร เพื่อให้เรียกใช้งานได้ง่าย
// ==========================================
const hexCodeDisplay = document.getElementById('hex-code');
const generateBtn = document.getElementById('generate');
const saveBtn = document.getElementById('save');
const copyBtn = document.getElementById('copy');


// ==========================================
// ส่วนที่ 2: ฟังก์ชันการทำงานหลัก (Main Functions)
// ==========================================

/**
 * ฟังก์ชันสุ่มรหัสสี Hex (เช่น #ff0055)
 * @returns {string} รหัสสี Hex ความยาว 6 หลักพร้อมเครื่องหมาย #
 */
function getRandomHex() {
    // 1. สุ่มตัวเลขคณิตศาสตร์ แล้วแปลงเป็นฐาน 16 (.toString(16))
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);

    // 2. เติม '0' ด้านหน้าให้ครบ 6 หลัก (ป้องกันกรณีสุ่มได้เลขสั้นกว่า 6 ตัว)
    return '#' + hex.padStart(6, '0');
}

/**
 * ฟังก์ชันคำนวณสีตัวอักษรให้ตัดกับสีพื้นหลัง (อ่านง่ายขึ้น)
 * @param {string} hex - รหัสสีพื้นหลังที่สุ่มได้
 * @returns {string} คืนค่าเป็น สีดำ (#000000) หรือ สีขาว (#ffffff)
 */
function getTextColor(hex) {
    // 1. ตัด string เพื่อแยกค่าสี แดง(R), เขียว(G), น้ำเงิน(B) แล้วแปลงกลับเป็นเลขฐาน 10
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // 2. คำนวณหาค่าความสว่าง (Brightness) ตามสูตรมาตรฐานสากล
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 3. ถ้าพื้นหลังสว่างไป (ค่า > 128) ให้ใช้ตัวหนังสือสีดำ ถ้ามืดไปให้ใช้สีขาว
    return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * ฟังก์ชันเปลี่ยนสีหน้าเว็บ (ทำงานเมื่อกดปุ่ม Generate)
 */
function flipColor() {
    const color = getRandomHex(); // สุ่มสีใหม่

    // อัปเดตสีพื้นหลัง ข้อความรหัสสี และสีตัวอักษรบนหน้าเว็บ
    document.body.style.backgroundColor = color;
    hexCodeDisplay.textContent = color;
    document.body.style.color = getTextColor(color);
}


// ==========================================
// ส่วนที่ 3: การจัดการเหตุการณ์ (Event Listeners)
// ดักจับการกระทำของผู้ใช้งาน เช่น การคลิก หรือการกดคีย์บอร์ด
// ==========================================

// --- 1. ปุ่ม Generate: กดเพื่อสุ่มสีใหม่ ---
generateBtn.addEventListener('click', function () {
    flipColor(); // เรียกใช้ฟังก์ชันสุ่มสี

    // คืนค่าสีปุ่ม Save กลับเป็นสีดำทุกครั้งที่มีการสุ่มสีใหม่
    saveBtn.style.color = '#000000';
});

// --- 2. ปุ่ม Copy: คัดลอกรหัสสีลง Clipboard ---
copyBtn.addEventListener('click', () => {
    // ดึงข้อความรหัสสีปัจจุบันบนหน้าจอ
    const hex = hexCodeDisplay.textContent;

    // ใช้คำสั่งของเบราว์เซอร์ในการก๊อปปี้ข้อความ
    navigator.clipboard.writeText(hex).then(() => {
        // เปลี่ยนข้อความบอกผู้ใช้ว่าก๊อปปี้สำเร็จแล้ว
        copyBtn.textContent = 'Copied!';

        // ตั้งเวลา 1.5 วินาที (1500ms) ให้ข้อความกลับมาเป็นคำว่า 'Copy' เหมือนเดิม
        setTimeout(() => copyBtn.textContent = 'Copy', 1500);
    });
});

// --- 3. ปุ่ม Save: บันทึกสีโปรดลง LocalStorage ---
let count_save = 0;
saveBtn.addEventListener('click', function () {
    const currentColor = hexCodeDisplay.textContent;

    // ดึงข้อมูลสีเก่าที่เคยเซฟไว้ (ถ้าไม่มีให้สร้างเป็น Array ว่าง [])
    // ต้องใช้ JSON.parse เพื่อแปลงข้อความกลับมาเป็น Array
    let savedColors = JSON.parse(localStorage.getItem('favoriteColors')) || [];
    // ตรวจสอบว่าสีนี้ถูกเซฟไปหรือยัง จะได้ไม่เซฟซ้ำ
    if (savedColors.includes(currentColor)) {
        alert(`สี ${currentColor} นี้บันทึกไปแล้วครับ`);
        return; // จบการทำงานทันที ไม่ต้องทำโค้ดด้านล่างต่อ
    }

    // เอาสีใหม่ดัน (Push) เข้าไปใน Array
    savedColors.push(currentColor);

    // แปลง Array กลับเป็นข้อความ (JSON.stringify) แล้วบันทึกลง LocalStorage
    localStorage.setItem('favoriteColors', JSON.stringify(savedColors));

    // บวกเลขเพิ่มทีละ 1 เมื่อมีการบันทึกสำเร็จ
    count_save ++;

    // เปลี่ยนสีไอคอน/ข้อความปุ่ม Save เป็นสีขาว เพื่อบอกว่าบันทึกสำเร็จ
    saveBtn.style.color = '#FFFFFF';
    saveBtn.setAttribute('data-count' , count_save); // อัปเดตข้อความบนปุ่มให้แสดงตัวเลขด้วย เช่น "Save (1)", "Save (2)"
    console.log("บันทึกสำเร็จ: " + currentColor);
});

// --- 4. คีย์บอร์ด: กด Spacebar เพื่อสุ่มสีใหม่ ---
document.addEventListener('keydown', function (event) {
    // เช็คว่าปุ่มที่ผู้ใช้กดคือ Spacebar หรือไม่
    if (event.code === 'Space') {
        // ป้องกันพฤติกรรมดั้งเดิมของเบราว์เซอร์ (ไม่ให้หน้าเว็บเลื่อนลงมาเวลาสเปซบาร์)
        event.preventDefault();

        // สั่งให้จำลองการคลิกที่ปุ่ม Generate
        generateBtn.click();
    }
});