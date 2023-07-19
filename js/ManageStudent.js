function ManageStudent() {

    this.listCourse = localStorage.getItem("DataManagement")
    ? JSON.parse(localStorage.getItem("DataManagement"))
    : [];
    this.listStudent= [];

    this.listCourse.forEach(element => {
    element.arrClass.forEach(element => {
        element.studentArr.forEach(element => {
            this.listStudent.push(element)
        });
    });
});

    this.addStudent = function (student) {
        this.listStudent.unshift(student);
    };
    this.DeleteStudent= function (studenId) {
        for (let index = 0; index < this.listStudent.length; index++) {
            let studentDel = this.listStudent[index]
            if (studenId==studentDel.studenId) {
                this.listStudent.splice(index,1);
            } 
            
        }
    };
    this.EditStudent = function(studentEdit){
        for (let index = 0; index < this.listStudent.length; index++) {
            let studentDel = this.listStudent[index]
            if (studentDel.studenId == studentEdit.studenId) {
                studentDel.studenId = studentEdit.studenId;
                studentDel.studentName = studentEdit.studentName;
                studentDel.email = studentEdit.email;
                studentDel.birth = studentEdit.birth;
                studentDel.classRoom = studentEdit.classRoom;
                studentDel.tel = studentEdit.tel;
                studentDel.sex = studentEdit.sex;
                studentDel.address = studentEdit.address;
                studentDel.status = studentEdit.status;
                studentDel.note = studentEdit.note;
            }
            
            
        }
    };
    this.searchById = function (studentId) {
        for (let index = 0; index < this.listStudent.length; index++) {
            let student = this.listStudent[index]
            if (student.studentId == studentId) {
                return student
            }
            
        }
        return null
    };
    this.searchByName = function(name){
        let listResult = [];
        for (let index = 0; index < this.listStudent.length; index++) {
            let student = this.listStudent[index]
            if (student.studentName.toLowerCase().trim().search(name.toLowerCase().trim())!= -1 || student.studenId.toLowerCase().trim().search(name.toLowerCase().trim())!= -1) {
               
                listResult.push(student)
            }
            
        }
        return listResult;
    };
    this.sortName =function(){
       let listDaTa = this.listStudent
       listDaTa.sort((a,b)=>(a.studentName>b.studentName)?1:(a.studentName<b.studentName)?-1:0);
    }
    
    this.sortID = function (){
        let listDaTa = this.listStudent
       listDaTa.sort((a,b)=>(a.studenId>b.studenId)?1:(a.studenId<b.studenId)?-1:0);
    } 
        
    this.sortBirth = function (){
        let listDaTa = this.listStudent
       listDaTa.sort((a,b)=>(a.birth>b.birth)?1:(a.birth<b.birth)?-1:0);
    } 
}

var ManaStudent = new ManageStudent();
let listCourse = ManaStudent.listCourse
let listDaTa = ManaStudent.listStudent;

let ListstudenId= [];

let currentPage = 1;
let recordsPage = 10;
let create = true;

let courseBox = domId("classList");
listCourse.forEach(classRoom => {
    courseBox.innerHTML+=`
    <option selected value="${classRoom.courseID}">${classRoom.courseName}</option>
    `
});

let myModal = new bootstrap.Modal(
    document.getElementById("set_Class"),
    {
      keyboard: false,
    }
  );

getStorager()
function domId(selector) {
    let dom = document.getElementById(selector);
    return dom;
}


function getStorager() {
localStorage.getItem("ListStudent")?JSON.parse(localStorage.getItem("ListStudent")):[]
}


function getTotalPage(list) {
    return Math.ceil(list.length / recordsPage);
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
        let number =listDaTa[index].status
        let status = "";
        switch (number) {
            case "1":
                status = "Chờ Lớp";
            break;
            case "2":
                status = "Đang học";
                break;
            case "3":
                    status = "Tốt nghiệp";
                break;
            case "4":
                    status = "Bảo lưu";
                break;
            case "5":
                    status = "Đình chỉ";
                break;
        }
       
        
        domId("tbody").innerHTML += `
        <td>${index+1}</td>
        <td>${listDaTa[index].studentId}</td>
        <td>${listDaTa[index].studentName}</td>
        <td>${listDaTa[index].birth}</td>
        <td>${listDaTa[index].address}</td>
        <td><div class="row">
        <div class="col-7 ps-4">
          ${status}
        </div>
        <div class="col-4">
          <p class="icon_action text-info" data-bs-toggle="modal"
            data-bs-target="#set_Class"  onclick = editStatus('${listDaTa[index].studentId}')><i class="fa-solid fa-pen-to-square "></i></p>        
        </td>
        </div>
        </div>       
        </td>
        <td>
        <p class="icon_action text-info" data-bs-toggle="modal"
        data-bs-target="#exampleModal"  onclick = editDataStudent('${listDaTa[index].studentId}')><i class="fa-solid fa-pen-to-square "></i></p>
        <p class="icon_action text-danger" onclick = deleteStudent('${listDaTa[index].studentId}')><i class="fa-regular fa-trash-can"></i></p>
        <p  class="icon_action text-warning" data-bs-toggle="modal" data-bs-target="#set_Class")><i class="fa-solid fa-grip" ></i></p>

                    
        </td>
        `
    }
    
    // Render ra cac trang
    let listPage = domId("listPage")
    listPage.innerHTML = "";
    for (let i = 1; i <= getTotalPage(listDaTa); i++) {

        listPage.innerHTML += `
        <a href="javascript:clickPage('${i}')">${i}</a>
        `
    }

    // aN hien preview, next
    let prev = domId("prev")
    let next = domId("next")
    if (currentPage == 1) {
        prev.style.display = "hidden";
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
    Render(value,listDaTa)

}

function prevPage() {
    currentPage--;
    Render(currentPage,listDaTa)
}

function nextPage() {
    currentPage++;
    Render(currentPage,listDaTa)
}
function addInfo() {
    let studenId = domId("studentId").value;
    let studentName = domId("studentName").value;
    let birth = domId("studentBrith").value;
    let classRoom = domId("studentClass").value;
    let email = domId("studentEmail").value;
    let tel = domId("studentTel").value;
    let sex = document.querySelector("input[type='radio']:checked").value;
    let address = domId("studentAddress").value;
    let note  = domId("note").value;
    let newStudent = new Student(studenId,studentName,birth,email,classRoom,tel,sex,address,note);
    return newStudent
}


//Xoa du lieu InPut
function resetInput() {

    domId("studentId").value = "";
    domId("studentName").value = "";
    domId("studentBrith").value = "";
    domId("studentClass").value = "";
    domId("studentTel").value = "";
    domId("studentAddress").value = "";
    domId("note").value = "";

}
function editStatus(studentId) {
    let student = ManaStudent.searchById(studentId)
    domId("edit_status").value = student.status
    domId("editStatusID").value = studentId
    // student.status = domId("eidt_status").value
    // console.log("student.status",student.status);
    // let list = ManaStudent.listCourse
    // localStorage.setItem(("DataManagement"),JSON.stringify(list))
    // console.log("list",list);
    // messagerEdit()

    // Render(1,list)
}

function editDataStudent(studentId) {
    
    create = false;
  if (!create) {
      if (student != null) {
      domId("studentId").value = student.studentId ;
      domId("studentId").disabled=true;
      domId("studentName").value = student.studentName;
      domId("studentEmail"),value = student.email;
      domId("studentBrith").value = student.birth;
      domId("studentAddress").value = student.address;
      domId("note").value = student.note;
      domId("studentTel").value = student.tel;
      if(student.sex == "Nam"){
          domId("inlineCheckbox1").checked=true;
      }else{
          domId("inlineCheckbox2").checked=true;
      }
      domId("studentAddress").value = student.address;
      domId("note").value = student.note;
      }
  }
}

function uploadData(){

    let list = ManaStudent.listStudent
    let editStudent = addInfo()
    ManaStudent.EditStudent(editStudent)
    localStorage.setItem(("ListStudent"),JSON.stringify(list))
    resetInput()
    create = true
    Render(1,list)
}

function deleteStudent(studentId) {
    let list = listDaTa
    ManaStudent.DeleteStudent(studentId)
    localStorage.setItem(("ListStudent"),JSON.stringify(list))
    Render(1,listDaTa)
}

function searchName() {
    let search_StudentName = domId("search_Student").value
    let listSearch = ManaStudent.searchByName(search_StudentName)
    console.log(listSearch);
    Render(1,listSearch)
}
let btnSearch = domId("button-search")
btnSearch.addEventListener("click", function (e) {
    e.preventDefault()
    searchName()
}
)

let btnEditStatus = domId("bet_setStatus")
btnEditStatus.addEventListener("click", function (e) {
    e.preventDefault()
    let studentEditID = domId("editStatusID").value
    let student = ManaStudent.searchById(studentEditID)
    student.status = domId("edit_status").value
    let list = ManaStudent.listCourse
    localStorage.setItem(("DataManagement"),JSON.stringify(list))
    domId("editStatusID").value = "";
    domId("edit_status").value = "";
    Render(1, listDaTa)
    myModal.hide();
})


let btnSave = document.querySelector(".btn_save")
if(create){
    domId("exampleModalLabel").innerHTML = "Tạo mới sinh viên"
}else{
    domId("exampleModalLabel").innerHTML = "Cập nhật Sinh Viên"
    
}
function createTrue(){
    if(create){
        domId("exampleModalLabel").innerHTML = "Tạo mới sinh viên"
    }else{
        domId("exampleModalLabel").innerHTML = "Cập nhật Sinh Viên"
    }
}
btnSave.addEventListener("click", function () {
    if(create){
        let list = ManaStudent.listStudent
        let newStudent = addInfo()
        ManaStudent.addStudent(newStudent)
        localStorage.setItem(("ListStudent"),JSON.stringify(list))
        resetInput()
        Render(1,list)
    }else{
        uploadData()
        resetInput()
        create = true
        createTrue()
    }
})

let sort = domId("sortStuden")
function sortStudent() {
    let number = sort.value
    switch (number) {
        case "1":
            console.log(0000000);
   ManaStudent.sortID()
            break;
        case "2":
            ManaStudent.sortName()
            break;
        case "3":
            ManaStudent.sortBirth()
            break;
    }
    localStorage.setItem(("ListStudent"),JSON.stringify(listDaTa))
Render(1,listDaTa)
}
sort.addEventListener("change",sortStudent)
let kiemtra = document.getElementById("btn_toast")


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
if (listDaTa.length>0) {
    domId("page_result").style.display ='block';
    domId("page_null").style.display = 'none';
}else{
    domId("page_result").style.display ='none';
    domId("page_null").style.display = 'block';
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

if(listDaTa.length>0){
    document.onload = Render(1, listDaTa)
}


