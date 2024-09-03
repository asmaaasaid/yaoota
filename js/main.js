var links = document.querySelectorAll('.recipe');
var recipeName = document.getElementById('recipe-name');
var btnSearch = document.getElementById('btn-search');
var inputSearch = document.getElementById('input-search');
var previosBtn = document.getElementById('prvis-btn');
var nextBtn = document.getElementById('nxt-btn')
for(var i=0 ; i<links.length ; i++){
    links[i].addEventListener('click',function(e){
        var currentMeal = e.target.text;
        getRecipes(currentMeal)
    })
}
btnSearch.addEventListener('click',function(){
    var innerValue=inputSearch.value;
    if(innerValue == ""){
        Swal.fire({
            title: 'Warning!',
            text: 'You must enter the name of recipe',
            confirmButtonText: 'OK',
            allowOutsideClick:false
          })
    }
    else{
        
        getRecipes(innerValue)
    }
})
var listRecipes =[];
var recipesPerPage =8;
var currentPage = 1;

async function getRecipes(meal) {
    try {
        var response = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${meal}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        var resultRecipe = await response.json();
        listRecipes = resultRecipe.recipes;
        recipeName.innerText = `Here are all the ${meal} recipes`;
        displayRecipes();
    } catch (error) {
        console.error(`Meal "${meal}" doesn't exist or there was an issue with the request:`, error.message);
        Swal.fire({
            icon:'error',
            title: '404',
            text: "Oops! the ricepe you are looking for does'nt exist ",
            confirmButtonText: 'OK',
            allowOutsideClick:false
          })
          inputSearch.value="";
    }
}
getRecipes('pizza')

function displayRecipes(){
    var pages = [];
    for(var x =0 ; x<= Math.ceil(listRecipes/recipesPerPage); x++){
        pages.push(x)
    }
    var indexOfLastPage=currentPage*recipesPerPage;
    var indexOfFirstPage=indexOfLastPage-recipesPerPage;
    var currentRecipes=listRecipes.slice(indexOfFirstPage,indexOfLastPage)
    var rowRecipes=``;
    for(var i=0 ; i<currentRecipes.length ; i++){
        rowRecipes+=`
         <div class="col-md-3 ">
            <div class="card  border-0" >
                 <img src="${currentRecipes[i].image_url}" class="card-img-top recipe-img" alt="...">
                <div class="card-body text-capitalize">
                  <h5 class="card-title">${currentRecipes[i].title}</h5>
                  <ul>
                    <li class="fs-6 card-title">publisher's book :${currentRecipes[i].publisher}</li>
                    <li class="fs-6 card-title">social rank :${Math.floor(currentRecipes[i].social_rank)}</li>
                  </ul>
                 
                  
                  <button class="btn my-2   rounded-0"> <a href="${currentRecipes[i].publisher_url}" class="text-decoration-none text-capitalize fw-semibold">publisher source </a></button>
                  <button class="btn   rounded-0"> <a href="${currentRecipes[i].source_url}" class="text-decoration-none text-capitalize fw-semibold">more details...</a></button>
                </div>
              </div>
        </div>`

    }
    document.getElementById('demo').innerHTML=rowRecipes;
    // previosBtn.disabled=currentPage===1;
    // nextBtn.disabled=indexOfLastPage>=listRecipes.length
    if (currentPage === 1) {
        previosBtn.disabled = true;
        previosBtn.classList.add('disabled-btn');
    } else {
        previosBtn.disabled = false;
        previosBtn.classList.remove('disabled-btn');
    }

    if (indexOfLastPage >= listRecipes.length) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled-btn');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled-btn');
    }
}

function getPreviosRecipes(){
    if(currentPage>1){
        currentPage--;
        displayRecipes();
    }
}
previosBtn.addEventListener('click',getPreviosRecipes)
function getNextRecipes(){
    if(currentPage*recipesPerPage < listRecipes.length){
        currentPage++;
        displayRecipes();
    }
}
nextBtn.addEventListener('click',getNextRecipes)

let navSection = document.getElementById('nav');
window.addEventListener('scroll' , ()=>{
    let scrollEl = document.documentElement.scrollTop;
    if(scrollEl>100){
        navSection.style.backgroundColor='#03213b';
        navSection.style.transition='all 0.7s ease-in';
    }
    else
    {
        navSection.style.backgroundColor='transparent';
    }
})