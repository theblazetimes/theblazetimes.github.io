jQuery(document).ready(function($) {
    
    // Cache frequently accessed elements
    const $alertbar = $('.alertbar');
    const $navbar = $('nav');
    const $siteContent = $('.site-content');
    const navbarHeight = $navbar.outerHeight();
    
    // Fix for IE/Edge object cover issue
    if ('objectFit' in document.documentElement.style === false) {
        $('.featured-box-img-cover').each(function() {
            const $img = $(this);
            const imgSrc = 'url(' + $img.attr('src') + ')';
            const $imgParent = $img.parent();
            const $div = $('<div></div>');

            $imgParent.append($div);
            $div.css({
                'height': '290px',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'background-position': '50% 20%',
                'background-image': imgSrc
            });
            $img.hide();
        });
    }

    // Alertbar visibility on scroll
    $(document).scroll(function() {
        const scrollTop = $(this).scrollTop();
        scrollTop > 280 ? $alertbar.fadeIn() : $alertbar.fadeOut();
    });

    // Smooth scroll for anchor links
    $('a[href*="#"]:not([href="#"])').click(function(event) {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            const target = $(this.hash);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                event.preventDefault();
            }
        }
    });

    // Hide header on scroll down
    let lastScrollTop = 0;
    const delta = 5;

    $(window).scroll(function() {
        const st = $(this).scrollTop();
        if (Math.abs(lastScrollTop - st) > delta) {
            if (st > lastScrollTop && st > navbarHeight) {
                // Scroll down
                $navbar.removeClass('nav-down').addClass('nav-up').css('top', -navbarHeight + 'px');
            } else if (st + $(window).height() < $(document).height()) {
                // Scroll up
                $navbar.removeClass('nav-up').addClass('nav-down').css('top', '0px');
            }
            lastScrollTop = st;
        }
    });

    // Adjust site content margin based on header height
    $siteContent.css('margin-top', $('header').outerHeight() + 'px');

    // Spoilers click handler
    $(document).on('click', '.spoiler', function() {
        $(this).removeClass('spoiler');
    });
});

// Deferred style loading
const loadDeferredStyles = () => {
    const addStylesNode = document.getElementById('deferred-styles');
    if (addStylesNode) {
        const replacement = document.createElement('div');
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement);
        addStylesNode.parentElement.removeChild(addStylesNode);
    }
};

const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
if (raf) {
    raf(() => setTimeout(loadDeferredStyles, 0));
} else {
    window.addEventListener('load', loadDeferredStyles);
}
