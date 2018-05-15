/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Phaser, statusMain, MenuInitial, RoomMenu, GameOver */

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");

game.state.add("Menu", MenuInitial);
game.state.add("RoomMenu", RoomMenu);
game.state.add("Game", statusMain);
game.state.add("GameOver", GameOver);

game.state.start("Menu");