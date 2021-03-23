/**
 * Views:
 * - Layout
 * - Sidebar
 * - Header
 * - Footer
 * - Home 
 * - Category 
 * - Tag 
 * - Page 
 * - Post 
 * - Archive 
 * - Search 
 * - Error 
 */
function BloggerClient(config = {}) {
    this.config = {
        base_uri: window.location.origin,
        ...config
    };
    this._defaults = {
        feedPages: `${this.config.base_uri}/feeds/pages/default?alt=json`,
        feedPosts: `${this.config.base_uri}/feeds/posts/default?alt=json`,
        searchPosts: `${this.config.base_uri}/feeds/posts/default?alt=json&max-results=`
    }

    this._globals = {
        post: false,
        post_list: [],
        sidebars: [],
        categories: [],
        widgets:{}
    }

    this.feeds = {
        postFeed: false,
        pageFeed: false,
        searchPostFeed: false,
        searchPageFeed: false
    }

    this.addSidebar("default",
                    "<div class='blogger-widget'><div class='widget-title'>",
                    "</div>",
                    "<div class='widget-content'>",
                    "</div></div>");

    this._getJsonFeed(this._defaults.feedPages, (json) => {
        this.feeds.pageFeed = json;
        this.feeds.searchPageFeed = json;
    });

    this._getJsonFeed(this._defaults.feedPosts, (json) => {
        this.feeds.postFeed = json;
        this._globals.post_list = json.posts
    });

    this._getJsonFeed(this._defaults.searchPosts+this.feeds.postFeed.totalResults, (json) => {
        this.feeds.searchPostFeed = json;
    });

    new Vue({
        el: this.config.el,
        data:{
            globals: this._globals,
            feeds: this.feeds,
            urlType: this.getUrlType()
        },
        provide: function () {
            return {
                sidebars: this.globals.sidebars,
                widgets: this.globals.widgets,
                urlType: this.urlType
            }
        }
    })
}

BloggerClient.prototype._getJsonFeed = async function(uri,cb) {
    let _jsonFeed = false;

    await fetch(uri)
    .then(f => f.json())
    .then(feed => _jsonFeed = feed)
    .catch(e => console.error(e));

    let feed = _jsonFeed.feed;
    let i = feed.id.$t.split(":");
    i = i[i.length-1].split("-")[1];

    cb({
        authors: feed.author,
        tags: feed.category,
        blogID: i,
        posts: feed.entry,
        startIndex: feed.openSearch$startIndex.$t,
        totalResults: feed.openSearch$totalResults.$t,
        title: feed.title.$t,
        subtitle: feed.subtitle.$t,
        updated: feed.updated.$t
    });    
}

BloggerClient.prototype.addSidebar = function(id,bef_title,af_title,bef_content,af_content) {
    this._globals.sidebars.push({
        id:id,
        beforeTitle: bef_title,
        afterTitle: af_title,
        beforeContent: bef_content,
        afterContent: af_content
    });  
    
    this.addWidget(id,{
        title:"",
        content: ""
    })
}

BloggerClient.prototype.getSidebar = function (id) {
    return this._globals.sidebars.filter((s)=> s.id == id)[0];
}

BloggerClient.prototype.addCategory = function(cat_name) {
    this._globals.categories.push({
        name: cat_name,
        uri: `${this.config.base_uri}/search/label/${cat_name}?max-results=7`
    });    
}

BloggerClient.prototype.getCategory = function (name) {
    return this._globals.categories.filter((c)=> c.name == name)[0];
}

BloggerClient.prototype.getCategories = function () {
    return this._globals.categories;
}

BloggerClient.prototype.havePosts = function () {
    return this._globals.post_list.length > 0 ? true : false;
}

BloggerClient.prototype.thePost = function () {
    for (let i = 0; i < this._globals.post_list.length; i++) {
        const p = this._globals.post_list[i];
        
        if(p){
            this._globals.post = p;
            this._globals.post_list[i] = false;
            break;
        }
    }
}

BloggerClient.prototype.theTitle = function () {
    return this._globals.post ? this._globals.post.title.$t : false; 
}

BloggerClient.prototype.theContent = function () {
    return this._globals.post ? this._globals.post.content.$t : false; 
}

BloggerClient.prototype.theUpdated = function () {
    return this._globals.post ? this._globals.post.updated.$t : false; 
}

BloggerClient.prototype.thePublished = function () {
    return this._globals.post ? this._globals.post.published.$t : false; 
}

BloggerClient.prototype.theAuthor = function () {
    return this._globals.post ? {
        name: this._globals.post.author[0].name.$t,
        url: this._globals.post.author[0].url.$t,
        email: this._globals.post.author[0].email.$t,
        image: this._globals.post.author[0].gd$image.src
    } : false; 
}

BloggerClient.prototype.theThumbnailUrl = function () {
    if(this._globals.post){
        let el = document.createElement("div");
        el.innerHTML = this._globals.post.content.$t;
        return el.querySelector("img").src;
    }
    return false;
}

BloggerClient.prototype.thePermalink = function () {
    if(this._globals.post){
        return this._globals.post.link.filter(l => l.rel == "alternate")[0].href;
    }
    return false;
}

BloggerClient.prototype.theTags = function () {
    if(this._globals.post){
        return this._globals.post.category;
    }
    return false;
}

BloggerClient.prototype.getUrlType = function () {
    let uri = window.location.href;

    let is_home = uri == `${window.location.origin}/`;
    let is_page = uri.search(`${this.config.base_uri}/p/`) != -1;
    let is_label = uri.search(`${this.config.base_uri}/search/label/`) != -1;
    let is_search = false;
    if(!is_label){
        is_search = uri.search(`${this.config.base_uri}/search/`) != -1;
    }
    let is_archive = is_home || is_page || is_search == false;
    let is_post = false;

    if(is_home){
        return "home";
    }else if(is_page){
        return "page";
    }else if(is_label){
        let label = window.location.pathname.split("/");
        label = label[ label.length - 1 ];
        
        if( this.getCategory(label) ){
            return "category";
        }
        return "tag";
    }else if(is_search){
        return "search";
    }else if(is_archive){
        let uri = window.location.pathname.split("/");
        is_archive = uri[ uri.length-1 ] == "";
        if(is_archive)
            return "archive";
        return "post";
    }else{
        return "error";
    }
}

BloggerClient.prototype.addWidget = function (sidebar, options) {
    if(this._globals.widgets[sidebar] == undefined){
        this._globals.widgets[sidebar] = []
    }

    this._globals.widgets[sidebar].push(options);
}

BloggerClient.view = function (view_name,options) {
    Vue.component(view_name,options);
}

BloggerClient.renderWidget = function (sidebar,widget) {
    let html = `
    ${sidebar.beforeTitle}${widget.title}${sidebar.afterTitle}
    ${sidebar.beforeContent}${widget.content}${sidebar.afterContent}
    `;

    return html;
}