using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct DeleteWorkspaceFileHandler : IRequestHandler<DeleteWorkspaceFileCommand, WorkspaceCommandResponse>
    {
        readonly ILogger _logger;
        readonly IHostingEnvironment _hostingEnvironment;
        public DeleteWorkspaceFileHandler(
            ILogger<DeleteWorkspaceFileHandler> logger,
            IHostingEnvironment hostingEnvironment
        )
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(DeleteWorkspaceFileCommand request, CancellationToken cancellationToken)
        {
            var toDelete = new FileInfo(
                GetFullFilePath(request)
            );
            if (toDelete.Exists)
            {
                toDelete.Delete();
            }
            return Task.FromResult(
                new WorkspaceCommandResponse(true)
            );
        }

        private string GetFullFilePath(DeleteWorkspaceFileCommand request)
        {
            return Path.Combine(
                this.GetWorkspacePath(request.Workspace),
                Path.Combine(request.FolderList),
                request.FileName
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