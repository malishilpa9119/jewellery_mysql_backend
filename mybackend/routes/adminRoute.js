const express = require('express');
const router = express.Router();
const {imageValidation} = require('../helpers/validation')
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
      cb(null, path.join(__dirname, '../public/images'));
    },
    filename:function(req, file, cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    }
})

const filefilter = (req, file, cb) => {
   (file.mimetype == 'image/jpeg' ||  file.mimetype == 'image/png' || file.mimetype =='image/svg+xml' || file.mimetype =='image/gif')?cb(null,true):cb(null,false)
}

const upload = multer({
     storage:storage,
     fileFilter:filefilter
     });

const adminController = require('../controllers/adminController')

const {isAuthorize} = require('../middleware/auth')

router.get('/images',adminController.images);
router.post('/addimages',upload.single('imageUrl'),isAuthorize,imageValidation,adminController.addImage);
router.delete('/delete/:id',isAuthorize,adminController.deleteImage);

module.exports = router;