import multer from 'multer';
import ImageKit from 'imagekit';

export const imageKit = new ImageKit({
  publicKey: 'public_wd1C4Blc3kuzLXF9kc49txjPzEY=',
  privateKey: 'private_Q3904+wBxW5O4xZzrzBmaP1RXgo=',
  urlEndpoint: 'https://ik.imagekit.io/niemoo/',
});

const fileStorage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
