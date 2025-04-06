using CardCollectionAPI.Data;
using CardCollectionAPI.Services;
using CardCollectionAPI.Services.Interfaces;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Threading.RateLimiting;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

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


// Configurazione per limitare la dimensione delle richieste HTTP e prevenire attacchi DoS
builder.Services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // Limite di 10 MB per le richieste
});

// Configurazione per limitare la dimensione dei form
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // Limite di 10 MB per i form multipart
    options.ValueLengthLimit = 32 * 1024; // Limite di 32 KB per i singoli valori
});

builder.Services.AddControllers(options =>
{
    // Aggiunge un filtro globale per limitare la dimensione delle richieste
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.RequestSizeLimitAttribute(10 * 1024 * 1024));
})
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 32; // Riduciamo la profondità massima da 64 a 32 per mitigare attacchi DoS
        options.JsonSerializerOptions.DefaultBufferSize = 1024 * 16; // Buffer di 16 KB per il parsing JSON
        options.JsonSerializerOptions.ReadCommentHandling = System.Text.Json.JsonCommentHandling.Skip; // Ignora i commenti
        options.JsonSerializerOptions.AllowTrailingCommas = false; // Non permettere virgole finali
    });
builder.Services.AddEndpointsApiExplorer();
// Aggiungi questo nella sezione di configurazione dei servizi
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
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
// Configurazione del rate limiting per prevenire attacchi DoS
builder.Services.AddRateLimiter(options =>
{
    // Limita le richieste a 100 per ogni client in un intervallo di 1 minuto
    options.GlobalLimiter = PartitionedRateLimiter.Create<Microsoft.AspNetCore.Http.HttpContext, string>(httpContext =>
    {
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 5
            });
    });

    // Configurazione della risposta quando il limite viene superato
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";

        // Imposta un valore fisso per il retry
        var retryAfterSeconds = 60;
        context.HttpContext.Response.Headers.Append("Retry-After", retryAfterSeconds.ToString());

        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Troppe richieste. Per favore, riprova più tardi.",
            retryAfter = retryAfterSeconds
        }, token);
    };
});

builder.Services.AddHttpClient<PokemonCardService>();
builder.Services.AddHttpClient<PokemonPriceService>();
builder.Services.AddScoped<IPokemonPriceService, PokemonPriceService>();
builder.Logging.AddConsole(); // Mostra log sulla console
builder.Logging.SetMinimumLevel(LogLevel.Information); // Raccogli tutti i log di livello 'Information' o superiore
builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Warning); // Raccogli solo i log di Entity Framework Core
builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Error); // Collect Entity Framework Core error logs

var app = builder.Build();

// Verifica e mostra l'ambiente corrente
Console.WriteLine($"Ambiente corrente: {app.Environment.EnvironmentName}");

if (app.Environment.IsDevelopment())
{
    Console.WriteLine("L'applicazione è in esecuzione in modalità Development");
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Collectu API v1"));
}
else
{
    Console.WriteLine("L'applicazione è in esecuzione in modalità Production");
}
// Usa CORS prima di Authentication e Authorization
app.UseCors("AllowAll");

// Attiva il rate limiting per prevenire attacchi DoS
app.UseRateLimiter();

app.UseAuthentication(); // Attiva l'autenticazione
app.UseAuthorization();

// Near the end of your file, before app.Run()
app.MapControllers();

// Log dettagliato degli indirizzi di ascolto
Console.WriteLine($"Application is listening on: {string.Join(", ", builder.WebHost.GetSetting("urls")?.Split(';') ?? new[] { "default" })}");

// Ottieni e mostra tutti gli indirizzi IP locali per facilitare la connessione
Console.WriteLine("Available local IP addresses:");
var hostName = System.Net.Dns.GetHostName();
var addresses = System.Net.Dns.GetHostAddresses(hostName)
    .Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
    .Select(ip => ip.ToString());
foreach (var address in addresses)
{
    Console.WriteLine($"  http://{address}:5193");
}

app.Run();
