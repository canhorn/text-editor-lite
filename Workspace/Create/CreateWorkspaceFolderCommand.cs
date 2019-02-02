using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;

namespace EventHorizon.CodeEditorLite.Workspace.Create
{
    public struct CreateWorkspaceFolderCommand : IRequest<WorkspaceCommandResponse>
    {
        public string Workspace { get; }
        public string[] FolderList { get; }
        public string FolderName { get; }

        public CreateWorkspaceFolderCommand(string workspace, string[] folderList, string folderName)
        {
            Workspace = workspace;
            FolderList = folderList;
            FolderName = folderName;
        }
    }
}