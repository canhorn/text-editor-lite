using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public struct CreateWorkspaceFileHandler : IRequestHandler<CreateWorkspaceFileCommand, WorkspaceCommandResponse>
    {
        readonly ILogger _logger;
        readonly IHostingEnvironment _hostingEnvironment;
        public CreateWorkspaceFileHandler(
            ILogger<CreateWorkspaceFileHandler> logger,
            IHostingEnvironment hostingEnvironment
        )
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(CreateWorkspaceFileCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var path = GetFullFolderPath(request);
                // Validate if directory exists by path
                var newDirectoryInfo = new DirectoryInfo(path);
                if (newDirectoryInfo.Exists)
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_folder_exists")
                    );
                }
                // Validate Folder Path
                if (!PathValidator.IsValidPathAndFolder(path, request.FileName))
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_folder_invalid_name")
                    );
                }
                // Check if folder is a file
                var fileInfo = new FileInfo(path);
                if (fileInfo.Exists)
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_contains_file")
                    );
                }
                // Create, then dispose of FileStream, just a quick create and release of resources.
                fileInfo.Create().Dispose();
                return Task.FromResult(new WorkspaceCommandResponse(true));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception Creating Workspace File");
                return Task.FromResult(
                    new WorkspaceCommandResponse("error")
                );
            }
        }
        private string GetFullFolderPath(CreateWorkspaceFileCommand request)
        {
            return Path.Combine(
                this.GetWorkspacesPath(),
                request.Workspace,
                Path.Combine(request.FolderList),
                request.FileName
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