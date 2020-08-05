const connection = require("../my-connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc 회원가입
// @routes POST api/v1/user
// @request email , passwd ,age
// @response success
exports.signupUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  let age = req.body.age;

  const hashedPasswd = await bcrypt.hash(passwd, 4);
  let query = `insert into book_user(email , passwd , age) values("${email}","${hashedPasswd}" ,${age})`;

  if (!email || !passwd) {
    res.status(500).json({ success: false, msg: "이메일 비밀번호 입력하세요" });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(500).json({ success: false, msg: "이메일 형식이 이상해요" });
    return;
  }
  //

  let user_id;
  try {
    [reslut] = await connection.query(query);
    user_id = reslut.insertId;
  } catch (e) {
    if (e.errno == 1062) {
      res.status(500).json({ success: true, msg: "이메일 중복" });
      return;
    } else {
      res.status(400).json({ success: false, msg: e });
      return;
    }
  }
  let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = `insert into book_token(token , user_id) values ("${token}",${user_id})`;
  try {
    [reslut] = await connection.query(query);
    res.status(200).json({ success: true, msg: reslut });
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
    return;
  }
};
// @desc 로그인
// @routes POST api/v1/user/login
// @request email , passwd
// @response success
exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let savedPasswd;
  let query = `select * from book_user where email = "${email}"`;
  try {
    [rows] = await connection.query(query);
    savedPasswd = rows[0].passwd;
    let user_id = rows[0].id;

    isMath = await bcrypt.compare(passwd, savedPasswd);
    if (isMath == false) {
      res.status.json({ success: false, msg: "비밀번호가 일치 하지않습니다" });
      return;
    }

    let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
    query = `insert into book_token(token , user_id)values("${token}",${user_id})`;

    try {
      [reslut] = await connection.query(query);
      res.status(200).json({ success: true, token: token });
    } catch (e) {
      res.status(400).json({ success: false, msg: e });
      return;
    }
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
    return;
  }
};
// @desc 로그아웃
// @routes DELETE api/v1/user/logout
// @request  token
// @response success
exports.logoutUser = async (req, res, next) => {
  let user_id = req.user.id;
  let query = `delete from book_token where user_id = ${user_id}`;
  try {
    [reslut] = await connection.query(query);
    res.status(200).json({ success: true, msg: reslut });
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
    return;
  }
};
