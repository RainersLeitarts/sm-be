import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL ?? "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export default multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.R2_BUCKET_NAME ?? "",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (_, file, cb) {
      const fileNameArr = file.originalname.split(".");
      const fileExt =
        fileNameArr.length > 1
          ? fileNameArr[fileNameArr.length - 1]
          : fileNameArr[0];
      cb(null, `${uuidv4()}.${fileExt}`);
    },
    acl: "public-read",
    contentDisposition: "attachment",
  }),
}).array("file");
