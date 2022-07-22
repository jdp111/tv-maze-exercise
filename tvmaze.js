"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
//var display = []

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const showList = await axios({
    url: `http://api.tvmaze.com/search/shows?q=${term}`,
    method: "GET",
  })
  return showList.data.map(function(value){
    const temp = {};
    temp.id =  value.show.id;
    temp.name =  value.show.name;
    if (value.show.image){
    temp.image =  value.show.image.medium;}
    else{temp.image = "No image Available -JP"}
    return temp
  })
}

function populateShows(shows) {
  $showsList.empty();
console.log(shows)
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt= "${show.name} cover"  
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id=${show.id} class="btn btn-outline-light btn-sm Show-getEpisodes" value = "Episodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
  
}


async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  console.log(term)
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


$showsList.on("click",".Show-getEpisodes",async function(event){
const id = event.target.id;
console.log(id)
$('section').attr("style","display: block")
$('#episodes-list').empty();

const episodes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  
  episodes.data.forEach((element,index) => {
    const title = element.name;
    const nextEp = $("<li></li>").append(`${index+1}.  ${title}`);
  $("#episodes-list").append(nextEp)
  });
});

