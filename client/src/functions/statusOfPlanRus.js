export const statusOfPlanRus = (plan) => {
    switch (plan.level) {
        case 1: return "заполнение сотрудником"
        case 2: return "согласование с руководителем"
        case 3: return "выполняется"
        case 4: return "оценивается руководителем"
        case 5: return "завершён"
        default:return "none"
    }
}