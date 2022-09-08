export const parseDate = (d) => {
    const dateGiven = String(new Date(Date.parse(d)));
    const relevant = dateGiven.split('G')[0].split(' ');
    const date = relevant.slice(0, 4);
    const time = relevant[4].split(':').slice(0, 2);
    let add = " AM";

    if (Number(time[0]) >= 12) {
        add = " PM";
        time[0] = String(Number(time[0]) - 12);
    }

    const intermediate = Number(time[0]);
    time[0] = intermediate + 12 * (intermediate <= 0); //0 -> 12, rest unchanged

    date.push(time.join(':'));
    return date.join(' ') + add;
}

export const convertFilters = (filters) => {
    const d = {};
    const splits = filters.replace(/[ ]+/g, '').split(';'); //remove all whitespace
    for (let i = 0; i < splits.length; i++) {
        d[splits[i].split(':')[0]] = splits[i].split(':')[1]
        if (splits[i].split(':')[0] == 'bloodTypes') {
            d[splits[i].split(':')[0]] = `[${splits[i].split(':')[1]}]`
            //bloodTypes array
        }
    }
    return d;
}

export const getUsers = (otherUsers, predicate) => Object.keys(otherUsers).filter(id => predicate(otherUsers[id])).map(id => otherUsers[id]);