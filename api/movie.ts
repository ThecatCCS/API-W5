import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { MoviePostRequest } from "../modle/moviepost";


export const router = express.Router();

router.get("/", (req,res)=>{
        const sql = "select * from movie";
        conn.query(sql,(err,result)=>{
            res.json(result);
        })
    }
);

router.get("/:name", (req, res) => {
    const movieName = req.params.name; 

    let sql = "SELECT * FROM movie WHERE moviename LIKE ?";
    let params = ['%' + movieName + '%'];

    conn.query(sql, params, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


router.post("/add", (req, res) => {
    let movie: MoviePostRequest = req.body;
    let sql =
          "INSERT INTO `movie`(`moviename`, `movieimg`, `movievideo`, `Director`,`Writer`,`movietype`,`Stars`) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql, [
        movie.moviename,
        movie.movieimg,
        movie.movievideo,
        movie.Director,
        movie.Writer,
        movie.movietype,
        movie.Stars

        ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.put("/addStars/:movieId", (req, res) => {
    let movieId = req.params.movieId;
    let newStars = req.body.Stars.split(',').map((name: string) => name.trim()); 
    let getExistingStarsSql = "SELECT `Stars` FROM `movie` WHERE `movieid` = ?";
    conn.query(getExistingStarsSql, [movieId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).json({ message: "Movie not found" });
        } else {
            let existingStars = result[0].Stars.split(',').map((name: string) => name.trim());
            let updatedStars = [...existingStars, ...newStars];
            let updatedStarsString = updatedStars.join(', '); 
            let updateStarsSql = "UPDATE `movie` SET `Stars` = ? WHERE `movieid` = ?";
            conn.query(updateStarsSql, [updatedStarsString, movieId], (err, result) => {
                if (err) throw err;
                res.status(200).json({ message: "Stars added successfully" });
            });
        }
    });
});
router.put("/removeStars/:movieId", (req, res) => {
    let movieId = req.params.movieId;
    let removeStar = req.body.Stars.trim();

    let getExistingStarsSql = "SELECT `Stars` FROM `movie` WHERE `movieid` = ?";
    conn.query(getExistingStarsSql, [movieId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).json({ message: "Movie not found" });
        } else {
            let existingStars = result[0].Stars.split(',').map((name: string) => name.trim());
            let updatedStars = existingStars.filter((name: string) => name !== removeStar); // กรองชื่อดาราที่ต้องการลบออก
            let updatedStarsString = updatedStars.join(', '); // รวมชื่อดาราเป็นสตริงใหม่
            let updateStarsSql = "UPDATE `movie` SET `Stars` = ? WHERE `movieid` = ?";
            conn.query(updateStarsSql, [updatedStarsString, movieId], (err, result) => {
                if (err) throw err;
                res.status(200).json({ message: "Stars removed successfully" });
            });
        }
    });
});

router.put("/addDirector/:movieId", (req, res) => {
    let movieId = req.params.movieId;
    let newDirector = req.body.Director.split(',').map((name: string) => name.trim()); 
    let getExistingDirectorSql = "SELECT `Director` FROM `movie` WHERE `movieid` = ?";
    conn.query(getExistingDirectorSql, [movieId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).json({ message: "Movie not found" });
        } else {
            let existingDirector = result[0].Director.split(',').map((name: string) => name.trim());
            let updatedDirector = [...existingDirector, ...newDirector];
            let updatedDirectorString = updatedDirector.join(', '); 
            let updateDirectorSql = "UPDATE `movie` SET `Director` = ? WHERE `movieid` = ?";
            conn.query(updateDirectorSql, [updatedDirectorString, movieId], (err, result) => {
                if (err) throw err;
                res.status(200).json({ message: "Director added successfully" });
            });
        }
    });
});


router.put("/removeDirector/:movieId", (req, res) => {
    let movieId = req.params.movieId;
    let removeDirector = req.body.Director.trim();

    let getExistingDirectorSql = "SELECT `Director` FROM `movie` WHERE `movieid` = ?";
    conn.query(getExistingDirectorSql, [movieId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).json({ message: "Movie not found" });
        } else {
            let existingDirector = result[0].Director.split(',').map((name: string) => name.trim());
            let updatedDirector = existingDirector.filter((name: string) => name !== removeDirector);
            let updatedDirectorString = updatedDirector.join(', ');
            let updateDirectorSql = "UPDATE `movie` SET `Director` = ? WHERE `movieid` = ?";
            conn.query(updateDirectorSql, [updatedDirectorString, movieId], (err, result) => {
                if (err) throw err;
                res.status(200).json({ message: "Director removed successfully" });
            });
        }
    });
});

  router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from movie where movieid = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });