'use strict'

function Student(name, age, course) {
  this.name = name;
  this.age = age;
  this.course = course;
}

Student.prototype.displayInfo = function () {
  return `
    <div class="flex student-item">
      <div class="student-card">
        <h3>${this.name}</h3>
        <p>Yosh: ${this.age}</p>
        <p>Kurs: ${this.course}</p>
      </div>
      <button class="menu"><i class="ri-more-2-fill"></i></button>
      <div class="menus hidden">
        <div class="edit"><i class="ri-edit-2-line"></i> Edit</div>
        <div class="delete"><i class="ri-delete-bin-6-line"></i> Delete</div>
      </div>
    </div>`;
};

function restoreStudents() {
  const raw = JSON.parse(localStorage.getItem('students')) || [];
  return raw.map(s => new Student(s.name, s.age, s.course));
}

let students = restoreStudents();

const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const editModal = document.querySelector('.edit_modal');

const overlay = document.createElement('div');
overlay.className = 'overlay hidden';
document.body.appendChild(overlay);

function saveToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const course = document.getElementById("course").value.trim();

  if (name && age && course) {
    const newStudent = new Student(name, age, course);
    students.push(newStudent);
    saveToLocalStorage();
    displayStudent();

    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
  } else {
    Swal.fire("Xatolik", "Iltimos, barcha maydonlarni to'ldiring!", "warning");
  }
}

function displayStudent() {
  const studentList = document.getElementById("studentList");
  studentList.innerHTML = "";

  students.forEach((student, index) => {
    studentList.innerHTML += student.displayInfo();
  });

  const menuButtons = document.querySelectorAll('.menu');
  const menus = document.querySelectorAll('.menus');

  menuButtons.forEach((button, index) => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      const currentMenu = this.nextElementSibling;
      const isHidden = currentMenu.classList.contains('hidden');

      menus.forEach(menu => menu.classList.add('hidden'));


      if (isHidden) {
        currentMenu.classList.remove('hidden');
      } else {
        currentMenu.classList.add('hidden');
      }
    });
  });


  // menu
  document.addEventListener('click', () => {
    menus.forEach(menu => menu.classList.add('hidden'));
  });


  menus.forEach(menu => {
    menu.addEventListener('click', e => e.stopPropagation());
  });

  document.querySelectorAll('.edit').forEach((btn, index) => {
    btn.addEventListener('click', function () {
      document.getElementById('name_edit').value = students[index].name;
      document.getElementById('age_edit').value = students[index].age;
      document.getElementById('course_edit').value = students[index].course;

      editModal.classList.remove('hidden');
      overlay.classList.remove('hidden');
      menus.forEach(m => m.classList.add('hidden'));

      editBtn.onclick = function () {
        const newName = document.getElementById('name_edit').value.trim();
        const newAge = document.getElementById('age_edit').value.trim();
        const newCourse = document.getElementById('course_edit').value.trim();

        if (newName && newAge && newCourse) {
          students[index].name = newName;
          students[index].age = newAge;
          students[index].course = newCourse;

          saveToLocalStorage();
          students = restoreStudents();
          displayStudent();

          editModal.classList.add('hidden');
          overlay.classList.add('hidden');
        } else {
          Swal.fire("Xatolik", "Iltimos, barcha maydonlarni to'ldiring!", "warning");
        }
      };
    });
  });

  document.querySelectorAll('.delete').forEach((btn, index) => {
    btn.addEventListener('click', function () {
      Swal.fire({
        title: 'Ishonchingiz komilmi?',
        text: "Talabani o‘chirmoqchimisiz?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Ha, o‘chir!',
        cancelButtonText: 'Bekor qilish'
      }).then((result) => {
        if (result.isConfirmed) {
          students.splice(index, 1);
          saveToLocalStorage();
          students = restoreStudents();
          displayStudent();

          Swal.fire('O‘chirildi!', 'Talaba o‘chirildi.', 'success');
        }
      });
    });
  });
}

overlay.addEventListener('click', function () {
  editModal.classList.add('hidden');
  overlay.classList.add('hidden');
});

addBtn.addEventListener("click", addStudent);
displayStudent();
