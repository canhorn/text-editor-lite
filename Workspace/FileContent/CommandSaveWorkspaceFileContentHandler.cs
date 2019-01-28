using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EventHorizon.CodeEditorLite.Workspace.Model;
using MediatR;
using Microsoft.AspNetCore.Hosting;

namespace EventHorizon.CodeEditorLite.Workspace.FileContent
{
    public struct CommandSaveWorkspaceFileContentHandler : IRequestHandler<CommandSaveWorkspaceFileContentEvent, WorkspaceFileContent>
    {
        readonly IMediator _mediator;
        readonly IHostingEnvironment _hostingEnvironment;
        public CommandSaveWorkspaceFileContentHandler(
            IMediator mediator,
            IHostingEnvironment hostingEnvironment
        )
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
        }
        public async Task<WorkspaceFileContent> Handle(CommandSaveWorkspaceFileContentEvent request, CancellationToken cancellationToken)
        {
            var fileContent = request.FileContent;
            var saveDirectory = Path.Combine(
                this.GetWorkspacesPath(),
                fileContent.Workspace,
                Path.Combine(fileContent.FolderList)
            );
            var fileName = fileContent.FileName;
            await WriteToFile(
                saveDirectory,
                fileName,
                fileContent.Content
            );
            return await _mediator.Send(new QueryWorkspaceFileContentEvent
            {
                Workspace = fileContent.Workspace,
                FolderList = fileContent.FolderList,
                FileName = fileContent.FileName
            });
        }
        private async Task WriteToFile(string directory, string fileName, string textContent)
        {
            Directory.CreateDirectory(directory);
            using (var file = File.Create(Path.Combine(directory, fileName)))
            {
                await file.WriteAsync(Encoding.UTF8.GetBytes(textContent));
            }
        }
        private string GetWorkspacesPath()
        {
            return Path.Combine(
                _hostingEnvironment.ContentRootPath,
                "App_Data",
                "Workspaces"
            );
        }
    }
}