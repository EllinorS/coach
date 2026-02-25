import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Chemin du dossier d’upload
const uploadDir = path.resolve('uploads');

// Création du dossier uploads s’il n’existe pas
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
 
}

// Liste blanche des types MIME autorisés
const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
];

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    }
});

// Filtre de fichiers sécurisé
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error('Formats autorisés : PNG, JPEG, WEBP, SVG'),
            false
        );
    }
};

// Export du middleware Multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 Mo
    }
});
