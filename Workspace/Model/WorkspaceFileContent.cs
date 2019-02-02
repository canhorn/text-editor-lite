namespace EventHorizon.CodeEditorLite.Workspace.Model
{
    public struct WorkspaceFileContent
    {
        public static WorkspaceFileContent NULL = default(WorkspaceFileContent);
        
        public string FileName { get; set; }
        public string[] FolderList { get; set; }
        public string Workspace { get; set; }
        public string Content { get; set; }
    }
}