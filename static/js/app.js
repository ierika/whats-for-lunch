$(document).ready(function(){
    // Search
    const autocompleteData = {};

    let restaurants = (function(){
        $.ajax({
            type: 'GET',
            url: '/static/restaurants.json',
            success: function(data) {
                restaurants = data;
                console.log(restaurants);
                for (restaurant of restaurants) {
                    autocompleteData[restaurant.name] = null;
                }
            },
        });
    })();

    $('input.autocomplete').autocomplete({
      data: autocompleteData,
    });

    $('#search-form').submit(function(e) {
        e.preventDefault();
        alert('Search is not working yet');
    });


    // Pick restaurant button
    $('.pick-restaurant').click(function () {
        const $result = $("#result");
        $result.html(`
            <div class="progress blue lighten-4" style="margin-top: 5em;">
                <div class="indeterminate blue"></div>
            </div>
        `);
        setTimeout(() => {
            $result.load('/pick');
        }, 500);
    });


    // Are you sure confirm modal
    $('.are-you-sure').click(function() {
        const conf = confirm('Are you sure?');
        if (!conf) return false;
        return true;
    });

    // Modal
    $('.modal').modal();
});