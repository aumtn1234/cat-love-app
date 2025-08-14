
# Cat Lovers • React + Node (web + api)

โครงงานตัวอย่างสำหรับระบบคนรักแมว:
- หน้าเข้าสู่ระบบ (รองรับอย่างน้อย 2 ผู้ใช้)
- หน้าจอแสดงรูปแมวแบบสุ่มจาก https://cataas.com/cat พร้อมปุ่มเปลี่ยนรูป
- ช่องคอมเมนต์ใต้รูป (เก็บแบบ in-memory)

## วิธีรัน
1) ติดตั้ง Node.js (v16+)
2) แตกไฟล์ zip แล้วเปิดโฟลเดอร์ `cat-love-app`
3) รันคำสั่ง:
```bash
npm install
npm start
```
4) เปิดเบราว์เซอร์ไปที่ http://localhost:3000

## ผู้ใช้ตัวอย่าง
- `catlover` / `meow123`
- `whiskers` / `purr789`

## โครงสร้าง
```
cat-love-app/
├─ package.json        # ขึ้นกับ express
├─ server.js           # เว็บเซิร์ฟเวอร์ + API (login, comments)
└─ public/             # ฝั่งเว็บ (React via CDN)
   ├─ index.html
   ├─ styles.css
   └─ app.jsx
```

> หมายเหตุ: คอมเมนต์เก็บในหน่วยความจำของเซิร์ฟเวอร์ (หายเมื่อรีสตาร์ท) เพื่อให้ตัวอย่างเรียบง่าย
