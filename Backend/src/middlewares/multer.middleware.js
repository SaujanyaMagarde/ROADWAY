import multer from "multer"

const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, "./public/temp")
},
filename: function (req, file, cb) {
    cb(null,file.originalname)
    // cb(null,'${file.fieldname}_${Date.now()}${path.extreame(file.originalname)}')
}  
})
//filname get all local fiile path for cloudinary
export const upload = multer({ storage: storage })