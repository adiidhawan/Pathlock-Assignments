using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class TaskService
    {
        private readonly List<TaskItem> _tasks = new();

        public List<TaskItem> GetAll() => _tasks;

        public TaskItem? GetById(Guid id) => _tasks.FirstOrDefault(t => t.Id == id);

        public TaskItem Create(TaskItem task)
        {
            task.Id = Guid.NewGuid();
            task.CreatedAt = DateTime.UtcNow;
            _tasks.Add(task);
            return task;
        }

        public bool Update(Guid id, bool isCompleted)
        {
            var task = GetById(id);
            if (task == null) return false;
            task.IsCompleted = isCompleted;
            task.UpdatedAt = DateTime.UtcNow;
            return true;
        }

        public bool Delete(Guid id)
        {
            var task = GetById(id);
            if (task == null) return false;
            _tasks.Remove(task);
            return true;
        }
    }
}
