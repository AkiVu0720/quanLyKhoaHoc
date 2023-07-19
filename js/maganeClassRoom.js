function ManaClass() {
    this.listCourse = localStorage.getItem("DataManagement")
    ? JSON.parse(localStorage.getItem("DataManagement"))
    : [];
    this.addClass = function (classRoom) {
        this.listClass.unshift(classRoom)
    }
    this.deleteClass= function (classID) {
        for (let index = 0; index < this.listCourse.length; index++) {
            for (let indexClass = 0; indexClass < this.listCourse[index].arrClass.length; indexClass++) {
                let listClass =  this.listCourse[index].arrClass
                let CourseDel = this.listCourse[index].arrClass[indexClass];
                console.log("listClass", listClass);
                if (classID == CourseDel.courseID) {
                    listClass.splice(indexClass, 1);
                }
            }
            }
    };
    this.editClassRoom = function(ClassEdit){
        for (let index = 0; index < this.listCourse.length; index++) {
            for (let indexClass = 0; indexClass < this.listCourse[index].arrClass.length; indexClass++) {
                let ClassDel =  this.listCourse[index].arrClass[indexClass]
                if (ClassDel.classId == ClassEdit.classId) {
                    ClassDel.className = ClassEdit.className;
                    ClassDel.numberOfStudent = ClassEdit.numberOfStudent;
                    ClassDel.classTeacher = ClassEdit.classTeacher;
                    ClassDel.classStatus = ClassEdit.classStatus;
                    ClassDel.classNote = ClassEdit.classNote;
                } 
                
            }
        }
    };
    this.searchById = function (classID) {
        for (let index = 0; index < this.listCourse.length; index++) {
            for (let indexClass = 0; indexClass < this.listCourse[index].arrClass.length; indexClass++) {
                let classRoom = this.listCourse[index].arrClass[indexClass]
                if (this.listCourse[index].arrClass[indexClass].classId==classID) {

                    return classRoom
                }
               
            }
            
        }
        return null
    };
    this.searchByName = function(name){
        let listResult = [];
        for (let index = 0; index < this.listClass.length; index++) {
            let classRoom = this.listClass[index]
            if (classRoom.className.toLowerCase().trim().search(name.toLowerCase().trim())!= -1 || classRoom.classID.toLowerCase().trim().search(name.toLowerCase().trim())!= -1) {
                listResult.push(classRoom)
            }
        }
        return listResult;
    };

    this.sortNameAZ =function(listClass){
        listClass.sort((a,b)=>(a.className>b.className)?1:(a.className<b.className)?-1:0);
        console.log("listClass", listClass);
    }
    this.sortNameZA =function(listClass){
        listClass.sort((a,b)=>(a.className>b.className)?-1:(a.className<b.className)?1:0);
        console.log("listClass", listClass);
     }
    this.sortStatusAZ = function (listClass){
        listClass.sort((a,b)=>(a.classStatus>b.classStatus)?1:(a.classStatus<b.classStatus)?-1:0);
        console.log("listClass", listClass);
    } 
    this.sortStatusZA = function (listClass){
        listClass.sort((a,b)=>(a.classStatus>b.classStatus)?-1:(a.classStatus<b.classStatus)?1:0);
        console.log("listClass", listClass);
    } 


}
let ManageClass = new ManaClass()
let listCourse = ManageClass.listCourse
let listClassLoad = getListClass(listCourse);

let currentPage = 1;
let recordsPage = 5;
let create = true;

var myModal = new bootstrap.Modal(
    document.getElementById("exampleModalClass"),
    {
      keyboard: false,
    }
  );
function getListClass(listCourseOnLoad) {
    let listClassOnLoad = [];
    for (let item of listCourseOnLoad) {
      for (let classItem of item.arrClass) {
        listClassOnLoad.push(classItem);
      }
    }
    return listClassOnLoad;
  }
  function getIndexById(courseId, listCourse) {
    for (let index = 0; index < listCourse.length; index++) {
      if (listCourse[index].courseID == courseId) {
        return index;
      }
    }
    return -1;
  }

  function getIndexCourseById(classId, listCourse) {
    for (let index = 0; index < listCourse.length; index++) {
      for (let indexClass = 0; indexClass < listCourse[index].arrClass.length; indexClass++) {
        if (listCourse[index].arrClass[indexClass].classId == classId) {
          return index;
        }
      }
    }
    return -1;
  }



function domId(selector) {
    let dom = document.getElementById(selector);
    return dom;
}
let courseBox = domId("courseList");
listCourse.forEach(classRoom => {
    courseBox.innerHTML+=`
    <option value="${classRoom.courseID}">${classRoom.courseName}</option>
    `
});

function getTotalPage(list) {
    return Math.ceil(list.length / recordsPage);
}

function resetInput() {
    domId("classRoomNumber").value = " ";
    domId("classRoomId").value = "";
    domId("classRoomId").readOnly = false;
    domId("classRoomName").value = "";
    domId("classRoomTeacher").value = "";
    domId("classStatus").value = 0
    domId("classRoomNote").value = "";
    domId("courseList").value = 0
}
function Render(page, listDaTa) {
    let pageMax = getTotalPage(listDaTa)

    if (page < 1) {
        page = 1;
    }
    if (page > pageMax) {
        page = pageMax
    }
    let indexMinPage;
    let indexMaxPage;
    indexMinPage = (page - 1) * recordsPage;

    if (page * recordsPage > listDaTa.length) {
        indexMaxPage = listDaTa.length
    } else {
        indexMaxPage = page * recordsPage;
    }

    // tinh toan render

    domId("tbody").innerHTML = ``;

    for (let index = indexMinPage; index < indexMaxPage; index++) {
        let status = "";
        if (listDaTa[index].classStatus == 1) {
            status = "Chờ Lớp";
        }else if(listDaTa[index].classStatus == 2){
            status = "Hoạt động";
        }else {
            status = "Kết Thúc";
            
        }

        domId("tbody").innerHTML += `
        <td>${index + 1}</td>
        <td>${listDaTa[index].classId}</td>
        <td>${listDaTa[index].className}</td>
        <td>${listDaTa[index].classTeacher}</td>
        <td>${listDaTa[index].classNote}</td>
        <td>${listDaTa[index].numberOfStudent}</td>
        <td>${status}</td>
        <td>
        <p class="icon_action text-info" data-bs-toggle="modal" data-bs-target="#exampleModalClass"  onclick = editData('${listDaTa[index].classId}') )><i class="fa-solid fa-pen-to-square "></i></p>
        <p class="icon_action text-danger" onclick = deleteClass('${listDaTa[index].classId}')><i class="fa-regular fa-trash-can"></i></p>
        
        </td>
        `
    }

    // Render ra cac trang
    let listPage = domId("listPage")
    listPage.innerHTML = "";
    for (let i = 1; i <= getTotalPage(listDaTa); i++) {
        listPage.innerHTML += `
        <li><a href="javascript:clickPage('${i}')">${i}</a></li>
        `
    }

    // aN hien preview, next
    let prev = domId("prev")
    let next = domId("next")
    if (currentPage == 1) {
        prev.style.visibility = "hidden";
    } else {
        prev.style.visibility = "visible"
    }
    if (currentPage == pageMax) {
        next.style.visibility = "hidden"
    } else {
        next.style.visibility = "visible";
    }
}

function clickPage(value) {
    currentPage = value;
    // lít dât này em lấy ở đâu đây
    // cái này em copy quên chưa đổi =))
    Render(value, listDataClass)

}

function prevPage() {
    currentPage--;
    Render(currentPage, listDataClass)
}

function nextPage() {
    currentPage++;
    Render(currentPage, listDataClass)
}
function addClassData() {

    let list = listCourse;
    let classRoomId = domId("classRoomId").value;
    let classRoomName = domId("classRoomName").value;
    let classRoomTeacher =  domId("classRoomTeacher").value;
    let classRoomNumber = domId("classRoomNumber").value;
    let classStatus = domId("classStatus").value;
    let classRoomNote = domId("classRoomNote").value;
    let courseID = domId("courseList").value;
    let indexClass = getIndexById(courseID,listCourse)

    let newClass = new ClassRoom(classRoomId,classRoomName,classRoomNumber,classRoomTeacher,classStatus,classRoomNote);
    listCourse[indexClass].arrClass.unshift(newClass)
    localStorage.setItem("DataManagement", JSON.stringify(list));
    let listClassLoad = getListClass(list)
    Render(1, listClassLoad);
    messagerAdd()
    resetInput();
    myModal.hide();
}

function editData(classId) {
    create = false;
    let classRoom = ManageClass.searchById(classId)
    if (classRoom != null) {
        console.log("Class khong Roong");
        domId("classRoomId").value=classRoom.classId;
        domId("classRoomId").readOnly = true;
        domId("classRoomName").value = classRoom.className ;
       domId("classRoomTeacher").value = classRoom.classTeacher ;
        domId("classRoomNumber").value = classRoom.numberOfStudent ;
        domId("classStatus").value =  classRoom.classStatus;
        domId("classRoomNote").value = classRoom.classNote ;
        let indexClass = getIndexCourseById(classId,listCourse);
        domId("courseList").value = listCourse[indexClass].courseID
        domId("courseList").disabled=true

    }
}
function uploadData() {

    let classRoomId = domId("classRoomId").value;
    let classRoomName = domId("classRoomName").value;
    let classRoomTeacher =  domId("classRoomTeacher").value;
    let classRoomNumber = domId("classRoomNumber").value;
    let classStatus = domId("classStatus").value;
    let classRoomNote = domId("classRoomNote").value;
    // let indexClassById = getIndexById(courseID,listCourse)
    let editClass = new ClassRoom(classRoomId,classRoomName,classRoomNumber,classRoomTeacher,classStatus,classRoomNote);
    
    ManageClass.editClassRoom(editClass)
    
    let list = listCourse;
    localStorage.setItem("DataManagement", JSON.stringify(list));
    let listClassLoad = getListClass(list)
    
    Render(1, listClassLoad);
    
    domId("courseList").disabled =  false 
    messagerEdit()
    resetInput()
    console.log(classRoomId);
    myModal.hide();

}

function deleteClass(classID) {
    let list = listCourse
    for (let index = 0; index < list.length; index++) {
        for (let indexClass = 0; indexClass < list[index].arrClass.length; indexClass++) {
            console.log("arrClas:", list[index].arrClass[indexClass].studentArr.length);
            if (list[index].arrClass[indexClass].studentArr.length>0) {
                messagerDel2()
                return
            }else{
            
                ManageClass.deleteCourse(classID)
                let list = listCourse;
                localStorage.setItem("DataManagement", JSON.stringify(list));
                let listClassLoad = getListClass(list)            
                Render(1, listClassLoad);
    
            }
        }
    }
    }
 
function searchName() {
    let search_ClassName = domId("search_Course").value
    let listSearch =ManageClass.searchByName(search_ClassName)
    Render(1, listSearch)
}
let btnSearch = domId("button-search")
btnSearch.addEventListener("click", function (e) {
    e.preventDefault()
    searchName()
}
)
if (create) {
    domId("exampleModalLabel").innerHTML = "Tạo mới Lớp học"
} else {
    console.log(create);
    domId("exampleModalLabel").innerHTML = "Cập nhật Lớp học"

}
let btnSaveClass = document.querySelector(".btn_Save_class")
btnSaveClass.addEventListener("click", function () {
    if (create) {
        addClassData()
    } else {
        uploadData()
        create = true
    }
})
let sort = domId("sortClass")
function sortClass() {
    
    let list = listCourse;
    let number = sort.value
    switch (number) {
        case "1":
            ManageClass.sortNameAZ(listClassLoad)
            break;
            case "2":
                ManageClass.sortStatusAZ(listClassLoad)
                break;
            case "3":
            ManageClass.sortStatusZA(listClassLoad)
            break;
    }
    localStorage.setItem(("DataManagement"), JSON.stringify(list))
    Render(1, listClassLoad)
}
sort.addEventListener("change", sortClass)
// sort.addEventListener("change", sortCourse);

function getListClass(listCourseOnLoad) {
    let listClassOnLoad = [];
    for (let item of listCourseOnLoad) {
      for (let classItem of item.arrClass) {
        listClassOnLoad.push(classItem);
      }
    }
    return listClassOnLoad;
  }

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
                <i class="fa-regular fa-circle-check"></i> Lớp đang hoạt động .không thể xóa
              </p>
            </div>
        `
}

if (listClassLoad.length > 0) {
    domId("page_result").style.display = "block";
    domId("page_null").style.display = "none";
  } else {
    domId("page_result").style.display = "none";
    domId("page_null").style.display = "block";
  }
  document.onload = Render(1, listClassLoad);
