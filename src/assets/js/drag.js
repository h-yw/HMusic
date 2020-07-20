function Drag (ev) {
  this.oDiv = ev.target // document.querySelector(elem)
  var _this = this
  this.oDiv.onmousedown = function (ev) {
    _this.down(ev)
  }
  document.onmouseup = this.moveStop
}

Drag.prototype.down = function (ev) {
  ev = ev || window.event
  // alert(ev.this.offsetX + ',' + ev.this.offsetY)
  this.offsetX = ev.clientX - this.oDiv.offsetLeft
  this.offsetY = ev.clientY - this.oDiv.offsetTop
  var _this = this
  document.onmousemove = function (ev) {
    _this.Move(ev)
  }
}

Drag.prototype.Move = function (ev) {
  ev = ev || window.event
  this.oDiv.style.left = ev.clientX - this.offsetX + 'px'
  this.oDiv.style.top = ev.clientY - this.offsetY + 'px'
}

Drag.prototype.moveStop = function () {
  document.onmousemove = null
}

export default Drag
