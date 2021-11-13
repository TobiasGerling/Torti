
function fillCakeList() {

    

    if (allCakes.length != 0) {
        var cardTemplate = document.querySelector("#cardTemplate");
        for (var i = 0; i < allCakes.length; i++) {
        var tempNode = cardTemplate.content.cloneNode(true);
        tempNode.querySelector("p.kuchenName").textContent = allCakes[i];
        tempNode.querySelector("img.kuchenBild").src = "uploads/" + allCakes[i] + "/" + allCakes[i] +".png" ;

        var currentCard = tempNode.querySelector("li.card")
        currentCard.id = allCakes[i];
        currentCard.tabIndex = 1;
        currentCard.setAttribute("onclick", "selectionChanged(this.id)");   
        cakeList.appendChild(tempNode); 
        }
        
    }
}