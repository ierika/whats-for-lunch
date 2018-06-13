$(document).ready(function(){
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