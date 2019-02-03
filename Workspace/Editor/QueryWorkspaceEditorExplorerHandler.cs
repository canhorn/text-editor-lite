using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Editor.Model;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.Editor
{
    public struct QueryWorkspaceEditorExplorerHandler : IRequestHandler<QueryWorkspaceEditorExplorerEvent, WorkspaceEditorExplorer>
    {
        IHostingEnvironment _hostingEnvironment;
        public QueryWorkspaceEditorExplorerHandler(
            IHostingEnvironment hostingEnvironment
        )
        {
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<WorkspaceEditorExplorer> Handle(QueryWorkspaceEditorExplorerEvent request, CancellationToken cancellationToken)
        {
            return Task.FromResult(
                new WorkspaceEditorExplorer
                {
                    Workspace = request.Workspace,
                    Root = new EditorFolder
                    {
                        Name = request.Workspace,
                        FileNameList = GetFileNameList(
                            GetWorkspacePath(
                                _hostingEnvironment.ContentRootPath,
                                request.Workspace
                            )
                        ),
                        FolderList = GetFolderList(
                            request.Workspace,
                            GetWorkspacePath(
                                _hostingEnvironment.ContentRootPath,
                                request.Workspace
                            )
                        )
                    }
                }
            );
        }

        public static string[] GetFileNameList(string directory)
        {
            return Directory
                .GetFiles(directory)
                .Select(
                    filePath => new FileInfo(filePath).Name
                ).ToArray();
        }

        public static EditorFolder[] GetFolderList(string workspace, string directory)
        {
            return new DirectoryInfo(directory)
                .GetDirectories()
                .Select(
                    directoryInfo => new EditorFolder
                    {
                        Name = directoryInfo.Name,
                        FolderList = GetFolderList(workspace, directoryInfo.FullName),
                        FileNameList = GetFileNameList(directoryInfo.FullName)
                    }
                ).ToArray();
        }

        private static string GetWorkspacePath(string contentRootPath, string workspace)
        {
            return Path.Combine(
                contentRootPath,
                "App_Data",
                "Workspaces",
                workspace
            );
        }
    }
}