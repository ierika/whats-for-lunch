$(document).ready(function(){
    // Pick restaurant button
    $('.pick-restaurant').click(function () {
        const $result = $('#result');
        $result.html(`
            <div class="progress blue lighten-4" style="margin-top: 5em;">
                <div class="indeterminate blue"></div>
            </div>
        `);

        $result.load('/pick');
    });

    // Materialize Modal
    $('.modal').modal();
});