export const filterTasks = (tasks, done, current) => {
    let arrNeed = []
    let dateNow = new Date()
    dateNow = new Date(dateNow.setDate(dateNow.getDate()+1))
    tasks.forEach(function(task) {
        const dateStart = new Date(task.date.dateStart)
        if (task.done === done){
            if (done === true){
                arrNeed.push(task)
            } else {
                switch (current) {
                    case true:
                        if (dateStart <= dateNow) arrNeed.push(task)
                        break
                    case false:
                        if (dateStart > dateNow) arrNeed.push(task)
                        break
                    default: arrNeed.push(task)
                }
            }
        }
    })
    return arrNeed
}