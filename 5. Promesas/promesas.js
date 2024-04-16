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

// const p = makePromise(1001);

// p.then(resultado => {
//   console.log('Promesa resuelta', resultado);
// }).catch(err => {
//   console.log('Promesa rechazada', err);
// });

async function main() {
  console.log('Inicio de main');
  let x;
  x = await makePromise(1001);
  console.log('x =', x);
  console.log('Fin de main');
  return 42;
  // throw 666;
}

// main()
// .then(z => {
//   console.log('z =', z);
// })
// .catch(err => {
//   console.log('err =', err);
// });

(async () => {
  try {
    let z = await main();
    console.log('z =', z);
  } catch (err) {
    console.log('err =', err);
  }
})();

console.log('Fin de programa');
