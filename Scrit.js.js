const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const roleSelection = document.getElementById('role-selection');
const messageDiv = document.getElementById('message');
const signupButton = document.getElementById('signup-button');
const signinButton = document.getElementById('signin-button');
const showSigninLink = document.getElementById ('show-signin');
const showSignupLink = document.getElementById('show-signup');
const teacherButton = document.getElementById('role-teacher');
const studentButton = document.getElementById('role-student');
const parentButton = document.getElementById('role-parent');
const teacherDashboard = document.getElementById('teacher-dashboard');
const studentDashboard = document.getElementById('student-dashboard');
const parentDashboard = document.getElementById('parent-dashboard');
const childSearch = document.getElementById('child-search');
const childPasscode = document.getElementById('child-passcode');
const gradeDisplay = document.getElementById('grade-display');
const missingOutputsDisplay = document.getElementById('missing-outputs-display');
const pendingBalanceDisplay = document.getElementById('pending-balance-display');
const childGrade = document.getElementById('child-grade');
const viewGradeButton = document.getElementById('view-grade');
const studentList = document.getElementById('student-list');
const uploadStudentFileDiv = document.getElementById('upload-student-file');
const studentFileInput = document.getElementById('student-file');
const saveStudentFileButton = document.getElementById('save-student-file');
const logoutButton = document.getElementById('logout-button');

let students = []; // Array to store student data
let currentBalance = 0; // Initialize balance

signupButton.addEventListener('click', handleSignup);
signinButton.addEventListener('click', handleSignin);
showSigninLink.addEventListener('click', showSigninForm);
showSignupLink.addEventListener('click', showSignupForm);
teacherButton.addEventListener('click', showTeacherDashboard);
studentButton.addEventListener('click', showStudentDashboard);
parentButton.addEventListener('click', showParentDashboard);
viewGradeButton.addEventListener('click', viewChildGrade);
document.getElementById('view-students').addEventListener('click', showStudentList);
document.getElementById('add-students').addEventListener('click', () => {
  uploadStudentFileDiv.style.display = 'block';
});
saveStudentFileButton.addEventListener('click', saveStudentFile);
logoutButton.addEventListener('click', logout);

// Student Dashboard Button Event Listeners
document.getElementById('view-grades').addEventListener('click', viewMyGrades);
document.getElementById('payment-tracking').addEventListener('click', openPaymentModal);
document.getElementById('deadline-calendar').addEventListener('click', openCalendarModal);
document.getElementById('progress-dashboard').addEventListener('click', openProgressModal);

// Modal Close Event Listeners
document.getElementById('close-payment-modal').onclick = closePaymentModal;
document.getElementById('close-calendar-modal').onclick = closeCalendarModal;
document.getElementById('close-progress-modal').onclick = closeProgressModal;

// Initialize Calendar
$(document).ready(function() {
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    selectable: true,
    select: function(start, end) {
      const title = prompt('Enter Task Title:');
      if (title) {
        const eventData = {
          title: title,
          start: start,
          end: end
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true);
      }
      $('#calendar').fullCalendar('unselect');
    },
    events: [] // You can load events from a database or local storage
  });
});

function handleSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const terms = document.getElementById('signup-terms').checked;

  if (!name || !username || !email || !password || !terms) {
    messageDiv.textContent = 'Please fill out all fields and agree to the terms and conditions.';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageDiv.textContent = 'Please enter a valid email address.';
    return;
  }

  if (password.length < 6) {
    messageDiv.textContent = 'Password must be at least 6 characters long.';
    return;
  }

  localStorage.setItem('user', JSON.stringify({ name, username, email, password }));
  messageDiv.textContent = '';
  roleSelection.classList .add('active');
  signupForm.classList.remove('active');
}

function handleSignin() {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email === email && user.password === password) {
    messageDiv.textContent = '';
    roleSelection.classList.add('active');
    signinForm.classList.remove('active');
  } else {
    messageDiv.textContent = 'Invalid email or password.';
  }
}

function showSigninForm() {
  signupForm.classList.remove('active');
  signinForm.classList.add('active');
  messageDiv.textContent = '';
}

function showSignupForm() {
  signinForm.classList.remove('active');
  signupForm.classList.add('active');
  messageDiv.textContent = '';
}

function showTeacherDashboard() {
  roleSelection.classList.remove('active');
  teacherDashboard.classList.add('active');
  document.getElementById('teacher-display-name').textContent = JSON.parse(localStorage.getItem('user')).name;
}

function showStudentDashboard() {
  roleSelection.classList.remove('active');
  studentDashboard.classList.add('active');
}

function showParentDashboard() {
  roleSelection.classList.remove('active');
  parentDashboard.classList.add('active');
}

function viewChildGrade() {
  const childName = childSearch.value.trim();
  const passcode = childPasscode.value.trim();

  // Simulated data for demonstration
  const childData = {
    'Child 1': { grade: 'A', missingOutputs: '2', pendingBalance: '100' },
    'Child 2': { grade: 'B+', missingOutputs: '1', pendingBalance: '50' },
    'Child 3': { grade: 'A-', missingOutputs: '0', pendingBalance: '0' }
  };

  if (childData[childName]) {
    // Check passcode (for demonstration, we assume all passcodes are "1234")
    if (passcode === '1234') {
      gradeDisplay.textContent = childData[childName].grade;
      missingOutputsDisplay.textContent = childData[childName].missingOutputs;
      pendingBalanceDisplay.textContent = childData[childName].pendingBalance;
      childGrade.style.display = 'block';
    } else {
      alert('Invalid passcode. Please try again.');
    }
  } else {
    alert('Child not found. Please check the name.');
  }
}

function showStudentList() {
  studentList.innerHTML = ''; // Clear existing list
  if (students.length === 0) {
    studentList.innerHTML = '<tr><td colspan="4">No students added yet.</td></tr>';
  } else {
    students.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${student.name}</td>
        <td><input type="text" placeholder="Enter Grade" data-student="${student.name}" class="grade-input"></td>
        <td><input type="text" placeholder="Remaining Balance" data-student="${student.name}" class="balance-input"></td>
        <td><input type="text" placeholder="Lacking Output" data-student="${student.name}" class="output-input"></td>
      `;
      studentList.appendChild(tr);
    });
  }
  document.getElementById('view-student-list').style.display = 'block';
}

function saveStudentFile() {
  const file = studentFileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      students = jsonData.slice(1).map(row => ({ name: row[0], grades: [], balance: 0, output: '' })); // Assuming first column is student name
      uploadStudentFileDiv.style.display = 'none';
      showStudentList();
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please upload a file.');
  }
}

function logout() {
  localStorage.removeItem('user'); // Clear user data
  roleSelection.classList.remove('active');
  teacherDashboard.classList.remove('active');
  studentDashboard.classList.remove('active');
  parentDashboard.classList.remove('active');
  signupForm.classList.add('active'); // Redirect to signup
}

// Student Dashboard Functions
function viewMyGrades() {
  alert("Displaying grades for the student.");
  // Implement logic to fetch and display grades
}

function openPaymentModal() {
  document.getElementById('payment-modal').style.display = 'block';
  document.getElementById('current-balance').textContent = currentBalance; // Display current balance
}

function closePaymentModal() {
  document.getElementById('payment-modal').style.display = 'none';
}

document.getElementById('confirm-payment').addEventListener('click', function() {
  const paymentAmount = prompt("Enter payment amount:");
  if (paymentAmount && !isNaN(paymentAmount)) {
    currentBalance -= parseFloat(paymentAmount);
    alert(`Payment of ${paymentAmount} made. New balance: ${currentBalance}`);
    document.getElementById('current-balance').textContent = currentBalance; // Update balance display
  } else {
    alert("Invalid payment amount.");
  }
});

function openCalendarModal() {
  document.getElementById('calendar-modal').style.display = 'block';
}

function closeCalendarModal() {
  document.getElementById('calendar-modal').style.display = 'none';
}

function openProgressModal() {
  document.getElementById('progress-modal').style.display = 'block';
}

function closeProgressModal() {
  document.getElementById('progress-modal').style.display = 'none';
}