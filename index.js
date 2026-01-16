const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// sessions
app.use(session({
  secret: "devpanelsecret", // can also use env
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60*60*1000 } // 1 hour
}));

app.use(express.json());
app.use(express.static("Login")); // serve login folder

// login route
app.post("/auth/login", (req, res) => {
  const pw = req.body.pw;
  if(pw === process.env.DEV_PASSWORD){
    req.session.ok = true;
    res.json({ ok: true });
  } else res.json({ ok: false });
});

// auth check route
app.get("/auth/status", (req,res) => {
  res.json({ ok: !!req.session.ok });
});

// serve panel
app.get("/panel", (req,res)=>{
  if(!req.session.ok) return res.redirect("/login/index.html");
  res.sendFile(path.join(__dirname,"panel.html"));
});

// redirect root to login
app.get("/", (req,res) => res.redirect("/login/index.html"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
