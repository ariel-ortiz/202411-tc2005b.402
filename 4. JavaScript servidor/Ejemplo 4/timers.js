setTimeout(() => {
  console.log('A');
}, 2000);
setTimeout(() => {
  console.log('B');
  setTimeout(() => {
    console.log('C');
  }, 500);
  console.log('D');
}, 1000);
console.log('E');

