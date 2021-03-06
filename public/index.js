
const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

let editStatus = false;
let id = '';

const saveTask = (title, description) => db.collection('tasks').doc().set({
    title,
    description
});

const getTasks = () => db.collection('tasks').get();
const getTask = (id) => db.collection('tasks').doc(id).get();
const onGetTask = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = id => db.collection('tasks').doc(id).delete();
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask); 


window.addEventListener('DOMContentLoaded', async (e) => {
    // const querySnapshot = await getTasks();

    onGetTask((querySnapshot)=>{
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc =>{

            const task = doc.data();
            task.id = doc.id; // ID de cada tarea en la base de datos

            taskContainer.innerHTML += `
            <div class="card bg-dark p-2 text-white-50">
                <div class="card-title" id="titulo">
                    <h4 class="text-center text-capitalize bg-dark">${task.title}</h4>
                </div>
                <div class="card-body">
                <p>${task.description}</p>
                </div>
                <div class="clearfix p-2">
                    <button class="btn btn-outline-secondary  btn-sm btn-delete" data-id="${task.id}">Borrar</button>
                    <button class="btn btn-secondary btn-sm btn-edit float-right" data-id="${task.id}">Editar</button>
                </div>
            </div>`;

            const btnDelete = document.querySelectorAll('.btn-delete');

            btnDelete.forEach(btn =>{
                btn.addEventListener('click', async (e) => {
                    console.log()
                    await deleteTask(e.target.dataset.id);
                })
            })

            const btnEdit = document.querySelectorAll('.btn-edit');
            
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskForm['task-title'].value = task.title;
                    taskForm['task-description'].value = task.description;
                    taskForm['btn-task-form'].innerText = 'Cambiar'
                })
            })

        })
    })
})

taskForm.addEventListener('submit',async (e) =>{
    e.preventDefault();

    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    if (!editStatus) {        
        await saveTask(title.value, description.value);
    } else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        });

        editStatus = false;
        taskForm['btn-task-form'].innerText = 'Guardar';
        id = '';
    }

    await getTasks();

    taskForm.reset();
    title.focus();
})
