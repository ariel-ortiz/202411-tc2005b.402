function inc(x) {
  return x + 1;
}

console.log(inc(5));

const f = (x => x + 1);

console.log(f(5));

const a = [2, 5, 7, 2, 1, 0];

console.log(a.map(x => x * x));
console.log(a.map(inc));

setTimeout(() => { console.log("first time out"); }, 1000);
setTimeout(() => { console.log("second time out"); }, 500);
console.log('The end');
