using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Delete
{
    public struct DeleteWorkspaceFileCommand : IRequest<WorkspaceCommandResponse>
    {
        public string Workspace { get; }
        public string[] FolderList { get; }
        public string FileName { get; }

        public DeleteWorkspaceFileCommand(
            string workspace,
            string[] folderList,
            string fileName
        )
        {
            Workspace = workspace;
            FolderList = folderList;
            FileName = fileName;
        }
    }
}