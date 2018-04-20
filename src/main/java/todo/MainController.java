package todo;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MainController {

    private final UserService userService;
    private final TodoService todoService;

    @Autowired
    public MainController(UserService userService, TodoService todoService) {
        this.userService = userService;
        this.todoService = todoService;
    }

    @GetMapping(value = "/todo")
    private ModelAndView todo(Principal principal) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("todo");
        return modelAndView;
    }

    @GetMapping(value = "/todo/items")
    @ResponseBody
    private List<TodoListEntity> getTodoList(Principal principal) {
        return todoService.getTodoListByUser(userService.findByName(principal.getName()));
    }

    @PostMapping(value = "/todo")
    @ResponseBody
    private ResponseEntity<TodoListEntity> addTodoListEntity(@RequestBody TodoListEntity todo, Principal principal) {
        todo.setUser(userService.findByName(principal.getName()));
        return ResponseEntity.ok(todoService.saveTodoListEntity(todo));
    }

    @DeleteMapping(value = "/todo/{id}")
    @ResponseBody
    private void deleteTodoListEntity(@PathVariable("id") Integer todoId, Principal principal) {
        UserEntity user = userService.findByName(principal.getName());
        TodoListEntity todo = todoService.getTodoById(todoId);
        todoService.deleteTodoById(todoId);
    }

    @PatchMapping(value = "/todo/{id}/checked")
    @ResponseBody
    private void setTodoState(@PathVariable("id") Integer todoId, @RequestBody TodoStatePatch statePatch, Principal principal) {
        UserEntity user = userService.findByName(principal.getName());
        TodoListEntity todo = todoService.getTodoById(todoId);
        todoService.updateStateById(todoId, statePatch.isChecked());
    }

    @PatchMapping(value = "/todo/{id}/text")
    @ResponseBody
    private void setTodoText(@PathVariable("id") Integer todoId, @RequestBody TodoTextPatch textPatch, Principal principal) {
        UserEntity user = userService.findByName(principal.getName());
        TodoListEntity todo = todoService.getTodoById(todoId);
        todoService.updateTextById(todoId, textPatch.getText());
    }

    @PatchMapping(value = "/todo/checkAll")
    @ResponseBody
    private void checkAllDone(Principal principal) {
        UserEntity user = userService.findByName(principal.getName());
        todoService.checkAllDone(user);
    }
}
