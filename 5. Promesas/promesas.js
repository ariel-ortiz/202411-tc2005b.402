function makePromise(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (n % 2 == 0) {
        resolve(n);
      } else {
        reject(`No me gustan los números impares: ${n}`);
      }
    }, n);
  });
}

const p = makePromise(1001);

p.then(resultado => {
  console.log('Promesa resuelta', resultado);
}).catch(err => {
  console.log('Promesa rechazada', err);
});
