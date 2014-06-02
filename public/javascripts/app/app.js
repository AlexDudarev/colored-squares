// generate new color for square
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// generate guid
var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

//init sockets
var socket = io();

function setSquareParams(square, paramColor, coordTop, coordLeft) {
    square.css('background-color', paramColor);
    square.css('top', coordTop);
    square.css('left', coordLeft);
}

// create square from servers request or click
function createSquare(squareAttrs) {
    var sqClass = 'square';
    var squareGuid = guid(),
        coordTop = (Math.random() * 100) + '%',
        coordLeft = (Math.random() * 100) + '%',
        paramColor = getRandomColor();

    if (squareAttrs) {
        squareGuid = squareAttrs.id;
        sqClass = 'other-user-square';
        coordTop = squareAttrs.top;
        coordLeft = squareAttrs.left;
        paramColor = squareAttrs.color;
    }

    var square = $('<div id="' + squareGuid + '" class="' + sqClass + '"></div>');
    $('.pool').append(square);

    setSquareParams(square, paramColor, coordTop, coordLeft);

    if (!squareAttrs) {
        square.draggable({
            stop: function(){
                squareEdited($(this));
            }
        });
        socket.emit('square created', {
            id: squareGuid,
            top: coordTop,
            left: coordLeft,
            color: paramColor
        });
    }
}

// after color or position changed send message to server
function squareEdited(square) {
    socket.emit('square edited', {
        id: square.attr('id'),
        top: square.css('top'),
        left: square.css('left'),
        color: square.css('background-color')
    });
}

//receive message and handle
socket.on('square created', function (msg) {
    createSquare(msg);
});

//receive message and handle
socket.on('square edited', function (squareAttrs) {
    var square = $('#' + squareAttrs.id);
    setSquareParams(square, squareAttrs.color, squareAttrs.top, squareAttrs.left);
});

// add new square to random position
$('#addSquare').on('click', function () {
    createSquare();
});

//change color on dbl click
$(document).on('dblclick', '.square', function (event) {
    var color = getRandomColor();
    $(this).css('background-color', color);
    squareEdited($(this));
    event.preventDefault();
});