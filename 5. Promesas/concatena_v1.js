const fs = require('fs');

function main() {
  let resultado = '';
  fs.readFile('001.txt', (err, data) => {
    if (err) {
      console.log('Hubo un error:', err);
      return;
    }
    resultado += data.toString();
    fs.readFile('002.txt', (err, data) => {
      if (err) {
        console.log('Hubo un error:', err);
        return;
      }
      resultado += data.toString();
      fs.readFile('003.txt', (err, data) => {
        if (err) {
          console.log('Hubo un error:', err);
          return;
        }
        resultado += data.toString();
        fs.writeFile('004.txt', resultado, err => {
          if (err) {
            console.log('Hubo un error:', err);
            return;
          }
          console.log('File 004.txt has been created.');
        });
      });
    });
  });
  console.log(resultado);
}

main();
