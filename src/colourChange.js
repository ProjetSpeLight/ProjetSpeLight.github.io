function changeColorGround(player,game) {
    player.body.onBeginContact.add(groundHit,game);
    


    function groundHit(body, shapeA, shapeB, equation) {

            switch (body.sprite.key) {
                case 'groundYellow':
                   
                    break;
                case 'groundGreen':
                    player.color = ColorEnum.GREEN;
                    player.frame = player.color.value * 9 + 4;
                    break;
                case 'groundRed':
                    player.color = ColorEnum.RED;
                    player.frame = player.color.value * 9 + 4;  
                    break;
                case 'groundBlue':
                    player.color = ColorEnum.BLUE;
                    player.frame = player.color.value * 9 + 4;
                    break;
                default:
            }
    }
}
// ajouter la collision par le dessus et non de coté ou en dessous

