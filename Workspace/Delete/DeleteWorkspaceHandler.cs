using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    /// <summary>
    /// Move workspace folder to new ~/App_Data/Workspaces/.deleted/{request.Workspace}.
    /// </summary>
    public struct DeleteWorkspaceHandler : IRequestHandler<DeleteWorkspaceCommand, WorkspaceCommandResponse>
    {
        readonly ILogger _logger;
        readonly IHostingEnvironment _hostingEnvironment;
        public DeleteWorkspaceHandler(
            ILogger<DeleteWorkspaceHandler> logger,
            IHostingEnvironment hostingEnvironment
        )
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceCommandResponse> Handle(DeleteWorkspaceCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Directory for existing workspace
                var workspacePath = GetWorkspacePath(request.Workspace);
                // Directory for deleted path
                var deletedWorkspacePath = GetDeleteWorkspacePath(request.Workspace);
                // Delete deleted path directory if exists
                RemoveDeleteWorkspaceIfExists(deletedWorkspacePath);
                if (!Directory.Exists(workspacePath))
                {
                    _logger.LogError("Workspace does not exists. {Workspace}", request.Workspace);
                    return Task.FromResult(new WorkspaceCommandResponse("workspace_not_found"));
                }
                // Move Existing workspace to Deleted workspace
                MoveDirectory(workspacePath, deletedWorkspacePath);
                return Task.FromResult(new WorkspaceCommandResponse(true));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete workspace. {Workspace}", request.Workspace);
                return Task.FromResult(new WorkspaceCommandResponse("general"));
            }
        }

        private void RemoveDeleteWorkspaceIfExists(string deletedWorkspacePath)
        {
            if (Directory.Exists(deletedWorkspacePath))
            {
                Directory.Delete(deletedWorkspacePath, true);
            }
        }

        public string GetDeleteWorkspacePath(string workspace)
        {
            return Path.Combine(
                _hostingEnvironment.ContentRootPath,
                "App_Data",
                ".deleted.Workspaces",
                workspace
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
        private void MoveDirectory(string fromDirectory, string toDirectory)
        {
            Directory.Move(fromDirectory, toDirectory);
        }
    }
}