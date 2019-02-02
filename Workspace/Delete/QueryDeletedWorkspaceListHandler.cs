using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct QueryDeletedWorkspaceListHandler : IRequestHandler<QueryDeletedWorkspaceList, IEnumerable<IWorkspace>>
    {
        IHostingEnvironment _hostingEnvironment;
        public QueryDeletedWorkspaceListHandler(
            IHostingEnvironment hostingEnvironment
        )
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public Task<IEnumerable<IWorkspace>> Handle(QueryDeletedWorkspaceList request, CancellationToken cancellationToken)
        {
            return Task.FromResult(
                new DirectoryInfo(
                    CreateDeletedWorkspacesPath()
                ).GetDirectories()
                    .Select(
                        workspaceDirectory => (IWorkspace)new WorkspaceStruct
                        {
                            Name = workspaceDirectory.Name
                        }
                    )
            );
        }

        private string CreateDeletedWorkspacesPath()
        {
            return Path.Combine(
                _hostingEnvironment.ContentRootPath,
                "App_Data",
                ".deleted.Workspaces"
            );
        }

        private struct WorkspaceStruct : IWorkspace
        {
            public string Name { get; set; }
        }
    }
}