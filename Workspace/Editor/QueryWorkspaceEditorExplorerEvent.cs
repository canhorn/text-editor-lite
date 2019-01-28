using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Editor
{
    public struct QueryWorkspaceEditorExplorerEvent : IRequest<WorkspaceEditorExplorer>
    {
        public string Workspace { get; set; }
    }
}