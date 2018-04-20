document.addEventListener('DOMContentLoaded', init);

const TodosListModel = require('./units/TodosListModel');
const TodosContainer = require('./units/TodosContainer');
const TodoAddbar = require('./units/TodosAddbar');
const TodosList = require('./units/TodosList');
const TodosActionbar = require('./units/TodosActionbar');
const viewState = require('./views/ViewState');
const api = require('./utils/Requests');

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
