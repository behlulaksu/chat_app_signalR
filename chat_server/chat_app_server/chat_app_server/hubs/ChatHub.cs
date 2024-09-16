using chat_app_server.Data;
using chat_app_server.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chat_app_server.hubs
{
    public class ChatHub : Hub
    {
        public async Task GetNickName (string nickName)
        {
            Client client = new Client
            {
                ConnectionId = Context.ConnectionId,
                NickName = nickName
            };

            ClientSource.Clients.Add(client);
            await Clients.Others.SendAsync("clientJoined", nickName);
            await Clients.All.SendAsync("clients", ClientSource.Clients);
        }

        public async Task SendMessageAsync(string message, string clientName)
        {
            Client SenderClient = ClientSource.Clients.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);

            if (clientName == "All Users")
            {
                await Clients.All.SendAsync("receiveMessage", message, SenderClient.NickName);
            }
            else
            {
                Client client = ClientSource.Clients.FirstOrDefault(c => c.NickName == clientName);
                await Clients.Client(client.ConnectionId).SendAsync("receiveMessage", message, SenderClient.NickName);
            }

        }

        public async Task AddGroup (string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            GroupSource.Groups.Add(new Group {GroupName = groupName });

            await Clients.All.SendAsync("groups", groupName);
        }

        public async Task AddClientToGroup (IEnumerable<string> groupNames)
        {
            foreach (string group in groupNames)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, group);
            }
        }
    }
}
