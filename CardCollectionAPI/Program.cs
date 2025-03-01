using CardCollectionAPI.Data;
using CardCollectionAPI.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));


// Inizializza Firebase Admin SDK
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("firebase-config.json")
});

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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<PokemonCardService>();
builder.Logging.AddConsole(); // Mostra log sulla console
builder.Logging.SetMinimumLevel(LogLevel.Information); // Raccogli tutti i log di livello 'Information' o superiore

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication(); // Attiva l'autenticazione
app.UseAuthorization();
app.MapControllers();
app.Run();
