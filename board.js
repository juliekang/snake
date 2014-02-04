// Anything that involves referring specific attributes or positions in the board
// is placed here.  Score is also kept here.

(function(root){
  // root.Game = require("./snake.js");
  var Game = root.Game = (root.Game || {});

  var Board = Game.Board = function() {
    this.snake = new Game.Snake();
    this.apples = [];
    this.score = 0;
  }

  Board.SIZE = 20;

  // Before we made the css/html front end, we tested our board/snake
  // logic in the command line.

  // Board.prototype.render = function(){
  //   var output = "";
  //   for(var i = 0; i < Board.SIZE; i++){
  //     for(var j = 0; j < Board.SIZE; j++){
  //       if(this.snake.isOn([j, i])) {
  //         output += "S ";
  //       } else {
  //         output += ". ";
  //       }
  //     }
  //     output += "\n"
  //   }
  //   return output;
  // };

  Board.prototype.distributeApple = function(){
    var appleLocation = [Math.floor(Math.random() * Board.SIZE),
                         Math.floor(Math.random() * Board.SIZE)]
    if(this.snake.isOn(appleLocation) || this.hasApple(appleLocation)){
      this.distributeApple();
    } else {
      this.apples.push(appleLocation);
    }
  };

  Board.prototype.hasApple = function(coord){
    for(var i = 0; i < this.apples.length; i++) {
      if (this.apples[i][0] == coord[0] &&
          this.apples[i][1] == coord[1]) {
            return true;
      }
    }
    return false;
  };

  // The board doesn't actually eat apples, of course, but  
  // since the board keeps track of apple locations and the score,
  // it should handle what to do when the snake does eat an apple.
  Board.prototype.maybeEatApple = function(){
    if(this.hasApple(this.snake.head())){
      this.snake.eatApple();
      this.score += 10;
      this.getRidOfApple(this.snake.head());
    }
  };

  Board.prototype.getRidOfApple = function(coord){
    for(var i = 0; i < this.apples.length; i++) {
      if (this.apples[i][0] == coord[0] &&
          this.apples[i][1] == coord[1]) {
            this.apples.splice(i, 1);
      }
    }
  };

  Board.prototype.hasLost = function(){
    return this.snake.ateItself || this.outOfBounds();
  }

  Board.prototype.outOfBounds = function(){
    var head = this.snake.head();
    return head[0] >= Board.SIZE || head[1] >= Board.SIZE ||
           head[0] < 0 || head[1] < 0;
  };

})(this);

// var b = new this.Game.Board();
//
// b.render();
// console.log(b.snake.segments.indexOf([10, 10]));