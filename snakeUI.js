(function(root) {
  var Game = root.Game = (root.Game || {} );

  var View = Game.View = function (el) {
    this.$el = el;
    this.leaderboard = this.parseLeaderboard(localStorage.leaderboard) || [];
  };

  View.prototype.parseLeaderboard = function(leaderboard){
    if(!leaderboard) return false;
    return JSON.parse(leaderboard);
  }

  View.prototype.start = function () {
    var that = this;
    this.board = new Game.Board();
    this.stopped = false;
    this.paused = true;
    $(window).off('keydown');
    $(window).on('keydown', function(event){
      that.handleKeyEvent(event)
    });
    $('#clearLeaders').on('click', function(){
      that.clearLeaderboard();
    })
    this.render();
  };

  View.prototype.clearLeaderboard = function(){
    this.leaderboard = [];
    localStorage.leaderboard = "";
    this.renderLeaderboard();
  }

  View.prototype.handleKeyEvent = function(event) {
    // console.log(event);
    if($(event.target).attr('id') != "name") {
      if(event.keyCode == 37) {
        this.board.snake.queueTurn('R');
      } else if(event.keyCode == 39) {
        this.board.snake.queueTurn('L');
      } else if(event.keyCode == 80) {
        this.togglePause();
      } else if(event.keyCode == 82) {
        if(!this.stopped) this.stop();
        this.start();
      }
    }
  };

  View.APPLE_FREQUENCY = 0.1;

  View.prototype.step = function () {
    this.board.snake.move();
    if(this.board.hasLost()) return this.stop();
    this.board.maybeEatApple();
    if(Math.random() < View.APPLE_FREQUENCY){
      this.board.distributeApple();
    }
    this.render();
  };

  View.prototype.stop = function(){
    clearInterval(this.timer);
    this.addScore();
    this.stopped = true;
    this.renderLeaderboard();
  }

  View.prototype.togglePause = function () {
    var that = this;
    if(!this.paused) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(function(){
      that.step()}
      , 100);
    }
    this.paused = !this.paused;
  };

  View.prototype.render = function(){
    $('#scoreboard').text('score: ' + this.board.score);
    this.renderBoard();
    this.renderLeaderboard();
  };

  View.prototype.renderLeaderboard = function(){
    $('#leaders').html('')
    for(var i = 0; i < this.leaderboard.length && i < 25; i++){
      $('#leaders').append($('<li>' + this.leaderboard[i][0] + "\t\t" +
                            this.leaderboard[i][1] + '</li>'))
    }
  };

  View.prototype.renderBoard = function(){
    this.$el.html('');
    for(var i = 0; i < Game.Board.SIZE; i++){
      for(var j = 0; j < Game.Board.SIZE; j++){
        var tile = $('<div class="tile"></div>');
        this.$el.append(tile);
        if(this.board.snake.isOn([j, i])) {
          tile.addClass('snake');
        } else if (this.board.hasApple([j, i])){
          tile.addClass('apple');
        }
      }
    }
  };

  View.prototype.addScore = function(){
    var name = $('#name').val();
    this.leaderboard.push([this.board.score, name]);
    this.leaderboard.sort(function(a,b){return b[0]-a[0]});
    localStorage.leaderboard = JSON.stringify(this.leaderboard);
  }

})(this);


$(function (){
  v = new Game.View($('#wrapper'));
  v.start();
});
