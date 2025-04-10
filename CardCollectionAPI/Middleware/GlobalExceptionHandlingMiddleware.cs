using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace CardCollectionAPI.Middleware
{
    public class GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger = logger;

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Si è verificato un errore non gestito");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var response = new ErrorResponse { TraceId = context.TraceIdentifier };

            switch (exception)
            {
                case DbUpdateException dbUpdateException:
                    // Gestione specifica per errori di aggiornamento del database
                    if (dbUpdateException.InnerException is PostgresException pgEx)
                    {
                        switch (pgEx.SqlState)
                        {
                            case "23505": // Violazione di vincolo univoco
                                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                                response.StatusCode = (int)HttpStatusCode.Conflict;
                                response.Message = "Errore di duplicazione: un record con gli stessi dati esiste già.";
                                
                                // Aggiungi dettagli specifici se disponibili
                                if (pgEx.ConstraintName != null)
                                {
                                    if (pgEx.ConstraintName == "PK_PokemonCardMarketPriceDetails")
                                    {
                                        response.Message = "Errore: esiste già un dettaglio di prezzo per questa carta con la stessa data di aggiornamento.";
                                    }
                                    else if (pgEx.ConstraintName.Contains("PokemonCardMarket"))
                                    {
                                        response.Message = "Errore: esiste già un prezzo CardMarket per questa carta con la stessa data di aggiornamento.";
                                    }
                                    else if (pgEx.ConstraintName.Contains("PokemonTcgPlayer"))
                                    {
                                        response.Message = "Errore: esiste già un prezzo TCGPlayer per questa carta con la stessa data di aggiornamento.";
                                    }
                                    else
                                    {
                                        response.Message += $" Vincolo violato: {pgEx.ConstraintName}.";
                                    }
                                }
                                break;
                                
                            case "23503": // Violazione di vincolo di chiave esterna
                                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                                response.StatusCode = (int)HttpStatusCode.BadRequest;
                                response.Message = "Errore di riferimento: impossibile trovare un record correlato necessario.";
                                break;
                                
                            default:
                                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                                response.StatusCode = (int)HttpStatusCode.BadRequest;
                                response.Message = $"Errore del database: {pgEx.Message}";
                                break;
                        }
                    }
                    else
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        response.Message = "Si è verificato un errore durante l'aggiornamento del database.";
                    }
                    break;

                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Message = exception.Message;
                    break;

                case ArgumentException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Message = exception.Message;
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.Message = "Si è verificato un errore interno. Riprova più tardi.";
                    break;
            }

            var result = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(result);
        }
    }

    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string TraceId { get; set; } = string.Empty;
    }
}