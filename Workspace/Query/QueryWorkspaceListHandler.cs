using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.Query
{
    public struct QueryWorkspaceListHandler : IRequestHandler<QueryWorkspaceListEvent, IEnumerable<IWorkspace>>
    {
        IHostingEnvironment _hostingEnvironment;
        public QueryWorkspaceListHandler(
            IHostingEnvironment hostingEnvironment
        )
        {
            _hostingEnvironment = hostingEnvironment;
        }
        public Task<IEnumerable<IWorkspace>> Handle(QueryWorkspaceListEvent request, CancellationToken cancellationToken)
        {
            return Task.FromResult(
                new DirectoryInfo(
                    CreateWorkspacesPath()
                ).GetDirectories()
                    .Select(
                        workspaceDirectory => (IWorkspace)new WorkspaceStruct
                        {
                            Name = workspaceDirectory.Name
                        }
                    )
            );
        }
        private string CreateWorkspacesPath()
        {
            return Path.Combine(
                _hostingEnvironment.ContentRootPath,
                "App_Data",
                "Workspaces"
            );
        }

        private struct WorkspaceStruct : IWorkspace
        {
            public string Name { get; set; }
        }
    }
}