const sharp = require('sharp');
const fs = require('fs');

module.exports = async function(image_path, new_path) {
  //Redimenciona a imagem para um tamanho de 300x300 e salva na pasta 'resized'
  await sharp(image_path)
  .resize(300)
  .toFile(new_path)

  //Deleta a imagem antiga que esta na pasta 'uploads'
  fs.unlinkSync(image_path);
}