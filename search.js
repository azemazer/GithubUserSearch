async function searchUsers (query) {

    formattedQuery = query.split(", ").join(",").replace(" ", "_")

    try {
        const res = await fetch('https://api.github.com/search/users?q=' + query);
        const data = await res.json();
        return(data);
    }
    catch (e) { 
        console.log(e)
    }
}

async function locallyStoreUser( username ) {
    try {
        const res = await fetch('https://api.github.com/users/' + username);
        const data = await res.json();
        let oldList = localStorage.getItem("githubSavedUsers")
        console.log(typeof oldList)
        if (oldList == null || oldList == '{}') {
            const formattedData = {};
            formattedData[username] = data;
            oldList = formattedData
            console.log('je suis la')
        } else {
            oldList = JSON.parse(oldList)
            oldList[username] = data
            console.log('je suis pas la')
        }
        
        localStorage.setItem("githubSavedUsers", JSON.stringify(oldList))

        return(data);
    }
    catch (e) { 
        console.log(e)
    }
}

function locallyDeleteUser( username ) {
    let oldList = JSON.parse(localStorage.getItem("githubSavedUsers"))
    delete oldList[username];
    localStorage.setItem("githubSavedUsers", JSON.stringify(oldList))
    console.log(oldList)
}

async function onSearch(query = '') {
    let usersQuery = await searchUsers(query);
    console.log(usersQuery);
    renderUsers(usersQuery.items);

}

function renderUsers(users) {

    const usersContainer = document.getElementById("user-search-results-container");
    usersContainer.innerHTML = ''
    if(!users){
        return
    }
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
        userCardLink.classList.add("card-link", "text-align-right");
        userCardLink.href = user.html_url;
        userCardLink.innerText = "Profile"

        const userCardStar = document.createElement("i");
        userCardStar.classList.add("bi", "bi-star");
        userCardStar.style.color = "yellow";
        userCardStar.addEventListener("click", (event) => {
            if(userCardStar.classList.toggle("bi-star")){
                locallyDeleteUser(user.login)
            }; 
            if (userCardStar.classList.toggle("bi-star-fill")){
                locallyStoreUser(user.login)
            }
            ;
        })
        
        userCardBody2.appendChild(userCardStar);
        userCardBody2.appendChild(userCardLink);

        /*
        *   APPENDS
        */
        userCard.append(userImg, userCardBody1, userCardListGroup, userCardBody2)
        usersContainer.appendChild(userCard);

    });

}

const searchUsersButton = document.getElementById("user-search-button");
searchUsersButton.addEventListener("click", (event) => {
    event.preventDefault();
    const searchValue = document.getElementById("user-search-input").value;
    onSearch(searchValue);
})

// onSearch();