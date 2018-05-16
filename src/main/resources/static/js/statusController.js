/* global Phaser, statusMain, MenuInitial, RoomMenu */

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");

game.state.add("Menu", MenuInitial);
game.state.add("RoomMenu", RoomMenu);
game.state.add("Game", statusMain);
game.state.start("Menu");