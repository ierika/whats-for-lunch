$(document).ready(function(){
    // Search
    const autocompleteData = {};

    let restaurants = (function(){
        $.ajax({
            type: 'GET',
            url: '/static/restaurants.json',
            success: function(data) {
                restaurants = data.restaurants;
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
        $.ajax({
            type: 'GET',
            url: '/pick',
            success: function(data) {
                const $result = $("#result");
                $result.html(`
                    <div class="progress">
                        <div class="indeterminate"></div>
                    </div>
                `);

                setTimeout(() => {
                    $result.html(data);
                }, 1000);
            },
        });
    });


    // Modal

    $('.modal').modal();
});
