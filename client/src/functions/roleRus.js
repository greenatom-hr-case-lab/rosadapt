export const roleRus = (userRole) => {
    switch (userRole) {
        case 'hr': return 'HR'
        case 'tyro': return 'стажёр'
        case 'head': return 'руководитель'
        default:break
    }
}