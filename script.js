// Mobile Menu Toggle
document.querySelector('.hamburger').addEventListener('click', function () {
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');

    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navCta.style.display = navCta.style.display === 'flex' ? 'none' : 'flex';
});

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Pricing Toggle
const toggle = document.getElementById('pricing-toggle');
const priceElements = document.querySelectorAll('.price span');

toggle.addEventListener('change', function () {
    if (this.checked) {
        priceElements[0].textContent = '$79';
        priceElements[1].textContent = '$239';
    } else {
        priceElements[0].textContent = '$99';
        priceElements[1].textContent = '$299';
    }
});


// Contact Form Validation
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Name validation
    if (!name) {
        document.getElementById('nameError').textContent = 'Name is required';
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    // Email validation
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Message validation
    if (!message) {
        document.getElementById('messageError').textContent = 'Message is required';
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    }

    // If form is valid, show success message
    if (isValid) {
        // In a real application, you would send the data to a server here
        document.getElementById('formSuccess').textContent = 'Thank you for your message! We will get back to you soon.';
        document.getElementById('formSuccess').style.display = 'block';

        // Reset form
        document.getElementById('contactForm').reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            document.getElementById('formSuccess').style.display = 'none';
        }, 5000);
    }
});

// To-Do List Application
document.addEventListener('DOMContentLoaded', function () {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tasksLeft = document.getElementById('tasksLeft');
    const clearCompleted = document.getElementById('clearCompleted');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
        });

        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks found';
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach((todo, index) => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('todo-checkbox');
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleTodo(index));

                const todoText = document.createElement('span');
                todoText.classList.add('todo-text');
                if (todo.completed) todoText.classList.add('completed');
                todoText.textContent = todo.text;

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.innerHTML = '&times;';
                deleteBtn.addEventListener('click', () => removeTodo(index));

                todoItem.appendChild(checkbox);
                todoItem.appendChild(todoText);
                todoItem.appendChild(deleteBtn);

                todoList.appendChild(todoItem);
            });
        }

        updateTasksLeft();
        saveToLocalStorage();
    }

    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text !== '') {
            todos.push({
                text,
                completed: false
            });
            todoInput.value = '';
            renderTodos();
        }
    }

    // Toggle todo completion status
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    // Remove todo
    function removeTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    // Update tasks left counter
    function updateTasksLeft() {
        const activeTodos = todos.filter(todo => !todo.completed).length;
        tasksLeft.textContent = `${activeTodos} ${activeTodos === 1 ? 'task' : 'tasks'} left`;
    }

    // Clear completed todos
    function clearCompletedTodos() {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    }

    // Save todos to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Event listeners
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTodo();
    });

    clearCompleted.addEventListener('click', clearCompletedTodos);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });

    // Initial render
    renderTodos();
});