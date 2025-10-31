using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public ActionResult<List<TaskItem>> GetAll()
        {
            return Ok(_taskService.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetById(Guid id)
        {
            var task = _taskService.GetById(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public ActionResult<TaskItem> Create([FromBody] TaskItem task)
        {
            var created = _taskService.Create(task);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // DTO for update payload
        public class UpdateTaskDto
        {
            public bool IsCompleted { get; set; }
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] UpdateTaskDto dto)
        {
            if (!_taskService.Update(id, dto.IsCompleted))
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            if (!_taskService.Delete(id))
                return NotFound();
            return NoContent();
        }
    }
}
