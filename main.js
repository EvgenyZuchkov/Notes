const model = {
    notes: [],
    addNote (title, content, color) {
        const id = Math.random()
        const note = {
            id: id,
            title: title,
            content: content,
            color: color,
            isFavorite: false,
        }
        // 2. добавим заметку в начало списка
        this.notes.unshift(note)
        // 3. обновим view
        this.updateNotesView()
    },
    deleteNote (id) {
        this.notes = this.notes.filter(note => note.id !== id)
        this.updateNotesView()
    },
    toggleNote (id) {
        this.notes = this.notes.map(note => {
            if (note.id === id) {
                note.isFavorite = !note.isFavorite
            }
            return note
        })
        this.updateNotesView()
    },
    isShowOnlyFavorite: false,
    toggleShowOnlyFavorite (isShowOnlyFavorite) {
        this.isShowOnlyFavorite = isShowOnlyFavorite
        this.updateNotesView()
    },
    updateNotesView() {
        const notesToRender = this.isShowOnlyFavorite
            ? this.notes.filter(note => note.isFavorite)
            : this.notes

        view.renderNotes(notesToRender)
        // 2. рендерит количество заметок (вызывает метод view.renderNotesCount)
        view.renderNotesCount()
    }
}

const view = {
    init: function () {
        this.renderNotes(model.notes)
        this.renderNotesCount(model.notes)

        const form = document.querySelector('.note-form')
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            // получаем данные из полей формы
            const title = document.querySelector('input').value
            const content = document.querySelector('textarea').value
            const color = document.querySelector('input[name="color"]:checked').value

            if (title !== '' && content !== '') {
                controller.addNote(title, content, color)
                form.reset()
            } else {
                this.showMessage('errorValue')
            }

        })

        let notes = document.querySelector('.notes-list')
        notes.addEventListener('click', (e) => {

            if (e.target.closest('.delete')) {
                e.preventDefault()
                const noteId = +e.target.closest('.note').id
                controller.deleteNote(noteId)
            }
            if (e.target.closest('.favoriteToggle')) {
                e.preventDefault()
                const noteId = +e.target.closest('.note').id
                controller.toggleNote(noteId)
            }
        })

        const filterBox = document.querySelector('.filter-box')
        filterBox.addEventListener('change', (e) => {
            controller.toggleShowOnlyFavorite(e.target.checked)
        })
    },
    renderNotes(notes) {
        // находим контейнер для заметок и рендерим заметки в него (если заметок нет, отображаем соответствующий текст)
        let notesList = document.querySelector('.notes-list')
        let notesListHTML = ''

        if (model.notes.length === 0) {
            notesList.innerHTML = '<div class="description">У вас нет еще ни одной заметки\n' +
                'Заполните поля выше и создайте свою первую заметку!</div>'
        } else {
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
                        <a href="#" id="favoriteToggle" class="favoriteToggle">
                            <img src="${favIcon}" alt="favorite" id="fav">
                        </a>
                        <a href="#" id="delete" class="delete">
                            <img src="assets/icon/trash.png" alt="delete">
                        </a>                  
                    </div>
            </header>
                <div class="note-content">${note.content}</div>
            </div>`
            })
            notesList.innerHTML = notesListHTML
        }
    },
    renderNotesCount () {
        let notesCount = document.querySelector('#notesCount')
        if (notesCount) {
            notesCount.innerHTML = `Всего заметок: ${model.notes.length}`
        }
    },
    showMessage (message) {
        const messagesBox = document.querySelector('.messages-box')
        if (message === 'done') {
            messagesBox.innerHTML += `<img src="assets/icon/alert/done.png" alt="done">`
        } else if (message === 'error') {
            messagesBox.innerHTML += `<img src="assets/icon/alert/error.png" alt="error">`
        } else if (message === 'delete') {
            messagesBox.innerHTML += `<img src="assets/icon/alert/delete.png" alt="delete">`
        } else if (message === 'errorValue') {
            messagesBox.innerHTML += `<img src="assets/icon/alert/errorValue.png" alt="errorValue">`
        }

        setTimeout(()=> {
            messagesBox.innerHTML = ''
        }, 3000)

    },
}

const controller = {
    addNote(title, content, color) {
        if (title.length > 50) {
            view.showMessage('error')
            return
        }

        model.addNote(title, content, color)
        view.showMessage('done')
    },
    deleteNote(id) {
        model.deleteNote(id)
        view.showMessage('delete')
    },
    toggleNote(id) {
        model.toggleNote(id)
    },
    toggleShowOnlyFavorite(isShowOnlyFavorite) {
        model.toggleShowOnlyFavorite(isShowOnlyFavorite)
    }
}

function init () {
    view.init()
}

init()