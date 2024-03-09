import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { MoviePostRequest } from "../modle/moviepost";
import { objectPostRepost } from "../modle/people";

export const router = express.Router();

router.get("/", (req, res) => {
  const sql = `
        SELECT 
        m.*, 
        GROUP_CONCAT(DISTINCT p1.name) AS Stars,
        GROUP_CONCAT(DISTINCT p2.name) AS Creators
        FROM movie m
        LEFT JOIN Stars s ON m.movieid = s.m_id
        LEFT JOIN people p1 ON s.p_id = p1.id
        LEFT JOIN creator c ON m.movieid = c.m_id
        LEFT JOIN people p2 ON c.p_id = p2.id
        GROUP BY m.movieid
      `;
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/:name", (req, res) => {
  const movieName = req.params.name;

  let sql = `SELECT 
    m.*, 
    GROUP_CONCAT(DISTINCT p1.name) AS Stars,
    GROUP_CONCAT(DISTINCT p2.name) AS Creators
    FROM movie m
    LEFT JOIN Stars s ON m.movieid = s.m_id
    LEFT JOIN people p1 ON s.p_id = p1.id
    LEFT JOIN creator c ON m.movieid = c.m_id
    LEFT JOIN people p2 ON c.p_id = p2.id
    WHERE moviename LIKE ?
    GROUP BY m.movieid`;
  let params = ["%" + movieName + "%"];

  conn.query(sql, params, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/add", (req, res) => {
  let movie: MoviePostRequest = req.body;
  let sql =
    "INSERT INTO `movie`(`moviename`, `movieimg`, `movievideo`,`Writer`,`movietype`) VALUES (?,?,?,?,?)";
  sql = mysql.format(sql, [
    movie.moviename,
    movie.movieimg,
    movie.movievideo,
    movie.Writer,
    movie.movietype,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.post("/addStars", (req, res) => {
  let oject: objectPostRepost = req.body;
  let sql = "INSERT INTO `Stars`(`m_id`, `p_id`) VALUES (?,?)";
  sql = mysql.format(sql, [oject.m_id, oject.p_id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/removeStars/:starsid", (req, res) => {
  let starsid = req.params.starsid;
  conn.query("delete from Stars where s_id = ?", [starsid], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

router.post("/addDirector", (req, res) => {
  let oject: objectPostRepost = req.body;
  let sql = "INSERT INTO `creator`(`m_id`, `p_id`) VALUES (?,?)";
  sql = mysql.format(sql, [oject.m_id, oject.p_id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/removeDirector/:drectorid", (req, res) => {
  let drectorid = req.params.drectorid;
  conn.query(
    "delete from creator where c_id = ?",
    [drectorid],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({ affected_row: result.affectedRows });
    }
  );
});

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("delete from movie where movieid = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});
