var fs = require('fs');

function A() {
  console.log('a');
}

function c(d) {
  d();
}

c(A);
