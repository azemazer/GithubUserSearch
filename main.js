async function searchUsers (query) {

    formattedQuery = query.split(", ").join(",").replace(" ", "_")

    try {
        const res = await fetch('https://api.github.com/search/users?q=' + query + '&query=');
        const data = await res.json();
        return(data);
    }
    catch (e) { 
        console.log(e)
    }
}

async function onSearch(query = 'roc') {
    let usersQuery = await searchUsers(query);
    console.log(usersQuery);
    renderUsers(usersQuery.items);

}

function renderUsers(users) {

    const usersContainer = document.getElementById("user-search-results-container")
    users.forEach(user => {
        
        const userCard = document.createElement("div");
        userCard.classList.add("card", "text-white", "bg-dark", "mb-3");
        userCard.style.width = "18rem";

        /*
        *   HEAD
        */

        const userImg = document.createElement("img");
        userImg.classList.add("card-img-top");
        userImg.alt = user.login + "'s avatar";
        userImg.src = user.avatar_url;

        /*
        *   BODY 1
        */
        const userCardBody1 = document.createElement("div");
        userCardBody1.classList.add("card-body");

        const userCardTitle = document.createElement("h5"); 
        userCardTitle.classList.add("card-title");
        userCardTitle.innerText = user.login;
        
        userCardBody1.appendChild(userCardTitle);

        /*
        *   ITEM LIST
        */
        const userCardListGroup = document.createElement("ul");    
        userCardListGroup.classList.add("list-group", "list-group-flush");    

        const userCardListGroupItem1 = document.createElement("li");   
        userCardListGroupItem1.classList.add("list-group-item", "text-white", "bg-dark");
        userCardListGroupItem1.innerText = "Score : " + user.score;     

        const userCardListGroupItem2 = document.createElement("li");  
        userCardListGroupItem2.classList.add("list-group-item", "text-white", "bg-dark");
        userCardListGroupItem1.innerText = user.site_admin ? "Is an admin." : "Is a " + user.type;
        
        userCardListGroup.append(userCardListGroupItem1, userCardListGroupItem2);

        /*
        *   BODY 2 (LINK)
        */
        const userCardBody2 = document.createElement("div");
        userCardBody2.classList.add("card-body");        

        const userCardLink = document.createElement("a"); 
        userCardLink.classList.add("card-link");
        userCardLink.href = user.html_url;
        userCardLink.innerText = "Profile"
        
        userCardBody2.appendChild(userCardLink);

        /*
        *   APPENDS
        */
        userCard.append(userImg, userCardBody1, userCardListGroup, userCardBody2)
        usersContainer.appendChild(userCard);

    });

}

onSearch();