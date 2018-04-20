package todo;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SignUpController {

    private final UserService userService;

    @Autowired
    public SignUpController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/signup")
    private ModelAndView signup() {
        ModelAndView modelAndView = new ModelAndView();
        UserEntity user = new UserEntity();
        modelAndView.addObject("name", user);
        modelAndView.setViewName("signup");
        return modelAndView;
    }

    @PostMapping(value = "/signup")
    private ModelAndView signup(@Valid UserEntity user, BindingResult bindingResult){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("signup");
        if (userService.findByName(user.getName()) != null) {
            modelAndView.addObject("message", "User already exists!");
        } else {
            userService.saveUser(user);
            modelAndView.addObject("name", new UserEntity());
            modelAndView.addObject("message", "Success!");
        }
        return modelAndView;
    }


}
