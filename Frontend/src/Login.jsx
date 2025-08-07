import React, { useState, useContext } from "react";
import { MyContext } from "./MyContext";

function Login() {
  const { setUser, setToken, setShowLogin, setShowRegister } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      setUser(data.email);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setShowLogin(false);
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="login-modal" style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 2000}}>
      <form onSubmit={handleSubmit} style={{background:'#232323', padding:32, borderRadius:8, minWidth:320, boxShadow:'0 2px 16px #000'}}>
        <h2 style={{marginBottom:16}}>Login</h2>
        <div style={{marginBottom:12}}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{width:'100%', padding:10, borderRadius:4, border:'1px solid #444', background:'#181818', color:'#fff'}}
            autoFocus
            required
          />
        </div>
        <div style={{marginBottom:12}}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{width:'100%', padding:10, borderRadius:4, border:'1px solid #444', background:'#181818', color:'#fff'}}
            required
          />
        </div>
        {error && <div style={{color:'#f87171', marginBottom:12}}>{error}</div>}
        <button type="submit" style={{width:'100%', padding:10, borderRadius:4, background:'#339cff', color:'#fff', border:'none', fontWeight:'bold'}} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button type="button" style={{width:'100%', marginTop:8, padding:10, borderRadius:4, background:'#444', color:'#fff', border:'none'}} onClick={() => setShowLogin(false)}>
          Cancel
        </button>
        <div style={{marginTop:16, textAlign:'center'}}>
          <span style={{color:'#b4b4b4'}}>Don't have an account? </span>
          <button type="button" style={{background:'none', border:'none', color:'#339cff', cursor:'pointer', textDecoration:'underline', fontWeight:'bold'}} onClick={() => { setShowLogin(false); setShowRegister(true); }}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login; 