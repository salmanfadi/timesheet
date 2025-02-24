document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.querySelector('.close');
    const taskForm = document.getElementById('task-form');
    const todoTasksContainer = document.getElementById('todo-tasks');
    const inprogressTasksContainer = document.getElementById('inprogress-tasks');
    const doneTasksContainer = document.getElementById('done-tasks');

    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const taskProject = document.getElementById('task-project').value;

        const task = document.createElement('div');
        task.classList.add('kanban-task');
        task.innerHTML = `
            <span>${taskName} - ${taskProject}</span>
            <button class="edit-task-btn">Edit</button>
            <button class="delete-task-btn">Delete</button>
        `;

        todoTasksContainer.appendChild(task);

        taskModal.style.display = 'none';
        taskForm.reset();

        addTaskEventListeners(task);
    });

    const addTaskEventListeners = (task) => {
        const editBtn = task.querySelector('.edit-task-btn');
        const deleteBtn = task.querySelector('.delete-task-btn');

        editBtn.addEventListener('click', () => {
            const newTaskName = prompt('Enter new task name:', task.firstChild.textContent.split(' - ')[0]);
            const newTaskProject = prompt('Enter new project name:', task.firstChild.textContent.split(' - ')[1]);
            if (newTaskName !== null && newTaskProject !== null) {
                task.firstChild.textContent = `${newTaskName} - ${newTaskProject}`;
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                task.remove();
            }
        });
    };

    // Add event listeners to existing tasks
    const existingTasks = document.querySelectorAll('.kanban-task');
    existingTasks.forEach(task => {
        addTaskEventListeners(task);
    });

    // Sortable initialization
    const sortableTodo = new Sortable(todoTasksContainer, {
        group: 'tasks',
        animation: 150,
        onEnd: function (evt) {
            const item = evt.item;
            console.log(`Moved item: ${item.textContent}`);
        }
    });

    const sortableInProgress = new Sortable(inprogressTasksContainer, {
        group: 'tasks',
        animation: 150,
        onEnd: function (evt) {
            const item = evt.item;
            console.log(`Moved item: ${item.textContent}`);
        }
    });

    const sortableDone = new Sortable(doneTasksContainer, {
        group: 'tasks',
        animation: 150,
        onEnd: function (evt) {
            const item = evt.item;
            console.log(`Moved item: ${item.textContent}`);
        }
    });
});
