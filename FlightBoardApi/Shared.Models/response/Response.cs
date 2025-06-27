using System.Net;

namespace Shared.Models.response
{
    public class Response<T>
    {
        public HttpStatusCode StatusCode { get; set; }

        public string Message { get; set; }
        public T Data { get; set; }
        public Response(HttpStatusCode statusCode, string message, T data = default)

        {
            StatusCode = statusCode;
            Message = message;
            Data = data;
        }
    }
}
