/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Phaser, game, playerId,points*/

var bgGO;

var GameOver = {
    preload: function () {
        game.load.image("backgroundInitialMenu", "assets/fondoGOver.png");
        game.load.image("boton","assets/btn.png");
    },
    create: function () {
        bgGO = game.add.tileSprite(0, 0, 800, 600, "backgroundInitialMenu");
        
        var txtGO = game.add.text(game.width / 2, game.height / 2 - 120 ,"Perdedor "+playerId +" puntos "+points, {
                font: "bold 40px sans-serif",
                fill: "#ffffff",
                align: "center"
        });
        txtGO.anchor.setTo(0.5);
        var grd = txtGO.context.createLinearGradient(0, 0, 0, txtTitulo.height);
        grd.addColorStop(0, '#fff67a');
        grd.addColorStop(1, '#a09501');
        txtGO.fill = grd;
    },
    update: function () {
        bgGO.tilePosition.x -= 0.2;
    },
    startGame: function () {
        
    }
};
