$(".sd-menu-toggle").click(function(){
    $(".hero-header .navbar")
    .toggleClass("bg-light")
    .toggleClass("bg-dark");
})

let PARTICLES_LOADED = false;

if( window.outerWidth > 768 && !PARTICLES_LOADED){
    particlesJS.load('particles-js', 'https://raw.githubusercontent.com/Cover-UI/blogger/main/web%20template/particlesjs-config.json');
    PARTICLES_LOADED = true;
 }

$(window).resize( function(event) {
    if( window.outerWidth > 768 && !PARTICLES_LOADED){
        particlesJS.load('particles-js', 'https://raw.githubusercontent.com/Cover-UI/blogger/main/web%20template/particlesjs-config.json');
        PARTICLES_LOADED = true;
     }
     
})

let list = [
    {
        title: "Home",
        url: "/"
    },
    {
        title: "About",
        url: "/about"
    },
    {
        title: "Projects",
        url: "/projects"
    },
    {
        title: "_Themes",
        url: "/themes"
    },
    {
        title: "__Blogger",
        url: "/blogger"
    },
    {
        title: "__Blogger",
        url: "/blogger"
    },
    {
        title: "_Templates",
        url: "/templates"
    },
    {
        title: "Contact",
        url: "/contact"
    }
];

let THEME_CONFIG = {
    menu: list,
    portfolio: [
        {
            img: "./images/w-1.jpg",
            title: "Web Development Projects",
            url: "#"
        },
        {
            img: "./images/w-2.jpg",
            title: "Web Design Projects",
            url: "#"
        },
        {
            img: "./images/apİ.jpg",
            title: "API Development Projects",
            url: "#"
        },
        {
            img: "./images/robo.jpg",
            title: "Robotics Projects",
            url: "#ali"
        }
    ]
}

$.fn.themeConfig = function(config){
    for (let i = 0; i < 4; i++) {
        $(`#portfolio-${i+1} img`).attr("src",config.portfolio[i].img);
        $(`#portfolio-${i+1} p`).text(config.portfolio[i].title);
        $(`#portfolio-${i+1} a`).attr("href",config.portfolio[i].url);
    }
    
    jQuery(document).ready(function(){
        let $ = jQuery;
        $(".sd-desktop-menu").addMenu(config.menu);
        $(".sd-mobile-menu").addMenu(config.menu);
        $().mobileMenuInit();
    });

}

$(document).themeConfig(THEME_CONFIG);

