const storedUserObj = JSON.parse(localStorage.getItem('users'))
if(storedUserObj){
    document.getElementById('message').innerHTML = `
    Welcome! ${storedUserObj.firstName}
    `
}else{
    document.getElementById("message").innerHTML = `
    Welcome!
    `
}

const noteForm = document.getElementById('noteForm');
        const notesGrid = document.getElementById('notesGrid');
        const noteTitle = document.getElementById('noteTitle');
        const noteContent = document.getElementById('noteContent');
        const noteImage = document.getElementById('noteImage');
        const noteFile = document.getElementById('noteFile');
        const noteColor = document.getElementById('noteColor');
        const noteFontWeight = document.getElementById('noteFontWeight');
        const noteFontStyle = document.getElementById('noteFontStyle');
        const editIndex = document.getElementById('editIndex');
        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        let trash = JSON.parse(localStorage.getItem('trash') || '[]');

        function saveNotes() {
            localStorage.setItem('notes', JSON.stringify(notes));
            localStorage.setItem('trash', JSON.stringify(trash));
        }

        function renderNotes(filteredNotes) {
            const notesToRender = filteredNotes || notes;
            notesGrid.innerHTML = notesToRender.map((note, idx) => `
                <div class="note" style="background:${note.color || '#fff'};">
                    <div>
                        <div class="note-title" style="font-weight:${note.fontWeight || 'normal'}; font-style:${note.fontStyle || 'normal'};">${note.title}</div>
                        <div class="note-content" style="font-weight:${note.fontWeight || 'normal'}; font-style:${note.fontStyle || 'normal'};">${note.content}</div>
                        ${note.imageData ? `<img src="${note.imageData}" alt="Note Image" style="max-width:100%;max-height:120px;margin-top:8px;">` : ''}
                        ${note.fileData ? `<a href="${note.fileData}" download="${note.fileName}" style="display:block;margin-top:8px;">${note.fileName}</a>` : ''}
                    </div>
                    <div class="note-footer">
                        <button onclick="editNote(${idx})">Edit</button>
                        <button onclick="moveToTrash(${idx})">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        function renderTrash() {
            notesGrid.innerHTML = trash.map((note, idx) => `
                <div class="note" style="background:${note.color || '#fff'};opacity:0.7;">
                    <div>
                        <div class="note-title" style="font-weight:${note.fontWeight || 'normal'}; font-style:${note.fontStyle || 'normal'};">${note.title}</div>
                        <div class="note-content" style="font-weight:${note.fontWeight || 'normal'}; font-style:${note.fontStyle || 'normal'};">${note.content}</div>
                        ${note.imageData ? `<img src="${note.imageData}" alt="Note Image" style="max-width:100%;max-height:120px;margin-top:8px;">` : ''}
                        ${note.fileData ? `<a href="${note.fileData}" download="${note.fileName}" style="display:block;margin-top:8px;">${note.fileName}</a>` : ''}
                    </div>
                    <div class="note-footer">
                        <button onclick="restoreNote(${idx})">Restore</button>
                        <button onclick="deletePermanently(${idx})">Delete Permanently</button>
                    </div>
                </div>
            `).join('');
        }

        function showNotes() {
            renderNotes();
            document.getElementById('noteForm').style.display = '';
        }
        function showTrash() {
            renderTrash();
            document.getElementById('noteForm').style.display = 'none';
        }

        window.moveToTrash = function(idx) {
            trash.unshift(notes[idx]);
            notes.splice(idx, 1);
            saveNotes();
            renderNotes();
            noteForm.reset();
            noteColor.value = "#ffffff";
            noteFontWeight.value = "normal";
            noteFontStyle.value = "normal";
            editIndex.value = "";
        }
        window.deleteNote = window.moveToTrash; // for compatibility

        window.restoreNote = function(idx) {
            notes.unshift(trash[idx]);
            trash.splice(idx, 1);
            saveNotes();
            renderTrash();
        }
        window.deletePermanently = function(idx) {
            trash.splice(idx, 1);
            saveNotes();
            renderTrash();
        }

        window.editNote = function(idx) {
            const note = notes[idx];
            noteTitle.value = note.title;
            noteContent.value = note.content;
            noteColor.value = note.color || "#ffffff";
            noteFontWeight.value = note.fontWeight || "normal";
            noteFontStyle.value = note.fontStyle || "normal";
            editIndex.value = idx;
            // Images/files can't be set for security, so user must re-upload if needed
            noteImage.value = "";
            noteFile.value = "";
        }

        // Navigation for Notes/Trash
        function setNavHandlers() {
            // Desktop sidebar
            document.querySelectorAll('.sidebar main a').forEach(a => {
                a.onclick = function(e) {
                    e.preventDefault();
                    document.querySelectorAll('.sidebar main a').forEach(x => x.classList.remove('active'));
                    this.classList.add('active');
                    if (this.textContent.trim() === 'Trash') {
                        showTrash();
                    } else {
                        showNotes();
                    }
                };
            });
            // Mobile navbar (Bootstrap collapse)
            document.querySelectorAll('.navbar-nav .nav-link').forEach(a => {
                a.onclick = function(e) {
                    e.preventDefault();
                    document.querySelectorAll('.navbar-nav .nav-link').forEach(x => x.classList.remove('active'));
                    this.classList.add('active');
                    if (this.textContent.trim() === 'Trash') {
                        showTrash();
                    } else {
                        showNotes();
                    }
                    // Close the navbar toggle after click (for mobile UX)
                    const navCollapse = document.getElementById('sidebarNav');
                    if (navCollapse && navCollapse.classList.contains('show')) {
                        navCollapse.classList.remove('show');
                    }
                };
            });
            // Custom mobile dashboard menu
            document.querySelectorAll('#mobileDashboardMenu .nav-link').forEach(a => {
                a.onclick = function(e) {
                    e.preventDefault();
                    document.querySelectorAll('#mobileDashboardMenu .nav-link').forEach(x => x.classList.remove('active'));
                    this.classList.add('active');
                    if (this.textContent.trim() === 'Trash') {
                        showTrash();
                    } else {
                        showNotes();
                    }
                    // Hide the custom menu after click with animation
                    const mobileDashboardMenu = document.getElementById('mobileDashboardMenu');
                    if (mobileDashboardMenu) {
                        mobileDashboardMenu.classList.remove('show-scale');
                        setTimeout(() => {
                            mobileDashboardMenu.style.display = 'none';
                        }, 250);
                    }
                };
            });
        }
        setNavHandlers();

        noteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = noteTitle.value.trim();
            const content = noteContent.value.trim();
            let imageData = null;
            let fileData = null;
            let fileName = null;
            let fileType = null;
            const color = noteColor.value;
            const fontWeight = noteFontWeight.value;
            const fontStyle = noteFontStyle.value;

            // Handle image upload
            if (noteImage.files && noteImage.files[0]) {
                imageData = await toBase64(noteImage.files[0]);
            }
            // Handle file upload
            if (noteFile.files && noteFile.files[0]) {
                fileData = await toBase64(noteFile.files[0]);
                fileName = noteFile.files[0].name;
                fileType = noteFile.files[0].type;
            }

            const idx = editIndex.value;
            if (idx !== "") {
                notes[idx] = { title, content, imageData, fileData, fileName, fileType, color, fontWeight, fontStyle };
            } else {
                notes.unshift({ title, content, imageData, fileData, fileName, fileType, color, fontWeight, fontStyle });
            }
            saveNotes();
            renderNotes();
            noteForm.reset();
            noteColor.value = "#ffffff";
            noteFontWeight.value = "normal";
            noteFontStyle.value = "normal";
            editIndex.value = "";
        });

        function toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }

        // Add icon click handlers for color, font weight, and font style
        document.querySelector('label[for="noteColor"] img').onclick = function() {
            document.getElementById('noteColor').click();
        };
        document.querySelector('label[for="noteFontWeight"] img').onclick = function() {
            document.getElementById('noteFontWeight').focus();
            document.getElementById('noteFontWeight').size = 2;
        };
        document.getElementById('noteFontWeight').onblur = function() {
            this.size = 0;
        };
        document.getElementById('noteFontWeight').onchange = function() {
            this.size = 0;
        };
        document.querySelector('label[for="noteFontStyle"] img').onclick = function() {
            document.getElementById('noteFontStyle').focus();
            document.getElementById('noteFontStyle').size = 2;
        };
        document.getElementById('noteFontStyle').onblur = function() {
            this.size = 0;
        };
        document.getElementById('noteFontStyle').onchange = function() {
            this.size = 0;
        };
        // Auto-expand textarea as user types
        noteContent.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        // Reset textarea height on form reset
        noteForm.addEventListener('reset', function() {
            noteContent.style.height = 'auto';
        });
        // On load, show notes
        showNotes();


        // Custom toggle for mobile dashboard menu
        const customToggleBtn = document.getElementById('customToggleBtn');
        const mobileDashboardMenu = document.getElementById('mobileDashboardMenu');
        if (customToggleBtn && mobileDashboardMenu) {
            customToggleBtn.addEventListener('click', function() {
                if (mobileDashboardMenu.style.display === 'none' || mobileDashboardMenu.style.display === '') {
                    mobileDashboardMenu.style.display = 'block';
                    // Animate in
                    setTimeout(() => mobileDashboardMenu.classList.add('show-scale'), 10);
                } else {
                    // Animate out
                    mobileDashboardMenu.classList.remove('show-scale');
                    setTimeout(() => {
                        mobileDashboardMenu.style.display = 'none';
                    }, 250);
                }
            });
        }

        // Search bar logic
        const searchBar = document.getElementById('searchBar');
        if (searchBar) {
            searchBar.addEventListener('input', function() {
                const query = this.value.trim().toLowerCase();
                if (!query) {
                    renderNotes();
                } else {
                    const filtered = notes.filter(note =>
                        (note.title && note.title.toLowerCase().includes(query)) ||
                        (note.content && note.content.toLowerCase().includes(query))
                    );
                    renderNotes(filtered);
                }
            });
        }