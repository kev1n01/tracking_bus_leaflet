saveUser = (type) => {
    type === 'driver' ? sumCountDriver() : sumCountStudent()
}

countDriverStorage = () => {
    drivers = localStorage.getItem('driver')
    return drivers
}

countStudentStorage = () => {
    drivers = localStorage.getItem('student')
    return drivers
}

sumCountDriver = () => {
    count = countDriverStorage()
    if (count === null) {
        localStorage.setItem('driver', 1)
    } else {
        count < 6 ? localStorage.setItem('driver', parseInt(count) + 1) : alert("Solo se permite 6 Conductores")
    }
}

sumCountStudent = () => {
    count = countStudentStorage()
    if (count === null) {
        localStorage.setItem('student', 1)
    } else {
        localStorage.setItem('student', parseInt(count) + 1)
    }
}

export {
    saveUser,
    countDriverStorage,
    countStudentStorage,
    sumCountDriver,
    sumCountStudent
}