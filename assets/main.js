window.onload = function(){
  const todosContainer = document.getElementById('todos-container');
  const inlinetodo = document.getElementById('inline-todo');
  
  const newTodoInput = document.getElementById('new-todo-input');
  const addTodoBtn = document.getElementById('add-todo-btn');
  const sortTodoBtn = document.getElementById('sort-todos-btn');
  const plusIcon = document.getElementById('plus');
  const wipeIt = document.getElementById('wipe');

  // const editOverlay = this.document.getElementById('edit');

  cDate();
  keepCount();
  newTodoInput.onkeydown = function(e) {
    if (e.keyCode === 13) {
      createTodo();
      // console.log("add with keydown");
    }
  }
  
  addTodoBtn.onclick = function(e) {
    // console.log("add btn click");
    createTodo();
  }
  
  plusIcon.onclick = function(e){
    // console.log("plus icon click");
  
    $( "#add-to-do-wrap" ).toggle();
  }
  
  sortTodoBtn.onclick = function(e) {
    // console.log("sort btn click");

    if(document.getElementsByClassName("fa-sort-down").length > 0){
      // console.log("element exists");
      sortTodoBtn.getElementsByClassName("fa-sort-down")[0].className = 'fas fa-sort-up';
      sortTodosdesc();
    }
    else{
      // console.log("other element exists");
      sortTodoBtn.getElementsByClassName("fa-sort-up")[0].className = 'fas fa-sort-down';
      sortTodosasc();
    }
    
  }

  wipeIt.onclick = function(e) {
    // console.log("wipe btn click");
    WipeTable();
  }

fetch('/get-todos')
.then(response => response.json())
.then(response => {
  // console.log("get to dos " + response);
  response.forEach(todo => {
    // console.log("for each loop " + todo.checkboxdate);
    insertTodo(todo);
  });
});
//START INSERTTODO​
function insertTodo(todo) {
  // console.log("get to dos checkboxdate " + todo.checkboxdate);
  let container = document.createElement('div');
  container.id = todo.id;
  container.classList.add('row');
  container.innerHTML = `
  <div id="${'inlinecheckbox-' + container.id}" class="inline-checkbox col"></div>
  <div id="${'inlinecreatedate-' + container.id}" class="inline-createdate col"></div>
  <div id="${'inlinecheckboxdate-' + container.id}" class="inline-checkboxdate col"></div>
  <div id="${'inlinetext-' + container.id}" class="inline-text col"></div>
  <div id="${'inlinedel-' + container.id}" class="inline-del col"></div>
  <div id="${'inlineedit-' + container.id}" class="inline-edit col"></div>
  <div id="${'inlinepriority-' + container.id}" class="inline-priority col"></div>
 `;
 

//  var ttest = "#inlinecheckbox-" + container.id;
//  console.log("id name " + test);
//let checkbox = $( ttest ).append(document.createElement('input'));
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'checkbox-' + todo.id;
  checkbox.classList.add('checked');
  checkbox.checked = todo.completed;
  let checkdate = document.createElement('span');
  checkdate.id = 'checkdate-' + todo.id;
  checkdate.classList.add('checkdate');
  if(todo.checkboxdate && checkbox.checked){
    // console.log('createdDate ' + todo.created);
    // Split timestamp into [ Y, M, D, h, m, s ]
    var t = todo.checkboxdate.split(/[T]/);
    // Apply each element to the Date function
    var d = t[0].split(/[-]/);
    var f =  d[1]+"-"+d[2]+"-"+d[0];
    // console.log("split date " + t + " testing date " + f);
    checkdate.innerHTML += `${f}`;
  }
  
  checkbox.onchange = function (e) {
    // console.log(checkbox.checked);
    if(checkbox.checked){
      var now2 = new Date();
      var offset = -300; //Timezone offset for EST in minutes.
      var estDate = new Date(now2.getTime() + offset*60*1000);
      todo.checkboxdate = ISODateString(estDate);
      console.log("testing eastern date: " + estDate);
      var n2 = todo.checkboxdate.split(/[ ]/);
      var d2 = n2[0].split(/[-]/);
      var tempDate2 = d2[1] + "/" + d2[2] + "/" + d2[0];
      // console.log('checkbox checked? if so, date should be inserted. ' + todo.checkboxdate + " " + checkbox.checked);
      checkdate.innerHTML = `${tempDate2}`;
      console.log("tempdate2 " + tempDate2);
    }
    else{
      // console.log("checkbox not checked? date should be blank. if not remove")
      todo.checkboxdate = "";
      checkdate.innerHTML= `${todo.checkboxdate}`;
    }
  
    checkdateTodo(todo.checkboxdate, todo.id); 
    
    fetch('/update-todo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        id: todo.id,
        completed: checkbox.checked
      })
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response);      
    })
      .catch(error => console.error(error));
  }

  let text = document.createElement('input');
  text.type = 'text';
  text.id = 'text-' + todo.id;
  text.value = todo.text;

  let createdDate = document.createElement('span');
  createdDate.id = 'createdDate-' + todo.id;
  createdDate.classList.add('created');
  if(todo.created){
    // console.log('createdDate ' + todo.created);
    // Split timestamp into [ Y, M, D, h, m, s ]
    var t = todo.created.split(/[T]/);
    // Apply each element to the Date function
    var d = t[0].split(/[-]/);
    var f =  d[1]+"/"+d[2]+"/"+d[0];
    // console.log("split date " + t + " testing date " + f);
    createdDate.innerHTML += `${f}`;
  }
  else{
    var now = new Date();
    var date = now.toLocaleDateString();
    var dtest = now.toISOString().substr(0,10);
    var n =  dtest.split(/[-]/);
    var tempDate = n[1] + "/" + n[2] + "/" + n[0];
    // console.log("split date " + n + " test after split " + tempDate);
    createdDate.innerHTML += `${tempDate}`;
  }
  

  let edit = document.createElement('icon');
    edit.classList.add('far');
    edit.classList.add('fa-edit');
    edit.id = 'edit-' + todo.id;
    
    
    edit.onclick = function (e) {
      // console.log('editing ' + todo.id);

      fetch('/edit-todo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          id: todo.id,
          text: text.value,
        })
      })
        .then(response => response.json())
        .then(response => {
          // console.log(response);
        })
        .catch(error => console.error(error));
    }

    let btn = document.createElement('icon');
    btn.classList.add('fas');
    btn.classList.add('fa-trash-alt');
    btn.id = 'btn-' + todo.id;
    // btn.innerHTML = 'X';
    btn.onclick = function (e) {
      console.log('deleting ' + todo.id);
      
      fetch('/delete-todo', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          id: todo.id,
        })
      })
        .then(response => response.json())
        .then(response => {
          // console.log(response);
          if (response.affectedRows) {
            document.getElementById('count').innerHTML = "";
            container.remove();
            keepCount();
          }
        })
        .catch(error => console.error(error));
    }

    

      var one = "inlinecheckbox-" + container.id;
      var two = "inlinecreatedate-" + container.id;
      var three = "inlinecheckboxdate-" + container.id;
      var four = "inlinetext-" + container.id;
      var five = "inlinedel-" + container.id;
      var six = "inlineedit-" + container.id;
      // var seven = "inlinepriority-" + container.id;
      
      
      inlinetodo.appendChild(container);     
      document.getElementById(one).appendChild(checkbox);
      document.getElementById(two).appendChild(createdDate);
      document.getElementById(three).appendChild(checkdate);
      document.getElementById(four).appendChild(text);
      document.getElementById(five).appendChild(btn);
      document.getElementById(six).appendChild(edit);
      // document.getElementById(seven).appendChild("priority");
      todosContainer.appendChild(inlinetodo);

}
//END INSERTTODO
//START FUNCTIONS

function checkdateTodo(newcheckdate, id) {
  fetch('/checkdate-todo', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify({
      id: id,
      checkdate: newcheckdate,
    })
    // .catch(error => console.error(error));
})
}

function keepCount(){
  var countItems = document.getElementById('count');
  fetch('/get-count', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: "include",
  })
    .then(response => response.json())
    .then(response => {
      countItems.innerHTML += `<div>${response[0]['count']} RECORDS</div>`;
    })
    .catch(error => console.error(error));
}

function WipeTable(){
  fetch('/wipe-todo', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: "include",
    })
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        if (response.affectedRows) {
          console.log("successfully wiped table");
          document.getElementById('count').innerHTML = "";
          container.remove();
          keepCount();
        }

      })
      .catch(error => console.error(error));
}

  function cDate(){
    var today = document.getElementById('today');
    var currentdate = new Date(); 
    var datetime = (currentdate.getMonth()+1)  + "/"
                + currentdate.getDate() + "/"
                + currentdate.getFullYear() + "  "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    today.innerHTML += `<div>${datetime}</div>`;
    // document.getElementById('today').innerHTML += datetime;
  }

function createTodo() {
  // console.log('add todo');
  if (newTodoInput.value) {
    fetch('/create-todo', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        text: newTodoInput.value,
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.affectedRows) {
          insertTodo({
            id: response.insertId,
            text: newTodoInput.value,
            created: response.created,
            completed: false,
            priority: response.priority,
            checkboxdate: null
          });
          newTodoInput.value = '';
          document.getElementById('count').innerHTML = "";
          keepCount();
        }
        else {
          alert('Could not create');
        }
      })
      // .catch(error => console.error(error));
  }
  else {
    alert('You can not create a todo without text');
  }
}

function sortTodosdesc() {
  // console.log('sort todos');
  $('#inline-todo > div').remove();
  
  fetch('/sort-todos-desc')
  .then(response => response.json())
  .then(response => {
    // console.log(response);
    response.forEach(todo => {
      insertTodo(todo);
    });
    })
  }

function sortTodosasc() {
  // console.log('sort todos');
  $('#inline-todo > div').remove();
  
  fetch('/sort-todos-asc')
  .then(response => response.json())
  .then(response => {
    // console.log(response);
    response.forEach(todo => {
      insertTodo(todo);
    });
    })
  }

  function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate()) +' '
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())
  }
}

