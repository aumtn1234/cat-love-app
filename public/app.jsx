
const { useState, useEffect, useCallback } = React;

const API = {
  async login(username, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    return res.json();
  },
  async getComments(imageUrl) {
    const res = await fetch('/api/comments?imageUrl=' + encodeURIComponent(imageUrl));
    return res.json();
  },
  async addComment(token, imageUrl, text) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ imageUrl, text }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to comment');
    return res.json();
  }
};

function Login({ onSuccess }) {
  const [username, setUsername] = useState('catlover');
  const [password, setPassword] = useState('meow123');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await API.login(username, password);
      onSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>เข้าสู่ระบบ</h1>
        <p className="muted">เดโม่ผู้ใช้: <b>catlover/meow123</b> หรือ <b>whiskers/purr789</b></p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <label>ชื่อผู้ใช้</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
          <label>รหัสผ่าน</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          <div style={{height:8}}/>
          <button type="submit">เข้าสู่ระบบ</button>
        </form>
      </div>
    </div>
  );
}

function CatViewer({ token, user }) {
  const [imageUrl, setImageUrl] = useState('https://cataas.com/cat');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [err, setErr] = useState('');

  // Force a new random image by adding a timestamp query
  const fetchRandomImage = useCallback(() => {
    const url = 'https://cataas.com/cat?ts=' + Date.now();
    setImageUrl(url);
  }, []);

  async function loadComments(url) {
    try {
      const data = await API.getComments(url);
      setComments(data.comments || []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadComments(imageUrl);
  }, [imageUrl]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setStatus('');
    setErr('');
    try {
      await API.addComment(token, imageUrl, newComment.trim());
      setNewComment('');
      setStatus('บันทึกคอมเมนต์สำเร็จ');
      loadComments(imageUrl);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="toolbar">
          <h1>ยินดีต้อนรับ, {user.displayName || user.username}</h1>
          <button onClick={fetchRandomImage}>สุ่มรูปใหม่</button>
        </div>
        <img className="cat" src={imageUrl} alt="Random Cat from cataas.com" />
        <div className="toolbar">
          <div className="muted">รูปนี้: <code style={{fontSize:12}}>{imageUrl}</code></div>
        </div>
        <hr/>
        <h2>คอมเมนต์</h2>
        {comments.length === 0 && <p className="muted">ยังไม่มีคอมเมนต์สำหรับรูปนี้</p>}
        {comments.map((c, idx) => (
          <div className="comment" key={idx}>
            <div><b>{c.user}</b></div>
            <div>{c.text}</div>
            <div className="muted">{new Date(c.ts).toLocaleString()}</div>
          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <label>เพิ่มคอมเมนต์ใหม่</label>
          <div className="row">
            <input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="พิมพ์ข้อความของคุณ..." />
            <button type="submit">ส่ง</button>
          </div>
        </form>
        <div style={{height:8}}/>
        {status && <div className="success">{status}</div>}
        {err && <div className="error">{err}</div>}
      </div>
      <div className="footer">แหล่งรูป: <a href="https://cataas.com" target="_blank" rel="noreferrer">cataas.com</a> • โค้ดตัวอย่างเพื่อการสาธิต</div>
    </div>
  );
}

function App() {
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState(null);

  if (!token) return <Login onSuccess={(t, u) => { setToken(t); setUser(u); }} />;
  return <CatViewer token={token} user={user} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
