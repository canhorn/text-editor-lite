using System.Collections.Generic;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Create;
using EventHorizon.CodeEditorLite.Workspace.Delete;
using EventHorizon.CodeEditorLite.Workspace.Editor;
using EventHorizon.CodeEditorLite.Workspace.FileContent;
using EventHorizon.CodeEditorLite.Workspace.Model;
using EventHorizon.CodeEditorLite.Workspace.Query;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace EventHorizon.CodeEditorLite.Hubs
{
    public class WorkspaceHub : Hub
    {
        readonly IMediator _mediator;
        public WorkspaceHub(
            IMediator mediator
        )
        {
            _mediator = mediator;
        }

        public Task<IEnumerable<IWorkspace>> GetWorkspaceList()
        {
            return _mediator.Send(
                new QueryWorkspaceListEvent()
            );
        }

        public Task<WorkspaceCommandResponse> CreateWorkspace(string workspace)
        {
            return _mediator.Send(
                new CreateWorkspaceCommand
                {
                    Workspace = workspace
                }
            );
        }

        public Task<WorkspaceCommandResponse> DeleteWorkspace(string workspace)
        {
            return _mediator.Send(
                new DeleteWorkspaceCommand
                {
                    Workspace = workspace
                }
            );
        }
        public Task<WorkspaceCommandResponse> DeleteWorkspaceFolder(string workspace, string[] folderList)
        {
            return _mediator.Send(
                new DeleteWorkspaceFolderCommand(workspace, folderList)
            );
        }
        public Task<WorkspaceCommandResponse> DeleteWorkspaceFile(string workspace, string[] folderList, string fileName)
        {
            return _mediator.Send(
                new DeleteWorkspaceFileCommand(workspace, folderList, fileName)
            );
        }

        public Task<IEnumerable<IWorkspace>> GetDeletedWorkspaceList()
        {
            return _mediator.Send(
                new QueryDeletedWorkspaceList()
            );
        }

        public Task<WorkspaceCommandResponse> CreateNewWorkspaceFolder(string workspace, string[] folderList, string folderName)
        {
            return _mediator.Send(
                new CreateWorkspaceFolderCommand(workspace, folderList, folderName)
            );
        }

        public Task<WorkspaceCommandResponse> CreateNewWorkspaceFile(string workspace, string[] folderList, string fileName)
        {
            return _mediator.Send(
                new CreateWorkspaceFileCommand(workspace, folderList, fileName)
            );
        }

        public Task<WorkspaceEditorExplorer> GetWorkspaceEditorExplorer(string workspace)
        {
            return _mediator.Send(
                new QueryWorkspaceEditorExplorerEvent
                {
                    Workspace = workspace
                }
            );
        }

        public Task<WorkspaceFileContent> GetWorkspaceFileContent(string workspace, string[] folderList, string fileName)
        {
            return _mediator.Send(
                new QueryWorkspaceFileContentEvent
                {
                    Workspace = workspace,
                    FolderList = folderList,
                    FileName = fileName
                }
            );
        }

        public Task<WorkspaceFileContent> SaveWorkspaceFileContent(WorkspaceFileContent fileContent)
        {
            return _mediator.Send(
                new SaveWorkspaceFileContentCommand
                {
                    FileContent = fileContent
                }
            );
        }
    }
}