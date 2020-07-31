export const statusOfPlanRus = (plan) => {
    switch (plan.level) {
        case 1: return "Заполнение сотрудником"
        case 2: return "Согласование руководителем"
        case 3: return "Выполнение"
        case 4: return "Оценка руководителем"
        case 5: return "Оценка завершена"
        default:return "none"
    }
}