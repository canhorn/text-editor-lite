using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public struct CreateWorkspaceCommand : IRequest<WorkspaceCommandResponse>
    {
        public string Workspace { get; set; }
    }
}