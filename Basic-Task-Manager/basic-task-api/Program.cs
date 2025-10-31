using TaskManagerAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// If Render provides a PORT env var, make the host listen on it
// Fallback to 5002 for local development
var port = Environment.GetEnvironmentVariable("PORT") ?? "5002";
var urls = $"http://0.0.0.0:{port}";
builder.WebHost.UseUrls(urls);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<TaskService>();

// CORS: read allowed frontend origin from env, fallback to local dev origins
var frontendOrigin = Environment.GetEnvironmentVariable("FRONTEND_URL") 
                     ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendOrigin, "http://localhost:5173", "http://localhost:5097")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
