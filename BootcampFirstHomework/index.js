
document.querySelector("#loadPost").addEventListener("click", () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json()).then(response => {
        const posts = response.slice(0, 20)
        renderPost(posts)
      })
    })
    
    const renderPost = (data = []) => {
      data.forEach((item) => {
        const li = document.createElement("li")
        li.innerHTML = `<div class="card">
      <div class="card-body">
        ${item.title}
      </div>
    </div>`
        document.querySelector("#ul-1").appendChild(li)
      })
    }
    const loadUserButton = document.querySelector("#loadUsers")
    
    const template = `
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">Website</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
    `

let users = []
const loadUsers = () => {
let loader = document.querySelector("#loader")
loader.style.display ="block"
setTimeout(() => {
     loader.style.display ="none"
     fetch("https://jsonplaceholder.typicode.com/users").then(response => {
        return response.json()
      }).then(response => {
        users = response.map((x, index) => {
          x.orderNo = index + 1
          return x
        })

        renderUsers(users)
      }).catch(err => {
        console.error(err)
      })
    }, 3000);
    }
    
    loadUserButton.addEventListener("click", loadUsers)
    
    const userDom = document.querySelector("#user")
    
    let user = {}
    const renderUsers = (users = []) => {
      userDom.innerHTML = ""
      const table = document.createElement("table")
    
      table.classList.add("table")
      const thead = document.createElement("thead")
      thead.innerHTML = `
      <tr>
      <th scope="col">Id</th>
        <th scope="col">Sıra No</th>
        <th scope="col" id="sort-order">Name</th>
        <th scope="col" id="reverse-mail">Email</th>
        <th scope="col" id="reverse-phone">Phone</th>
        <th scope="col">Website</th>
        <th scope="col">Actions</th>
      </tr>`
      table.appendChild(thead)

      const tbody = document.createElement("tbody")
    
      tbody.innerHTML = users.map((user, index) => {
        return `<tr>
          <th scope="row">${user.id}</th>
          <th scope="row">${index + 1}</th>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.website}</td>
          <td>
          <button type="button" class="btn btn-danger btn-sm remove" data-id="${user.id}">Sil</button>
          <button type="button" class="btn btn-warning btn-sm update" data-id="${user.id}">Düzenle</button>
          </td>
        </tr>`
      }).join(" ")
      table.appendChild(tbody)

      userDom.appendChild(table)

      document.querySelector("#sort-order").addEventListener("click", sortOrder)
      function sortOrder(){

        tbody.innerHTML = users.map((user, index) => {return `<tr>
              <th scope="row">${user.id}</th>
              <th scope="row">${index + 1}</th>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.phone}</td>
              <td>${user.website}</td>
              <td>
              <button type="button" class="btn btn-danger btn-sm remove" data-id="${user.id}">Sil</button>
              <button type="button" class="btn btn-warning btn-sm update" data-id="${user.id}">Düzenle</button>
              </td>
            </tr>`
          }).reverse()
          .join(" ")
          table.appendChild(tbody)
        
          userDom.appendChild(table)
        
      }
      document.querySelector("#reverse-mail", "reverse-phone").addEventListener("click", sortOrder)
      function sortOrder(){

        tbody.innerHTML = users.map((user, index) => {return `<tr>
              <th scope="row">${user.id}</th>
              <th scope="row">${index + 1}</th>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.phone}</td>
              <td>${user.website}</td>
              <td>
              <button type="button" class="btn btn-danger btn-sm remove" data-id="${user.id}">Sil</button>
              <button type="button" class="btn btn-warning btn-sm update" data-id="${user.id}">Düzenle</button>
              </td>
            </tr>`
          }).reverse()
          .join(" ")
          table.appendChild(tbody)
        
          userDom.appendChild(table)
        
      }
    
      document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function () {
          const status = confirm("Kaydı silmek üzeresiniz emin misiniz?")
          if (status) {
            const id = this.getAttribute("data-id")
            renderUsers(users.filter(x => x.id != id))
          }
        })
      })
    
      document.querySelectorAll(".update").forEach(button => {
        button.addEventListener("click", function () {
          const id = this.getAttribute("data-id")
          const _user = users.find(user => user.id == id)
          fillUser(_user)
          toggleUser()
          toggleTable("none")
        })
      })
    }
    const toggleTable = (display = "none") => {
      document.querySelector("#user").style.display = display
    }
    
    const toggleUser = (display = "block") => {
      document.querySelector("#user-form").style.display = display
    }
    
    const fillUser = (user) => {
      document.querySelector("#labelName").value = user.name
      document.querySelector("#labelPhone").value = user.phone
      document.querySelector("#labelWebSite").value = user.website
      document.querySelector("#labelEmail").value = user.email
      document.querySelector("#userId").value = user.id
    }
    
    const updateUser = () => {
      try {
        const name = document.querySelector("#labelName").value
        const phone = document.querySelector("#labelPhone").value
        const webSite = document.querySelector("#labelWebSite").value
        const email = document.querySelector("#labelEmail").value
        const userId = document.querySelector("#userId").value
    
        const index = users.findIndex(user => user.id == userId)
        fetch("http://localhost:3000/update", {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Token": window.localStorage.getItem("token")
          }
        })
          .then(response => response.json())
          .then(response => {
            const { status } = response
            if (status == true) {
              users[index] = { name, phone, website: webSite, email, id: userId }
              renderUsers(users)
              toggleTable("block");
              toggleUser("none");
              alert("Güncelleme işlemi başarıyla gerçekleşti")
            } else {
              alert("Güncelleme işlemi sırasında bir hata oluştu")
            }
        })

      } catch (error) {
        console.error(error)
        alert("Bizden kaynaklı bir hata oluştu özür dileriz")
        toggleTable("block");
        toggleUser("none");
      }
    
    }
    document.querySelector("#cancel").addEventListener("click", () => {
      toggleTable("block");
      toggleUser("none");
    })  
    document.querySelector("#save").addEventListener("click", updateUser)
    