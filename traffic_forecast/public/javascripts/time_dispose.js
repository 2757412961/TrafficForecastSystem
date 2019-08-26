let date, _date;
let _year, _month, _day, _hour, _week;

$(function () {
    $(':input').labelauty();
});

$(document).ready(function () {
    date = new Date();
    _date = date;
    time_to_forecast();
    $("#time_label").text(get_time_label(1));
    $('#time_list').val('' + (_hour));
    $('#real-time').click(function () {
        type_change();
        $("#time_label").text(get_time_label(1));
        dispose('real-time');
    });
    $('#forecast').click(function () {
        type_change();
        $("#time_label").text(get_time_label(2));
        $('#week' + _week).css('color', 'red');
        dispose('forecast');
    });
    $('#week0').click(function () {
        week_change(0);
        dispose('forecast');
    });
    $('#week1').click(function () {
        week_change(1);
        dispose('forecast');
    });
    $('#week2').click(function () {
        week_change(2);
        dispose('forecast');
    });
    $('#week3').click(function () {
        week_change(3);
        dispose('forecast');
    });
    $('#week4').click(function () {
        week_change(4);
        dispose('forecast');
    });
    $('#week5').click(function () {
        week_change(5);
        dispose('forecast');
    });
    $('#week6').click(function () {
        week_change(6);
        dispose('forecast');
    });
    $('#time_list').mouseup(function () {
        _hour = parseInt($('#time_list').val());
        $("#time_label").text(get_time_label(2));
        dispose('forecast');
    });
});

function type_change() {
    date = new Date();
    $('.week').css('color', 'blue');
    let ele = document.getElementById('real-time');
    if (ele.checked) {
        $('#forecast_panel').css('display', 'none');
    } else {
        $('#forecast_panel').css('display', 'inline');
    }
}

function week_change(week_index) {
    date = new Date();
    $('.week').css('color', 'blue');
    let delta = week_index - date.getDay();
    _date = new Date(date.getTime() + delta*24*60*60*1000);
    time_to_forecast();
    $('#week' + _week).css('color', 'red');
    $("#time_label").text(get_time_label(2));
}

//Function to get time
function time_to_forecast() {
    _year = _date.getFullYear();
    _month = _date.getMonth() + 1;
    _day = _date.getDate();
    _hour = parseInt($('#time_list').val());
    _week = _date.getDay();
}

function get_time_label(type) {
    let text_result = 'Time On Map: ';
    if (type === 1) {
        text_result += date.getHours() + ':' + PrefixInteger(date.getMinutes(), 2) + ' (' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ')';
    } else {
        text_result += _hour + ':00 (' + _year + '-' + _month + '-' + _day + ')';
    }
    return text_result;
}

function dispose(type) {
    if (type === 'real-time') {
        console.log('Now: ' + date.getHours() + ':' + PrefixInteger(date.getMinutes(), 2) + ' (' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ')');
        //todo: display the real-time layer.
        changeLayer(_tmsUrl, get_time_text(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes()));
    } else {
        let myDate = new Date();
        let forecast = true;
        if (_week < myDate.getDay()) {
            forecast = false;
        } else if (_week > myDate.getDay()) {
            forecast = true;
        } else {
            if (_hour <= myDate.getHours()) {
                forecast = false;
            } else if (_hour > myDate.getHours()) {
                forecast = true;
            }
        }
        if (forecast) {
            console.log('Forecast: ' + _hour + ':00 (' + _year + '-' + _month + '-' + _day + ')');
            //todo: display the forecast layer.
            changeLayer(_tmsUrl, get_time_text(_year, _month, _day, _hour, 0));
        } else {
            console.log('Old: ' + _hour + ':00 (' + _year + '-' + _month + '-' + _day + ')');
            //todo: display the old layer.
            changeLayer(_tmsUrl, get_time_text(_year, _month, _day, _hour, 0));
        }
    }
}
