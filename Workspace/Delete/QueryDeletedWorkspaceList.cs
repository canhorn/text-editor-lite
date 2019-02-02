using System.Collections.Generic;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct QueryDeletedWorkspaceList: IRequest<IEnumerable<IWorkspace>>
    {
        
    }
}