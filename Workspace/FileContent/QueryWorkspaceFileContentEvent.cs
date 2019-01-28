using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.FileContent
{
    public struct QueryWorkspaceFileContentEvent : IRequest<WorkspaceFileContent>
    {
        public string Workspace { get; internal set; }
        public string[] FolderList { get; internal set; }
        public string FileName { get; internal set; }
    }
}