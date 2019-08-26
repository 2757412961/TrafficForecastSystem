function get_time_text(year, month, day, hour, minute) {
    let text = '';
    text += PrefixInteger(year, 4);
    text += '-' + PrefixInteger(month, 2);
    text += '-' + PrefixInteger(day, 2);
    text += '-' + PrefixInteger(hour, 2);
    text += '-' + PrefixInteger(minute, 2);
    return text;
}

function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
