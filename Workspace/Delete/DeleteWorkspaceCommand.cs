using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct DeleteWorkspaceCommand : IRequest<WorkspaceCommandResponse>
    {
        public string Workspace { get; set; }
    }
}