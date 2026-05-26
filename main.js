const model = {
    notes: [],
    addNote (title, content, color) {
        const id = Math.random()
        const note = {
            // 1. создадим новую заметку
            id: id,
            title: title,
            content: content,
            color: color,
            isFavorite: false,
        }
        // 2. добавим заметку в начало списка
        this.notes.push(note)
        // 3. обновим view
        view.renderNotes(this.notes)
        this.updateNotesView()
    },
    deleteNote (id) {
        this.notes = this.notes.filter(note => note.id !== id)
        view.renderNotes(this.notes)
        this.updateNotesView()
    },
    updateNotesView() {
        // 1. рендерит список заметок (вызывает метод view.renderNotes)
        view.renderNotes(this.notes)
        // 2. рендерит количество заметок (вызывает метод view.renderNotesCount)
        view.renderNotesCount()
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)
        this.renderNotesCount(model.notes)

        const form = document.querySelector('.note-form')
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            // получаем данные из полей формы
            const title = document.querySelector('input').value
            const content = document.querySelector('textarea').value
            const color = document.querySelector('input[name="color"]:checked').value

            // передаем данные в контроллер
            controller.addNote(title, content, color)
            form.reset()
        })

        const notes = document.querySelector('.notes-list')
        notes.addEventListener('click', (e) => {

            if (e.target.closest('.delete')) {
                e.preventDefault()
                const noteId = +e.target.closest('.note').id
                controller.deleteNote(noteId)
            }
        })
    },
    renderNotes(notes) {
        // находим контейнер для заметок и рендерим заметки в него (если заметок нет, отображаем соответствующий текст)
        let notesList = document.querySelector('.notes-list')
        let notesListHTML = ''

        notes.forEach(note => {
            // Определение картинки favorite
            const favIcon = note.isFavorite
                ? 'assets/icon/heart-active.png'
                : 'assets/icon/heart-inactive.png'
            // Создание HTML заметки
            notesListHTML += `
            <div id="${note.id}" class="note">
            <header style="background: ${note.color}">
                <div class="note-title">
                        <div>${note.title}</div>
                    <div class="note-links">
                        <a><img src="${favIcon}" alt="favorite" id="fav"></a>
                        <a href="#" id="delete" class="delete"><img src="assets/icon/trash.png" alt="delete"></a></div>                   
                    </div>
            </header>
                <div class="note-content">${note.content}</div>
            </div>`
        })
        notesList.innerHTML = notesListHTML
        // также здесь можно будет повесить обработчики кликов на кнопки удаления и избранного
    },
    renderNotesCount () {
        let notesCount = document.querySelector('#notesCount')
        if (notesCount) {
            notesCount.innerHTML = `Всего заметок: ${model.notes.length}`
        }
    },
    showMessage () {
        const messagesBox = document.querySelector('.messages-box')
        messagesBox.innerHTML += `<img src="assets/icon/alert/done.png" alt="done">`

        setTimeout(()=> {
            messagesBox.innerHTML = ''
        }, 3000)

    },
    showMessageError () {
        const messagesBox = document.querySelector('.messages-box')
        messagesBox.innerHTML += `<img src="assets/icon/alert/error.png" alt="error">`

        setTimeout(()=> {
            messagesBox.innerHTML = ''
        }, 3000)

    }
}

const controller = {
    addNote(title, content, color) {
        if (title.trim() === '') {
            view.showMessageError()
            return
        }

        if (title.length > 50) {
            view.showMessageError()
            return
        }

        model.addNote(title, content, color)
        view.showMessage()
    },
    deleteNote(id) {
        model.deleteNote(id)
    }
}

function init () {
    view.init()
}

init()