/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Phaser, game, PhaserInput, playerId */
var userName = null;

var MenuInitial = {
    preload: function () {
        game.load.image("backgroundInitialMenu", "assets/fondoMenu.png");
        game.load.image("boton","assets/btn.png");
    },
    create: function () {
        bgMI = game.add.tileSprite(0, 0, 800, 600, "backgroundInitialMenu");

        game.add.plugin(PhaserInput.Plugin);

        userName = game.add.inputField(game.width / 2 - 75, game.height / 2 - 4, {
            font: "18px Arial",
            fill: "#212121",
            fontWeight: "bold",
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: "#000",
            borderRadius: 6,
            placeHolder: "Nombre"
        });


        var txtTitulo = game.add.text(game.width / 2, game.height / 2 - 120, "ASTEROIDS COOP", {
            font: "bold 60px sans-serif",
            fill: "#white", //#01987d
            align: "center"
        });
        txtTitulo.anchor.setTo(0.5);
        var grd = txtTitulo.context.createLinearGradient(0, 0, 0, txtTitulo.height);
        grd.addColorStop(0, '#8ED6FF');
        grd.addColorStop(1, '#004CB3');
        txtTitulo.fill = grd;

        var txtInicial = game.add.text(game.width / 2, game.height / 2 - 30, "Nombre de usuario", {
            font: "bold 24px sans-serif",
            fill: "white",
            align: "center"
        });
        txtInicial.anchor.setTo(0.5);
        
        var boton = this.add.button(game.width / 2, game.height / 2 + 80, "boton", this.startGame, this);
        boton.anchor.setTo(0.5);
        boton.scale.setTo(0.5);

        var txtDevelop = game.add.text(game.width / 2, game.height -30, "     Desarrollado  por  Juan Felipe Ortiz   y   Daniel Ospina       ", {
            font: "bold 12px sans-serif",
            fill: "#def4f4",
            align: "center"
        });
        txtDevelop.anchor.setTo(0.5);
    },
    update: function () {
        bgMI.tilePosition.x -= 0.2;
    },
    startGame: function () {
        if(userName.value !== ""){
            playerId = userName.value;
            this.state.start("Game");
        }else{
            alert("Por favor entrar un nombre de usuario");
        }
        
    }
};
