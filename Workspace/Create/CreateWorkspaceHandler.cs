using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public struct CreateWorkspaceHandler : IRequestHandler<CreateWorkspaceCommand, WorkspaceCommandResponse>
    {
        IHostingEnvironment _hostingEnvironment;
        public CreateWorkspaceHandler(
            IHostingEnvironment hostingEnvironment
        )
        {
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(CreateWorkspaceCommand request, CancellationToken cancellationToken)
        {
            var workspaceDirectoryInfo = new DirectoryInfo(
                CreateWorkspacesPath(request.Workspace)
            );
            if (workspaceDirectoryInfo.Exists)
            {
                return Task.FromResult(new WorkspaceCommandResponse("workspace_already_exists"));
            }
            workspaceDirectoryInfo.Create();
            return Task.FromResult(new WorkspaceCommandResponse(true));
        }

        private string CreateWorkspacesPath(string workspace)
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