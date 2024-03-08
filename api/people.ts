import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { PeoplePostRequest } from "../modle/people";


export const router = express.Router();

router.get("/all", (req,res)=>{
    const sql = "select * from people";
    conn.query(sql,(err,result)=>{
        res.json(result);
    })
}
);

router.post("/add", (req, res) => {
    let people: PeoplePostRequest = req.body;
    let sql =
          "INSERT INTO `people`(`name`,`img`, `age`,`detail`) VALUES (?,?,?,?)";
    sql = mysql.format(sql, [
        people.name,
        people.img,
        people.age,
        people.detail

        ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });


router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from people where id = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });