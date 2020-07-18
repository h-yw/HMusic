function peo (num) {
  var c = 0
  // const time = 0
  if (num === 1) {
    return this.time
  } else {
    if (num % 2 === 0) {
      num /= 2
      c += 1
    } else {
      num += 1
      c += 1
    }
    this.time += c
    console.log(this.time)
    peo(num)
  }
}

var a = peo(10)
console.log(a)
