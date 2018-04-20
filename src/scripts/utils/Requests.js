const TemplateEngine = require('./TemplateEngine');

const todoPath = '/todo';

function Api() {
}

Api.prototype.loadData = function (callback) {
    let req = new XMLHttpRequest();
    req.open('GET', `${todoPath}/items`, true);
    req.send();
    req.onload = function () {
        if (req.status === 200) {
            let todos = JSON.parse(req.responseText);
            callback(todos);
        } else {
            alert(`Error: ${req.responseText}`);
        }
    }
};

Api.prototype.addItem = function (model, callback) {
    let requestBody = {};
    requestBody['text'] = model.get('text');
    requestBody['checked'] = model.get('isReady');

    let req = new XMLHttpRequest();
    req.open('POST', todoPath, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(requestBody));

    req.onload = function () {
        if (req.status === 200) {
            let response = JSON.parse(req.responseText);
            callback(response);
        } else {
            alert(`Error: ${req.responseText}`);
        }
    }
};

Api.prototype.removeItem = function (model, todosList, callback) {
    let req = new XMLHttpRequest();
    req.open('DELETE', todoPath + "/" + model.get('id'), true);
    req.send();
    req.onload = function () {
        if (req.status === 200) {
            callback();
        } else {
            alert(`Error: ${req.responseText}`)
        }
    }
};

Api.prototype.setState = function (model, state) {
    let req = new XMLHttpRequest();
    req.open('PATCH', `${todoPath}/${model.get('id')}/checked`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({'checked': state}));
    req.onload = function () {
        if (req.status !== 200) {
            alert(`Error: ${req.responseText}`);
        }
    }
};

Api.prototype.setText = function (model, text) {
    let req = new XMLHttpRequest();
    req.open('PATCH', `${todoPath}/${model.get('id')}/text`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({'text': text}));
    req.onload = function () {
        if (req.status !== 200) {
            alert(`Error: ${req.responseText}`);
        }
    }
};

Api.prototype.checkAll = function (todosListModel, callback) {
    let req = new XMLHttpRequest();
    req.open('PATCH', `${todoPath}/checkAll`, true);
    req.send();
    req.onload = function () {
        if (req.status === 200) {
            callback();
        } else {
            alert(`Error: ${req.responseText}`);
        }
    }
};

let api = new Api();

module.exports = api;
