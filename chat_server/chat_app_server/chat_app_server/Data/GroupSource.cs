using chat_app_server.Models;
using System.Collections.Generic;

namespace chat_app_server.Data
{
    public static class GroupSource
    {
        public static List<Group> Groups { get; } = new List<Group> ();
    }
}
