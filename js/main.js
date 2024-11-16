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
       <div class="col-md-3 position-relative">
        <div class="card  p-4 rounded-3 bg-transparent border-0 shadow" >
            <img src="${currentRecipes[i].image_url}" class="w-100 recipe-img rounded" alt="recipe picture">
            <h6 class="text-light mt-3 rounded ps-2 py-2 text-capitalize">${currentRecipes[i].title.split(" ").slice(0,3).join(" ")} <a class="fw-normal text-lowercase " href="${currentRecipes[i].source_url}">see more</a></h6>
            <div data-bs-toggle="modal" data-bs-target="#exampleModal"  onclick="recipeDetails(${currentRecipes[i].recipe_id})" class="showrecipe rounded-3  justify-content-center align-items-center text-light position-absolute w-100 top-0 end-0 start-0 bottom-0">
               <span class="text-uppercase fw-medium">show recipe</span>
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

let allRecipeDetails=''
async function recipeDetails(id){
    let details =await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
    let data= await details.json();
    allRecipeDetails=await data.recipe;
    console.log(allRecipeDetails)
    showRecipeDetails()
}

function showRecipeDetails(){
    let title=document.querySelector('#title');
    let image_detail = document.querySelector('#image_detail');
    let publishDetail = document.querySelector('#publishDetail');
    let badge = document.querySelector('.badge');
    let publishSrc = document.querySelector('.publishSrc');
    let moreUrl=document.querySelector('.moreUrl');
    let listItem=document.querySelector('.listItem')
    let item='';

    image_detail.setAttribute('src',`${allRecipeDetails.image_url}`);
    publishDetail.innerHTML=allRecipeDetails.publisher;
    title.innerHTML=allRecipeDetails.title;
    badge.innerHTML=Math.round(allRecipeDetails.social_rank);
    publishSrc.setAttribute('href',`${allRecipeDetails.publisher_url}`);
    moreUrl.setAttribute('src',`${allRecipeDetails.source_url}`);

    for(let i=0 ; i<allRecipeDetails.ingredients.length ; i++){
      item+=`<li>${allRecipeDetails.ingredients[i]}</li>`
    }
    listItem.innerHTML=item
}