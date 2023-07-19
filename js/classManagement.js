let currentPage = 1;
let classPerPage = 3;
let action = "create";
let listCourseOnLoad = localStorage.getItem("Data Management")
  ? JSON.parse(localStorage.getItem("Data Management"))
  : [];
// Sử dụng 1 biến cục bộ lưu trữ các lớp sẽ render
// em cứ suy nghĩ theo hướng thầy nói, mai bảo vệ xong thầy demo lại cho các em
let listClassRender = [];

function renderClass(page, listClass) {
  //validate page
  let pageMax = getPageMax(listClass);
  if (page > pageMax) {
    page = pageMax;
  }
  if (page < 1) {
    page = 1;
  }

  //build function for pagination
  let itemMaxOnPage;
  let itemMinOnPage = (page - 1) * classPerPage;

  if (page * classPerPage > listClass.length) {
    itemMaxOnPage = listClass.length;
  } else {
    itemMaxOnPage = page * classPerPage;
  }
  //render data of course to table
  document.getElementById("class-info").innerHTML = "";

  for (let index = itemMinOnPage; index < itemMaxOnPage; index++) {
    document.getElementById("class-info").innerHTML += `
      <tr>
      <th scope="row">${index + 1}</th>
      <td>${listClass[index].classId}</td>
      <td>${listClass[index].className}</td>
      <td>${listClass[index].lecturer}</td>
      <td>${listClass[index].description}</td>
      <td>${listClass[index].numberOfStudent}</td>
      <td>${listClass[index].status}</td>
      <td>
      <button class="btn btn-primary edit" data-bs-toggle="modal" data-bs-target="#newClass" onclick="editData('${
        listClass[index].classId
      }')"></button>
          <button onclick = "deleteData('${
            listClass[index].classId
          }')" class="btn btn-primary delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></button>
      </td>
  </tr>`;
  }

  // Set up list pages
  document.getElementById("listPage").innerHTML = "";
  for (let i = 1; i <= pageMax; i++) {
    document.getElementById(
      "listPage"
    ).innerHTML += `<li><button id = "'${i}'" type = "submit" onclick = "clickPage('${i}')">${i}</button></li>`;
  }
  let prev = document.getElementById("prev");
  let next = document.getElementById("next");
  if (currentPage <= 1) {
    prev.style.visibility = "hidden";
  } else {
    prev.style.visibility = "visible";
  }

  if (currentPage >= pageMax) {
    next.style.visibility = "hidden";
  } else {
    next.style.visibility = "visible";
  }
}

function getPageMax(listClass) {
  return Math.ceil(listClass.length / classPerPage);
}

function clickPage(page, listClass) {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  listClass = getListClass(listCourse);
  currentPage = page;
  if (listClassRender == []) {
    listClassRender = listClass;
  }
  renderClass(currentPage, listClassRender);
}

function backPage() {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let listClass = getListClass(listCourse);
  currentPage--;
  if (listClassRender == []) {
    listClassRender = listClass;
  }
  renderClass(currentPage, listClassRender);
}

function nextPage() {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let listClass = getListClass(listCourse);
  currentPage++;
  if (listClassRender == []) {
    listClassRender = listClass;
  }
  renderClass(currentPage, listClassRender);
}

var newClassModal = new bootstrap.Modal("#newClass", {
  keyboard: false,
});
let btnSave = document.getElementById("save");
btnSave.addEventListener("click", function (event) {
  event.preventDefault();
  if (action == "create") {
    addNewClass();
    clearDataForm();
    newClassModal.hide();
  } else {
    updateData();
    clearDataForm();
    newClassModal.hide();
  }
});

function addNewClass() {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let classId = document.getElementById("classId").value;
  let className = document.getElementById("className").value;
  let lecturer = document.getElementById("lecturer").value;
  let description = document.getElementById("desc").value;
  let numberOfStudent = document.getElementById("studentNum").value;
  let courseId = document.getElementById("course").value;
  let status = document.querySelector("input[type='radio']:checked").value;
  let studentArr = [];
  let index = getIndexById(courseId, listCourse);
  if (index > -1) {
    let addedClass = {
      classId,
      className,
      lecturer,
      description,
      numberOfStudent,
      status,
      studentArr,
    };
    listCourse[index].arrClass.push(addedClass);
    localStorage.setItem("Data Management", JSON.stringify(listCourse));
    let listClass = getListClass(listCourse);
    renderClass(1, listClass);
  }
}

function getIndexById(courseId, listCourse) {
  for (let index = 0; index < listCourse.length; index++) {
    if (listCourse[index].courseId == courseId) {
      return index;
    }
  }
  return -1;
}

let btnOpenModal = document.getElementById("add");
btnOpenModal.addEventListener("click", function () {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let courseSelectBox = document.getElementById("course");
  courseSelectBox.innerHTML = "";
  listCourse.forEach((course) => {
    courseSelectBox.innerHTML += `
        <option selected value="${course.courseId}">${course.courseName}</option>
      `;
  });
});


function updateData() {

  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let classId = document.getElementById("classId").value;
  let className = document.getElementById("className").value;
  let lecturer = document.getElementById("lecturer").value;
  let description = document.getElementById("desc").value;
  let numberOfStudent = document.getElementById("studentNum").value;
  let courseId = document.getElementById("course").value;
  let status = document.querySelector("input[type='radio']:checked").value;
  let index = getIndexById(courseId, listCourse);
  let indexClass = getIndexClassInCourseById(classId, listCourse);
  let studentArr = listCourse[index].arrClass[indexClass].studentArr;
  if (index > -1) {
    if (indexClass > -1) {
      let updatedClass = {
        classId,
        className,
        lecturer,
        description,
        numberOfStudent,
        status,
        studentArr,
      };
      listCourse[index].arrClass[indexClass] = updatedClass;
      localStorage.setItem("Data Management", JSON.stringify(listCourse));
      let listClass = getListClass(listCourse);
      renderClass(1, listClass);
      action = "create";
      document.getElementById("classId").readOnly = false;
    }
  }
}

function editData(classId) {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let listClass = getListClass(listCourse);
  let indexEdit = getIndexClassById(classId, listClass);
  let indexCourse = getIndexCourseById(classId, listCourse);
  let courseSelectBox = document.getElementById("course");
  courseSelectBox.innerHTML = "";
  listCourse.forEach((course) => {
    courseSelectBox.innerHTML += `
        <option selected value="${course.courseId}">${course.courseName}</option>
      `;
  });
  if (indexEdit > -1) {
    document.getElementById("classId").value =
      listClassOnLoad[indexEdit].classId;
    document.getElementById("classId").readOnly = true;
    document.getElementById("className").value =
      listClassOnLoad[indexEdit].className;
    document.getElementById("lecturer").value =
      listClassOnLoad[indexEdit].lecturer;
    document.getElementById("desc").value =
      listClassOnLoad[indexEdit].description;
    document.getElementById("studentNum").value =
      listClassOnLoad[indexEdit].numberOfStudent;
    document.getElementById("course").value = listCourse[indexCourse].courseId;
    action = "edit";
  }
}

function getIndexClassById(classId, listClass) {
  for (let index = 0; index < listClass.length; index++) {
    if (listClass[index].classId == classId) {
      return index;
    }
  }
  return -1;
}

function getIndexCourseById(classId, listCourse) {
  for (let i = 0; i < listCourse.length; i++) {
    for (let j = 0; j < listCourse[i].arrClass.length; j++) {
      if (listCourse[i].arrClass[j].classId == classId) {
        return i;
      }
    }
  }
  return -1;
}

function getIndexClassInCourseById(classId, listCourse) {
  for (let i = 0; i < listCourse.length; i++) {
    for (let j = 0; j < listCourse[i].arrClass.length; j++) {
      if (listCourse[i].arrClass[j].classId == classId) {
        return j;
      }
    }
  }
  return -1;
}

function deleteData(classId) {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let indexDeleteInCourse = getIndexCourseById(classId, listCourse);
  let indexDeleteInClass = getIndexClassInCourseById(classId, listCourse);
  let deleteCheck = confirm(
    "Please make sure that you wanna delete this class"
  );
  if (indexDeleteInClass > -1 && indexDeleteInCourse > -1) {
    if (deleteCheck) {
      listCourse[indexDeleteInCourse].arrClass.splice(indexDeleteInClass, 1);
      localStorage.setItem("Data Management", JSON.stringify(listCourse));
      let listClass = getListClass(listCourse);
      renderClass(1, listClass);
    }
  }
}

let btnSearch = document.getElementById("search");
btnSearch.addEventListener("click", function (event) {
  event.preventDefault();
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let listClass = getListClass(listCourse);
  let keyword = document.getElementById("keyword").value;
  let listClassSearch = listClass.filter((classItem) =>
    classItem.className.includes(keyword)
  );
  localStorage.setItem("searchList", JSON.stringify(listClassSearch));
  listClassRender = listClassSearch;
  renderClass(1, listClassRender);
});

function sortData(page) {
  let listCourse = localStorage.getItem("Data Management")
    ? JSON.parse(localStorage.getItem("Data Management"))
    : [];
  let listClass = getListClass(listCourse);
  let sortOrder = document.getElementById("sort").value;
  switch (sortOrder) {
    case "Class Name ASC":
      listClass.sort((a, b) =>
        a.className > b.className ? 1 : a.className < b.className ? -1 : 0
      );
      break;
  }
  localStorage.setItem("Sorted Class", JSON.stringify(listClass));
  let sortedListClass = localStorage.getItem("Sorted Class")
    ? JSON.parse(localStorage.getItem("Sorted Class"))
    : [];
  listClassRender = sortedListClass;
  renderClass(1, listClassRender);
}

// var deleteModal = new bootstrap.Modal("#deleteModal", {
//   keyboard: false,
// });

// function deleteData(classId) {
//   let listCourse = localStorage.getItem("Data Management")
//     ? JSON.parse(localStorage.getItem("Data Management"))
//     : [];

//   let indexDeleteInCourse = getIndexCourseById(classId, listCourse);
//   let indexDeleteInClass = getIndexClassInCourseById(classId, listCourse);
//   let btnDelete = document.getElementById("deleteCheck");
//   console.log(indexDeleteInCourse);
//   console.log(indexDeleteInClass);
//   if (btnDelete.value == "") {
//     if (indexDeleteInCourse > -1 && indexDeleteInClass > -1) {
//       listCourse[indexDeleteInCourse].arrClass.splice(indexDeleteInClass, 1);
//       localStorage.setItem("Data Management", JSON.stringify(listCourse));
//       let listClass = getListClass(listCourse);
//       renderCourse(1, listClass);
//       deleteModal.hide();
//     }
//   }
// }

function clearDataForm() {
  document.getElementById("classId").value = "";
  document.getElementById("className").value = "";
  document.getElementById("lecturer").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("studentNum").value = "";
  document.getElementById("course").value = "";
  document.getElementById("waiting").checked = true;
}

let btnLogOut = document.getElementById("logout");
btnLogOut.addEventListener("click", function () {
  localStorage.removeItem("Logged-in User");
  window.location.href = "http://127.0.0.1:5500/firstProject/html/login.html";
});

function getListClass(listCourseOnLoad) {
  let listClassOnLoad = [];
  for (let item of listCourseOnLoad) {
    for (let classItem of item.arrClass) {
      listClassOnLoad.push(classItem);
    }
  }
  return listClassOnLoad;
}
let listClassOnLoad = getListClass(listCourseOnLoad);
document.onload = renderClass(1, listClassOnLoad);
