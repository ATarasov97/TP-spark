package todo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<TodoListEntity, Integer> {
    List<TodoListEntity> findByUser(UserEntity user);

    void deleteById(Integer id);
}
