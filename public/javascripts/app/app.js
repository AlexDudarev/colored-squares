// generate new color for square
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// add new square
$('#addSquare').on('click', function () {
    var square = $('<div class="square"></div>');
    $('.pool').append(square);
    square.draggable();
    square.css('background-color', getRandomColor());
    square.css('top', Math.random() * 100 + '%');
    square.css('left', Math.random() * 100 + '%');

});

$(document).on('dblclick', '.square', function () {
    $(this).css('background-color', getRandomColor());
});