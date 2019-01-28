using System.Collections.Generic;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Query
{
    public struct QueryWorkspaceListEvent : IRequest<IEnumerable<IWorkspace>>
    {

    }
}