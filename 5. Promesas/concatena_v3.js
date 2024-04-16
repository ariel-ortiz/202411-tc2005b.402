const fsPromises = require('fs/promises');

async function main() {
  try {
    let resultado = '';
    const fileNameArray = ['001.txt', '002.txt', '003.txt', '001.txt'];
    for (const fileName of fileNameArray) {
      resultado += (await fsPromises.readFile(fileName)).toString();
    }
    await fsPromises.writeFile('004.txt', resultado);
    console.log('File 004.txt has been created.');
    return 42;
  } catch (err) {
    console.log('err =', err);
  }
}

// main()
// .then(r => {
//   console.log(r);
//   console.log('Fin de programa.');
// });

(async () => {
  let r = await main();
  console.log(r);
  console.log('Fin de programa');
})();
