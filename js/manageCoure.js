function ManaCourse() {
  this.listCourse = localStorage.getItem("DataManagement")
    ? JSON.parse(localStorage.getItem("DataManagement"))
    : [];
  this.addCoure = function (course) {
    this.listCourse.unshift(course);
  };
  this.deleteCourse = function (courseId) {
    for (let index = 0; index < this.listCourse.length; index++) {
      let CourseDel = this.listCourse[index];
      if (courseId == CourseDel.courseID) {
        this.listCourse.splice(index, 1);
      }
    }
  };
  this.EditCourse = function (CourseEdit) {
    for (let index = 0; index < this.listCourse.length; index++) {
      let CourseDel = this.listCourse[index];
      if (CourseDel.courseID == CourseEdit.courseID) {
        console.log(CourseDel);
        CourseDel.courseID = CourseEdit.courseID;
        CourseDel.courseName = CourseEdit.courseName;
        CourseDel.courseStatus = CourseEdit.courseStatus;
        CourseDel.courseTime = CourseEdit.courseTime;
      }
    }
  };
  this.searchById = function (courseId) {
    for (let index = 0; index < this.listCourse.length; index++) {
      let Course = this.listCourse[index];
      if (Course.courseID == courseId) {
        return Course;
      }
    }
    return null;
  };
  this.searchByName = function (name) {
    let listResult = [];
    for (let index = 0; index < this.listCourse.length; index++) {
      let Course = this.listCourse[index];
      if (
        Course.CourseName.toLowerCase()
          .trim()
          .search(name.toLowerCase().trim()) != -1 ||
        Course.courseId
          .toLowerCase()
          .trim()
          .search(name.toLowerCase().trim()) != -1
      ) {
        listResult.push(Course);
      }
    }
    return listResult;
  };

  this.sortNameA_Z = function () {
    let listDaTa = this.listCourse;
    listDaTa.sort((a, b) =>
      a.courseName > b.courseName ? 1 : a.courseName < b.courseName ? -1 : 0
    );
  };

  this.sortNameZ_A = function () {
    let listDaTa = this.listCourse;
    listDaTa.sort((a, b) =>
      a.courseName > b.courseName ? -1 : a.courseName < b.courseName ? 1 : 0
    );
  };

  this.sortTime = function () {
    let listDaTa = this.listCourse;

    listDaTa.sort((a, b) =>
      a.courseStatus > b.courseStatus
        ? 1
        : a.courseStatus < b.courseStatus
        ? -1
        : 0
    );
  };
}

let ManageCourse = new ManaCourse();
let validation = new Validation();
let listDataCourse = ManageCourse.listCourse;
let currentPage = 1;
let recordsPage = 5;
let create = true;
var myModal = new bootstrap.Modal(
  document.getElementById("exampleModalCourse"),
  {
    keyboard: false,
  }
);
function domId(selector) {
  let dom = document.getElementById(selector);
  return dom;
}

function getTotalPage(list) {
  return Math.ceil(list.length / recordsPage);
}

function resetInput() {
  domId("courseId").value = "";
  domId("courseName").value = "";
  domId("courseTime").value = "";
  domId("inlineCheckbox2").checked = true;
  domId("inlineCheckbox1").checked = false;
}

function Render(page, listDaTa) {
  let pageMax = getTotalPage(listDaTa);

  if (page < 1) {
    page = 1;
  }
  if (page > pageMax) {
    page = pageMax;
  }
  let indexMinPage;
  let indexMaxPage;
  indexMinPage = (page - 1) * recordsPage;

  if (page * recordsPage > listDaTa.length) {
    indexMaxPage = listDaTa.length;
  } else {
    indexMaxPage = page * recordsPage;
  }

  // tinh toan render

  domId("tbody").innerHTML = ``;
  actionCourse()
  for (let index = indexMinPage; index < indexMaxPage; index++) {
    let status = "";
    if (listDaTa[index].courseStatus == 1) {
      status = "Hoạt Động";
    } else {
      status = "Không hoạt động";
    }

    domId("tbody").innerHTML += `
        <td>${index + 1}</td>
        <td>${listDaTa[index].courseID}</td>
        <td>${listDaTa[index].courseName}</td>
        <td>${listDaTa[index].courseTime}</td>
        <td>${status}</td>
        <td>
        <p class="icon_action text-info" data-bs-toggle="modal"
        data-bs-target="#exampleModalCourse"  onclick = editData('${
          listDaTa[index].courseID
        }')><i class="fa-solid fa-pen-to-square "></i></p>
        
        <p class="icon_action text-danger" onclick = deleteCourse('${
          listDaTa[index].courseID
        }')><i class="fa-regular fa-trash-can"></i></p>
        <p  class="icon_action text-warning" data-bs-toggle="modal" data-bs-target="#set_Class")><i class="fa-solid fa-grip" ></i></p>

        </td>
        `;
  }

  // Render ra cac trang
  let listPage = domId("listPage");
  listPage.innerHTML = "";
  for (let i = 1; i <= getTotalPage(listDaTa); i++) {
    listPage.innerHTML += `
        <li><a href="javascript:clickPage('${i}')">${i}</a></li>
        `;
  }

  // aN hien preview, next
  let prev = domId("prev");
  let next = domId("next");
  if (currentPage == 1) {
    prev.style.visibility = "hidden";
  } else {
    prev.style.visibility = "visible";
  }
  if (currentPage == pageMax) {
    next.style.visibility = "hidden";
  } else {
    next.style.visibility = "visible";
  }
}

function clickPage(value) {
  currentPage = value;
  // lít dât này em lấy ở đâu đây
  // cái này em copy quên chưa đổi =))
  Render(value, listDataCourse);
}

function prevPage() {
  currentPage--;
  Render(currentPage, listDataCourse);
}

function nextPage() {
  currentPage++;
  Render(currentPage, listDataCourse);
}

function getIndexById(courseId, listCourse) {
  for (let index = 0; index < listCourse.length; index++) {
    if (listCourse[index].courseId == courseId) {
      return index;
    }
  }
  return -1;
}

//  sự kiện Blur
let courseID = domId("courseId");
let courseName = domId("courseName");
let courseTime = domId("courseTime");

courseID.onblur = function () {
  let courseIDvalue = domId("courseId").value;
  if (validation.KiemTraRong(courseIDvalue)) {
    domId("checkCourseId").innerHTML = `
        Vui lòng nhập trường này
        `;
  }
};
courseTime.onblur = function () {
  let courseTimeValue = domId("courseTime").value;
  if (validation.KiemTraRong(courseTimeValue)) {
    domId("checkCourseTime").innerHTML = `
        Vui lòng nhập trường này
        `;
  }
  if (!validation.KiemTraNumber(courseTimeValue)) {
    domId("checkCourseTime").innerHTML = `
        Vui lòng nhập Time > 0
        `;
  }
};
courseName.onblur = function () {
  let courseNameValue = domId("courseName").value;
  if (validation.KiemTraRong(courseNameValue)) {
    domId("checkCourseName").innerHTML = `
    Vui lòng nhập trường này
    `;
  }
};
onKey(courseID, "checkCourseId");
onKey(courseName, "checkCourseName");
onKey(courseTime, "checkCourseTime");

function addCoureData() {
  let courseID = domId("courseId").value;
  let courseName = domId("courseName").value;
  let courseTime = domId("courseTime").value;
  let courseStatus = document.querySelector(
    "input[type='radio']:checked"
  ).value;
  let courseNameData = "";
  let courseIdData = "";
  console.log(listDataCourse);
  for (let index = 0; index < listDataCourse.length; index++) {
    courseNameData += listDataCourse[index].courseName;
    courseIdData += listDataCourse[index].courseID;
  }
  //kiem tra validation
  let error1 = 0;

  if (validation.KiemTraRong(courseID)) {
    domId("checkCourseId").innerHTML = `
        Vui lòng nhập trường này
        `;
    error1++;
  } else {
    if (validation.KiemTraTrungNhau(courseIdData, courseID)) {
      domId("checkCourseId").innerHTML = `
     
        Mã lớp học đã tồn tại
        `;
      error1++;
    } else {
      domId("checkCourseId").innerHTML = "";
    }
  }
  if (validation.KiemTraRong(courseTime)) {
    domId("checkCourseTime").innerHTML = `
    Vui lòng nhập trường này
    `;
    error1++;
  } else {
    domId("checkCourseTime").innerHTML = "";
  }
  if (!validation.KiemTraNumber(courseTime)) {
    domId("checkCourseTime").innerHTML = `
    Vui lòng nhập Time > 0
    `;
    error1++;
  } else {
    domId("checkCourseTime").innerHTML = "";
  }
  if (validation.KiemTraRong(courseName)) {
      domId("checkCourseName").innerHTML = `
      Vui lòng nhập trường này
      `;
      error1++;
    } else {
        domId("checkCourseName").innerHTML = "";
    }
    if (validation.KiemTraTrungNhau(courseNameData, courseName)) {
      console.log("data: ",courseNameData);
      console.log(("value",courseName));
    if (courseName != undefined) {
      domId("checkCourseName").innerHTML = `
    Lớp học đã tồn tại
    `;
      error1++;
    }
  } else {

    console.log("data: ",courseNameData);
    console.log(("value",courseName));
    domId("checkCourseTime").innerHTML = "";
  }
  if (error1 != 0) {
    return;
  }
  //them khoa hoc
  let newCourse = new Course(courseID, courseName, courseTime, courseStatus);
  let list = listDataCourse;
  ManageCourse.addCoure(newCourse);
  localStorage.setItem("DataManagement", JSON.stringify(list));
  resetInput();
  Render(1, listDataCourse);
  myModal.hide();
  messagerAdd()
}

function editData(courseId) {
    create = false
  let course = ManageCourse.searchById(courseId);
  if (course != null) {
    domId("courseId").value = course.courseID;
    domId("courseId").readOnly = true;
    domId("courseName").value = course.courseName;
    domId("courseTime").value = course.courseTime;
    if (course.courseStatus == 1) {
      domId("inlineCheckbox1").checked = true;
    } else {
      domId("inlineCheckbox2").checked = true;
    }
  }
}

function uploadData() {
  let error1 = 0;
  let courseID = domId("courseId").value;
  let courseName = domId("courseName").value;
  let courseTime = domId("courseTime").value;
  let courseStatus = document.querySelector(
    "input[type='radio']:checked"
  ).value;
  let courseNameData = "";
  for (let index = 0; index < listDataCourse.length; index++) {
    if(listDataCourse[index].courseName!=courseName)
    courseNameData += listDataCourse[index].courseName;
  }
  // kiem tra
  if (validation.KiemTraRong(courseTime)) {
    domId("checkCourseTime").innerHTML = `
        Vui lòng nhập trường này
        `;
    error1++;
  } else {
    domId("checkCourseTime").innerHTML = "";
  }
  if (!validation.KiemTraNumber(courseTime)) {
    domId("checkCourseTime").innerHTML = `
        Vui lòng nhập Time > 0
        `;
    error1++;
  } else {
    domId("checkCourseTime").innerHTML = "";
  }
  // kiem tra lop hoc
  if (validation.KiemTraRong(courseName)) {
    domId("checkCourseName").innerHTML = `
    Vui lòng nhập trường này
    `;
    error1++;
  } else {
    domId("checkCourseName").innerHTML = "";
  }
  if (validation.KiemTraTrungNhau(courseNameData, courseName)) {
    if (courseName.length>0) {
      domId("checkCourseName").innerHTML = `
        Lớp học đã tồn tại
        `;
      error1++;
    }
  } else {
    domId("checkCourseTime").innerHTML = "";
  }
  if (error1 != 0) {
    return;
  }
  let newCourse = new Course(courseID, courseName, courseTime, courseStatus);
  let list = listDataCourse;
  ManageCourse.EditCourse(newCourse);
  localStorage.setItem("DataManagement", JSON.stringify(list));
  domId("courseId").readOnly = false;
  resetInput();
  Render(1, listDataCourse);
  create = true
  myModal.hide();
  messagerEdit()
}

function deleteCourse(courseId) {
    let list = listDataCourse;
    for (let index = 0; index < listDataCourse.length; index++) {
      if (listDataCourse[index].courseID==courseId) {
        if (listDataCourse[index].courseStatus = 1) {
          console.log("test action Course: ",listDataCourse[index] );
          messagerDel2()

        }else{
          ManageCourse.deleteCourse(courseId);
          messagerDel()
      }
      localStorage.setItem("DataManagement", JSON.stringify(list));
      Render(1, listDataCourse);
    }
  }
    }
function searchName() {
  let search_CourseName = domId("search_Course").value;
  let listSearch = ManageCourse.searchByName(search_CourseName);
  console.log(listSearch);
  Render(1, listSearch);
}

function onKey(elementID, messID) {
  elementID.addEventListener("keydown", function () {
    domId(messID).innerHTML = " ";
  });
}

function isCourseOff(listClass) {
  let isCourseOff = listClass.every(function(classCurrent){
 return classCurrent.classStatus === 0
})
return isCourseOff
}

// Xu ly Validation
//Kiem tra trang thai hoat ddong khoa hoc
function actionCourse (){
  for (let index = 0; index < listDataCourse.length; index++) {
      let listClass = listDataCourse[index].arrClass
      if (isCourseOff(listClass)) {
        listDataCourse[index].classStatus = 2
      } else{
        listDataCourse[index].classStatus = 1
      }
     
    }
}

let btnSearch = domId("button-search");
btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  searchName();
});

if (ManageCourse.listCourse.length > 0) {
  domId("page_result").style.display = "block";
  domId("page_null").style.display = "none";
} else {
  domId("page_result").style.display = "none";
  domId("page_null").style.display = "block";
}

let btnSave = document.getElementById("btn_save");

let sort = domId("sortCourse");
btnSave.addEventListener("click", function () {
  if (create) {
    addCoureData();
  } else {
    uploadData();
  }
});

function sortCourse(listDataCourse) {
  let number = sort.value;
  switch (number) {
    case "1":
      ManageCourse.sortNameA_Z();
      break;
    case "2":
      ManageCourse.sortNameZ_A();
      break;
    case "3":
      ManageCourse.sortCourse();
      break;
  }
  localStorage.setItem("DataManagement", JSON.stringify(listDataCourse));
  Render(1, listDataCourse);
}

sort.addEventListener("change", sortCourse(listDataCourse));


function messagerAdd(){
    const toast = document.querySelector(".mess")
    console.log(toast);
        toast.innerHTML=`
        <div class="toast_mess actionPush">
              <p>
                <i class="fa-regular fa-circle-check"></i> Thêm mới thành công
              </p>
            </div>
        `
}
function messagerEdit(){
    const toast = document.querySelector(".mess")
    console.log(toast);
        toast.innerHTML=`
        <div class="toast_mess actionPush">
              <p>
                <i class="fa-regular fa-circle-check"></i> Chỉnh sửa thành công
              </p>
            </div>
        `
}
function messagerDel(){
    const toast = document.querySelector(".mess")
    console.log(toast);
        toast.innerHTML=`
        <div class="toast_mess actionPush">
              <p>
                <i class="fa-regular fa-circle-check"></i> Xóa thành công
              </p>
            </div>
        `
}
function messagerDel2(){
    const toast = document.querySelector(".mess")
        toast.innerHTML=`
        <div class="toast_mess actionPush">
              <p>
                <i class="fa-regular fa-circle-check"></i> Có lớp đang hoạt động. không thể xóa
              </p>
            </div>
        `
}



if (ManageCourse.listCourse.length > 0) {
  document.onload = Render(1, ManageCourse.listCourse);
}
