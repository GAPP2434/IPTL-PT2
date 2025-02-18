document.addEventListener('DOMContentLoaded', () => {
    loadStudents();

    // Add event listener for the toggle button
    const toggleButton = document.getElementById('toggle-student-list');
    const studentListContainer = document.getElementById('student-list-container');

    toggleButton.addEventListener('click', () => {
        if (studentListContainer.style.display === 'none') {
            studentListContainer.style.display = 'block';
            toggleButton.textContent = 'Hide Student List';
        } else {
            studentListContainer.style.display = 'none';
            toggleButton.textContent = 'Show Student List';
        }
    });
});

document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('studentNumber', document.getElementById('studentNumber').value);
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    const response = await fetch('/students', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        document.getElementById('student-form').reset();
        loadStudents();
    }
});

// Function to load students from the database
async function loadStudents() {
    const response = await fetch('/students');
    const students = await response.json();
    const studentList = document.getElementById('student-list');

    // Clear existing rows
    studentList.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.studentNumber}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td><img src="${student.photo}" width="80" height="80" style="border-radius: 5px;"></td>
            <td>
                <button onclick="editStudent('${student._id}', '${student.studentNumber}', '${student.name}', '${student.email}', '${student.photo}')">Edit</button>
                <button onclick="deleteStudent('${student._id}')">Delete</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

// Function to delete a student
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        await fetch(`/students/${id}`, { method: 'DELETE' });
        loadStudents();
    }
}

// Function to edit a student
function editStudent(id, studentNumber, name, email, photo) {
    document.getElementById('studentNumber').value = studentNumber;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Student';
    updateButton.onclick = async () => {
        const formData = new FormData();
        formData.append('studentNumber', document.getElementById('studentNumber').value);
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('photo', document.getElementById('photo').files[0]);

        await fetch(`/students/${id}`, {
            method: 'PUT',
            body: formData
        });

        document.getElementById('student-form').reset();
        updateButton.remove();
        loadStudents();
    };
    document.getElementById('student-form').appendChild(updateButton);
}