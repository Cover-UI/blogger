const $ = require("jquery");
require("jquery-modal");

var sd_popup_modal_delay = 5;
var container_id = ".post-content.post-body";

function sd_get_search_url(value){
    return "/search?q="+value;
}

function sd_get_hashtag_el(value){
    return '<a class="sd_blogger_hashtag" href="'+sd_get_search_url(value)+'">#'+value+'</a>';
}

function sd_hashtag_split(array){
    let hashtag_array = [];
    for (let i = 0; i < array.length; i++) {
        const hashtag = array[i];
        if(i==0){
        
            hashtag_array.push(hashtag);
        }else{
            if ( !( array[i-1].endsWith('href="') || array[i-1].endsWith("href='") ) ){
                hashtag_array.push(hashtag);
            }
        }
    }
    return hashtag_array;
    
}

//let container_id = "main";

$.fn.blogger_hashtag_plugin = function(){
    try {
        let html = $(this).html();
        html = html.split("#");
        html = sd_hashtag_split(html);
        for (let i = 1; i < html.length; i++) {
            let hashtag = html[i].split(" ");
            
            hashtag[0] = sd_get_hashtag_el(hashtag[0]);
    
            html[i] = hashtag.join(" ");
        }
        html = html.join("");
        $(this).html(html);
    } catch (error) {
    console.log(error); 
        
    }
} 

try {
    $(container_id).blogger_hashtag_plugin();
} catch (error) {
    console.log(error);
}


setTimeout(function sd_popup_modal(){
    if(!sessionStorage.getItem('sd_popup_modal') == 'true'){
        $('.modal').modal();
        sessionStorage.setItem('sd_popup_modal','true');
    }
},sd_popup_modal_delay*1000);




function getInstaFeed(){
    return new Promise((resolve, reject) => {
        fetch("https://www.instagram.com/stingydeveloper/?__a=1").then(x=>x.json()).then(a=>{resolve(a)}).catch(e=>reject(e));
    });
}

$(document).ready(function(){
    getInstaFeed().then(api=>{
        var data = api.graphql.user.edge_owner_to_timeline_media.edges;
        let $carousel = $(".owl-carousel");
        let feed_arr = [];    
        for (let i = 0; i < data.length; i++) {

            if(data[i].node.edge_sidecar_to_children != undefined){
                const d = data[i].node.edge_sidecar_to_children.edges;
                d.forEach(e => {
                    feed_arr.push(e.node.display_url);
                });
            }else{
                const d = data[i].node.thumbnail_src;
                feed_arr.push(d);
            }
            
        }

        feed_arr.forEach(f => {
            let el = `
            <div><img src='${f}'/></div>
            `;
            $carousel.html($carousel.html()+el);            
        });

        $carousel.owlCarousel({
            items: 3,
            margin: 10,
            autoplayTimeout: 1500
        });
    })
    
  });