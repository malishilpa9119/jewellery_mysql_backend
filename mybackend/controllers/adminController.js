const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const db = require("../config/dbConnection");

const images = (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    db.query("SELECT * FROM images", (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No image found" });
      }
  
      res.json({ success: true, data: results });
    });
  };
  

const addImage = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    const category = req.body.category;
    const imageUrl = `images/${req.file.filename}`;
  
    const query = "INSERT INTO images (category, imageUrl) VALUES (?, ?)";
    db.query(query, [category, imageUrl], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
      }
  
      res.status(201).json({ success: true, message: "Image uploaded successfully!" });
    });
  };
 
const deleteImage = (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const imageId = req.params.id; 
    const findQuery = "SELECT imageUrl FROM images WHERE id = ?";
    db.query(findQuery, [imageId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Image not found" });
        }

        const imageUrl = results[0].imageUrl;
        const filePath = path.join(__dirname, "../public/images", imageUrl.split('images/')[1]); 

        const deleteQuery = "DELETE FROM images WHERE id = ?";
        db.query(deleteQuery, [imageId], (deleteErr) => {
            if (deleteErr) {
                console.error(deleteErr);
                return res.status(500).json({ message: "Failed to delete image from database", error: deleteErr.message });
            }

            
            fs.unlink(filePath, (fileErr) => {
                if (fileErr) {
                    console.error(fileErr);
                   
                    return res.status(200).json({ 
                        success: true, 
                        message: "Image record deleted, but file was not found or couldn't be deleted." 
                    });
                }

                res.status(200).json({ success: true, message: "Image deleted successfully!" });
            });
        });
    });
};

module.exports = {
  images,
  addImage,
  deleteImage
};
