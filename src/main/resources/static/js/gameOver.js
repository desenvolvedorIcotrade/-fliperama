/* global Phaser, game, playerId, points, player, ClientModule*/

var bgGO;

var GameOver = {
    lostScreen: function () {
        var txtGO = game.add.text(game.width / 2, game.height / 2 - 120 ,"Perdiste!\n"+playerId +" puntos "+points, {
                font: "bold 40px sans-serif",
                fill: "#ffffff",
                align: "center"
        });
        txtGO.anchor.setTo(0.5);
        var grd = txtGO.context.createLinearGradient(0, 0, 0, txtGO.height);
        grd.addColorStop(0, "#fff67a");
        grd.addColorStop(1, "#a09501");
        txtGO.fill = grd;
        
        var txtMenu = game.add.text(game.width / 2, game.height / 2 + 50, "Volver al Menu", {
                font: "bold 25px sans-serif",
                fill: "#ffffff",
                align: "center"
        });
        txtMenu.anchor.setTo(0.5);
        
        var boton = game.add.button(game.width / 2, game.height / 2 + 100, "boton", this.nextScreen, this);
        boton.anchor.setTo(0.5);
        boton.scale.setTo(0.5);
        
        player.kill();
        ClientModule.informPlayerKilled(playerId);
        
    },
    nextScreen: function () {
        game.state.start("RoomMenu");
        ClientModule.disconnectStomp();
    }
};
