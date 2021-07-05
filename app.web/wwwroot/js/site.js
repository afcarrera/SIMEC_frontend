// Write your JavaScript code.
var enlace = 'https://localhost:44387/api/Cliente';
var clientes = [];

function getItems() {
    fetch(enlace)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const identidficadorTextbox = document.getElementById('identificador');
    const nombreTextbox = document.getElementById('nombre');

    const item = {
        estado: true,
        idcliente: identidficadorTextbox.value.trim(),
        nombrecompleto: nombreTextbox.value.trim()
    };

    fetch(enlace, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    },)
        .then(response => response.json())
        .then(data => _displayMsg(data))
        .then(() => {
            getItems();
            identidficadorTextbox.value = '';
            nombreTextbox.value = '';
        })
        .catch(error => console.error('No se puede añadir cliente.', error));
}

function deleteItem(id) {
    fetch(`${enlace}/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => _displayMsg(data))
        .then(() => getItems())
        .catch(error => console.error('No se puede eliminar cliente.', error));
}

function displayEditForm(id) {
    const cliente = clientes.find(item => item.idcliente == id);

    document.getElementById('edit-nombre').value = cliente.nombrecompleto;
    document.getElementById('edit-id').value = cliente.idcliente;
    document.getElementById('edit-isActivo').checked = cliente.estado;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        idcliente: itemId,
        estado: document.getElementById('edit-isActivo').checked,
        nombrecompleto: document.getElementById('edit-nombre').value.trim()
    };

    fetch(`${enlace}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(data => _displayMsg(data))
        .then(() => getItems())
        .catch(error => console.error('No se puede actualizar cliente.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function validarNombre(id_text) {
    var nombre = document.getElementById(id_text).value;
    nombre = nombre.toUpperCase();
    if (!sonLetrasSolamente(nombre)) {
        document.getElementById(id_text).value = nombre.substring(0, nombre.length - 1);
    } else {
        document.getElementById(id_text).value = nombre;
    }
}

function sonLetrasSolamente(texto) {
    var regex = /^[A-Z\u00d1ÁÉÍÓÚ]+(\s[A-Z\u00d1ÁÉÍÓÚ]*){0,}$/;
    return regex.test(texto);
}

function _displayItems(data) {
    const tBody = document.getElementById('clientes');
    tBody.innerHTML = '';

    const button = document.createElement('button');
    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.estado;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Editar';
        editButton.setAttribute('onclick', `displayEditForm(${item.idcliente})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Eliminar';
        deleteButton.setAttribute('onclick', `deleteItem(${item.idcliente})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNodeId = document.createTextNode(item.idcliente);
        td1.appendChild(textNodeId);

        let td2 = tr.insertCell(1);
        let textNodeNom = document.createTextNode(item.nombrecompleto);
        td2.appendChild(textNodeNom);

        let td3 = tr.insertCell(2);
        td3.appendChild(isCompleteCheckbox);

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    clientes = data;
    
}

function _displayMsg(data) {
    var tamanio = Object.keys(data).length;
    if (tamanio>1) {
        Object.values(data).forEach(item => {
            if (typeof item === 'object') {
                var cont = 0;
                Object.values(item).forEach(validacion => {
                    setTimeout(function () {
                        doToast(validacion);
                    }, cont);
                    cont += 1000;
                });
            }
        }); 
    } else {
        doToast(data);
    }
}

(function (window, document) { // asilamos el componente
    // creamos el contedor de las tostadas o la tostadora
    var container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);

    // esta es la funcion que hace la tostada
    window.doToast = function (message) {
        // creamos tostada
        var toast = document.createElement('div');
        toast.className = 'toast-toast';
        toast.innerHTML = message;

        // agregamos a la tostadora
        container.appendChild(toast);

        // programamos su eliminación
        setTimeout(function () {
            // cuando acabe de desaparecer, lo eliminamos del dom.
            toast.addEventListener("transitionend", function () {
                container.removeChild(toast);
            }, false);

            // agregamos un estilo que inicie la "transition". 
            toast.classList.add("fadeout");
        }, 4000); // OP dijo, "solo dos segundos"
    }
})(window, document);
