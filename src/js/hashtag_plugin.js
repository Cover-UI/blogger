function sd_get_search_url(value){
    return `/search?q=${value}`;
}

function sd_get_hashtag_el(value){
    return `<a class="sd_blogger_hashtag" href="${sd_get_search_url(value)}"><b>#</b><strong>${value}</strong></a>`;
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
} 

