using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace EventHorizon.CodeEditorLite.Hubs
{
    public class TerminalHub : Hub
    {
        readonly ILogger _logger;
        readonly HostingEnvironment _hostingEnvironment;
        public TerminalHub(
            ILogger<TerminalHub> logger,
            HostingEnvironment hostingEnvironment
        )
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<string> SendWorkspaceCommand(string workspace, string command)
        {
            _logger.LogInformation("workspace {workspace} | command {Command}", workspace, command);
            return command.RunCLICommand(GetWorkspaceDirectory(workspace));
        }

        public string GetWorkspaceDirectory(string workspace)
        {
            return Path.Combine(
                _hostingEnvironment.ContentRootPath,
                "App_Data",
                "Workspaces",
                workspace
            );
        }
    }
}