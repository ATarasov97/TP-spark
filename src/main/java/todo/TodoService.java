package todo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public TodoListEntity getTodoById(Integer id) {
        return todoRepository.findById(id).orElse(null);
    }

    public List<TodoListEntity> getTodoListByUser(UserEntity user) {
        return todoRepository.findByUser(user);
    }

    public TodoListEntity saveTodoListEntity(TodoListEntity todo) {
        return todoRepository.save(todo);
    }

    public void deleteTodoById(Integer id) {
        todoRepository.deleteById(id);
    }

    public TodoListEntity updateStateById(Integer id, boolean state) {
        TodoListEntity todo = todoRepository.findById(id).orElseThrow(RuntimeException::new);
        todo.setChecked(state);
        return todoRepository.save(todo);
    }

    public TodoListEntity updateTextById(Integer id, String text) {
        TodoListEntity todo = todoRepository.findById(id).orElseThrow(RuntimeException::new);
        todo.setText(text);
        return todoRepository.save(todo);
    }

    public void checkAllDone(UserEntity user) {
        List<TodoListEntity> todoList = todoRepository.findByUser(user);
        for(TodoListEntity todo: todoList) {
            todo.setChecked(true);
        }
        todoRepository.saveAll(todoList);
    }

}
