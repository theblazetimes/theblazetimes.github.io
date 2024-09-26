---
layout: null
sitemap: false
---

{% assign counter = 0 %}
var documents = [{% for page in site.pages %}{% unless page.url contains '.xml' or page.url contains 'assets' or page.url contains 'category' or page.url contains 'tag' %}
{
    "id": {{ counter }},
    "url": "{{ site.url }}{{ site.baseurl }}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '</h3>', ': ' | replace: '</h4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}"
}{% assign counter = counter | plus: 1 %}{% unless forloop.last %},{% endunless %}{% endunless %}{% endfor %}];

var idx = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('body');

    documents.forEach(function (doc) {
        this.add(doc);
    }, this);
});

function lunr_search(term) {
    const $lunrResults = $('#lunrsearchresults');
    $lunrResults.show(400);
    $('body').addClass("modal-open");
    
    $lunrResults.html(`
        <div id="resultsmodal" class="modal fade show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog shadow-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header" id="modtit">
                        <h5 class="modal-title">Search results for '${term}'</h5>
                        <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <ul class="mb-0"></ul>
                    </div>
                    <div class="modal-footer">
                        <button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    if (term) {
        const results = idx.search(term);
        const $resultsList = $lunrResults.find('ul');

        if (results.length > 0) {
            results.forEach(result => {
                const ref = result.ref;
                const url = documents[ref].url;
                const title = documents[ref].title;
                const body = documents[ref].body.substring(0, 160) + '...';

                $resultsList.append(`
                    <li class='lunrsearchresult'>
                        <a href='${url}'>
                            <span class='title'>${title}</span><br />
                            <small><span class='body'>${body}</span><br />
                            <span class='url'>${url}</span></small>
                        </a>
                    </li>
                `);
            });
        } else {
            $resultsList.append("<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>");
        }
    }
    
    return false;
}

$(function() {
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide(5);
        $('body').removeClass("modal-open");
    });
});
