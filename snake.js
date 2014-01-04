(function(root) {
  var Game = root.Game = (root.Game || {} );

  var Snake = Game.Snake = function () {
    this.dir = [0, 1];
    this.segments = [[10,10]];
    this.length = 1;
  };

  Snake.prototype.move = function () {
    if(this.queuedDir) this.turn();
    var newPos = [this.dir[0] + this.head()[0], this.dir[1] + this.head()[1]]
    if(this.segments.length > this.length - 1) {
      this.segments.shift();
    }
    if(this.isOn(newPos)) this.ateItself = true;
    this.segments.push(newPos);

  };

  Snake.prototype.queueTurn = function(dir){
    this.queuedDir = dir;
  }

  Snake.prototype.turn = function () {
    if(this.queuedDir == 'L') {
      this.dir = [-this.dir[1], this.dir[0]];
    } else {
      this.dir = [this.dir[1], -this.dir[0]];
    }
    this.queuedDir = null;
  };

  Snake.prototype.isOn = function(coord){
    for(var i = 0; i < this.segments.length; i++) {
      if (this.segments[i][0] == coord[0] &&
          this.segments[i][1] == coord[1]) {
            return true;
      }
    }
    return false;
  };

  Snake.prototype.eatApple = function() {
    this.length += 4;
  };

  Snake.prototype.head = function(){
    return this.segments[this.segments.length - 1];
  }

})(this);