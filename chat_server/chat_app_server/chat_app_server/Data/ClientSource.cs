using chat_app_server.Models;
using System.Collections.Generic;

namespace chat_app_server.Data
{
    public class ClientSource
    {
        public static List<Client> Clients { get; } = new List<Client>();
    }
}
