async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

async function getStudentActivities() {
    const response = await fetch(`http://localhost:3001/activities`);
    const responsejson = await response.json();
    return responsejson;
}

async function studentActivitiesRegistration(data) {
    const method = data[0];
    if (method === 'CREATE') {
        const name = data[1];
        const day = data[2];
        const response = await addStudent(name, day);
        return response;
    } else if (method === 'DELETE') {
        const id = data[1];
        const response = await deleteStudent(id);
        return response;
    } else {
        err = "Invalid method"
        return err;
    }
}

async function addStudent(name, day) {
    const activities = await getStudentActivities();
    const selectActivities = activities.filter(activity => activity.days.includes(day));
    const activityMap = selectActivities.map((activity) => ({
        name: activity.name,
        desc: activity.desc
    })
    )
    const response = await fetch(`http://localhost:3001/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, activities: activityMap })
    });
    const responsejson = await response.json();
    return responsejson;
}

async function deleteStudent(id) {
    const response = await fetch(`http://localhost:3001/students/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responsejson = await response.json();
    return responsejson;
}

process_argv()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};
