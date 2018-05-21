package todo;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface TodoRepository extends JpaRepository<TodoListEntity, Integer> {
    List<TodoListEntity> findByUser(UserEntity user);

    void deleteById(Integer id);

    @Transactional
    @Modifying
    void checkAllDone(UserEntity user);
}
