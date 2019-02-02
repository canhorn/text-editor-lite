using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct DeleteWorkspaceFolderCommand : IRequest<WorkspaceCommandResponse>
    {
        public string Workspace { get; }
        public string[] FolderList { get; }

        public DeleteWorkspaceFolderCommand(string workspace, string[] folderList)
        {
            Workspace = workspace;
            FolderList = folderList;
        }
    }
}