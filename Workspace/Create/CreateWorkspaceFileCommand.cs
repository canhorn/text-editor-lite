using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public struct CreateWorkspaceFileCommand : IRequest<WorkspaceCommandResponse>
    {
        public string Workspace { get; }
        public string[] FolderList { get; }
        public string FileName { get; }

        public CreateWorkspaceFileCommand(
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