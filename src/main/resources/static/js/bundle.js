/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Eventable = __webpack_require__(2);

/**
 * @param {Function} Extendable
 * @return {Function} Extendable
 */
function ExtendEventable(Extendable) {
    for (let proto in Eventable.prototype) {
        Extendable.prototype[proto] = Eventable.prototype[proto];
    }
    return Extendable;
}

module.exports = ExtendEventable;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const TemplateEngine = __webpack_require__(3);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function Eventable() {
}

Eventable.prototype._initEventable = function () {
    this._eventable_registry = {};
};

function getEventSubscribers(eventable, eventName, needToCreate) {
    let registry = eventable._eventable_registry;

    if (eventName in registry) {
        return registry[eventName];
    } else if (needToCreate) {
        return registry[eventName] = [];
    }
    return null;
}

Eventable.prototype.on = function (eventName, handler, ctx) {
    let subscribers = getEventSubscribers(this, eventName, true);
    subscribers.push({handler: handler, ctx: ctx});
    return this;
};

Eventable.prototype.off = function (eventName, handler, ctx) {
    let subscribers = getEventSubscribers(this, eventName);
    if (subscribers) {
        for (let i = subscribers.length; i--;) {
            if ((subscribers[i].handler === handler) && (subscribers[i].ctx === ctx)) {
                subscribers.splice(i, 1);
                return this;
            }
        }
    }
    return this;
};

Eventable.prototype.trigger = function (eventName, data) {
    let subscribers = getEventSubscribers(this, eventName);
    if (subscribers) {
        let subscribersCopy = subscribers.slice();
        for (let i = 0, l = subscribersCopy.length; i !== l; i += 1) {
            subscribersCopy[i].handler.call(subscribersCopy[i].ctx, data);
        }
    }
    return this;
};

module.exports = Eventable;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

let divElement = document.createElement('div');

function getTemplateRootNode(scriptId) {
    let script = document.getElementById(scriptId);
    divElement.innerHTML = script.innerHTML;

    let result = divElement.children[0];
    divElement.removeChild(result);

    return result;
}

let templateEngine = {
    todoItem: function (data) {
        let root = getTemplateRootNode('itemTemplate');
        let readyMark = root.querySelector('.input-checkbox_target');
        let remove = root.querySelector('.todo-item_close');
        let text = root.querySelector('.todo-item_text');

        if (data.text) {
            text.innerText = data.text;
        }

        if (data.isReady) {
            readyMark.checked = true;
        }

        return {
            root: root,
            text: text,
            readyMark: readyMark,
            remove: remove
        };
    }
};

module.exports = templateEngine;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);

/**
 * @constructor
 */
function ViewState() {
    this._initEventable();

    this.filter = 'all';
}

ExtendEventable(ViewState);

ViewState.prototype.onChange = function (handler, ctx) {
    this.on('filterChanged', function (filterName) {
        handler.call(ctx, {filter: filterName});
    });
};

ViewState.prototype.setFilter = function (filterName) {
    this.filter = filterName;
    this.trigger('filterChanged', filterName);
    return this;
};

ViewState.prototype.getFilter = function () {
    return this.filter;
};

const viewState = new ViewState();

module.exports = viewState;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

document.addEventListener('DOMContentLoaded', init);

const TodosListModel = __webpack_require__(6);
const TodosContainer = __webpack_require__(8);
const TodoAddbar = __webpack_require__(9);
const TodosList = __webpack_require__(10);
const TodosActionbar = __webpack_require__(12);
const viewState = __webpack_require__(4);
const api = __webpack_require__(1);

function init() {
    const mainWrapper = document.querySelector('.todo-main-wrapper');
    const todosContainer = new TodosContainer(mainWrapper.querySelector('.todo-container'));
    const todoAddbar = new TodoAddbar(mainWrapper.querySelector('.todo-add'));
    const todosList = new TodosList(mainWrapper.querySelector('.todo-items'));
    const todosActionbar = new TodosActionbar(mainWrapper.querySelector('.todo-actionbar'));
    const todosListModel = new TodosListModel([]);

    viewState.onChange(data => {
        todosList.filterItems(data['filter']);
    });

    todosListModel.onChange(() => {
        todosContainer.setVisibility(todosListModel.getList().length !== 0);

        let leftItemsNumber = todosListModel.getLeftItemsNumber();
        todosActionbar.setLeftItemsNumber(leftItemsNumber);

        todosActionbar.setClearCompletedVisibility(todosListModel.getList().length > leftItemsNumber);
    });

    todoAddbar
            .on('todoCreated', inputData => todosListModel.add(inputData))
            .on('selectAll', () => {
                api.checkAll(todosListModel, () => {
                    todosListModel.getList()
                            .filter(model => !model.get('isReady'))
                            .forEach(model => model.set('isReady', true));
                });
            });

    todosListModel
            .on('todoAdd', model => todosList.addTodo(model))
            .on('todoRemove', model => {
                api.removeItem(model, todosList, () => todosList.remove(model));
            })
            .on('todoChange', () => {
                todosList.filterItems();
            });

    todosActionbar
            .on('clearCompleted', () => {
                todosListModel.clearCompleted();
            })
            .on('filterSelected', filter => {
                viewState.setFilter(filter);
            });

    api.loadData(response => response
            .sort((a, b) => a['id'] - b['id'])
            .forEach(todo => todosListModel.addLoaded(todo)));
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);
const TodoModel = __webpack_require__(7);
const api = __webpack_require__(1);

/**
 * @param {Array.<TodoModel>} dataItems
 * @constructor
 */
function TodosListModel(dataItems) {
    this._initEventable();

    this._itemIds = 0;
    this._itemModels = dataItems || [];
    this._left = 0;
}

ExtendEventable(TodosListModel);

/**
 * Returns list models.
 * @returns {Array.<TodoModel>}
 */
TodosListModel.prototype.getList = function () {
    return this._itemModels;
};

/**
 * @returns {Number}
 */
TodosListModel.prototype.getLeftItemsNumber = function () {
    return this._left;
};

/**
 *
 * @param {Function} handler
 * @param {Object} [ctx]
 * @returns {TodosListModel}
 */
TodosListModel.prototype.onChange = function (handler, ctx) {
    this
            .on('todoAdd', handler, this)
            .on('todoRemoved', handler, this)
            .on('todoChange', handler, this)
            .on('modelReadyChanged', model => {
                if (model.get('isReady') && this._left !== 0) {
                    this._left -= 1;
                } else {
                    this._left += 1;
                }
                this.trigger('todoChange');
                handler.call(ctx);
            }, this)
            .on('modelRemoved', model => {
                this.remove(model.get('id'));
                this.trigger('todoChange');
                handler.call(ctx);
            }, this)
            .on('modelChanged', () => {
                this.trigger('todoChange');
                handler.call(ctx)
            }, this);

    return this;
};

/**
 * @param {Object} inputData
 * @returns {TodosListModel}
 */
TodosListModel.prototype.add = function (inputData) {
    let model = new TodoModel(Object.assign({id: this._itemIds++}, inputData));
    this._setupModel(model);

    api.addItem(model, response => {
        model.set('id', response['id']);
        this.trigger('todoAdd', model);
    });

    return this;
};

TodosListModel.prototype.addLoaded = function (data) {
    let model = new TodoModel(Object.assign({id: data['id'], text: data['text'], isReady: data['checked']}));
    this._setupModel(model);

    this.trigger('todoAdd', model);

    return this;
};

TodosListModel.prototype._setupModel = function (model) {
    model.onAnyChange(data => {
        switch (data['field']) {
        case 'isReady':
            this.trigger('modelReadyChanged', model);
            break;
        case 'deleted':
            this.trigger('modelRemoved', model);
            break;
        default:
            this.trigger('modelChanged', model);
            break;
        }
    }, this);

    if (!model.get('isReady')) {
        this._left += 1;
    }

    this._itemModels.push(model);
};

/**
 * @param {Number} id
 * @returns {TodoModel|null}
 * @private
 */
TodosListModel.prototype._getModelById = function (id) {
    for (let i = this._itemModels.length; i--;) {
        if (this._itemModels[i].get('id') === id) {
            return this._itemModels[i];
        }
    }
    return null;
};

/**
 * @param {Number} id
 * @returns {TodosListModel}
 */
TodosListModel.prototype.remove = function (id) {
    let model = this._getModelById(id);

    if (model) {
        if (!model.get('isReady')) {
            this._left -= 1;
        }

        this.trigger('todoRemove', model);
        model.off('modelFieldChanged', this);

        let modelIndex = this.getList().indexOf(model);
        this.getList().splice(modelIndex, 1);

        this.trigger('todoRemoved');
    }

    return this;
};

/**
 * @returns {TodosListModel}
 */
TodosListModel.prototype.clearCompleted = function () {
    let copyModels = this.getList().slice();
    copyModels.forEach(model => {
        if (model.get('isReady')) {
            this.remove(model.get('id'));
        }
    }, this);
    return this;
};

module.exports = TodosListModel;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);

/**
 * @param {Object} data
 * @constructor
 */
function TodoModel(data) {
    this._initEventable();

    this._model = {
        id: data.id,
        isReady: data.isReady || false,
        text: data.text
    };
}

ExtendEventable(TodoModel);

/**
 * @param {String} field
 * @param {*} value
 * @returns {TodoModel}
 */
TodoModel.prototype.set = function (field, value) {
    this._model[field] = value;
    this.trigger('modelFieldChanged', {field: field, value: value});

    return this;
};

/**
 * @param {String} field
 * @returns {*}
 */
TodoModel.prototype.get = function (field) {
    return this._model[field];
};

/**
 * @param {String} field
 * @param {Function} handler
 * @param {Object} [ctx]
 * @returns {TodoModel}
 */
TodoModel.prototype.onChange = function (field, handler, ctx) {
    this.on('modelFieldChanged', function (data) {
        if (data.field === field) {
            handler.call(ctx, data);
        }
    }, this);

    return this;
};

/**
 * @param {Function} handler
 * @param {Object} [ctx]
 * @returns {TodoModel}
 */
TodoModel.prototype.onAnyChange = function (handler, ctx) {
    this.on('modelFieldChanged', function (data) {
        handler.call(ctx, data);
        this.trigger('modelChanged', this);
    }, this);

    return this;
};

module.exports = TodoModel;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * @param {HTMLElement} root
 * @constructor
 */
function TodosContainer(root) {
    this._root = root;
    this._todosContainer = root.querySelector('.todo-container');
}

/**
 * @param {Boolean} isVisible
 * @returns {TodosContainer}
 */
TodosContainer.prototype.setVisibility = function (isVisible) {
    if (isVisible) {
        this._root.classList.remove('__empty');
    } else {
        this._root.classList.add('__empty');
    }
    return this;
};

/**
 * @returns {HTMLElement}
 */
TodosContainer.prototype.getRoot = function () {
    return this._root;
};

module.exports = TodosContainer;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);

/**
 * @extends {EventListener}
 * @param {HTMLElement} root
 * @constructor
 */
function TodosAddbar(root) {
    this._initEventable();

    this._root = root;
    this._input = root.querySelector('.todo-add_input');
    this._selectAllButton = root.querySelector('.todo-add_select-all');

    this._input.addEventListener('keypress', this);
    this._selectAllButton.addEventListener('click', this);
}

ExtendEventable(TodosAddbar);

/**
 * @callback handleEvent
 * @private
 * @returns {Eventable}
 */
TodosAddbar.prototype._onSelectAll = function () {
    return this.trigger('selectAll');
};

/**
 * @callback handleEvent
 * @private
 * @returns {Eventable}
 */
TodosAddbar.prototype._onTodoAdd = function () {
    let inputText = this._input.value.trim();

    if (inputText.length !== 0) {
        this._input.value = '';
        this._input.blur();

        return this.trigger('todoCreated', {text: inputText});
    }
};

/**
 * @returns {HTMLElement|*}
 */
TodosAddbar.prototype.getRoot = function () {
    return this._root;
};

TodosAddbar.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'click':
            this._onSelectAll();
            break;
        case 'keypress':
            if (e.keyCode === 13) {
                this._onTodoAdd();
            }
            break;
    }
};

module.exports = TodosAddbar;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);
const TodoItem = __webpack_require__(11);
const viewState = __webpack_require__(4);

/**
 * @param {HTMLElement} root
 * @constructor
 */
function TodosList(root) {
    this._initEventable();

    this._root = root;
    /**
     * @type {Array.<TodoItem>}
     * @private
     *
     */
    this._items = [];
    this._left = 0;
}

ExtendEventable(TodosList);

/**
 * @returns {Number}
 */
TodosList.prototype.getTodosCount = function () {
    return this._items.length;
};

/**
 * @param {TodoModel} model
 * @returns {TodosList}
 */
TodosList.prototype.addTodo = function (model) {
    let item = new TodoItem(model);
    item._manageReadyModifier(model.get('isReady'));
    this._items.push(item);

    item.on('todoChange', this._onTodoChange, this)
        .render(this._root);

    this.filterItems();
    return this;
};

/**
 * @returns {TodosList}
 */
TodosList.prototype.clearCompleted = function () {
    for (let i = this._items.length; i--;) {
        if (this._items[i]._model.get('isReady')) {
            this._items[i].remove();
        }
    }
    return this;
};

/**
 * @param {Number} id
 * @returns {TodoItem}
 * @private
 */
TodosList.prototype._getItemById = function (id) {
    for (let i = this._items.length; i--;) {
        if (this._items[i]._model.get('id') === id) {
            return this._items[i];
        }
    }
    return null;
};

/**
 * @callback addTodo
 * @private
 * @returns {TodosList}
 */
TodosList.prototype._onTodoChange = function () {
    this.filterItems(viewState.getFilter());
    return this;
};

/**
 * @param {TodoModel} model
 * @returns {TodosList}
 */
TodosList.prototype.remove = function (model) {
    let item = this._getItemById(model.get('id'));
    if (item) {
        item.off('todoChange', this._onTodoChange, this);
        item.remove();
        let itemIndex = this._items.indexOf(item);
        this._items.splice(itemIndex, 1);
    }

    return this;
};

/**
 * @returns {TodosList}
 */
TodosList.prototype.selectAll = function () {
    this._items.forEach(function (item) {
        item.changeReady(true);
    });
    return this;
};

/**
 * @param {String} [filter]
 * @returns {TodosList}
 */
TodosList.prototype.filterItems = function (filter) {
    if (!filter) {
        filter = viewState.getFilter();
    }

    this._items.forEach(function (item) {
        switch (filter) {
            case 'all':
                item.visible(true);
                break;
            case 'completed':
                item.visible(item._model.get('isReady'));
                break;
            case 'active':
                item.visible(!item._model.get('isReady'));
                break;
        }
    });
    return this;
};

/**
 * @returns {HTMLElement|*}
 */
TodosList.prototype.getRoot = function () {
    return this._root;
};

module.exports = TodosList;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);
const TemplateEngine = __webpack_require__(3);
const api = __webpack_require__(1);

/**
 * @extends {EventListener}
 * @param {TodoModel} model
 * @constructor
 */
function TodoItem(model) {
    this._initEventable();

    let element = TemplateEngine.todoItem({text: model.get('text')});

    this._root = element.root;
    this._readyMark = element.readyMark;
    this._remove = element.remove;
    this._text = element.text;
    this._model = model;

    this._model.onChange('isReady', function (data) {
        this._manageReadyModifier(data['value']);
    }, this);

    this._readyMark.addEventListener('change', this);
    this._remove.addEventListener('click', this);
    this._text.addEventListener('blur', this);
}

ExtendEventable(TodoItem);

/**
 * @param {HTMLElement} parent
 * @returns {TodoItem}
 */
TodoItem.prototype.render = function (parent) {
    parent.appendChild(this._root);
    return this;
};

/**
 * @callback handleEvent
 * @param {String} newText
 * @returns {TodoItem}
 * @private
 */
TodoItem.prototype._onSetText = function (newText) {
    if (this._model.get('text') !== newText) {
        api.setText(this._model, newText);
        this._text.innerText = newText;
        this._model.set('text', newText);
    }
    return this;
};

/**
 * @param {Boolean} isReady
 * @returns {TodoItem}
 * @private
 */
TodoItem.prototype._manageReadyModifier = function (isReady) {
    if (isReady) {
        this._root.classList.add('__ready');
    } else {
        this._root.classList.remove('__ready');
    }
    this._readyMark.checked = isReady;
    return this;
};

/**
 * @param {Boolean} isReady
 * @returns {TodoItem}
 */
TodoItem.prototype.changeReady = function (isReady) {
    if (isReady !== this._model.get('isReady')) {
        api.setState(this._model, isReady);
        this._model.set('isReady', isReady);
        this._manageReadyModifier(isReady);
        this.trigger('todoChange', this._model);
    }
    return this;
};

/**
 * @callback handleEvent
 * @private
 */
TodoItem.prototype._onRemove = function () {
    this._model.set('deleted', true);
};

/**
 * @returns {TodoItem}
 */
TodoItem.prototype.remove = function () {
    this._root.parentNode.removeChild(this._root);
    return this;
};

/**
 * @param {Boolean} isVisible
 * @returns {TodoItem}
 */
TodoItem.prototype.visible = function (isVisible) {
    if (isVisible) {
        this._root.classList.remove('__hide');
    } else {
        this._root.classList.add('__hide');
    }
    return this;
};

TodoItem.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'change':
            this.changeReady(this._readyMark.checked);
            break;
        case 'click':
            if (e.target === this._remove) {
                this._onRemove();
            }
            break;
        case 'blur':
            this._onSetText(this._text.innerText);
            break;
    }
};

module.exports = TodoItem;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);
const Filter = __webpack_require__(13);

/**
 * @extends {EventListener}
 * @param root
 * @constructor
 */
function TodosActionbar(root) {
    this._initEventable();

    this._root = root;
    this._counter = root.querySelector('.todo-actionbar_left-items');
    this._clearCompletedButton = root.querySelector('.todo-actionbar_clear-completed');
    this._filters = new Filter(root.querySelector('.filter-button'));

    this._filters.on('filterSpecified', this._onFilterSpecified, this);

    this._clearCompletedButton.addEventListener('click', this);
}

ExtendEventable(TodosActionbar);

/**
 * @callback handleEvent
 * @private
 * @returns {Eventable}
 */
TodosActionbar.prototype._onFilterSpecified = function (filterName) {
    return this.trigger('filterSelected', filterName);
};

/**
 * @callback handleEvent
 * @private
 * @returns {Eventable}
 */
TodosActionbar.prototype._onClearCompleted = function () {
    return this.trigger('clearCompleted');
};

/**
 * @param {Number} number
 * @returns {TodosActionbar}
 */
TodosActionbar.prototype.setLeftItemsNumber = function (number) {
    this._counter.innerHTML = number + '&nbsp;' + (number === 1 ? 'item' : 'items') + '&nbsp;left';
    return this;
};

/**
 * @param {Boolean} isVisible
 * @returns {TodosActionbar}
 */
TodosActionbar.prototype.setClearCompletedVisibility = function (isVisible) {
    if (isVisible) {
        this._clearCompletedButton.classList.remove('__hide');
    } else {
        this._clearCompletedButton.classList.add('__hide');
    }
    return this;
};

TodosActionbar.prototype.handleEvent = function (e) {
    if (e.type === 'click') {
        this._onClearCompleted();
    }
};

module.exports = TodosActionbar;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const ExtendEventable = __webpack_require__(0);
const Eventable = __webpack_require__(2);

/**
 * @param {HTMLElement} root
 * @constructor
 */
function Filter(root) {
    this._initEventable();

    this._filters = root.querySelectorAll('.filter-button_item');
    this._activeFilter = null;

    for (let i = 0; i < this._filters.length; i++) {
        this._filters[i].addEventListener('click', this);

        if (this._filters[i].classList.contains('__active')) {
            this._activeFilter = this._filters[i];
        }
    }
}

ExtendEventable(Filter, Eventable);

/**
 * @param {HTMLElement} filter
 * @callback handleEvent
 * @private
 */
Filter.prototype._onSetFilter = function (filter) {
    if (this._activeFilter !== filter) {
        this._activeFilter.classList.remove('__active');
        filter.classList.add('__active');

        this._activeFilter = filter;
        this.trigger('filterSpecified', filter.dataset.filter);
    }
    return this;
};

Filter.prototype.handleEvent = function (e) {
    if (e.type === 'click') {
        this._onSetFilter(e.target);
    }
};

module.exports = Filter;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map