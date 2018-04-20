const ExtendEventable = require('../utils/ExtendEventable');
const TodoModel = require('./TodoModel');
const api = require('../utils/Requests');

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
