using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.FileContent
{
    public struct QueryWorkspaceFileContentHandler : IRequestHandler<QueryWorkspaceFileContentEvent, WorkspaceFileContent>
    {
        IHostingEnvironment _hostingEnvironment;
        public QueryWorkspaceFileContentHandler(
            IHostingEnvironment hostingEnvironment
        )
        {
            _hostingEnvironment = hostingEnvironment;
        }
        public async Task<WorkspaceFileContent> Handle(QueryWorkspaceFileContentEvent request, CancellationToken cancellationToken)
        {
            return new WorkspaceFileContent
            {
                Workspace = request.Workspace,
                FileName = request.FileName,
                FolderList = request.FolderList,
                Content = await File.ReadAllTextAsync(
                    Path.Combine(
                        this.GetWorkspacesPath(),
                        request.Workspace,
                        Path.Combine(request.FolderList),
                        request.FileName
                    )
                )
            };
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