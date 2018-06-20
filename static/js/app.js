$(document).ready(function(){
    // Pick restaurant button
    $('.pick-restaurant').click(function () {
        const $result = $('#result');
        $result.html(`
            <div class="progress blue lighten-4" style="margin-top: 5em;">
                <div class="indeterminate blue"></div>
            </div>
        `);

        $result.load('/restaurant/pick');
    });

    // Delete button
    $('.delete-btn').click(function(e) {
        e.preventDefault();
        const $form = $(this).closest('form');
        const confirmation = confirm('Are you sure?');
        if (confirmation) $form.submit();
    });

    // Materialize
    $('.modal').modal();
    $('.fixed-action-btn').floatingActionButton();
});