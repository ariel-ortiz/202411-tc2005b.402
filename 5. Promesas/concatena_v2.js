const fsPromises = require('fs/promises');

function main() {
  let resultado = '';
  fsPromises.readFile('001.txt')
  .then(data => {
    resultado += data.toString();
    return fsPromises.readFile('002.txt');
  })
  .then(data => {
    resultado += data.toString();
    return fsPromises.readFile('003.txt');
  })
  .then(data => {
    resultado += data.toString();
    return fsPromises.writeFile('004.txt', resultado);
  })
  .then(() => {
    console.log('File 004.txt has been created.');
  })
  .catch(err => {
    console.log(err);
  });
}

main();
