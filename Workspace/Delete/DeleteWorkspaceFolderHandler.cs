using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct DeleteWorkspaceFolderHandler : IRequestHandler<DeleteWorkspaceFolderCommand, WorkspaceCommandResponse>
    {
        readonly ILogger _logger;
        readonly IHostingEnvironment _hostingEnvironment;
        public DeleteWorkspaceFolderHandler(
            ILogger<DeleteWorkspaceFolderHandler> logger,
            IHostingEnvironment hostingEnvironment
        )
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(DeleteWorkspaceFolderCommand request, CancellationToken cancellationToken)
        {
            var toDelete = new DirectoryInfo(
                GetFullFolderPath(request)
            );
            if (toDelete.Exists)
            {
                toDelete.Delete(true);
            }
            return Task.FromResult(
                new WorkspaceCommandResponse(true)
            );
        }

        private string GetFullFolderPath(DeleteWorkspaceFolderCommand request)
        {
            return Path.Combine(
                this.GetWorkspacePath(request.Workspace),
                Path.Combine(request.FolderList)
            );
        }
        public string GetWorkspacePath(string workspace)
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