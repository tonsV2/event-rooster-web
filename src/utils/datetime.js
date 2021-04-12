import moment from "moment"

function toLocaleDatetimeString(datetimeString) {
    const datetime = new Date(datetimeString);
    return datetime.toLocaleDateString() + ' ' + datetime.toLocaleTimeString()
}

function toISOWithOffsetString(datetime) {
    return moment(new Date(datetime)).format()
}

export {toLocaleDatetimeString, toISOWithOffsetString}
