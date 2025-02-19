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

    // Add input restrictions
    document.getElementById('studentNumber').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9\-]/g, '');
    });

    document.getElementById('name').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    });

    document.getElementById('email').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z0-9._+-@]/g, '');
    });

    document.getElementById('contactNumber').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    document.getElementById('address').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z0-9\s,\-]/g, '');
    });
});

document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentNumber = document.getElementById('studentNumber').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const gender = document.getElementById('gender').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const address = document.getElementById('address').value;
    const photo = document.getElementById('photo').files[0];

    // Validate inputs
    if (!/^[0-9\-]{1,10}$/.test(studentNumber)) {
        alert('Student Number must be up to 10 digits and can only contain numbers and dashes.');
        return;
    }
    if (!/^[A-Za-z\s]*$/.test(name)) {
        alert('Name can only contain letters and spaces.');
        return;
    }
    if (!/^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
        alert('Invalid email format.');
        return;
    }
    if (!/^[0-9]{11}$/.test(contactNumber)) {
        alert('Contact Number must be exactly 11 digits.');
        return;
    }
    if (/[^A-Za-z0-9\s,\-]/.test(address)) {
        alert('Address can only contain letters, numbers, spaces, commas, and dashes.');
        return;
    }

    if (!confirm('Are you sure you want to add this student?')) {
        return;
    }

    const formData = new FormData();
    formData.append('studentNumber', studentNumber);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('contactNumber', contactNumber);
    formData.append('address', address);
    formData.append('photo', photo);

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
            <td>${student.gender}</td>
            <td>${student.contactNumber}</td>
            <td>${student.address}</td>
            <td><img src="${student.photo}" width="80" height="80" style="border-radius: 5px;"></td>
            <td>
                <button onclick="editStudent('${student._id}', '${student.studentNumber}', '${student.name}', '${student.email}', '${student.gender}', '${student.contactNumber}', '${student.address}', '${student.photo}')">Edit</button>
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
function editStudent(id, studentNumber, name, email, gender, contactNumber, address, photo) {
    document.getElementById('studentNumber').value = studentNumber;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('gender').value = gender;
    document.getElementById('contactNumber').value = contactNumber;
    document.getElementById('address').value = address;

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Student';
    updateButton.onclick = async () => {
        const formData = new FormData();
        formData.append('studentNumber', document.getElementById('studentNumber').value);
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('gender', document.getElementById('gender').value);
        formData.append('contactNumber', document.getElementById('contactNumber').value);
        formData.append('address', document.getElementById('address').value);
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