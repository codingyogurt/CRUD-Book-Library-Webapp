class Book {
    constructor(projectName, projectDetails, projectID){
        this.projectName = projectName;
        this.projectDetails = projectDetails;
        this.projectID = projectID;
    }
}

class LStorage {
    static getBooks(){
        let books;
        if (localStorage.getItem("books") === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }
    static addBook(book){
        let books = LStorage.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }
    static deleteBook(id){
        let books = LStorage.getBooks();
        books.forEach((book, index)=> {
            if (book.projectID === id){
                books.splice(index,1);
            }
        })
        localStorage.setItem("books", JSON.stringify(books));
    }
    static isExist(id){
        let books = LStorage.getBooks();
        let exist = false;
        books.forEach((book,index)=> {
            if(book.projectID === id){
                exist = true;
            }
        })
        return exist;
    }
}

class UI {
    
    static displayBooks(){
        const books = LStorage.getBooks();
        books.forEach((book) => UI.addToList(book));
    }

    static clearFields(){
        document.querySelector("#nameInput").value = "";
        document.querySelector("#detailsInput").value = "";
        document.querySelector("#idInput").value = "";
    }

    static addToList(book){
        // get table body
        const table = document.querySelector('#table-items');
        // create tr element
        const tableRow = document.createElement('tr');
        // set additional html to the tr element
        tableRow.innerHTML = `
            <td>${book.projectName}</td>
            <td>${book.projectDetails}</td>
            <td>${book.projectID}</td>
            <td><button class="btn btn-danger btn-sm delete">x</button></td>
        `
        // add tableRow with some HTML as a child to the table body
        table.appendChild(tableRow);
    }

    static showMessage(message, type){
        const div = document.createElement("div");
        div.className = `alert alert-${type}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");

        container.insertBefore(div,form);

        setTimeout(()=> document.querySelector(".alert").remove(),3000);
    }

    static deleteBook(eTarget){
        
        eTarget.parentElement.parentElement.remove();
        
    }

}

document.addEventListener("DOMContentLoaded", UI.displayBooks());
UI.clearFields();

// Event to add the book 
document.querySelector("#book-form").addEventListener("submit", (e) => {

    e.preventDefault();

    const projectName = document.querySelector("#nameInput").value;
    const projectDetails = document.querySelector("#detailsInput").value;
    const projectID = document.querySelector("#idInput").value;
    
    if (projectName === "" || projectDetails === "" || projectID === ""){
        UI.showMessage("Please input all fields", "danger");
    } else if (LStorage.isExist(projectID) === true){
        UI.showMessage("Project ID already exist!", "danger");
    } else {
        const book = new Book(projectName, projectDetails, projectID);

        UI.addToList(book);

        LStorage.addBook(book);

        UI.clearFields();

        UI.showMessage("Successfully Added!", "success");
    }
});

// Event for deleting a book

document.querySelector("#main-table").addEventListener("click", (e)=> {
    if(e.target.classList.contains("delete")){
        UI.deleteBook(e.target);
        LStorage.deleteBook(e.target.parentElement.previousElementSibling.textContent);
        UI.showMessage("Sucessfully deleted!", "success");
    }
})

