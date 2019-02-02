using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public struct CreateWorkspaceFolderHandler : IRequestHandler<CreateWorkspaceFolderCommand, WorkspaceCommandResponse>
    {
        IHostingEnvironment _hostingEnvironment;
        public CreateWorkspaceFolderHandler(
            IHostingEnvironment hostingEnvironment
        )
        {
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(CreateWorkspaceFolderCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Check if folder is a file
                var fileInfo = new FileInfo(GetFullFolderPath(request));
                if (fileInfo.Exists)
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_contains_file")
                    );
                }
                var newDirectoryInfo = new DirectoryInfo(GetFullFolderPath(request));
                if (newDirectoryInfo.Exists)
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_folder_exists")
                    );
                }
                newDirectoryInfo.Create();
                return Task.FromResult(new WorkspaceCommandResponse(true));
            }
            catch (Exception ex)
            {
                return Task.FromResult(
                    new WorkspaceCommandResponse("error")
                );
            }
        }
        private string GetFullFolderPath(CreateWorkspaceFolderCommand request)
        {
            return Path.Combine(
                this.GetWorkspacesPath(),
                request.Workspace,
                Path.Combine(request.FolderList),
                request.FolderName
            );
        }
        private string GetWorkspacesPath()
        {
            return Path.Combine(
                _hostingEnvironment.ContentRootPath,
                "App_Data",
                "Workspaces"
            );
        }
    }
}