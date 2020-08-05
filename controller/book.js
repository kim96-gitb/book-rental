const connection = require("../my-connection");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { query } = require("../my-connection");

// @desc 모든 책 조회 25권씩
// @routes GET api/v1/books?offset=?limit
// @request
// @response title
exports.selectbook = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select * from book limit ${offset},${limit}`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, msg: rows });
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
  }
};

// @desc 책대여
// @routes POST api/v1/books/rental
// @request  token , age , title
// @response success
exports.rentalBook = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.book_id;
  let age = req.user.age;
  let rental_date = Date.now();
  let return_date = rental_date + 1000 * 60 * 30 * 48 * 7;
  return_date = moment(return_date).format("YYYY-MM-DD HH:mm:ss");
  let query = `select * from book where id = ${book_id}`;
  try {
    [rows] = await connection.query(query);
    let limit_age = rows[0].limit_age;
    if (age < limit_age) {
      res.status(400).json({ success: false, msg: "나이가 어려서 안됩니다" });
      return;
    } else {
      query = `insert into book_rental(user_id , book_id  , return_date) values (${user_id},${book_id},"${return_date}")`;
      try {
        [result] = await connection.query(query);
        res.status(200).json({ success: true, msg: result });
      } catch (e) {
        res.status(400).json({ success: false, msg: e });
        console.log(e);
      }
    }
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
    console.log(e);
  }
};

// @desc 내가 대여한 책 확인 25
// @routes GET api/v1/books/me
// @request  token
// @response success
exports.myBook = async (req, res, next) => {
  let user_id = req.user.id;
  let query = `select bu.email , br.book_id\
  from book_user as bu join book_rental as br \
  on bu.id = br.user_id where user_id =${user_id}`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, msg: rows });
    console.log(user_id);
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
  }
};
// @desc 책 반납
// @routes DELETE api/v1/books/return
// @request  token , book_id
// @response success
exports.returnBook = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.book_id;

  let query = `delete from book_rental where user_id = ${user_id} and book_id = ${book_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, msg: e });
  }
};

//
