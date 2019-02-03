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
    public struct CreateWorkspaceFolderHandler : IRequestHandler<CreateWorkspaceFolderCommand, WorkspaceCommandResponse>
    {
        readonly ILogger _logger;
        readonly IHostingEnvironment _hostingEnvironment;
        public CreateWorkspaceFolderHandler(
            ILogger<CreateWorkspaceFolderHandler> logger,
            IHostingEnvironment hostingEnvironment
        )
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(CreateWorkspaceFolderCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var path = GetFullFolderPath(request);
                // Check if folder is a file
                var fileInfo = new FileInfo(path);
                if (fileInfo.Exists)
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_contains_file")
                    );
                }
                // Validate Folder Path
                if (!IsValidPathAndFolder(path, request.FolderName))
                {
                    return Task.FromResult(
                        new WorkspaceCommandResponse("workspace_folder_invalid_name")
                    );
                }
                var newDirectoryInfo = new DirectoryInfo(path);
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
                _logger.LogError(ex, "Exception Creating Workspace Folder");
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

        private static Regex INVALID_FILE_NAME_REGEX = new Regex($"[{Regex.Escape(new string(Path.GetInvalidFileNameChars()))}]");
        private static Regex INVALID_PATH_REGEX = new Regex($"[{Regex.Escape(new string(Path.GetInvalidPathChars()))}]");
        private bool IsValidPathAndFolder(string path, string folderName)
        {
            if (INVALID_PATH_REGEX.IsMatch(path)
                || INVALID_FILE_NAME_REGEX.IsMatch(folderName))
            {
                return false;
            };
            return true;
        }
    }
}