const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../config/dbConnection");

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This user is alread in use!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).send({
              msg: err,
            });
          }
          else{
            db.query(
                `INSERT INTO users (name,email,password) VALUES ( '${req.body.name}', ${db.escape(
                    req.body.email
                )},${db.escape(hash)});`,
                (err, result)=>{
                    if (err) {
                        return res.status(400).send({
                          msg: err,
                        });
                      }
                      return res.status(200).send({
                        msg: 'The user has been registered',
                      });
                      
                }
            )
          }
        });
      }
    }
  );
};

const login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.query(
        `SELECT * FROM users WHERE email =${db.escape( req.body.email )};`,
        (err, result)=>{
            if(err){
                return res.status(400).send({msg:err});
            }

            if(!result.length){
                return res.status(401).send({
                    msg:'Email or Password is incorrect!'
                });
            }
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    if(bErr){
                        return res.status(400).send({msg:bErr});
                    }
                    if(bResult){
                        //console.log(JWT_SECRET);
                        const token = jwt.sign({id:result[0].id}, JWT_SECRET, {expiresIn:'1d'});
                        return res.status(200).send({
                            msg:'logged In',
                            token,
                            user: result[0]
                        });
                    }
                    return res.status(401).send({
                        msg:'Email or Password is incorrect!'
                    });
                }
            )
        }
    )
};

const getUser = (req,res) => {
  const authToken = req.headers.authorization.split(' ')[1];
  const decode = jwt.verify(authToken, JWT_SECRET);

  db.query('SELECT * FROM users where id=?', decode.id, function(error, result, fields){
    if(error) throw error;

    return res.status(200).send({success:true, data:result[0], message:'Fetch Successfully'});
  })
};


const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, JWT_SECRET);

    const { email, password } = req.body;

    // Check if at least one field is provided
    if (!email && !password) {
      return res.status(400).json({ msg: "Email or password must be provided to update." });
    }

    let sql = "UPDATE users SET ";
    const data = [];

    // Add email to update query if provided
    if (email) {
      sql += "email = ?, ";
      data.push(email);
    }

    // Add password to update query if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += "password = ?, ";
      data.push(hashedPassword);
    }

    // Remove trailing comma and add condition
    sql = sql.slice(0, -2) + " WHERE id = ?";
    data.push(decode.id);

    // Execute the query
    db.query(sql, data, (error, result) => {
      if (error) {
        return res.status(400).send({ msg: error.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ msg: "User not found or no changes made." });
      }

      res.status(200).send({ msg: "Profile updated successfully." });
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};


module.exports = {
  signup,
  login,
  getUser,
  update
};
