using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.FileContent
{
    public struct CommandSaveWorkspaceFileContentEvent : IRequest<WorkspaceFileContent>
    {
        public WorkspaceFileContent FileContent { get; internal set; }
    }
}