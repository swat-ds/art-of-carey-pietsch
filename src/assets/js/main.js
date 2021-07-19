/*
 *
 * minimal jquery animations for landing page
 *
 */
// until I figure out a way to simply grab global variables
const pathPrefix = '/art-of-carey-pietsch';
// const pathPrefix = '';
const thumbEndpoint = 'https://ds-pages.swarthmore.edu/art-of-carey-pietsch/art/thumbs';
const fuseIndex = `${pathPrefix}/assets/js/collection.json`;

// scroll view jQuery function
$.fn.scrollView = function() {
    return this.each(function(){
        $('html, body').animate({
            scrollTop: $(this).offset().top
    }, 1000);
    });
}

function returnActiveFacets($el) {
    let activeFacets = [];
    $el.not('.inactive').each( (i,d) => {
        activeFacets.push(d.dataset.facet);
    })

    return activeFacets;
}

$(function(){
    const images = document.getElementById('image-list') || null;
    const $facets = $('.facet-buttons button');
    const $sort = $('.sort-buttons button');
    const $searchBar = $('.search #searchBar');;
    const $searchResults = $('.search #search-results ul');;
    // fuse.js options
    let fuse = {};
    const fuseOptions = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        keys: [
        "Title",
        "Description"
        ]
    }

    // Initialize scrolltop
    $(document).on('scroll', function(d){
        let currTop = $(this).scrollTop();
        if ( currTop > 100 ){
            $('.splash .navigation').addClass('show');
        } else {
            $('.splash .navigation').removeClass('show')
        }
    });

    // Initialize fuse.js
    $.getJSON(fuseIndex).then( (data) => {
        fuse = new Fuse(data, fuseOptions);
        $searchBar.on('input', (e) => {
            e.preventDefault();
            $searchResults.fadeOut(100).empty();
            fuse.search($(e.target).val()).slice(0,10).forEach( (d) => {
                let result = `
<li>
<a class="row" href="${pathPrefix}/items/${d.item.id}.html">
<div class="column work-thumbnail" style="background-image: url(${thumbEndpoint}/${d.item.Photos[0].split('.')[0]}-sm.jpg);" alt="thumbnail of"></div>
<div class="column">
<span class="work-title">${d.item.Title}</span>
<span class="work-date">${d.item.Date || ''}</span>
<span class="work-description">${d.item.Description.substr(0,80) + '&#8230;'}</span>
</div>
</a>
</li>
`;
                $searchResults.append(result).fadeIn(50);
            });
        })

    })

    // Initialize viewerjs
    if (images) {
        const viewer = new Viewer(images, {
            backdrop: true,
            movable: true,
            toolbar: false
        });
    }

    // Initialize isotope layout
        let activeFacets = returnActiveFacets($facets);

        const $grid = $('.collection-grid').isotope( {
            itemSelectors: '.collection-item',
            layoutMode: 'fitRows'
        });
        // $grid.isotope({ sortBy: 'date' })

        $facets.on('click', (e) => {
            e.preventDefault();
            let $currButton = $(e.target);
            let currFacet = $currButton.data('facet');

            if ($facets.filter('.inactive').length === 0) {
                $facets.not(`[data-facet=${currFacet}]`).addClass('inactive');
            } else if ( !$currButton[0].className.includes('inactive') ) {
                $facets.removeClass('inactive');
                currFacet = '';
            } else {
                $facets.not(`[data-facet=${currFacet}]`).
                    addClass('inactive');
                $currButton.removeClass('inactive');
            }

            $grid.isotope( { 
                filter: (currFacet) ? '.' + currFacet : ''
            });
        });

        $sort.on('click', (e) => {
            e.preventDefault();
            let currSort = $(e.target).data('sort');
            $sort.removeClass('inactive');                
            $sort.not(`[data-sort=${currSort}]`).addClass('inactive');
            $grid.isotope( { sortBy: currSort });
        });
});