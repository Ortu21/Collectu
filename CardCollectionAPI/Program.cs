using CardCollectionAPI.Data;
using CardCollectionAPI.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));


// Inizializza Firebase Admin SDK
if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile("firebase-config.json")
    });
}

// Configura l'autenticazione JWT con Firebase
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://securetoken.google.com/collectu-140c9";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/collectu-140c9",
            ValidateAudience = true,
            ValidAudience = "collectu-140c9",
            ValidateLifetime = true
        };
    });

// Configura CORS - spostato qui prima di app.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", 
        corsBuilder =>  
        {
            if (builder.Environment.IsDevelopment())
            {
                corsBuilder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
            }
            else
            {
                corsBuilder.WithOrigins("https://app.collectu.com", "https://collectu.com")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
            }
        });
});


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64; // Aumentiamo la profondità massima per gestire oggetti complessi
    });
builder.Services.AddEndpointsApiExplorer();
// Aggiungi questo nella sezione di configurazione dei servizi
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "Collectu API", 
        Version = "v1",
        Description = "API per la gestione delle collezioni di carte",
        Contact = new OpenApiContact
        {
            Name = "Collectu Team",
            Email = "info@collectu.app",
            Url = new Uri("https://github.com/Ortu21/Collectu")
        }
    });
    
    // Configura Swagger per utilizzare i file XML di documentazione
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});
builder.Services.AddHttpClient<PokemonCardService>();
builder.Logging.AddConsole(); // Mostra log sulla console
builder.Logging.SetMinimumLevel(LogLevel.Information); // Raccogli tutti i log di livello 'Information' o superiore
builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Warning); // Raccogli solo i log di Entity Framework Core
builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Error); // Collect Entity Framework Core error logs

var app = builder.Build();

// Aggiungi questo nella sezione di configurazione dell'app
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Collectu API v1"));
}

// Usa CORS prima di Authentication e Authorization
app.UseCors("AllowAll");

app.UseAuthentication(); // Attiva l'autenticazione
app.UseAuthorization();

app.MapControllers();
app.Run();
