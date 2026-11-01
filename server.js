const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005; // Railway tự set PORT khi deploy, local dùng 3005

// Thư mục data – trên Railway dùng /data (volume), local dùng ./data
const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(__dirname, 'data');

const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const LEADS_FILE   = path.join(DATA_DIR, 'leads.json');
const CREDS_FILE   = path.join(DATA_DIR, 'creds.json');

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve toàn bộ file tĩnh

// ── Đảm bảo thư mục data tồn tại ────────────────────────
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('[📁] Đã tạo thư mục data:', DATA_DIR);
}

// Nội dung mặc định nếu chưa có file
const DEFAULT_CONTENT = {
    slogan:  'Giải Pháp Logistics Toàn Diện Cho Doanh Nghiệp',
    desc:    'Công ty TNHH HP cung cấp dịch vụ Vận Tải, Kho Bãi và Cho Thuê Xe Nâng Hạ Container chuyên nghiệp.',
    phone:   '0901 234 567',
    email:   'info@hplogistics.vn',
    address: '123 Đường Logistics, KCN Bình Dương, Việt Nam',
    hours:   'Thứ 2 – Thứ 7: 7:30 – 17:30',
    tTitle:  'Dịch Vụ Vận Tải',
    tDesc:   'Đội xe hiện đại với hơn 150 đầu xe tải, đáp ứng mọi nhu cầu vận chuyển hàng hóa toàn quốc.',
    wTitle:  'Dịch Vụ Kho Bãi',
    wDesc:   'Hệ thống kho bãi hiện đại 50.000m², trang bị WMS thông minh, kho lạnh chuyên biệt.',
    fTitle:  'Cho Thuê Xe Nâng Hạ Container',
    fDesc:   'Đội xe nâng 3T–45T, phục vụ bốc xếp container tại cảng, kho bãi, khu công nghiệp.',
};

if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
}
if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// ── API: Lấy nội dung ────────────────────────────────────
app.get('/api/content', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
        res.json({ ok: true, data });
    } catch (e) {
        res.json({ ok: true, data: DEFAULT_CONTENT });
    }
});

// ── API: Lưu nội dung ────────────────────────────────────
app.post('/api/content', (req, res) => {
    try {
        const data = { ...DEFAULT_CONTENT, ...req.body };
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log('[✅] Đã lưu nội dung:', new Date().toLocaleString('vi-VN'));
        res.json({ ok: true, message: 'Lưu thành công!' });
    } catch (e) {
        res.status(500).json({ ok: false, message: 'Lỗi lưu file: ' + e.message });
    }
});

// ── API: Lấy danh sách leads ─────────────────────────────
app.get('/api/leads', (req, res) => {
    try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        res.json({ ok: true, data: leads });
    } catch (e) {
        res.json({ ok: true, data: [] });
    }
});

// ── API: Lưu lead từ form liên hệ ───────────────────────
app.post('/api/leads', (req, res) => {
    try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        const newLead = {
            id: Date.now(),
            ...req.body,
            date: new Date().toLocaleDateString('vi-VN'),
            status: 'new'
        };
        leads.unshift(newLead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
        console.log('[📞] Lead mới:', newLead.name, newLead.phone);
        res.json({ ok: true, message: 'Gửi yêu cầu thành công!' });
    } catch (e) {
        res.status(500).json({ ok: false, message: 'Lỗi lưu lead: ' + e.message });
    }
});

// ── API: Cập nhật trạng thái lead ───────────────────────
app.patch('/api/leads/:id', (req, res) => {
    try {
        let leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        leads = leads.map(l => l.id == req.params.id ? { ...l, ...req.body } : l);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
});

// ── API: Auth ────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    let creds = {
        username: process.env.ADMIN_USER || 'admin',
        password: process.env.ADMIN_PASS || 'hp@2024'
    };
    if (fs.existsSync(CREDS_FILE)) {
        try { creds = JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8')); } catch(e){}
    }
    if (username === creds.username && password === creds.password) {
        res.json({ ok: true, name: 'Quản trị viên HP' });
    } else {
        res.status(401).json({ ok: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
});

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ ok: true, status: 'running', time: new Date().toISOString() });
});

// ── Start server ─────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   🚀 HP Logistics Server đã khởi động!  ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  🌐 Port: ${PORT.toString().padEnd(31)}║`);
    console.log(`║  📁 Data: ${DATA_DIR.substring(0,31).padEnd(31)}║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
});
