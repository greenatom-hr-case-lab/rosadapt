export const dateFormToWords = (anyFormatDate, year) => {
    const date = new Date(anyFormatDate)
    const dd = date.getDate()
    let mm = date.getMonth() + 1
    switch (mm) {
        case 1:
            mm = 'января'
            break
        case 2:
            mm = 'февраля'
            break
        case 3:
            mm = 'марта'
            break
        case 4:
            mm = 'апреля'
            break
        case 5:
            mm = 'мая'
            break
        case 6:
            mm = 'июня'
            break
        case 7:
            mm = 'июля'
            break
        case 8:
            mm = 'августа'
            break
        case 9:
            mm = 'сентября'
            break
        case 10:
            mm = 'октября'
            break
        case 11:
            mm = 'ноября'
            break
        case 12:
            mm = 'декабря'
            break
        default: break
    }
    if (year) return dd + ' ' + mm + ' ' + date.getFullYear()
    return dd + ' ' + mm
}